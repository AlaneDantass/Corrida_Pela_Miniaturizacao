/* 🎛️ js/ui/HUD.js */

import { getAdaptivePurchaseLevel, getComponentByLevel } from '../config.js';

export class HUD {
  constructor() {
    this.coinsEl = document.getElementById('currency-value');
    this.cpsEl = document.getElementById('cps-value');
    this.clickPowerEl = document.getElementById('click-power-value');
    
    this.btnBuy = document.getElementById('btn-buy');
    this.buyCostEl = document.getElementById('buy-cost-value');
    this.slotsUsedEl = document.getElementById('slots-used');
    this.slotsMaxEl = document.getElementById('slots-max');

    // Cached values to avoid DOM writes
    this.lastCoins = -1;
    this.lastCps = -1;
    this.lastClickPower = -1;
    this.lastBuyCost = -1;
    this.lastOccupied = -1;
    this.lastMaxSlots = -1;
    this.lastIsFull = null;
    this.lastCanAfford = null;
    this.lastMaxEraUnlocked = -1;
    this.lastAdaptiveBuyLevel = -1;
    
    this.popTimeout = null;
  }

  /**
   * Formats numbers into a clean readable string (e.g. 1.2K, 3.4M).
   * @param {number} num - The number to format
   */
  formatNumber(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toString();
  }

  /**
   * Refreshes all HUD indicators.
   * @param {Economy} economy - Game economy state
   * @param {Grid} grid - Grid state
   * @param {number} maxEraUnlocked - Highest unlocked level
   */
  update(economy, grid, maxEraUnlocked, state = {}) {
    const gridSlots = grid.slots || grid;
    const cps = economy.calculateCps(gridSlots);
    const clickPower = economy.getClickValue(maxEraUnlocked);
    const buyCost = economy.getBuyCost();
    const occupied = grid.getOccupiedCount ? grid.getOccupiedCount() : gridSlots.filter(s => s !== null).length;
    const maxSlots = gridSlots.length;
    const isVictory = !!state.victoryTriggered;
    const highestGridLevel = gridSlots.reduce((highestLevel, computer) => (
      computer ? Math.max(highestLevel, computer.level) : highestLevel
    ), 1);
    const adaptiveBuyLevel = getAdaptivePurchaseLevel(highestGridLevel);
    const buyCostChanged = buyCost !== this.lastBuyCost;

    // 1. Update coins text with caching
    const roundedCoins = Math.floor(economy.coins);
    if (this.coinsEl && roundedCoins !== this.lastCoins) {
      const newVal = this.formatNumber(economy.coins);
      this.coinsEl.textContent = newVal;
      
      // Add subtle pop on change (only if not initial load)
      if (this.lastCoins !== -1) {
        this.coinsEl.style.transform = 'scale(1.08)';
        if (this.popTimeout) {
          clearTimeout(this.popTimeout);
        }
        this.popTimeout = setTimeout(() => {
          if (this.coinsEl) this.coinsEl.style.transform = 'scale(1)';
          this.popTimeout = null;
        }, 150);
      }
      this.lastCoins = roundedCoins;
    }
    
    // 2. Update stats with caching
    if (this.cpsEl && cps !== this.lastCps) {
      this.cpsEl.textContent = this.formatNumber(cps);
      this.lastCps = cps;
    }
    if (this.clickPowerEl && clickPower !== this.lastClickPower) {
      this.clickPowerEl.textContent = this.formatNumber(clickPower);
      this.lastClickPower = clickPower;
    }
    if (this.buyCostEl && buyCostChanged) {
      this.buyCostEl.textContent = this.formatNumber(buyCost);
    }
    if (this.slotsUsedEl && occupied !== this.lastOccupied) {
      this.slotsUsedEl.textContent = occupied.toString();
      this.lastOccupied = occupied;
    }
    if (this.slotsMaxEl && maxSlots !== this.lastMaxSlots) {
      this.slotsMaxEl.textContent = maxSlots.toString();
      this.lastMaxSlots = maxSlots;
    }

    // 3. Hide buy button on final victory or disable/update it otherwise
    const isFull = grid.isFull ? grid.isFull() : gridSlots.every(s => s !== null);
    const canAfford = economy.canAffordBuy();
    
    if (this.btnBuy) {
      if (isVictory) {
        this.btnBuy.style.display = 'none';
      } else {
        this.btnBuy.style.display = '';
      }
    }

    if (this.btnBuy && (isVictory || isFull !== this.lastIsFull || canAfford !== this.lastCanAfford || buyCostChanged || maxEraUnlocked !== this.lastMaxEraUnlocked || adaptiveBuyLevel !== this.lastAdaptiveBuyLevel)) {
      this.btnBuy.disabled = isFull || !canAfford;

      const mainText = this.btnBuy.querySelector('span:first-child');
      const subtextEl = this.btnBuy.querySelector('.buy-subtext');
      
      if (mainText) {
        const baseComponent = getComponentByLevel(adaptiveBuyLevel);
        mainText.textContent = `COMPRAR ${baseComponent?.name ?? 'PEÇA'} (N${baseComponent?.globalLevel ?? adaptiveBuyLevel})`;
      }

      if (subtextEl) {
        if (isFull) {
          subtextEl.innerHTML = '⚠️ GRADE CHEIA';
          subtextEl.style.color = '#EF5350';
        } else if (!canAfford) {
          subtextEl.innerHTML = `Custo: <span id="buy-cost-value">${this.formatNumber(buyCost)}</span> PP`;
          subtextEl.style.color = '#757575';
          this.buyCostEl = document.getElementById('buy-cost-value');
        } else {
          subtextEl.innerHTML = `Custo: <span id="buy-cost-value">${this.formatNumber(buyCost)}</span> PP`;
          subtextEl.style.color = '';
          this.buyCostEl = document.getElementById('buy-cost-value');
        }
      }

      this.lastIsFull = isFull;
      this.lastCanAfford = canAfford;
      this.lastMaxEraUnlocked = maxEraUnlocked;
      this.lastAdaptiveBuyLevel = adaptiveBuyLevel;
    }

    this.lastBuyCost = buyCost;
  }
}
