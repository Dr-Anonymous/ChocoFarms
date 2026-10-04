import React, { useState, useEffect } from "react";
import { Recipe } from "@/data/recipes";
import { useLanguage } from "@/context/LanguageContext";
import { soundManager } from "@/lib/soundEffects";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ChefHat,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KitchenTimer } from "./KitchenTimer";

interface ChefCookModeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ChefCookModeModal: React.FC<ChefCookModeModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const { lang, t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [muted, setMuted] = useState(() => soundManager.getMuted());

  // Reset when opening a new recipe
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      setIsFinished(false);
      soundManager.playChime(660);
    }
  }, [isOpen, recipe?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !recipe) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, recipe, currentStepIndex, isFinished]);

  if (!isOpen || !recipe) return null;

  const totalSteps = recipe.steps.length;
  const currentStep = recipe.steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStepIndex)) {
        setCompletedSteps((prev) => [...prev, currentStepIndex]);
      }
      soundManager.playChime(587.33);
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Last step -> Finish!
      if (!completedSteps.includes(currentStepIndex)) {
        setCompletedSteps((prev) => [...prev, currentStepIndex]);
      }
      setIsFinished(true);
      soundManager.playVictory();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      soundManager.playClick();
      setCurrentStepIndex((prev) => prev - 1);
      setIsFinished(false);
    }
  };

  const handleStepToggle = (idx: number) => {
    soundManager.playClick();
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((s) => s !== idx));
    } else {
      soundManager.playChime(784);
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setIsFinished(false);
  };

  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl h-[92vh] max-h-[820px] rounded-3xl bg-background border border-amber-900/30 shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-900 text-amber-50">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  {t.cookMode.title}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-semibold text-foreground line-clamp-1 max-w-[200px] sm:max-w-xs">
                  {recipe.title[lang]}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {t.cookMode.stepOf} {currentStepIndex + 1} {t.cookMode.of} {totalSteps}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                const nowMuted = soundManager.toggleMute();
                setMuted(nowMuted);
              }}
              title={muted ? t.cookMode.soundOff : t.cookMode.soundOn}
            >
              {muted ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-amber-800" />
              )}
            </Button>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              title={t.cookMode.backToDetail}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-amber-700 to-amber-900 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between">
          {!isFinished ? (
            <div className="space-y-6 max-w-2xl mx-auto w-full my-auto">
              {/* Step Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/10 px-3 py-1 text-xs font-bold text-amber-900 dark:text-amber-200">
                  {t.cookMode.stepOf} {currentStep.stepNumber}
                </span>

                <button
                  onClick={() => handleStepToggle(currentStepIndex)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    completedSteps.includes(currentStepIndex)
                      ? "text-emerald-600"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      completedSteps.includes(currentStepIndex)
                        ? "fill-emerald-600 text-white"
                        : ""
                    }`}
                  />
                  <span>
                    {completedSteps.includes(currentStepIndex)
                      ? t.cookMode.completedBadge
                      : lang === "te"
                      ? "పూర్తయినట్లు మార్క్ చేయండి"
                      : "Mark Completed"}
                  </span>
                </button>
              </div>

              {/* Big Instruction Text */}
              <div className="rounded-3xl border border-amber-900/15 bg-card/80 p-6 sm:p-8 shadow-sm">
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground leading-snug tracking-tight">
                  {currentStep.instruction[lang]}
                </p>

                {/* Step Tip if any */}
                {currentStep.tip && (
                  <div className="mt-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{currentStep.tip[lang]}</span>
                  </div>
                )}
              </div>

              {/* Embedded Timer if this step has a duration */}
              {currentStep.durationMinutes && (
                <div className="max-w-md mx-auto">
                  <KitchenTimer
                    key={`step-timer-${currentStepIndex}`}
                    initialMinutes={currentStep.durationMinutes}
                    title={`${t.cookMode.quickTimer} (${currentStep.durationMinutes} ${t.recipeCard.mins})`}
                  />
                </div>
              )}

              {/* Mascot Secret Bubble */}
              <div className="flex items-center gap-3 rounded-2xl bg-amber-950/5 p-3.5 border border-amber-900/10">
                <img
                  src="/mascot.png"
                  alt="Mascot Tip"
                  className="h-10 w-10 object-contain shrink-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-200 block">
                    {lang === "te" ? "మస్కాట్ చిట్కా:" : "Mascot Tip:"}
                  </span>
                  <span className="text-muted-foreground">
                    {recipe.mascotTip[lang]}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Celebration Screen when all steps are completed! */
            <div className="text-center my-auto max-w-lg mx-auto space-y-6 animate-in zoom-in-95 duration-400">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl animate-pulse" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-700 to-amber-900 text-white shadow-xl mx-auto">
                  <span className="text-5xl">🎉</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {lang === "te" ? "అభినందనలు, చెఫ్!" : "Hooray, Chef!"}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {t.cookMode.doneCookingMessage}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{recipe.title[lang]}</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                  {t.cookMode.completedBadge}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleRestart}
                  className="rounded-xl gap-1.5 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {lang === "te" ? "మళ్లీ ప్రారంభించండి" : "Cook Again"}
                </Button>
                <Button
                  onClick={onClose}
                  className="rounded-xl bg-amber-900 text-amber-50 hover:bg-amber-800 text-xs font-semibold px-5"
                >
                  {t.cookMode.backToDetail}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Controls */}
        {!isFinished && (
          <div className="flex items-center justify-between border-t border-border/70 px-6 py-4 bg-muted/30">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="rounded-xl gap-1.5 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.cookMode.prevStep}</span>
            </Button>

            {/* Dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {recipe.steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentStepIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? "w-7 bg-amber-900"
                      : completedSteps.includes(idx)
                      ? "w-2.5 bg-emerald-600"
                      : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  title={`${t.cookMode.stepOf} ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 gap-1.5 text-xs font-semibold px-5 shadow-sm"
            >
              <span>
                {currentStepIndex < totalSteps - 1
                  ? t.cookMode.nextStep
                  : t.cookMode.finishRecipe}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
