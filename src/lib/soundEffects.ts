// Web Audio API Synthesizer - 100% self-contained, no external MP3 dependencies!

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check initial mute state from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chocofarms_sound_muted");
      this.isMuted = saved === "true";
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("chocofarms_sound_muted", String(this.isMuted));
    }
    if (!this.isMuted) {
      this.playChime(660);
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("chocofarms_sound_muted", String(this.isMuted));
    }
  }

  /**
   * Pleasant xylophone / chime note
   */
  public playChime(freq = 587.33, duration = 0.3) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked by browser policy
    }
  }

  /**
   * Subtle wooden click for checkbox/timer toggle
   */
  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore
    }
  }

  /**
   * Kitchen Timer completion bell - 3 sweet harmonious bells
   */
  public playTimerAlarm() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 0.6);
      }, idx * 160);
    });
  }

  /**
   * Victory flourish when all steps are completed
   */
  public playVictory() {
    if (this.isMuted) return;
    const chord = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    chord.forEach((freq, i) => {
      setTimeout(() => {
        this.playChime(freq, 0.7);
      }, i * 120);
    });
  }
}

export const soundManager = new SoundManager();
