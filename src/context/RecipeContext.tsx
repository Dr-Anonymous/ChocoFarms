import React, { createContext, useContext, useState, useEffect } from "react";
import { Recipe, recipes as defaultRecipes } from "@/data/recipes";
import { soundManager } from "@/lib/soundEffects";
import { toast } from "sonner";

interface RecipeContextType {
  recipes: Recipe[];
  customRecipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  getRecipe: (id: string) => Recipe | undefined;
  isCustomRecipe: (id: string) => boolean;
}

const CUSTOM_RECIPES_KEY = "chocofarms_custom_recipes";

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // Combined list: custom recipes first (so newly added show up at the top!), followed by defaults
  const recipes = [...customRecipes, ...defaultRecipes];

  const addRecipe = (newRecipe: Recipe) => {
    soundManager.playVictory();
    setCustomRecipes((prev) => [newRecipe, ...prev]);
  };

  const deleteRecipe = (id: string) => {
    soundManager.playClick();
    setCustomRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const getRecipe = (id: string) => {
    return recipes.find((r) => r.id === id || r.slug === id);
  };

  const isCustomRecipe = (id: string) => {
    return customRecipes.some((r) => r.id === id);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        customRecipes,
        addRecipe,
        deleteRecipe,
        getRecipe,
        isCustomRecipe,
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
