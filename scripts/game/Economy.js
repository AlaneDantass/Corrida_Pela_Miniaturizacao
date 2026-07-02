/* ⚡ js/game/Economy.js */

import { BASE_BUY_COST, BUY_INFLATION, getComponentProduction } from '../config.js';

export function calculateGridProduction(gridEntries = [], prestigeMultiplier = 1) {
  const entries = Array.isArray(gridEntries) ? gridEntries : gridEntries?.slots;
  if (!Array.isArray(entries)) return 0;

  const baseProduction = entries.reduce((total, entry) => {
    if (!entry) return total;
    return total + getComponentProduction(entry.level);
  }, 0);

  return baseProduction * Math.max(0, prestigeMultiplier || 0);
}

export class Economy {
  constructor(savedState = null) {
    this.coins = savedState ? savedState.coins : 0;
    this.totalCoinsEarned = savedState ? savedState.totalCoinsEarned : 0;
    this.totalPurchases = savedState ? savedState.totalPurchases : 0;
    this.prestigeCount = savedState ? savedState.prestigeCount : 0;
  }

  getPrestigeMultiplier() {
    return 1 + this.prestigeCount * 0.5; // +50% per prestige
  }

  getClickValue(maxEraUnlocked = 1) {
    // Click scaling: base + (unlocked eras - 1) * 2
    const baseClick = 1;
    const eraBonus = (maxEraUnlocked - 1) * 2;
    return Math.floor((baseClick + eraBonus) * this.getPrestigeMultiplier());
  }

  getBuyCost() {
    return Math.floor(BASE_BUY_COST * Math.pow(BUY_INFLATION, this.totalPurchases));
  }

  canAffordBuy() {
    return this.coins >= this.getBuyCost();
  }

  buy() {
    if (!this.canAffordBuy()) return false;
    this.coins -= this.getBuyCost();
    this.totalPurchases++;
    return true;
  }

  addCoins(amount) {
    const val = Math.max(0, amount);
    this.coins += val;
    this.totalCoinsEarned += val;
  }

  subtractCoins(amount) {
    this.coins = Math.max(0, this.coins - amount);
  }

  clickResearch(maxEraUnlocked = 1) {
    const clickVal = this.getClickValue(maxEraUnlocked);
    this.addCoins(clickVal);
    return clickVal;
  }

  calculateCps(grid) {
    return calculateGridProduction(grid, this.getPrestigeMultiplier());
  }

  prestige() {
    this.prestigeCount++;
    this.coins = 0;
    this.totalPurchases = 0;
    // Keep totalCoinsEarned or reset? Let's keep totalCoinsEarned as a lifetime stat
  }
}
