import { audio } from './audio/SoundManager.js';

export class IntroController {
  constructor() {
    this.container = document.getElementById('intro-container');
    this.video = document.getElementById('intro-video');
    this.skipBtn = document.getElementById('btn-intro-skip');
    this.isSkipped = false;
  }

  init() {
    if (!this.container || !this.video) {
      console.warn("Intro container or video not found in DOM.");
      return;
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.skip();
      });
    }

    this.keydownHandler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.skip();
      }
    };
    window.addEventListener('keydown', this.keydownHandler);

    this.video.addEventListener('ended', () => this.finish());

    const playPromise = this.video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        this.video.controls = true;
      });
    }
  }

  skip() {
    if (this.isSkipped) return;
    this.isSkipped = true;

    try {
      audio.playClick();
    } catch(e) {}

    this.video.pause();
    this.finish(true);
  }

  finish(fast = false) {
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
    try {
      audio.initContext();
    } catch (e) {
      console.warn("Failed to initialize audio context on intro end:", e);
    }

    const event = new CustomEvent('introFinished');
    window.dispatchEvent(event);
  }
}
