/* 🖱️ js/input/ClickHandler.js */

import { Computer } from '../game/Computer.js';
import { audio } from '../audio/SoundManager.js';
import { getAdaptivePurchaseLevel, getEra } from '../config.js';

export class ClickHandler {
  /**
   * @param {Economy} economy - Game economy
   * @param {Grid} grid - Grid object
   * @param {ParticleSystem} particleSystem - Particle system
   * @param {Object} state - Reference to the global engine state
   * @param {Object} callbacks - callbacks: { onStateChange, onBuy }
   */
  constructor(economy, grid, particleSystem, state, callbacks) {
    this.economy = economy;
    this.grid = grid;
    this.particleSystem = particleSystem;
    this.state = state; // holds { maxEraUnlocked, ... }
    this.callbacks = callbacks;

    this.bindEvents();
  }

  bindEvents() {
    // 1. Click Research Button
    const btnResearch = document.getElementById('btn-research');
    if (btnResearch) {
      btnResearch.addEventListener('click', (e) => this.handleResearchClick(e));
    }

    // 2. Buy Computer Button
    const btnBuy = document.getElementById('btn-buy');
    if (btnBuy) {
      btnBuy.addEventListener('click', () => this.handleBuyClick());
    }

    // 3. Mute Button
    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
      btnMute.addEventListener('click', () => this.handleMuteToggle());
    }

    // 4. Reset Button
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.handleResetClick());
    }
  }

  handleResearchClick(e) {
    const clickVal = this.economy.clickResearch(this.state.maxEraUnlocked);
    audio.playClick();

    // Spawn floating number particle at mouse position or button center
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    
    // Calculate click coordinates relative to viewport to float text on screen,
    // or simulate it over the canvas center. Let's spawn it in a floating overlay or near the click!
    // Since our particle system runs on the canvas, let's spawn a floating particle in the canvas 
    // center, or scatter it! Or let's grab the canvas center.
    const canvas = document.getElementById('game-canvas');
    if (canvas) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const era = getEra(this.state.maxEraUnlocked);
      
      // Random offsets around the center
      const rx = centerX + (Math.random() - 0.5) * 120;
      const ry = centerY + (Math.random() - 0.5) * 120;
      
      this.particleSystem.addFloatingText(rx, ry, `+${clickVal} PP`, era.color);
    }

    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange();
    }
  }

  getHighestGridLevel() {
    return this.grid.slots.reduce((highestLevel, computer) => (
      computer ? Math.max(highestLevel, computer.level) : highestLevel
    ), 1);
  }

  handleBuyClick() {
    if (this.grid.isFull()) {
      audio.playError();
      this.shakeGameBoard();
      return;
    }

    const cost = this.economy.getBuyCost();
    if (this.economy.canAffordBuy()) {
      const success = this.economy.buy();
      if (success) {
        const slotIdx = this.grid.getRandomFreeSlot();
        if (slotIdx !== -1) {
          const coords = this.grid.getSlotCoordinates(slotIdx);
          
          const baseLevel = getAdaptivePurchaseLevel(this.getHighestGridLevel());
          const newComp = new Computer(baseLevel, slotIdx, coords.centerX, coords.centerY);
          this.grid.placeComputer(newComp, slotIdx);

          audio.playBuy();

          // Particle spawn on bought slot
          const era = getEra(this.state.maxEraUnlocked);
          this.particleSystem.addSparks(coords.centerX, coords.centerY, era.color, 15);
          this.particleSystem.addFloatingText(coords.centerX, coords.centerY - 20, `-${cost} PP`, '#EF5350');

          if (this.callbacks.onBuy) {
            this.callbacks.onBuy();
          }
        }
      }
    } else {
      audio.playError();
    }
  }

  handleMuteToggle() {
    const isMuted = audio.toggleMute();
    this.updateMuteIcon(isMuted);
  }

  updateMuteIcon(isMuted) {
    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
      // Toggle HTML SVGs inside button
      const svgSoundOn = btnMute.querySelector('.sound-on');
      const svgSoundOff = btnMute.querySelector('.sound-off');
      if (isMuted) {
        svgSoundOn.style.display = 'none';
        svgSoundOff.style.display = 'block';
      } else {
        svgSoundOn.style.display = 'block';
        svgSoundOff.style.display = 'none';
      }
    }
    
    // Toggle music indicator
    const musicIndicator = document.getElementById('music-indicator');
    if (musicIndicator) {
      musicIndicator.style.display = isMuted ? 'none' : 'flex';
    }
  }

  handleResetClick() {
    if (confirm("Deseja realmente reiniciar o jogo? Todo o seu progresso será perdido!")) {
      if (this.callbacks.onReset) {
        this.callbacks.onReset();
      }
    }
  }

  shakeGameBoard() {
    const container = document.querySelector('.game-board-container');
    if (container) {
      container.classList.add('shake');
      setTimeout(() => {
        container.classList.remove('shake');
      }, 400);
    }
  }
}
