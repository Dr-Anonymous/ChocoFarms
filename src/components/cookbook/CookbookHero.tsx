import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Sparkles, ChefHat, Leaf, Flame, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { soundManager } from "@/lib/soundEffects";

interface CookbookHeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddRecipe?: () => void;
}

export const CookbookHero: React.FC<CookbookHeroProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddRecipe,
}) => {
  const { lang, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-950/10 via-amber-900/5 to-background pt-10 pb-8 sm:pt-14 sm:pb-12 border-b border-amber-900/10">
      {/* Decorative background glow & cocoa bean shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-12 -right-20 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Text & Search */}
          <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-800/10 px-3.5 py-1 text-xs font-semibold text-amber-900 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-amber-950 dark:text-amber-50 leading-[1.15]">
              {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-amber-950/70 dark:text-amber-200/70 max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* Highlights row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs font-medium text-amber-950/80 dark:text-amber-200">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 px-2.5 py-1 border border-border shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                {lang === "te" ? "తోటల తాజా కోకో" : "100% Tree-to-Table Cacao"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 px-2.5 py-1 border border-border shadow-xs">
                <ChefHat className="w-3.5 h-3.5 text-amber-700" />
                {lang === "te" ? "ఇంటరాక్టివ్ చెఫ్ మోడ్" : "Interactive Chef Mode"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 px-2.5 py-1 border border-border shadow-xs">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                {lang === "te" ? "ఆర్గానిక్ తాటి బెల్లం" : "Organic Andhra Jaggery"}
              </span>
            </div>

            {/* Search Bar & Add Recipe CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl mx-auto lg:mx-0">
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-800/60 group-focus-within:text-amber-900 transition-colors" />
                <Input
                  type="text"
                  placeholder={t.filter.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-12 w-full rounded-2xl border-amber-900/20 bg-card/90 pl-11 pr-10 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-amber-800/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {onOpenAddRecipe && (
                <Button
                  onClick={() => {
                    soundManager.playChime(660);
                    onOpenAddRecipe();
                  }}
                  className="h-12 rounded-2xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs sm:text-sm font-bold gap-2 px-4 shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>{t.addRecipe.btn}</span>
                </Button>
              )}
            </div>
          </div>

          {/* Right Mascot Feature */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              {/* Soft glow circle behind mascot */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/20 via-amber-200/30 to-emerald-400/20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-95" />
              
              <div className="relative rounded-3xl border border-amber-900/10 bg-card/60 backdrop-blur-sm p-4 shadow-lg transition-transform duration-300 group-hover:scale-103">
                <img
                  src="/mascot.png"
                  alt="ChocoFarms Mascot Chef"
                  className="h-44 sm:h-52 lg:h-56 w-auto object-contain mx-auto drop-shadow-md"
                />
                <div className="mt-2 text-center">
                  <span className="inline-block rounded-full bg-amber-900/10 px-3 py-1 text-[11px] font-bold text-amber-900 dark:text-amber-200">
                    {lang === "te" ? "✨ చెఫ్ మస్కాట్ సీక్రెట్స్" : "✨ Mascot's Kitchen Grove"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
