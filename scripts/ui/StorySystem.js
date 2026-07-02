/* 📖 js/ui/StorySystem.js — multi-frame era story overlay (skip + replay) */

import { getEraStory } from '../data/EraStories.js';
import { audio } from '../audio/SoundManager.js';

export class StorySystem {
  /**
   * @param {string} overlayId - Story modal element id
   * @param {Object} [callbacks] - { onOpen(eraLevel, isReplay), onClose(eraLevel, wasReplay) }
   */
  constructor(overlayId, callbacks = {}) {
    this.overlay = document.getElementById(overlayId);
    this.callbacks = callbacks;

    this.titleEl = this.overlay?.querySelector('.story-title');
    this.textEl = this.overlay?.querySelector('.story-text');
    this.imgEl = this.overlay?.querySelector('.story-image');
    this.frameEl = this.overlay?.querySelector('.story-frame-indicator');
    this.btnNext = this.overlay?.querySelector('.btn-story-next');
    this.btnSkip = this.overlay?.querySelector('.btn-story-skip');

    this.seenEras = new Set();
    this.eraLevel = null;
    this.frames = [];
    this.index = 0;
    this.isReplay = false;

    this.bindEvents();
  }

  bindEvents() {
    this.btnNext?.addEventListener('click', () => this.next());
    this.btnSkip?.addEventListener('click', () => this.skip());
  }

  hasSeen(eraLevel) {
    return this.seenEras.has(eraLevel);
  }

  markSeen(eraLevel) {
    if (eraLevel) this.seenEras.add(eraLevel);
  }

  /**
   * Opens the story for an era. Never touches grid/economy state.
   * @param {number} eraLevel
   * @param {{replay?: boolean}} [options]
   * @returns {boolean} whether a story was shown
   */
  show(eraLevel, options = {}) {
    const story = getEraStory(eraLevel);
    if (!story || story.frames.length === 0) return false;

    this.eraLevel = eraLevel;
    this.frames = story.frames;
    this.index = 0;
    this.isReplay = !!options.replay;
    this.render();

    if (this.overlay) this.overlay.style.display = 'block';
    audio.playUnlock();
    if (this.callbacks.onOpen) this.callbacks.onOpen(eraLevel, this.isReplay);
    return true;
  }

  render() {
    const story = getEraStory(this.eraLevel);
    const frame = this.frames[this.index];
    if (!frame) return;

    if (this.titleEl) this.titleEl.textContent = frame.title || story?.eraName || '';
    if (this.textEl) this.textEl.textContent = frame.text;
    if (this.frameEl) this.frameEl.textContent = `${this.index + 1} / ${this.frames.length}`;
    if (this.imgEl) {
      this.imgEl.src = frame.image || '';
      this.imgEl.style.display = frame.image ? '' : 'none';
    }
    if (this.btnNext) {
      this.btnNext.textContent = this.index >= this.frames.length - 1 ? 'Continuar ▶' : 'Próximo ➔';
    }
  }

  next() {
    audio.playClick();
    if (this.index < this.frames.length - 1) {
      this.index++;
      this.render();
    } else {
      this.finish();
    }
  }

  skip() {
    this.finish();
  }

  finish() {
    this.markSeen(this.eraLevel);
    this.close();
  }

  close() {
    if (this.overlay) this.overlay.style.display = 'none';
    const eraLevel = this.eraLevel;
    const wasReplay = this.isReplay;
    if (this.callbacks.onClose) this.callbacks.onClose(eraLevel, wasReplay);
  }
}
