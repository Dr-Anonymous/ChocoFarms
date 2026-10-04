import React, { useState } from "react";
import { Recipe, RecipeCategory, RecipeDifficulty } from "@/data/recipes";
import { useLanguage } from "@/context/LanguageContext";
import { useRecipes } from "@/context/RecipeContext";
import { soundManager } from "@/lib/soundEffects";
import {
  X,
  Plus,
  Trash2,
  Upload,
  ChefHat,
  Sparkles,
  Camera,
  Check,
  Clock,
  Users,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeAdded?: (recipeId: string) => void;
}

const PRESET_PHOTOS = [
  { label: "Artisan Hot Cocoa", path: "/recipes/artisan-hot-cocoa.jpg" },
  { label: "Cocoa Sunnundalu", path: "/recipes/cocoa-sunnundalu.jpg" },
  { label: "Cacao Pulp Smoothie", path: "/recipes/cacao-pulp-smoothie.jpg" },
  { label: "Molten Lava Cake", path: "/recipes/jaggery-lava-cake.jpg" },
  { label: "Choco Filter Coffee", path: "/recipes/choco-filter-coffee.jpg" },
  { label: "Cocoa Nib Brittle", path: "/recipes/cacao-nib-brittle.jpg" },
];

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  isOpen,
  onClose,
  onRecipeAdded,
}) => {
  const { lang, t } = useLanguage();
  const { addRecipe } = useRecipes();

  const [activeTab, setActiveTab] = useState<"basic" | "ingredients" | "extras">("basic");

  // Basic Info
  const [titleEn, setTitleEn] = useState("");
  const [titleTe, setTitleTe] = useState("");
  const [taglineEn, setTaglineEn] = useState("");
  const [taglineTe, setTaglineTe] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionTe, setDescriptionTe] = useState("");
  const [category, setCategory] = useState<RecipeCategory>("sweets");
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>("easy");
  const [prepTime, setPrepTime] = useState<number>(10);
  const [cookTime, setCookTime] = useState<number>(15);
  const [baseServings, setBaseServings] = useState<number>(4);
  const [servingUnitEn, setServingUnitEn] = useState("servings");
  const [servingUnitTe, setServingUnitTe] = useState("మందికి");
  const [calories, setCalories] = useState<number>(180);

  // Photo
  const [selectedPhoto, setSelectedPhoto] = useState<string>(PRESET_PHOTOS[0].path);
  const [customPhotoData, setCustomPhotoData] = useState<string>("");

  // Extras
  const [cacaoProfileEn, setCacaoProfileEn] = useState("Single-origin 70% dark farm cocoa");
  const [cacaoProfileTe, setCacaoProfileTe] = useState("స్వచ్ఛమైన ఫామ్ కోకో");
  const [mascotTipEn, setMascotTipEn] = useState("Always use fresh ingredients and slow heat for the richest chocolate aroma!");
  const [mascotTipTe, setMascotTipTe] = useState("మంచి చాక్లెట్ సువాసన కోసం సన్నని మంటపై వేడి చేయండి!");
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(true);
  const [isJaggerySweetened, setIsJaggerySweetened] = useState(true);

  // Dynamic Ingredients
  const [ingredients, setIngredients] = useState<
    Array<{ id: string; amount: number; unit: string; nameEn: string; nameTe: string; note: string }>
  >([
    { id: "ing-1", amount: 50, unit: "g", nameEn: "Farm Cocoa Powder", nameTe: "ఫామ్ కోకో పౌడర్", note: "" },
    { id: "ing-2", amount: 100, unit: "g", nameEn: "Organic Palm Jaggery", nameTe: "సేంద్రీయ తాటి బెల్లం", note: "powdered" },
  ]);

  // Dynamic Steps
  const [steps, setSteps] = useState<
    Array<{ stepNumber: number; instructionEn: string; instructionTe: string; durationMinutes: number; tip: string }>
  >([
    {
      stepNumber: 1,
      instructionEn: "Whisk the dry cocoa powder and powdered jaggery together until thoroughly blended.",
      instructionTe: "కోకో పౌడర్ మరియు బెల్లం పొడిని సమానంగా కలపండి.",
      durationMinutes: 2,
      tip: "Sift first to avoid lumps",
    },
    {
      stepNumber: 2,
      instructionEn: "Gently fold in wet ingredients on low heat until glossy and fragrant.",
      instructionTe: "సన్నని మంటపై ఇతర పదార్థాలు కలిపి మెత్తగా అయ్యే వరకు తిప్పండి.",
      durationMinutes: 5,
      tip: "",
    },
  ]);

  if (!isOpen) return null;

  // Handle image upload with auto-downscale
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setCustomPhotoData(dataUrl);
          setSelectedPhoto(dataUrl);
          soundManager.playChime(660);
          toast.success("Photo uploaded successfully!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Ingredient Helpers
  const addIngredientRow = () => {
    soundManager.playClick();
    setIngredients((prev) => [
      ...prev,
      {
        id: `ing-${Date.now()}`,
        amount: 1,
        unit: "tbsp",
        nameEn: "",
        nameTe: "",
        note: "",
      },
    ]);
  };

  const removeIngredientRow = (id: string) => {
    soundManager.playClick();
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Step Helpers
  const addStepRow = () => {
    soundManager.playClick();
    setSteps((prev) => [
      ...prev,
      {
        stepNumber: prev.length + 1,
        instructionEn: "",
        instructionTe: "",
        durationMinutes: 3,
        tip: "",
      },
    ]);
  };

  const removeStepRow = (stepNum: number) => {
    soundManager.playClick();
    if (steps.length <= 1) return;
    const filtered = steps.filter((s) => s.stepNumber !== stepNum);
    // Renumber steps
    const renumbered = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(renumbered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn.trim()) {
      toast.error("Please enter a recipe title in English");
      setActiveTab("basic");
      return;
    }

    const hasValidIngredients = ingredients.some((i) => i.nameEn.trim() !== "");
    if (!hasValidIngredients) {
      toast.error("Please add at least one ingredient");
      setActiveTab("ingredients");
      return;
    }

    const hasValidSteps = steps.some((s) => s.instructionEn.trim() !== "");
    if (!hasValidSteps) {
      toast.error("Please add at least one cooking step");
      setActiveTab("ingredients");
      return;
    }

    const recipeId = `custom-${Date.now()}-${titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 24)}`;

    const categoryLabels = {
      drinks: { en: "Farm Drinks", te: "ఫామ్ పానీయాలు" },
      sweets: { en: "Sweet Treats", te: "తీపి వంటకాలు" },
      healthy: { en: "Healthy & Fresh", te: "ఆరోగ్యకరమైనవి" },
      fusion: { en: "Fusion Desserts", te: "ఫ్యూజన్ డెజర్ట్‌లు" },
    };

    const difficultyLabels = {
      easy: { en: "Easy", te: "సులభం" },
      medium: { en: "Medium", te: "మధ్యస్థం" },
      pro: { en: "Chef Pro", te: "ప్రో స్థాయి" },
    };

    const tagsEn = ["Farm Crafted"];
    const tagsTe = ["ఫామ్ స్పెషల్"];
    if (isVegan) {
      tagsEn.push("Vegan");
      tagsTe.push("వీగన్");
    }
    if (isGlutenFree) {
      tagsEn.push("Gluten-Free");
      tagsTe.push("గ్లూటెన్ రహితం");
    }
    if (isJaggerySweetened) {
      tagsEn.push("Palm Jaggery");
      tagsTe.push("సేంద్రీయ బెల్లం");
    }

    const newRecipe: Recipe = {
      id: recipeId,
      slug: recipeId,
      title: {
        en: titleEn.trim(),
        te: titleTe.trim() || titleEn.trim(),
      },
      tagline: {
        en: taglineEn.trim() || titleEn.trim(),
        te: taglineTe.trim() || taglineEn.trim() || titleEn.trim(),
      },
      description: {
        en: descriptionEn.trim() || taglineEn.trim() || "A wonderful farm-crafted cocoa delicacy.",
        te: descriptionTe.trim() || descriptionEn.trim() || "తోటల తాజా కోకోతో చేసిన ప్రత్యేక వంటకం.",
      },
      category,
      categoryLabel: categoryLabels[category],
      difficulty,
      difficultyLabel: difficultyLabels[difficulty],
      prepTimeMinutes: Number(prepTime) || 10,
      cookTimeMinutes: Number(cookTime) || 15,
      totalTimeMinutes: (Number(prepTime) || 10) + (Number(cookTime) || 15),
      baseServings: Number(baseServings) || 4,
      servingUnit: {
        en: servingUnitEn || "servings",
        te: servingUnitTe || "మందికి",
      },
      caloriesPerServing: Number(calories) || 150,
      image: selectedPhoto,
      tags: {
        en: tagsEn,
        te: tagsTe,
      },
      cacaoProfile: {
        en: cacaoProfileEn.trim(),
        te: cacaoProfileTe.trim() || cacaoProfileEn.trim(),
      },
      mascotTip: {
        en: mascotTipEn.trim(),
        te: mascotTipTe.trim() || mascotTipEn.trim(),
      },
      isVegan,
      isGlutenFree,
      isJaggerySweetened,
      ingredients: ingredients
        .filter((i) => i.nameEn.trim() !== "")
        .map((i) => ({
          id: i.id,
          amount: Number(i.amount) || 1,
          unit: i.unit || "portion",
          name: {
            en: i.nameEn.trim(),
            te: i.nameTe.trim() || i.nameEn.trim(),
          },
          note: i.note ? { en: i.note, te: i.note } : undefined,
        })),
      steps: steps
        .filter((s) => s.instructionEn.trim() !== "")
        .map((s, idx) => ({
          stepNumber: idx + 1,
          instruction: {
            en: s.instructionEn.trim(),
            te: s.instructionTe.trim() || s.instructionEn.trim(),
          },
          durationMinutes: s.durationMinutes ? Number(s.durationMinutes) : undefined,
          tip: s.tip ? { en: s.tip, te: s.tip } : undefined,
        })),
    };

    addRecipe(newRecipe);
    toast.success(t.addRecipe.successToast);
    if (onRecipeAdded) onRecipeAdded(newRecipe.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl h-[92vh] max-h-[820px] rounded-3xl bg-background border border-amber-900/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-900 text-amber-50">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t.addRecipe.modalTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t.addRecipe.modalSubtitle}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-6 bg-card">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab("basic");
            }}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === "basic"
                ? "border-amber-900 text-amber-900 dark:text-amber-200"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.addRecipe.basicInfoTab}
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab("ingredients");
            }}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === "ingredients"
                ? "border-amber-900 text-amber-900 dark:text-amber-200"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.addRecipe.ingredientsTab}
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab("extras");
            }}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === "extras"
                ? "border-amber-900 text-amber-900 dark:text-amber-200"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.addRecipe.extrasTab}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === "basic" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    {t.addRecipe.titleLabel} *
                  </label>
                  <Input
                    required
                    placeholder={t.addRecipe.titlePlaceholder}
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="rounded-xl border-amber-900/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>{t.addRecipe.titleTeLabel}</span>
                    <span className="rounded bg-amber-100 text-amber-900 px-1 text-[10px]">
                      తెలుగు
                    </span>
                  </label>
                  <Input
                    placeholder={t.addRecipe.titleTePlaceholder}
                    value={titleTe}
                    onChange={(e) => setTitleTe(e.target.value)}
                    className="rounded-xl border-amber-900/20 font-telugu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t.addRecipe.taglineLabel} (EN)
                  </label>
                  <Input
                    placeholder={t.addRecipe.taglinePlaceholder}
                    value={taglineEn}
                    onChange={(e) => setTaglineEn(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span>{t.addRecipe.taglineLabel} (TE)</span>
                    <span className="rounded bg-amber-100 text-amber-900 px-1 text-[10px]">
                      తెలుగు
                    </span>
                  </label>
                  <Input
                    placeholder="ఉదా: రుచికరమైన చాక్లెట్ బ్రౌనీస్"
                    value={taglineTe}
                    onChange={(e) => setTaglineTe(e.target.value)}
                    className="rounded-xl font-telugu"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t.addRecipe.descriptionLabel}
                </label>
                <Textarea
                  rows={3}
                  placeholder={t.addRecipe.descriptionPlaceholder}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="rounded-xl resize-none"
                />
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t.addRecipe.categoryLabel}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                    className="w-full h-10 rounded-xl border border-input bg-card px-3 text-xs font-medium"
                  >
                    <option value="sweets">{t.filter.sweets}</option>
                    <option value="drinks">{t.filter.drinks}</option>
                    <option value="healthy">{t.filter.healthy}</option>
                    <option value="fusion">{t.filter.fusion}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t.addRecipe.difficultyLabel}
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                    className="w-full h-10 rounded-xl border border-input bg-card px-3 text-xs font-medium"
                  >
                    <option value="easy">Easy (సులభం)</option>
                    <option value="medium">Medium (మధ్యస్థం)</option>
                    <option value="pro">Chef Pro (ప్రో స్థాయి)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>{t.addRecipe.prepTimeLabel}</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={prepTime}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>{t.addRecipe.cookTimeLabel}</span>
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={cookTime}
                    onChange={(e) => setCookTime(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Servings & Calories */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-700" />
                    <span>{t.addRecipe.servingsLabel}</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={baseServings}
                    onChange={(e) => setBaseServings(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t.addRecipe.servingUnitLabel}
                  </label>
                  <Input
                    placeholder="slices / cups / pieces"
                    value={servingUnitEn}
                    onChange={(e) => setServingUnitEn(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>{t.addRecipe.caloriesLabel}</span>
                  </label>
                  <Input
                    type="number"
                    min={10}
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INGREDIENTS & STEPS */}
          {activeTab === "ingredients" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Ingredients Builder */}
              <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    {t.addRecipe.ingredientsSection}
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIngredientRow}
                    className="h-7 text-xs font-semibold rounded-lg gap-1 border-amber-900/20"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.addRecipe.addIngredientBtn}</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  {ingredients.map((ing, idx) => (
                    <div
                      key={ing.id}
                      className="flex items-center gap-2 bg-muted/40 p-2 rounded-xl border border-border/60"
                    >
                      <Input
                        type="number"
                        min={0.1}
                        step={0.1}
                        placeholder={t.addRecipe.ingAmount}
                        value={ing.amount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setIngredients((prev) =>
                            prev.map((item) => (item.id === ing.id ? { ...item, amount: val } : item))
                          );
                        }}
                        className="w-20 rounded-lg text-xs"
                      />
                      <Input
                        placeholder={t.addRecipe.ingUnit}
                        value={ing.unit}
                        onChange={(e) => {
                          const val = e.target.value;
                          setIngredients((prev) =>
                            prev.map((item) => (item.id === ing.id ? { ...item, unit: val } : item))
                          );
                        }}
                        className="w-20 rounded-lg text-xs"
                      />
                      <Input
                        placeholder="Ingredient Name (EN)"
                        value={ing.nameEn}
                        onChange={(e) => {
                          const val = e.target.value;
                          setIngredients((prev) =>
                            prev.map((item) => (item.id === ing.id ? { ...item, nameEn: val } : item))
                          );
                        }}
                        className="flex-1 rounded-lg text-xs"
                      />
                      <Input
                        placeholder="పదార్థం పేరు (TE)"
                        value={ing.nameTe}
                        onChange={(e) => {
                          const val = e.target.value;
                          setIngredients((prev) =>
                            prev.map((item) => (item.id === ing.id ? { ...item, nameTe: val } : item))
                          );
                        }}
                        className="w-36 rounded-lg text-xs font-telugu hidden sm:block"
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredientRow(ing.id)}
                        disabled={ingredients.length <= 1}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-rose-600 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps Builder */}
              <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    {t.addRecipe.stepsSection}
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStepRow}
                    className="h-7 text-xs font-semibold rounded-lg gap-1 border-amber-900/20"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.addRecipe.addStepBtn}</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="bg-muted/40 p-3 rounded-2xl border border-border/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-900 text-amber-50 text-xs font-bold">
                          {st.stepNumber}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">
                            {t.addRecipe.stepTimerLabel}:
                          </span>
                          <Input
                            type="number"
                            min={0}
                            value={st.durationMinutes || ""}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSteps((prev) =>
                                prev.map((s) =>
                                  s.stepNumber === st.stepNumber ? { ...s, durationMinutes: val } : s
                                )
                              );
                            }}
                            className="w-16 h-7 text-xs rounded-lg"
                            placeholder="m"
                          />
                          <button
                            type="button"
                            onClick={() => removeStepRow(st.stepNumber)}
                            disabled={steps.length <= 1}
                            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-rose-600 disabled:opacity-30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <Textarea
                        rows={2}
                        placeholder={t.addRecipe.stepInstructionPlaceholder}
                        value={st.instructionEn}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSteps((prev) =>
                            prev.map((s) =>
                              s.stepNumber === st.stepNumber ? { ...s, instructionEn: val } : s
                            )
                          );
                        }}
                        className="rounded-xl text-xs resize-none"
                      />

                      <Input
                        placeholder="దశ వివరణ (తెలుగు - ఆప్షనల్)"
                        value={st.instructionTe}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSteps((prev) =>
                            prev.map((s) =>
                              s.stepNumber === st.stepNumber ? { ...s, instructionTe: val } : s
                            )
                          );
                        }}
                        className="rounded-xl text-xs font-telugu"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTO & EXTRAS */}
          {activeTab === "extras" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Photo Selector */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    {t.addRecipe.photoLabel}
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-amber-900/10 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-900/20">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.addRecipe.uploadCustom}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                  {PRESET_PHOTOS.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedPhoto(preset.path);
                      }}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all group ${
                        selectedPhoto === preset.path
                          ? "border-amber-900 ring-2 ring-amber-900/40 scale-102"
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={preset.path}
                        alt={preset.label}
                        className="h-full w-full object-cover"
                      />
                      {selectedPhoto === preset.path && (
                        <div className="absolute inset-0 bg-amber-950/40 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary checkboxes */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  {t.addRecipe.dietaryTagsLabel}
                </label>
                <div className="flex flex-wrap gap-4 text-xs font-medium">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isVegan}
                      onChange={(e) => setIsVegan(e.target.checked)}
                      className="rounded accent-amber-900"
                    />
                    <span>{t.filter.vegan}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isGlutenFree}
                      onChange={(e) => setIsGlutenFree(e.target.checked)}
                      className="rounded accent-amber-900"
                    />
                    <span>{t.filter.glutenFree}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isJaggerySweetened}
                      onChange={(e) => setIsJaggerySweetened(e.target.checked)}
                      className="rounded accent-amber-900"
                    />
                    <span>{t.filter.jaggerySweetened}</span>
                  </label>
                </div>
              </div>

              {/* Cacao Origin & Mascot Tip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t.addRecipe.cacaoProfileLabel}
                  </label>
                  <Input
                    placeholder={t.addRecipe.cacaoProfilePlaceholder}
                    value={cacaoProfileEn}
                    onChange={(e) => setCacaoProfileEn(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>{t.addRecipe.mascotTipLabel}</span>
                  </label>
                  <Input
                    placeholder={t.addRecipe.mascotTipPlaceholder}
                    value={mascotTipEn}
                    onChange={(e) => setMascotTipEn(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
            <div className="flex items-center gap-2">
              {activeTab !== "basic" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab(activeTab === "extras" ? "ingredients" : "basic");
                  }}
                  className="rounded-xl text-xs"
                >
                  Previous
                </Button>
              )}
              {activeTab !== "extras" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab(activeTab === "basic" ? "ingredients" : "extras");
                  }}
                  className="rounded-xl text-xs"
                >
                  Next Tab
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="rounded-xl text-xs"
              >
                {t.addRecipe.cancelBtn}
              </Button>
              <Button
                type="submit"
                size="sm"
                className="rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-xs px-5 shadow-sm"
              >
                {t.addRecipe.saveBtn}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
