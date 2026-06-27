/* 🎛️ js/ui/EraCard.js */

import { getEra } from '../config.js';
import { Sprites } from '../render/Sprites.js';
import { audio } from '../audio/SoundManager.js';

export class EraCard {
  constructor(overlayId, callbacks) {
    this.overlay = document.getElementById(overlayId);
    this.callbacks = callbacks || {};
    this.activeLevel = 1;

    this.titleEl = this.overlay.querySelector('.modal-title');
    this.subtitleEl = this.overlay.querySelector('.modal-subtitle');
    this.descEl = this.overlay.querySelector('.modal-text-content');
    this.canvasEl = this.overlay.querySelector('.modal-canvas-preview');
    this.btnAction = this.overlay.querySelector('.btn-modal-action');

    // Canvas drawing setup
    if (this.canvasEl) {
      this.canvasEl.width = 120;
      this.canvasEl.height = 120;
      this.ctx = this.canvasEl.getContext('2d');
    }

    this.setupEvents();
  }

  setupEvents() {
    if (this.btnAction) {
      this.btnAction.addEventListener('click', () => this.hide());
    }
  }

  /**
   * Displays the educational card for a specific era level.
   * @param {number} level - Era level (1 to 6)
   */
  show(level) {
    this.activeLevel = level;
    const era = getEra(level);
    
    if (!era) return;

    // Set text contents
    if (this.subtitleEl) {
      this.subtitleEl.textContent = `Nova Era Desbloqueada • ${era.period}`;
    }
    if (this.titleEl) {
      this.titleEl.textContent = era.name;
    }
    if (this.descEl) {
      this.descEl.innerHTML = era.description;
    }

    // Render computer preview on the modal canvas
    if (this.ctx) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      
      // Draw background glow on preview
      const grad = ctx.createRadialGradient(60, 60, 10, 60, 60, 60);
      grad.addColorStop(0, `${era.color}33`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(60, 60, 60, 0, Math.PI * 2);
      ctx.fill();

      // Draw sprite in center
      Sprites.draw(ctx, level, 3, 60, 60, 90, 0); // static draw with time = 0
    }

    // Display overlay
    this.overlay.style.display = 'block';
    
    // Play sound on unlock card display
    audio.playUnlock();

    if (this.callbacks.onShow) {
      this.callbacks.onShow();
    }
  }

  hide() {
    this.overlay.style.display = 'none';
    audio.playClick();
    
    if (this.callbacks.onClose) {
      this.callbacks.onClose(this.activeLevel);
    }
  }
}
