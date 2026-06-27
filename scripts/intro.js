/* 🎬 scripts/intro.js - Cinematic Intro Choreography (Scene 1) */

import { audio } from './audio/SoundManager.js';

export class IntroController {
  constructor() {
    this.container = document.getElementById('intro-container');
    this.valve = document.getElementById('intro-valve');
    this.text = document.getElementById('intro-text');
    this.skipBtn = document.getElementById('btn-intro-skip');
    
    this.timeouts = [];
    this.isSkipped = false;
  }

  init() {
    if (!this.container) {
      console.warn("Intro container not found in DOM.");
      return;
    }

    console.log("Initializing Intro Controller...");

    // Click handler for skip button
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.skip();
      });
    }

    // Keydown listener for Space bar
    this.keydownHandler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.skip();
      }
    };
    window.addEventListener('keydown', this.keydownHandler);

    // Start scene timeline
    this.start();
  }

  registerTimeout(callback, ms) {
    const id = setTimeout(callback, ms);
    this.timeouts.push(id);
  }

  start() {
    console.log("Intro Scene 1: The Thermionic Valve.");

    // 0s: Black screen (initial state)
    
    // 1s: The Valve (image) appears smoothly (fade-in)
    this.registerTimeout(() => {
      if (this.isSkipped || !this.valve) return;
      this.valve.classList.add('fade-in');
    }, 1000);

    // 3s: Text appears over the valve: "1946"
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.textContent = "1946";
      this.text.classList.add('fade-in');
    }, 3000);

    // 5s: Text "1946" disappears
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-in');
      this.text.classList.add('fade-out');
    }, 5000);

    // 6s: Text appears: "Para construir um computador..."
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-out');
      this.text.textContent = "Para construir um computador...";
      this.text.classList.add('fade-in');
    }, 6000);

    // 8s: Text disappears...
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-in');
      this.text.classList.add('fade-out');
    }, 8000);

    // 9s: ...and reappears as: "...era necessário ocupar uma sala inteira."
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-out');
      this.text.textContent = "...era necessário ocupar uma sala inteira.";
      this.text.classList.add('fade-in');
    }, 9000);

    // 11s: The valve image begins to shrink (zoom-out camera effect)
    this.registerTimeout(() => {
      if (this.isSkipped || !this.valve) return;
      this.valve.classList.add('zoom-out');
    }, 11000);

    // 13.5s: Text fades out
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-in');
      this.text.classList.add('fade-out');
    }, 13500);

    // 15s: Cinematic end of Scene 1, fading out container
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      this.finish();
    }, 15000);
  }

  skip() {
    if (this.isSkipped) return;
    this.isSkipped = true;
    console.log("Intro skip requested.");
    
    // Play a click sound if audio manager is ready
    try {
      audio.playClick();
    } catch(e) {}
    
    this.finish(true); // true triggers the quick 0.5s fade-out skip
  }

  finish(fast = false) {
    // Clear all scheduled timeline events
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts = [];

    // Remove window keydown listener
    window.removeEventListener('keydown', this.keydownHandler);

    if (this.container) {
      this.container.style.transition = fast ? 'opacity 0.5s ease-in-out' : 'opacity 1.5s ease-in-out';
      this.container.style.opacity = '0';
      
      setTimeout(() => {
        this.container.style.display = 'none';
        this.container.remove();
        this.releaseGame();
      }, fast ? 500 : 1500);
    } else {
      this.releaseGame();
    }
  }

  releaseGame() {
    console.log("Intro sequence complete. Releasing game control...");
    
    // Attempt to start background music after player interaction
    try {
      audio.initContext();
    } catch (e) {
      console.warn("Failed to initialize audio context on intro end:", e);
    }

    const event = new CustomEvent('introFinished');
    window.dispatchEvent(event);
  }
}
