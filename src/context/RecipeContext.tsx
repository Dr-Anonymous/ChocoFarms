import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Recipe, recipes as defaultRecipes } from "@/data/recipes";
import { soundManager } from "@/lib/soundEffects";
import {
  fetchRecipesFromGitHub,
  updateGitHubRecipesFile,
  getGitHubToken,
  setGitHubToken as persistGitHubToken,
} from "@/lib/githubStorage";

interface RecipeContextType {
  recipes: Recipe[];
  customRecipes: Recipe[];
  addRecipe: (
    recipe: Recipe,
    options?: { publishToGitHub?: boolean; token?: string }
  ) => Promise<{ success: boolean; githubPublished?: boolean; error?: string }>;
  updateRecipe: (
    recipe: Recipe,
    options?: { publishToGitHub?: boolean }
  ) => Promise<{ success: boolean; githubPublished?: boolean; error?: string }>;
  deleteRecipe: (
    id: string,
    options?: { deleteFromGitHub?: boolean }
  ) => Promise<{ success: boolean; error?: string }>;
  getRecipe: (id: string) => Recipe | undefined;
  isCustomRecipe: (id: string) => boolean;
  isAdmin: boolean;
  githubToken: string;
  setAdminToken: (token: string) => void;
  syncWithGitHub: () => Promise<void>;
  isSyncing: boolean;
  isPublishing: boolean;
}

const CUSTOM_RECIPES_KEY = "chocofarms_custom_recipes";

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(defaultRecipes);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CUSTOM_RECIPES_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [githubToken, setGithubTokenState] = useState<string>(() => getGitHubToken());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const setAdminToken = (token: string) => {
    persistGitHubToken(token);
    setGithubTokenState(token.trim());
  };

  const isAdmin = Boolean(githubToken);

  // Sync recipes from GitHub repository
  const syncWithGitHub = useCallback(async () => {
    setIsSyncing(true);
    try {
      const remoteRecipes = await fetchRecipesFromGitHub();
      if (remoteRecipes && remoteRecipes.length > 0) {
        // Merge: remote recipes take precedence, keeping any local unsynced custom recipes
        setRecipes((prev) => {
          const remoteIds = new Set(remoteRecipes.map((r) => r.id));
          const localOnly = customRecipes.filter((cr) => !remoteIds.has(cr.id));
          return [...localOnly, ...remoteRecipes];
        });
      }
    } catch (err) {
      console.warn("Error syncing recipes from GitHub:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [customRecipes]);

  // Initial sync on mount
  useEffect(() => {
    syncWithGitHub();
  }, [syncWithGitHub]);

  // Sync custom recipes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(customRecipes));
      } catch {
        // quota exceeded or private mode
      }
    }
  }, [customRecipes]);

  // Add Recipe
  const addRecipe = async (
    newRecipe: Recipe,
    options?: { publishToGitHub?: boolean; token?: string }
  ): Promise<{ success: boolean; githubPublished?: boolean; error?: string }> => {
    soundManager.playVictory();

    // 1. Immediately update local state so user sees it without delay
    const updatedCustom = [newRecipe, ...customRecipes];
    setCustomRecipes(updatedCustom);
    const updatedAll = [newRecipe, ...recipes.filter((r) => r.id !== newRecipe.id)];
    setRecipes(updatedAll);

    // 2. Publish directly to GitHub if token is provided or stored
    const effectiveToken = options?.token || githubToken;
    const shouldPublish = options?.publishToGitHub !== false && Boolean(effectiveToken);

    if (shouldPublish) {
      setIsPublishing(true);
      try {
        const commitMsg = `feat(cookbook): Add recipe "${newRecipe.title.en}" via ChocoFarms admin`;
        const result = await updateGitHubRecipesFile(updatedAll, commitMsg, effectiveToken);
        if (result.success) {
          // If token was passed via options and was valid, ensure it is saved
          if (options?.token && options.token !== githubToken) {
            setAdminToken(options.token);
          }
          return { success: true, githubPublished: true };
        } else {
          return {
            success: true,
            githubPublished: false,
            error: result.error,
          };
        }
      } catch (err: unknown) {
        const error = err as Error;
        return {
          success: true,
          githubPublished: false,
          error: error.message,
        };
      } finally {
        setIsPublishing(false);
      }
    }

    return { success: true, githubPublished: false };
  };

  // Update existing recipe
  const updateRecipe = async (
    updatedRecipe: Recipe,
    options?: { publishToGitHub?: boolean }
  ): Promise<{ success: boolean; githubPublished?: boolean; error?: string }> => {
    soundManager.playVictory();

    // 1. Immediately update local state
    const updatedAll = recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r));
    setRecipes(updatedAll);

    // Also update customRecipes if present
    setCustomRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );

    // 2. Publish directly to GitHub if token is configured
    const shouldPublish = options?.publishToGitHub !== false && Boolean(githubToken);

    if (shouldPublish) {
      setIsPublishing(true);
      try {
        const commitMsg = `feat(cookbook): Update recipe "${updatedRecipe.title.en}" via ChocoFarms admin`;
        const result = await updateGitHubRecipesFile(updatedAll, commitMsg, githubToken);
        if (result.success) {
          return { success: true, githubPublished: true };
        } else {
          return {
            success: true,
            githubPublished: false,
            error: result.error,
          };
        }
      } catch (err: unknown) {
        const error = err as Error;
        return {
          success: true,
          githubPublished: false,
          error: error.message,
        };
      } finally {
        setIsPublishing(false);
      }
    }

    return { success: true, githubPublished: false };
  };

  // Delete Recipe
  const deleteRecipe = async (
    id: string,
    options?: { deleteFromGitHub?: boolean }
  ): Promise<{ success: boolean; error?: string }> => {
    soundManager.playClick();

    // Update local state
    const filteredCustom = customRecipes.filter((r) => r.id !== id);
    setCustomRecipes(filteredCustom);
    const filteredAll = recipes.filter((r) => r.id !== id);
    setRecipes(filteredAll);

    // If admin token is set, sync deletion to GitHub
    if (githubToken && options?.deleteFromGitHub !== false) {
      try {
        const commitMsg = `feat(cookbook): Remove recipe ID "${id}" via ChocoFarms admin`;
        const result = await updateGitHubRecipesFile(filteredAll, commitMsg, githubToken);
        if (!result.success) {
          return { success: false, error: result.error };
        }
      } catch (err: unknown) {
        const error = err as Error;
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  };

  const getRecipe = (id: string) => {
    return recipes.find((r) => r.id === id || r.slug === id);
  };

  const isCustomRecipe = (id: string) => {
    // Custom if in local customRecipes or not in the default 6
    const isDefault = defaultRecipes.some((dr) => dr.id === id);
    return !isDefault || customRecipes.some((r) => r.id === id);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        customRecipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipe,
        isCustomRecipe,
        isAdmin,
        githubToken,
        setAdminToken,
        syncWithGitHub,
        isSyncing,
        isPublishing,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const ctx = useContext(RecipeContext);
  if (!ctx) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return ctx;
};
