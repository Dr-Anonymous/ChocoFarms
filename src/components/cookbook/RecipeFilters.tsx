import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { soundManager } from "@/lib/soundEffects";
import { Heart, CupSoda, Cake, Sparkles, Apple, SlidersHorizontal } from "lucide-react";
import { RecipeCategory } from "@/data/recipes";

export type DietaryFilter = "all" | "vegan" | "glutenFree" | "jaggery";

interface RecipeFiltersProps {
  selectedCategory: RecipeCategory | "all";
  onSelectCategory: (cat: RecipeCategory | "all") => void;
  selectedDietary: DietaryFilter;
  onSelectDietary: (diet: DietaryFilter) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
}

export const RecipeFilters: React.FC<RecipeFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDietary,
  onSelectDietary,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
}) => {
  const { lang, t } = useLanguage();

  const categories: Array<{ id: RecipeCategory | "all"; label: string; icon: React.ReactNode }> = [
    { id: "all", label: t.filter.allCategories, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "drinks", label: t.filter.drinks, icon: <CupSoda className="w-3.5 h-3.5" /> },
    { id: "sweets", label: t.filter.sweets, icon: <Cake className="w-3.5 h-3.5" /> },
    { id: "healthy", label: t.filter.healthy, icon: <Apple className="w-3.5 h-3.5" /> },
    { id: "fusion", label: t.filter.fusion, icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
  ];

  const dietaryOptions: Array<{ id: DietaryFilter; label: string }> = [
    { id: "all", label: t.filter.allDietary },
    { id: "vegan", label: t.filter.vegan },
    { id: "glutenFree", label: t.filter.glutenFree },
    { id: "jaggery", label: t.filter.jaggerySweetened },
  ];

  return (
    <div className="space-y-4">
      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id && !showFavoritesOnly;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                if (showFavoritesOnly) onToggleFavoritesOnly();
                onSelectCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-2xs ${
                isActive
                  ? "bg-amber-900 text-amber-50 shadow-md scale-102"
                  : "bg-card text-muted-foreground hover:bg-amber-900/10 hover:text-amber-950 border border-border/80"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}

        {/* Favorites Filter button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleFavoritesOnly();
          }}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ml-auto border ${
            showFavoritesOnly
              ? "bg-rose-600 text-white border-rose-600 shadow-md scale-102"
              : "bg-card text-muted-foreground hover:text-rose-700 hover:bg-rose-50 border-border/80"
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              showFavoritesOnly ? "fill-white text-white" : "text-rose-500"
            }`}
          />
          <span>{t.filter.favoritesOnly}</span>
          {favoritesCount > 0 && (
            <span
              className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                showFavoritesOnly
                  ? "bg-rose-800 text-white"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {favoritesCount}
            </span>
          )}
        </button>
      </div>

      {/* Dietary Filters Sub-row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
          {lang === "te" ? "ఆహార ప్రాధాన్యత:" : "Dietary:"}
        </span>
        {dietaryOptions.map((diet) => {
          const isSelected = selectedDietary === diet.id;
          return (
            <button
              key={diet.id}
              onClick={() => {
                soundManager.playClick();
                onSelectDietary(diet.id);
              }}
              className={`rounded-full px-2.5 py-1 transition-all whitespace-nowrap ${
                isSelected
                  ? "bg-emerald-800 text-white font-medium shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {diet.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
