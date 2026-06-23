/* 🎛️ js/ui/HUD.js */

import { getEra } from '../config.js';

export class HUD {
  constructor() {
    this.coinsEl = document.getElementById('currency-value');
    this.cpsEl = document.getElementById('cps-value');
    this.clickPowerEl = document.getElementById('click-power-value');
    
    this.btnBuy = document.getElementById('btn-buy');
    this.buyCostEl = document.getElementById('buy-cost-value');
    this.slotsUsedEl = document.getElementById('slots-used');
    this.slotsMaxEl = document.getElementById('slots-max');

    this.lastCoinValue = 0;
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
  update(economy, grid, maxEraUnlocked) {
    const gridSlots = grid.slots || grid;
    const cps = economy.calculateCps(gridSlots);
    const clickPower = economy.getClickValue(maxEraUnlocked);
    const buyCost = economy.getBuyCost();
    const occupied = grid.getOccupiedCount ? grid.getOccupiedCount() : gridSlots.filter(s => s !== null).length;
    const maxSlots = gridSlots.length;

    // Update text
    if (this.coinsEl) {
      const newVal = this.formatNumber(economy.coins);
      if (this.coinsEl.textContent !== newVal) {
        this.coinsEl.textContent = newVal;
        // Add subtle pop on change
        if (Math.floor(economy.coins) !== this.lastCoinValue) {
          this.coinsEl.style.transform = 'scale(1.08)';
          setTimeout(() => {
            if (this.coinsEl) this.coinsEl.style.transform = 'scale(1)';
          }, 150);
          this.lastCoinValue = Math.floor(economy.coins);
        }
      }
    }
    
    if (this.cpsEl) this.cpsEl.textContent = this.formatNumber(cps);
    if (this.clickPowerEl) this.clickPowerEl.textContent = this.formatNumber(clickPower);
    if (this.buyCostEl) this.buyCostEl.textContent = this.formatNumber(buyCost);
    if (this.slotsUsedEl) this.slotsUsedEl.textContent = occupied.toString();
    if (this.slotsMaxEl) this.slotsMaxEl.textContent = maxSlots.toString();

    // Disable buy button if full or cannot afford
    if (this.btnBuy) {
      const isFull = grid.isFull ? grid.isFull() : gridSlots.every(s => s !== null);
      const canAfford = economy.canAffordBuy();
      
      this.btnBuy.disabled = isFull || !canAfford;

      // Update button visual text cues
      const mainText = this.btnBuy.querySelector('span:first-child');
      const subtextEl = this.btnBuy.querySelector('.buy-subtext');
      
      if (mainText) {
        const era = getEra(maxEraUnlocked);
        mainText.textContent = `COMPRAR ${era.itemN1} (N1)`;
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
    }
  }
}
