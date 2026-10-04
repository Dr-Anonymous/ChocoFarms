import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { soundManager } from "@/lib/soundEffects";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Sparkles, BookOpen, Home, Heart, PlusCircle } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { AddRecipeModal } from "./AddRecipeModal";

interface CookbookNavbarProps {
  onOpenAddRecipe?: () => void;
}

export const CookbookNavbar: React.FC<CookbookNavbarProps> = ({ onOpenAddRecipe }) => {
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();
  const { favorites } = useFavorites();
  const [muted, setMuted] = React.useState(() => soundManager.getMuted());
  const [localModalOpen, setLocalModalOpen] = useState(false);

  const handleToggleSound = () => {
    const isNowMuted = soundManager.toggleMute();
    setMuted(isNowMuted);
  };

  const isCookActive = location.pathname.startsWith("/cook");

  const handleAddClick = () => {
    soundManager.playChime(660);
    if (onOpenAddRecipe) {
      onOpenAddRecipe();
    } else {
      setLocalModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Brand / Logo */}
          <Link
            to="/"
            onClick={() => soundManager.playClick()}
            className="group flex items-center space-x-2.5 transition-transform hover:scale-102"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-amber-900/10 text-amber-900 border border-amber-800/20 shadow-sm transition-colors group-hover:bg-amber-900/20">
              <span className="text-xl">🍫</span>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                🌱
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                ChocoFarms
                <span className="rounded-full bg-amber-800/10 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:text-amber-300">
                  Cookbook
                </span>
              </span>
              <span className="text-[11px] font-medium text-muted-foreground -mt-0.5">
                {lang === "te" ? "ఫామ్ వంటల పుస్తకం" : "Tree-to-Table Cocoa Recipes"}
              </span>
            </div>
          </Link>

          {/* Center / Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 font-medium text-sm">
            <Link
              to="/"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Home className="w-4 h-4" />
              {t.nav.home}
            </Link>
            <Link
              to="/cook"
              onClick={() => soundManager.playClick()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                isCookActive
                  ? "bg-amber-900/10 text-amber-900 font-semibold dark:bg-amber-900/30 dark:text-amber-200"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-800" />
              {t.nav.cookbook}
            </Link>
            <a
              href="https://wa.me/919866812555"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50 dark:text-emerald-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {t.nav.staycation}
            </a>
          </nav>

          {/* Right side controls: Add Recipe, Language, Sound, Favorites */}
          <div className="flex items-center space-x-2">
            {/* Add Recipe Button */}
            <Button
              size="sm"
              onClick={handleAddClick}
              className="rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs px-3"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{t.addRecipe.btn}</span>
            </Button>

            {/* Favorite Indicator */}
            {favorites.length > 0 && (
              <Link
                to="/cook?filter=favorites"
                onClick={() => soundManager.playClick()}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                title="Saved Recipes"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span className="font-bold">{favorites.length}</span>
              </Link>
            )}

            {/* Sound Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSound}
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-amber-950"
              title={muted ? t.cookMode.soundOff : t.cookMode.soundOn}
              aria-label="Toggle sound effects"
            >
              {muted ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-amber-800" />
              )}
            </Button>

            {/* Bilingual Language Switcher */}
            <button
              onClick={() => {
                toggleLang();
                soundManager.playChime(520);
              }}
              className="relative inline-flex items-center rounded-full border border-amber-900/20 bg-amber-50/80 p-0.5 text-xs font-semibold shadow-sm transition-all hover:border-amber-900/40 hover:shadow"
              title="Toggle English / తెలుగు"
              aria-label="Switch language"
            >
              <span
                className={`rounded-full px-2.5 py-1 transition-all ${
                  lang === "en"
                    ? "bg-amber-900 text-amber-50 shadow-sm"
                    : "text-amber-900/70 hover:text-amber-950"
                }`}
              >
                English
              </span>
              <span
                className={`rounded-full px-2.5 py-1 transition-all ${
                  lang === "te"
                    ? "bg-amber-900 text-amber-50 shadow-sm"
                    : "text-amber-900/70 hover:text-amber-950 font-telugu"
                }`}
              >
                తెలుగు
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Standalone Add Recipe Modal fallback if not handled by parent */}
      {!onOpenAddRecipe && (
        <AddRecipeModal
          isOpen={localModalOpen}
          onClose={() => setLocalModalOpen(false)}
        />
      )}
    </>
  );
};
