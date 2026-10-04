import React from "react";
import { Link } from "react-router-dom";
import { Recipe } from "@/data/recipes";
import { useLanguage } from "@/context/LanguageContext";
import { soundManager } from "@/lib/soundEffects";
import { Clock, Users, Flame, Heart, ChefHat, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenCookMode: (recipe: Recipe) => void;
  isCustom?: boolean;
  onDelete?: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onOpenCookMode,
  isCustom = false,
  onDelete,
}) => {
  const { lang, t } = useLanguage();

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-amber-900/10 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-900/25 hover:shadow-xl">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <img
          src={recipe.image}
          alt={recipe.title[lang]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <Badge className="bg-amber-950/80 backdrop-blur-md text-amber-50 border border-amber-800/30 text-[11px] font-medium shadow-xs">
            {recipe.categoryLabel[lang]}
          </Badge>
          <Badge
            variant="outline"
            className="bg-black/40 backdrop-blur-md text-white border-white/20 text-[10px]"
          >
            {recipe.difficultyLabel[lang]}
          </Badge>
          {isCustom && (
            <Badge className="bg-emerald-600/90 backdrop-blur-md text-white border-emerald-500/40 text-[10px] font-semibold flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{t.addRecipe.customRecipeBadge}</span>
            </Badge>
          )}
        </div>

        {/* Right Corner Buttons: Favorite and optional Delete */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isCustom && onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm(t.addRecipe.deleteConfirm)) {
                  onDelete(recipe.id);
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white/80 transition-all hover:bg-rose-600 hover:text-white hover:scale-110 active:scale-95"
              title={t.addRecipe.deleteRecipe}
              aria-label="Delete custom recipe"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(recipe.id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition-all hover:bg-black/70 hover:scale-110 active:scale-95"
            aria-label={isFavorite ? t.recipeCard.savedFavorite : t.recipeCard.saveFavorite}
            title={isFavorite ? t.recipeCard.savedFavorite : t.recipeCard.saveFavorite}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? "fill-rose-500 text-rose-500" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Quick info over bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs font-medium">
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-300" />
            {recipe.totalTimeMinutes} {t.recipeCard.mins}
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
            <Users className="w-3 h-3 text-amber-300" />
            {recipe.baseServings} {recipe.servingUnit[lang]}
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
            <Flame className="w-3 h-3 text-orange-400" />
            {recipe.caloriesPerServing} {t.recipeCard.calories}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        {/* Title */}
        <div className="space-y-1">
          <Link
            to={`/cook/${recipe.id}`}
            onClick={() => soundManager.playClick()}
            className="hover:underline focus:outline-hidden"
          >
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-amber-900 dark:group-hover:text-amber-300 line-clamp-1">
              {recipe.title[lang]}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {recipe.tagline[lang]}
          </p>
        </div>

        {/* Cacao Origin Note */}
        <div className="flex items-center gap-1.5 rounded-xl bg-amber-900/5 px-2.5 py-1.5 border border-amber-900/10 text-[11px] text-amber-950/80 dark:text-amber-200">
          <Sparkles className="w-3 h-3 text-amber-700 shrink-0" />
          <span className="truncate">{recipe.cacaoProfile[lang]}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {recipe.tags[lang].slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2 border-t border-border/60">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl border-amber-900/20 text-xs font-semibold hover:bg-amber-900/10 hover:text-amber-950"
            onClick={() => soundManager.playClick()}
          >
            <Link to={`/cook/${recipe.id}`}>
              {t.recipeCard.viewRecipe}
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              soundManager.playChime(660);
              onOpenCookMode(recipe);
            }}
            className="rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            title={t.recipeCard.cookMode}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>{t.recipeCard.cookMode}</span>
          </Button>
        </div>
      </div>
    </article>
  );
};
