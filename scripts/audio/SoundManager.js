/* 🔊 js/audio/SoundManager.js */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem("game_muted") === "true";
    this.bgmPlaying = false;
    this.bgmNodes = null;
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
    if (this.bgmPlaying || !this.ctx || this.muted) return;
    this.bgmPlaying = true;

    const ctx = this.ctx;

    // Master gain for BGM
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
    masterGain.connect(ctx.destination);

    // ── Bass Drone ──
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(55, ctx.currentTime); // A1
    bassGain.gain.setValueAtTime(0.3, ctx.currentTime);
    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start();

    // ── Pad (warm chord) ──
    const padNotes = [130.81, 164.81, 196.00]; // C3, E3, G3
    const padOscs = padNotes.map(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      return { osc, gain };
    });

    // ── Melody Sequencer ──
    // Pentatonic scale notes (C4 pentatonic): C4, D4, E4, G4, A4, C5, D5, E5
    const melodyNotes = [
      261.63, 293.66, 329.63, 392.00, 440.00,
      523.25, 587.33, 659.25
    ];

    // Musical patterns (index into melodyNotes)
    const patterns = [
      [0, 2, 4, 3, 2, 0, 1, 3],
      [4, 3, 2, 0, 1, 2, 4, 5],
      [2, 4, 6, 5, 4, 2, 3, 1],
      [0, 1, 3, 5, 7, 5, 3, 1],
      [5, 4, 2, 3, 1, 0, 2, 4],
      [3, 5, 7, 6, 5, 3, 4, 2],
    ];

    let currentPattern = 0;
    let noteIndex = 0;
    const bpm = 75;
    const noteInterval = 60 / bpm;

    // Melody oscillator setup
    const melodyOsc = ctx.createOscillator();
    const melodyGain = ctx.createGain();
    const melodyFilter = ctx.createBiquadFilter();
    
    melodyOsc.type = 'square';
    melodyFilter.type = 'lowpass';
    melodyFilter.frequency.setValueAtTime(1200, ctx.currentTime);
    melodyFilter.Q.setValueAtTime(2, ctx.currentTime);
    melodyGain.gain.setValueAtTime(0, ctx.currentTime);
    
    melodyOsc.connect(melodyFilter);
    melodyFilter.connect(melodyGain);
    melodyGain.connect(masterGain);
    melodyOsc.start();

    // Arpeggio oscillator
    const arpOsc = ctx.createOscillator();
    const arpGain = ctx.createGain();
    const arpFilter = ctx.createBiquadFilter();
    
    arpOsc.type = 'sine';
    arpFilter.type = 'lowpass';
    arpFilter.frequency.setValueAtTime(2000, ctx.currentTime);
    arpGain.gain.setValueAtTime(0, ctx.currentTime);
    
    arpOsc.connect(arpFilter);
    arpFilter.connect(arpGain);
    arpGain.connect(masterGain);
    arpOsc.start();

    // Sequencer loop
    const scheduleNote = () => {
      if (!this.bgmPlaying) return;

      const pattern = patterns[currentPattern];
      const noteIdx = pattern[noteIndex % pattern.length];
      const freq = melodyNotes[noteIdx];
      const now = ctx.currentTime;

      // Melody envelope
      melodyOsc.frequency.setValueAtTime(freq, now);
      melodyGain.gain.cancelScheduledValues(now);
      melodyGain.gain.setValueAtTime(0.15, now);
      melodyGain.gain.exponentialRampToValueAtTime(0.01, now + noteInterval * 0.8);

      // Arpeggio (plays octave above at half time)
      const arpFreq = freq * 2;
      setTimeout(() => {
        if (!this.bgmPlaying) return;
        const t = ctx.currentTime;
        arpOsc.frequency.setValueAtTime(arpFreq, t);
        arpGain.gain.cancelScheduledValues(t);
        arpGain.gain.setValueAtTime(0.05, t);
        arpGain.gain.exponentialRampToValueAtTime(0.001, t + noteInterval * 0.3);
      }, (noteInterval * 500));

      // Bass changes every 8 notes
      if (noteIndex % 8 === 0) {
        const bassNotes = [55, 65.41, 73.42, 49]; // A1, C2, D2, G1
        const bassIdx = Math.floor(currentPattern) % bassNotes.length;
        bassOsc.frequency.setValueAtTime(bassNotes[bassIdx], now);
      }

      noteIndex++;
      if (noteIndex >= pattern.length) {
        noteIndex = 0;
        currentPattern = (currentPattern + 1) % patterns.length;
      }
    };

    const intervalId = setInterval(scheduleNote, noteInterval * 1000);
    scheduleNote(); // play immediately

    // Store references for cleanup
    this.bgmNodes = {
      masterGain,
      bassOsc,
      bassGain,
      padOscs,
      melodyOsc,
      melodyGain,
      melodyFilter,
      arpOsc,
      arpGain,
      arpFilter,
      intervalId
    };
  }

  stopBGM() {
    this.bgmPlaying = false;

    if (this.bgmNodes) {
      clearInterval(this.bgmNodes.intervalId);

      const now = this.ctx ? this.ctx.currentTime : 0;
      
      try {
        // Fade out master
        this.bgmNodes.masterGain.gain.cancelScheduledValues(now);
        this.bgmNodes.masterGain.gain.setValueAtTime(this.bgmNodes.masterGain.gain.value, now);
        this.bgmNodes.masterGain.gain.linearRampToValueAtTime(0, now + 0.5);

        // Stop oscillators after fade
        setTimeout(() => {
          try {
            this.bgmNodes.bassOsc.stop();
            this.bgmNodes.melodyOsc.stop();
            this.bgmNodes.arpOsc.stop();
            this.bgmNodes.padOscs.forEach(p => p.osc.stop());
          } catch (e) { /* already stopped */ }
          this.bgmNodes = null;
        }, 600);
      } catch (e) {
        this.bgmNodes = null;
      }
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
