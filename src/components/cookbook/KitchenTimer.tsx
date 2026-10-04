import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { soundManager } from "@/lib/soundEffects";
import { Play, Pause, RotateCcw, Timer, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KitchenTimerProps {
  initialMinutes?: number;
  autoStart?: boolean;
  onFinish?: () => void;
  title?: string;
}

export const KitchenTimer: React.FC<KitchenTimerProps> = ({
  initialMinutes = 5,
  autoStart = false,
  onFinish,
  title,
}) => {
  const { lang, t } = useLanguage();
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync if initialMinutes changes
  useEffect(() => {
    setTotalSeconds(initialMinutes * 60);
    setRemainingSeconds(initialMinutes * 60);
    setIsDone(false);
  }, [initialMinutes]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsDone(true);
            soundManager.playTimerAlarm();
            if (onFinish) onFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onFinish]);

  const handleTogglePlay = () => {
    soundManager.playClick();
    if (isDone) {
      setRemainingSeconds(totalSeconds);
      setIsDone(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setIsRunning(false);
    setIsDone(false);
    setRemainingSeconds(totalSeconds);
  };

  const addMinutes = (mins: number) => {
    soundManager.playClick();
    const extra = mins * 60;
    setTotalSeconds((prev) => prev + extra);
    setRemainingSeconds((prev) => prev + extra);
    setIsDone(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        isDone
          ? "border-amber-500 bg-amber-50/90 dark:bg-amber-950/40 ring-2 ring-amber-500 animate-pulse"
          : isRunning
          ? "border-amber-800/40 bg-card shadow-md"
          : "border-border bg-card/60"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isDone
                ? "bg-amber-500 text-white"
                : isRunning
                ? "bg-amber-900 text-amber-50"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isDone ? <Bell className="h-4 w-4 animate-bounce" /> : <Timer className="h-4 w-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">
              {title || t.recipeDetail.timerTitle}
            </h4>
            <span className="text-[10px] text-muted-foreground">
              {isDone
                ? t.recipeDetail.timerDone
                : isRunning
                ? lang === "te"
                  ? "సమయం నడుస్తోంది..."
                  : "Cooking countdown..."
                : lang === "te"
                ? "సిద్ధంగా ఉంది"
                : "Ready to start"}
            </span>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => addMinutes(1)}
            className="flex items-center gap-0.5 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground hover:bg-amber-100 hover:text-amber-900"
          >
            <Plus className="w-2.5 h-2.5" /> 1m
          </button>
          <button
            onClick={() => addMinutes(5)}
            className="flex items-center gap-0.5 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground hover:bg-amber-100 hover:text-amber-900"
          >
            <Plus className="w-2.5 h-2.5" /> 5m
          </button>
        </div>
      </div>

      {/* Timer Display & Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span
            className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight ${
              isDone
                ? "text-amber-600 animate-bounce"
                : isRunning
                ? "text-amber-900 dark:text-amber-200"
                : "text-foreground"
            }`}
          >
            {formatTime(remainingSeconds)}
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={isRunning ? "outline" : "default"}
              onClick={handleTogglePlay}
              className={`rounded-xl text-xs font-semibold px-3 h-8 gap-1.5 ${
                !isRunning && !isDone
                  ? "bg-amber-900 text-amber-50 hover:bg-amber-800"
                  : ""
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>{t.recipeDetail.pauseTimer}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{t.recipeDetail.startTimer}</span>
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-foreground"
              title={t.recipeDetail.resetTimer}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all duration-1000 ${
              isDone ? "bg-amber-500" : "bg-amber-800"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
