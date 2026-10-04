import { useState, useEffect } from "react";
import { soundManager } from "@/lib/soundEffects";

const STORAGE_KEY = "chocofarms_favorite_recipes";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage quota or disabled
    }
  }, [favorites]);

  const toggleFavorite = (recipeId: string) => {
    soundManager.playClick();
    setFavorites((prev) => {
      if (prev.includes(recipeId)) {
        return prev.filter((id) => id !== recipeId);
      } else {
        soundManager.playChime(660);
        return [...prev, recipeId];
      }
    });
  };

  const isFavorite = (recipeId: string) => favorites.includes(recipeId);

  return { favorites, toggleFavorite, isFavorite };
}
