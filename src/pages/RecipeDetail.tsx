import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useRecipes } from "@/context/RecipeContext";
import { useLanguage } from "@/context/LanguageContext";
import { soundManager } from "@/lib/soundEffects";
import { useFavorites } from "@/hooks/useFavorites";
import { CookbookNavbar } from "@/components/cookbook/CookbookNavbar";
import { ChefCookModeModal } from "@/components/cookbook/ChefCookModeModal";
import { KitchenTimer } from "@/components/cookbook/KitchenTimer";
import {
  ArrowLeft,
  Clock,
  Users,
  Flame,
  Printer,
  Share2,
  Heart,
  ChefHat,
  Check,
  Sparkles,
  Minus,
  Plus,
  Timer,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const RecipeDetail: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recipes, getRecipe, isCustomRecipe, deleteRecipe } = useRecipes();

  const recipe = recipeId ? getRecipe(recipeId) : undefined;

  // Scalable servings: starts at baseServings
  const [servings, setServings] = useState<number>(() => recipe?.baseServings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [cookModeOpen, setCookModeOpen] = useState(false);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <CookbookNavbar />
        <div className="container mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center space-y-4">
          <span className="text-5xl">🍫</span>
          <h2 className="text-2xl font-bold text-foreground">
            {lang === "te" ? "రెసిపీ కనుగొనబడలేదు" : "Recipe Not Found"}
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            {lang === "te"
              ? "మీరు వెతుకుతున్న వంటకం మా ఫామ్ కిచెన్‌లో కనిపించలేదు."
              : "The cocoa delicacy you're looking for seems to have wandered back into the grove."}
          </p>
          <Button asChild className="rounded-xl bg-amber-900 text-amber-50">
            <Link to="/cook">{t.recipeDetail.backToCookbook}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Multiplier for scaling
  const scaleRatio = servings / recipe.baseServings;

  const handleServingChange = (delta: number) => {
    soundManager.playClick();
    const newServings = Math.max(1, servings + delta);
    setServings(newServings);
  };

  const handleToggleIngredient = (id: string) => {
    if (checkedIngredients.includes(id)) {
      soundManager.playClick();
      setCheckedIngredients(checkedIngredients.filter((i) => i !== id));
    } else {
      soundManager.playChime(660);
      setCheckedIngredients([...checkedIngredients, id]);
    }
  };

  const handleToggleStep = (stepNum: number) => {
    if (checkedSteps.includes(stepNum)) {
      soundManager.playClick();
      setCheckedSteps(checkedSteps.filter((s) => s !== stepNum));
    } else {
      soundManager.playChime(784);
      setCheckedSteps([...checkedSteps, stepNum]);
    }
  };

  const handleShare = () => {
    soundManager.playChime(660);
    if (navigator.share) {
      navigator.share({
        title: recipe.title[lang],
        text: recipe.tagline[lang],
        url: window.location.href,
      }).catch(() => {
        // Fallback
        navigator.clipboard.writeText(window.location.href);
        toast.success(t.recipeDetail.copiedToClipboard);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t.recipeDetail.copiedToClipboard);
    }
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  // Find next recipe
  const currentIndex = recipes.findIndex((r) => r.id === recipe.id);
  const nextRecipe = recipes[(currentIndex + 1) % recipes.length];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="no-print">
        <CookbookNavbar />
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-5xl flex-1">
        {/* Breadcrumb & Navigation row */}
        <div className="flex items-center justify-between gap-4 mb-6 no-print">
          <Link
            to="/cook"
            onClick={() => soundManager.playClick()}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-950/70 hover:text-amber-950 dark:text-amber-200/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.recipeDetail.backToCookbook}</span>
          </Link>

          <div className="flex items-center gap-2">
            {isCustomRecipe(recipe.id) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm(t.addRecipe.deleteConfirm)) {
                    deleteRecipe(recipe.id);
                    toast.success("Recipe deleted from cookbook");
                    navigate("/cook");
                  }
                }}
                className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium gap-1.5"
                title={t.addRecipe.deleteRecipe}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">{t.addRecipe.deleteRecipe}</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-xl border-amber-900/20 text-xs font-medium gap-1.5"
              title={t.recipeDetail.printRecipe}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.recipeDetail.printRecipe}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-xl border-amber-900/20 text-xs font-medium gap-1.5"
              title={t.recipeDetail.shareRecipe}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.recipeDetail.shareRecipe}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFavorite(recipe.id)}
              className="rounded-xl border-amber-900/20 text-xs font-medium gap-1.5"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavorite(recipe.id)
                    ? "fill-rose-500 text-rose-500"
                    : "text-muted-foreground"
                }`}
              />
              <span className="hidden sm:inline">
                {isFavorite(recipe.id)
                  ? t.recipeCard.savedFavorite
                  : t.recipeCard.saveFavorite}
              </span>
            </Button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="overflow-hidden rounded-3xl border border-amber-900/15 bg-card shadow-lg mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image */}
            <div className="lg:col-span-5 relative aspect-4/3 lg:aspect-auto lg:h-full bg-muted min-h-[300px]">
              <img
                src={recipe.image}
                alt={recipe.title[lang]}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge className="bg-amber-950/80 backdrop-blur-md text-amber-50">
                  {recipe.categoryLabel[lang]}
                </Badge>
                <Badge variant="outline" className="bg-black/40 backdrop-blur-md text-white border-white/20">
                  {recipe.difficultyLabel[lang]}
                </Badge>
                {isCustomRecipe(recipe.id) && (
                  <Badge className="bg-emerald-600/90 backdrop-blur-md text-white border-emerald-500/40 font-semibold flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>{t.addRecipe.customRecipeBadge}</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {recipe.tags[lang].map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-amber-900/10 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:text-amber-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                  {recipe.title[lang]}
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {recipe.description[lang]}
                </p>

                {/* Cacao Origin Profile */}
                <div className="flex items-center gap-2 rounded-2xl bg-amber-950/5 border border-amber-900/10 p-3 text-xs text-amber-950/90 dark:text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold">{t.recipeCard.farmCocoa}: </span>
                    <span>{recipe.cacaoProfile[lang]}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-2 border-y border-border/80 py-4 text-center">
                <div>
                  <span className="block text-[11px] text-muted-foreground font-medium">
                    {t.recipeDetail.prepTime}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    {recipe.prepTimeMinutes}m
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-muted-foreground font-medium">
                    {t.recipeDetail.cookTime}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
                    <Timer className="w-3.5 h-3.5 text-amber-700" />
                    {recipe.cookTimeMinutes}m
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-muted-foreground font-medium">
                    {t.recipeDetail.totalTime}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground mt-0.5 block">
                    {recipe.totalTimeMinutes}m
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-muted-foreground font-medium">
                    {t.recipeDetail.calories}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-orange-600 flex items-center justify-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {recipe.caloriesPerServing}
                  </span>
                </div>
              </div>

              {/* Cook Mode CTA Banner */}
              <div className="no-print pt-1">
                <Button
                  onClick={() => {
                    soundManager.playChime(660);
                    setCookModeOpen(true);
                  }}
                  className="w-full h-12 rounded-2xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-sm sm:text-base shadow-md gap-2"
                >
                  <ChefHat className="w-5 h-5" />
                  <span>{t.recipeDetail.startCookMode}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Section: Left = Ingredients & Servings Scaler | Right = Steps & Kitchen Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Ingredients Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ingredients Card */}
            <div className="rounded-3xl border border-amber-900/15 bg-card/90 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t.recipeDetail.ingredientsTitle}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t.recipeDetail.ingredientsSubtitle}
                  </p>
                </div>
              </div>

              {/* Servings Scaler Controls */}
              <div className="flex items-center justify-between rounded-2xl bg-muted/60 p-3 border border-border/70">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-800" />
                  <span>{t.recipeDetail.adjustServings}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleServingChange(-1)}
                    disabled={servings <= 1}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-card text-foreground border border-border/80 shadow-2xs hover:bg-amber-100 disabled:opacity-40 transition-colors"
                    aria-label="Decrease Servings"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-bold text-foreground">
                    {servings} {recipe.servingUnit[lang]}
                  </span>
                  <button
                    onClick={() => handleServingChange(1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-card text-foreground border border-border/80 shadow-2xs hover:bg-amber-100 transition-colors"
                    aria-label="Increase Servings"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scaled Ingredients List */}
              <ul className="space-y-2.5">
                {recipe.ingredients.map((ing) => {
                  const isChecked = checkedIngredients.includes(ing.id);
                  const scaledAmount = Number(
                    (ing.amount * scaleRatio).toFixed(1)
                  ).toString();

                  return (
                    <li
                      key={ing.id}
                      onClick={() => handleToggleIngredient(ing.id)}
                      className={`group flex items-start gap-3 rounded-2xl p-2.5 transition-all cursor-pointer select-none border ${
                        isChecked
                          ? "bg-muted/40 border-muted text-muted-foreground line-through"
                          : "bg-card hover:bg-amber-900/5 border-transparent hover:border-amber-900/10 text-foreground"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                          isChecked
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-border/80 group-hover:border-amber-800"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1 text-xs sm:text-sm">
                        <span className="font-bold text-amber-900 dark:text-amber-300">
                          {scaledAmount} {ing.unit}{" "}
                        </span>
                        <span>{ing.name[lang]}</span>
                        {ing.note && (
                          <span className="block text-[11px] text-muted-foreground no-underline mt-0.5">
                            ({ing.note[lang]})
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Mascot Secret Tip Box */}
            <div className="rounded-3xl border border-amber-900/20 bg-gradient-to-tr from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="/mascot.png"
                  alt="Mascot Tip"
                  className="h-12 w-auto object-contain drop-shadow-sm"
                />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    {t.recipeDetail.mascotSecretTip}
                  </h4>
                  <p className="text-xs font-semibold text-amber-950 dark:text-amber-100">
                    ChocoFarms Grove Secret
                  </p>
                </div>
              </div>
              <p className="text-xs text-amber-950/80 dark:text-amber-200/80 leading-relaxed pl-1">
                "{recipe.mascotTip[lang]}"
              </p>
            </div>

            {/* Kitchen Timer Widget in sidebar */}
            <div className="no-print">
              <KitchenTimer
                initialMinutes={recipe.cookTimeMinutes || 5}
                title={`${t.recipeDetail.timerTitle}: ${recipe.title[lang]}`}
              />
            </div>
          </div>

          {/* Right Column: Step-by-Step Method (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {t.recipeDetail.stepsTitle}
              </h3>
              <span className="text-xs text-muted-foreground font-medium">
                {recipe.steps.length} {lang === "te" ? "దశలు" : "Steps"}
              </span>
            </div>

            <ol className="space-y-4">
              {recipe.steps.map((step) => {
                const isStepChecked = checkedSteps.includes(step.stepNumber);

                return (
                  <li
                    key={step.stepNumber}
                    className={`rounded-3xl border p-5 sm:p-6 transition-all space-y-3 ${
                      isStepChecked
                        ? "border-emerald-600/30 bg-emerald-50/20 dark:bg-emerald-950/10"
                        : "border-border bg-card/80 hover:border-amber-900/20 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-900 text-amber-50 text-xs font-bold shadow-xs">
                          {step.stepNumber}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {lang === "te" ? `దశ ${step.stepNumber}` : `Step ${step.stepNumber}`}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleStep(step.stepNumber)}
                        className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1 transition-colors ${
                          isStepChecked
                            ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {isStepChecked
                            ? t.cookMode.completedBadge
                            : lang === "te"
                            ? "మార్క్ చేయండి"
                            : "Done"}
                        </span>
                      </button>
                    </div>

                    <p
                      className={`text-sm sm:text-base leading-relaxed ${
                        isStepChecked
                          ? "text-muted-foreground line-through"
                          : "text-foreground font-normal"
                      }`}
                    >
                      {step.instruction[lang]}
                    </p>

                    {/* Step Tip */}
                    {step.tip && (
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{step.tip[lang]}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* Next Recipe teaser at bottom */}
            <div className="no-print pt-6 border-t border-border">
              <div className="rounded-2xl border border-amber-900/15 bg-card/60 p-4 flex items-center justify-between hover:bg-amber-900/5 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={nextRecipe.image}
                    alt={nextRecipe.title[lang]}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {lang === "te" ? "తదుపరి వంటకం" : "Next Recipe"}
                    </span>
                    <h5 className="text-sm font-bold text-foreground">
                      {nextRecipe.title[lang]}
                    </h5>
                  </div>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-xl gap-1 text-xs font-semibold"
                  onClick={() => soundManager.playClick()}
                >
                  <Link to={`/cook/${nextRecipe.id}`}>
                    <span>{lang === "te" ? "చూడండి" : "Explore"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Cook Mode Modal */}
      <ChefCookModeModal
        recipe={recipe}
        isOpen={cookModeOpen}
        onClose={() => setCookModeOpen(false)}
      />
    </div>
  );
};
