class AudioSynthesizer {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Initialize on first user interaction
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("aegis-audio-mute");
      this.isMuted = stored === "true";
    }
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem("aegis-audio-mute", String(this.isMuted));
    return this.isMuted;
  }

  getMuteState(): boolean {
    return this.isMuted;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine"
  ) {
    if (this.isMuted) return;

    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  keystrokeClick() {
    this.playTone(1200, 0.08, "sine");
  }

  radarHum() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 80;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }

  accessDenied() {
    if (this.isMuted) return;
    const ctx = this.getContext();

    // Dual tone alarm
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sawtooth";
    osc1.frequency.value = 400;

    osc2.type = "sawtooth";
    osc2.frequency.value = 600;

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.3
    );

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);

    osc1.stop(ctx.currentTime + 0.3);
    osc2.stop(ctx.currentTime + 0.3);
  }

  accessGranted() {
    if (this.isMuted) return;

    // Arpeggio chord: 440Hz (A4) -> 554Hz (C#5) -> 659Hz (E5)
    setTimeout(() => this.playTone(440, 0.15, "sine"), 0);
    setTimeout(() => this.playTone(554, 0.15, "sine"), 100);
    setTimeout(() => this.playTone(659, 0.15, "sine"), 200);
  }

  biometricScan() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      400,
      ctx.currentTime + 0.3
    );

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }
}

export const audioSynth = new AudioSynthesizer();
