/* 🔊 js/audio/SoundManager.js */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem("game_muted") === "true";
    this.bgmPlaying = false;
    this.bgmAudio = null;
    this.bgmStarted = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    // Start BGM on first interaction
    if (this.ctx && !this.bgmStarted) {
      this.bgmStarted = true;
      if (!this.muted) {
        this.startBGM();
      }
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("game_muted", this.muted ? "true" : "false");
    
    if (this.muted) {
      this.stopBGM();
    } else {
      this.initContext();
      if (!this.bgmPlaying) {
        this.startBGM();
      }
    }
    
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // ═══════════════════════════════════════════
  //  🎵 BACKGROUND MUSIC - Procedural Chiptune
  // ═══════════════════════════════════════════

  startBGM() {
    if (this.bgmPlaying || this.muted) return;
    this.bgmPlaying = true;

    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('scripts/audio/BullyTheme.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.15; // Suave background volume
    }

    // Play BGM and handle autoplay limits
    this.bgmAudio.play().catch(err => {
      console.warn("Autoplay blocked or audio error:", err);
      this.bgmPlaying = false;
    });
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  // ═══════════════════════════════════════════
  //  🔊 SOUND EFFECTS
  // ═══════════════════════════════════════════

  playClick() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playBuy() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "triangle";
    osc2.type = "sine";

    const now = this.ctx.currentTime;

    // Cha-ching: rapid succession of two high-pitched notes
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
    
    osc2.frequency.setValueAtTime(1046.50, now + 0.16); // C6

    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();

    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  playMerge() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Satisfying whoosh + sparkle combo
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
    gain1.gain.setValueAtTime(0.01, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start();
    osc1.stop(now + 0.35);

    // Sparkle chime
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1318.51, now + 0.1); // E6
    osc2.frequency.setValueAtTime(1567.98, now + 0.15); // G6
    osc2.frequency.setValueAtTime(2093.00, now + 0.2); // C7
    gain2.gain.setValueAtTime(0.0, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start();
    osc2.stop(now + 0.45);
  }

  playUnlock() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "triangle";
    
    // Triumphant arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 to C6 arpeggio
    const step = 0.075;
    
    notes.forEach((freq, index) => {
      osc.frequency.setValueAtTime(freq, now + index * step);
    });

    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.setValueAtTime(0.12, now + notes.length * step - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + notes.length * step + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + notes.length * step + 0.35);
  }

  playError() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(130, this.ctx.currentTime); // Low buzz

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  playTick() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }
}

// Export singleton instance
export const audio = new SoundManager();
