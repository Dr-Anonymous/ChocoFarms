import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Recipe, RecipeCategory } from "@/data/recipes";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecipes } from "@/context/RecipeContext";
import { soundManager } from "@/lib/soundEffects";
import { CookbookNavbar } from "@/components/cookbook/CookbookNavbar";
import { CookbookHero } from "@/components/cookbook/CookbookHero";
import { RecipeFilters, DietaryFilter } from "@/components/cookbook/RecipeFilters";
import { RecipeCard } from "@/components/cookbook/RecipeCard";
import { ChefCookModeModal } from "@/components/cookbook/ChefCookModeModal";
import { AddRecipeModal } from "@/components/cookbook/AddRecipeModal";
import { Button } from "@/components/ui/button";
import { Sparkles, UtensilsCrossed, Heart, PlusCircle } from "lucide-react";

export const Cookbook: React.FC = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { recipes, isCustomRecipe, deleteRecipe } = useRecipes();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | "all">("all");
  const [selectedDietary, setSelectedDietary] = useState<DietaryFilter>("all");
  const [addRecipeOpen, setAddRecipeOpen] = useState(false);

  // Check if URL specifies favorites filter e.g. /cook?filter=favorites
  const showFavoritesOnly = searchParams.get("filter") === "favorites";
  const setShowFavoritesOnly = (show: boolean) => {
    if (show) {
      setSearchParams({ filter: "favorites" });
    } else {
      setSearchParams({});
    }
  };

  // State for cook mode modal
  const [activeCookRecipe, setActiveCookRecipe] = useState<Recipe | null>(null);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // 1. Favorites only filter
      if (showFavoritesOnly && !isFavorite(recipe.id)) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== "all" && recipe.category !== selectedCategory) {
        return false;
      }

      // 3. Dietary filter
      if (selectedDietary === "vegan" && !recipe.isVegan) return false;
      if (selectedDietary === "glutenFree" && !recipe.isGlutenFree) return false;
      if (selectedDietary === "jaggery" && !recipe.isJaggerySweetened) return false;

      // 4. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle =
          recipe.title.en.toLowerCase().includes(q) ||
          recipe.title.te.toLowerCase().includes(q);
        const matchesDesc =
          recipe.description.en.toLowerCase().includes(q) ||
          recipe.description.te.toLowerCase().includes(q);
        const matchesTags =
          recipe.tags.en.some((tag) => tag.toLowerCase().includes(q)) ||
          recipe.tags.te.some((tag) => tag.toLowerCase().includes(q));
        const matchesIngredients = recipe.ingredients.some(
          (ing) =>
            ing.name.en.toLowerCase().includes(q) ||
            ing.name.te.toLowerCase().includes(q)
        );

        return matchesTitle || matchesDesc || matchesTags || matchesIngredients;
      }

      return true;
    });
  }, [recipes, searchQuery, selectedCategory, selectedDietary, showFavoritesOnly, favorites]);

  const handleResetFilters = () => {
    soundManager.playClick();
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDietary("all");
    setShowFavoritesOnly(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <CookbookNavbar onOpenAddRecipe={() => setAddRecipeOpen(true)} />

      {/* Hero Section */}
      <CookbookHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddRecipe={() => setAddRecipeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 max-w-6xl space-y-8">
        {/* Filters Row */}
        <RecipeFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedDietary={selectedDietary}
          onSelectDietary={setSelectedDietary}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
          favoritesCount={favorites.length}
        />

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
              <span>
                {lang === "te"
                  ? `${filteredRecipes.length} వంటకాలు కనుగొనబడ్డాయి`
                  : `Showing ${filteredRecipes.length} cacao recipes`}
              </span>
              {showFavoritesOnly && (
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  {t.filter.favoritesOnly}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={isFavorite(recipe.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpenCookMode={(r) => setActiveCookRecipe(r)}
                  isCustom={isCustomRecipe(recipe.id)}
                  onDelete={deleteRecipe}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-3xl border border-dashed border-amber-900/20 bg-muted/30 p-12 text-center space-y-4 max-w-md mx-auto my-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-900/10 text-amber-900 mx-auto">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {t.filter.noResults}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "te"
                  ? "వేరొక పదం కోసం వెతకండి లేదా ఫిల్టర్లను తొలగించండి."
                  : "Try searching with different keywords or reset your dietary preferences."}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="rounded-xl border-amber-900/20 text-xs font-semibold"
              >
                {t.filter.resetFilters}
              </Button>
              <Button
                size="sm"
                onClick={() => setAddRecipeOpen(true)}
                className="rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-semibold gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.addRecipe.btn}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Playful Farmhouse Discovery Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-900/15 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 p-6 sm:p-8 shadow-xl mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-800/60 px-3 py-0.5 text-[11px] font-semibold text-amber-200">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{lang === "te" ? "ఫామ్-టు-టేబుల్ మ్యాజిక్" : "Farm-to-Table Magic"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {lang === "te"
                  ? "మీ స్వంత కోకో రెసిపీని పంచుకోవాలనుకుంటున్నారా?"
                  : "Have a unique cocoa recipe of your own?"}
              </h3>
              <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed max-w-xl">
                {lang === "te"
                  ? "మా చాకోఫార్మ్స్ చెఫ్స్ తో మాట్లాడండి లేదా మీ వినూత్న చాక్లెట్ వంటకాన్ని డైరెక్ట్ గా మా వంటల పుస్తకంలో నమోదు చేయండి!"
                  : "Add your handcrafted cocoa recipes right here into the cookbook or connect with our staycation cocoa farmers!"}
              </p>
            </div>
            <div className="sm:col-span-4 flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                onClick={() => {
                  soundManager.playChime(660);
                  setAddRecipeOpen(true);
                }}
                className="rounded-2xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm px-4 py-6 shadow-md gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.addRecipe.btn}</span>
              </Button>
              <Button
                asChild
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-6 shadow-md"
                onClick={() => soundManager.playChime(660)}
              >
                <a
                  href="https://wa.me/919866812555"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lang === "te" ? "వాట్సాప్" : "WhatsApp"}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/30 py-6 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            🌱 {t.footer.madeWith}
          </span>
          <span>{t.footer.rights}</span>
        </div>
      </footer>

      {/* Full-screen Cook Mode Modal */}
      <ChefCookModeModal
        recipe={activeCookRecipe}
        isOpen={Boolean(activeCookRecipe)}
        onClose={() => setActiveCookRecipe(null)}
      />

      {/* Add Recipe Modal */}
      <AddRecipeModal
        isOpen={addRecipeOpen}
        onClose={() => setAddRecipeOpen(false)}
      />
    </div>
  );
};
