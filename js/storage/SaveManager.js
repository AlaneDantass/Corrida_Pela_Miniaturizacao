/* 💾 js/storage/SaveManager.js */

import { OFFLINE_EARNINGS_CAP_HOURS, getEra } from '../config.js';

const LOCAL_STORAGE_KEY = 'computer_evolution_save';

export class SaveManager {
  static save(state) {
    try {
      const saveData = {
        version: 1,
        coins: state.coins,
        totalCoinsEarned: state.totalCoinsEarned,
        totalPurchases: state.totalPurchases,
        maxEraUnlocked: state.maxEraUnlocked,
        erasDiscovered: Array.from(state.erasDiscovered),
        grid: state.grid.map((comp, idx) => comp ? { slot: idx, level: comp.level } : null).filter(Boolean),
        prestigeCount: state.prestigeCount || 0,
        lastSaveTime: Date.now()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.error("Failed to save game:", e);
    }
  }

  static load() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) return null;
      
      const parsed = JSON.parse(saved);
      if (!parsed || parsed.version !== 1) return null;
      
      // Convert array of discovered eras back to Set
      parsed.erasDiscovered = new Set(parsed.erasDiscovered || [1]);
      return parsed;
    } catch (e) {
      console.error("Failed to load game:", e);
      return null;
    }
  }

  static clear() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  /**
   * Calculates the offline earnings.
   * @param {Object} savedData - The loaded state data
   * @returns {Object} { elapsedSeconds, earnings }
   */
  static calculateOfflineEarnings(savedData) {
    if (!savedData || !savedData.lastSaveTime) {
      return { elapsedSeconds: 0, earnings: 0 };
    }

    const lastTime = savedData.lastSaveTime;
    const now = Date.now();
    let elapsedMs = now - lastTime;

    if (elapsedMs <= 1000) {
      return { elapsedSeconds: 0, earnings: 0 };
    }

    // Cap at OFFLINE_EARNINGS_CAP_HOURS
    const capMs = OFFLINE_EARNINGS_CAP_HOURS * 60 * 60 * 1000;
    if (elapsedMs > capMs) {
      elapsedMs = capMs;
    }

    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    
    // Calculate total coins per second of current grid
    let coinsPerSecond = 0;
    if (savedData.grid) {
      savedData.grid.forEach(compData => {
        const era = getEra(compData.level);
        if (era) {
          coinsPerSecond += era.coinsPerSecond;
        }
      });
    }

    // Apply prestige multiplier if any
    const prestigeMultiplier = 1 + (savedData.prestigeCount || 0) * 0.5;
    let earnings = elapsedSeconds * coinsPerSecond * prestigeMultiplier;

    return {
      elapsedSeconds,
      earnings: Math.floor(earnings)
    };
  }
}
