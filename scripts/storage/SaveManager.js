/* 💾 js/storage/SaveManager.js */

import { MAX_GLOBAL_LEVEL, OFFLINE_EARNINGS_CAP_HOURS, getEraLevelForGlobalLevel } from '../config.js';
import { calculateGridProduction } from '../game/Economy.js';

export const SAVE_VERSION = 2;
export const LOCAL_STORAGE_KEY = 'computer_evolution_save';
const MAX_ERA_LEVEL = getEraLevelForGlobalLevel(MAX_GLOBAL_LEVEL) || 6;

export function createDefaultBugzeState() {
  return {
    unlocked: false,
    active: false,
    firstInvasionSeen: false,
    lastInvasionAt: null,
    lastResolvedAt: null
  };
}

function toArray(value) {
  if (value instanceof Set) return Array.from(value);
  return Array.isArray(value) ? value : [];
}

function normalizePositiveInteger(value) {
  const parsed = Number.isInteger(value) ? value : Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function normalizeGlobalLevel(value) {
  const level = normalizePositiveInteger(value);
  return level && level <= MAX_GLOBAL_LEVEL ? level : null;
}

function normalizeSlotIndex(value) {
  const parsed = Number.isInteger(value) ? value : Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function normalizeGrid(grid) {
  if (!Array.isArray(grid)) return [];

  return grid
    .map((entry, index) => {
      if (!entry) return null;

      const slot = normalizeSlotIndex(entry.slot ?? entry.slotIndex ?? index);
      const level = normalizeGlobalLevel(entry.level);
      if (slot === null || level === null) return null;

      return { slot, level };
    })
    .filter(Boolean);
}

function getHighestGridLevel(grid) {
  return grid.reduce((highest, entry) => Math.max(highest, entry.level || 1), 1);
}

function normalizeEras(value, maxGlobalLevel) {
  const eras = new Set(
    toArray(value)
      .map(normalizePositiveInteger)
      .filter((level) => level && level <= MAX_ERA_LEVEL)
  );

  const maxEraFromLevel = getEraLevelForGlobalLevel(maxGlobalLevel) || 1;
  for (let eraLevel = 1; eraLevel <= maxEraFromLevel; eraLevel++) {
    eras.add(eraLevel);
  }

  return Array.from(eras).sort((a, b) => a - b);
}

function normalizeDiscoveredComponents(state, grid, maxGlobalLevel) {
  const discovered = new Set([
    ...toArray(state.discoveredComponents),
    ...toArray(state.collection?.discoveredComponents),
    ...grid.map((entry) => entry.level)
  ]);

  for (let level = 1; level <= maxGlobalLevel; level++) {
    discovered.add(level);
  }

  return Array.from(discovered)
    .map(normalizeGlobalLevel)
    .filter(Boolean)
    .sort((a, b) => a - b);
}

function normalizeBugzeState(value) {
  return {
    ...createDefaultBugzeState(),
    ...(value && typeof value === 'object' ? value : {})
  };
}

function normalizeTutorialFlags(state) {
  const flags = state.tutorialFlags && typeof state.tutorialFlags === 'object'
    ? state.tutorialFlags
    : {};
  const completed = Boolean(state.tutorialCompleted ?? flags.completed);

  return {
    ...flags,
    completed,
    tourCompleted: Boolean(flags.tourCompleted ?? completed)
  };
}

export class SaveManager {
  static save(state) {
    try {
      const grid = normalizeGrid(state.grid || []);
      const maxGridLevel = getHighestGridLevel(grid);
      const maxGlobalLevel = Math.max(1, normalizeGlobalLevel(state.maxGlobalLevel) || maxGridLevel);
      const discoveredComponents = normalizeDiscoveredComponents(state, grid, maxGlobalLevel);
      const unlockedEras = normalizeEras(state.unlockedEras ?? state.erasDiscovered, maxGlobalLevel);
      const tutorialFlags = normalizeTutorialFlags(state);
      const bugzeState = normalizeBugzeState(state.bugzeState);

      const saveData = {
        version: SAVE_VERSION,
        coins: state.coins,
        totalCoinsEarned: state.totalCoinsEarned,
        totalPurchases: state.totalPurchases,
        maxEraUnlocked: Math.max(normalizePositiveInteger(state.maxEraUnlocked) || 1, unlockedEras.at(-1) || 1),
        maxGlobalLevel,
        unlockedEras,
        erasDiscovered: unlockedEras,
        discoveredComponents,
        collection: { discoveredComponents },
        grid,
        prestigeCount: state.prestigeCount || 0,
        tutorialCompleted: tutorialFlags.completed,
        tutorialFlags,
        bugzeState,
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
      return SaveManager.normalizeSave(parsed);
    } catch (e) {
      console.error("Failed to load game:", e);
      return null;
    }
  }

  static normalizeSave(parsed) {
    if (!parsed || (parsed.version !== 1 && parsed.version !== SAVE_VERSION)) {
      return null;
    }

    const grid = normalizeGrid(parsed.grid || []);
    const maxGridLevel = getHighestGridLevel(grid);
    const maxGlobalLevel = Math.max(1, normalizeGlobalLevel(parsed.maxGlobalLevel) || maxGridLevel);
    const unlockedEras = normalizeEras(parsed.unlockedEras ?? parsed.erasDiscovered, maxGlobalLevel);
    const discoveredComponents = normalizeDiscoveredComponents(parsed, grid, maxGlobalLevel);
    const tutorialFlags = normalizeTutorialFlags(parsed);

    return {
      ...parsed,
      version: SAVE_VERSION,
      coins: Number(parsed.coins) || 0,
      totalCoinsEarned: Number(parsed.totalCoinsEarned ?? parsed.coins) || 0,
      totalPurchases: normalizePositiveInteger(parsed.totalPurchases) || 0,
      prestigeCount: normalizePositiveInteger(parsed.prestigeCount) || 0,
      maxEraUnlocked: Math.max(normalizePositiveInteger(parsed.maxEraUnlocked) || 1, unlockedEras.at(-1) || 1),
      maxGlobalLevel,
      unlockedEras,
      erasDiscovered: new Set(unlockedEras),
      discoveredComponents: new Set(discoveredComponents),
      collection: { discoveredComponents },
      grid,
      tutorialCompleted: tutorialFlags.completed,
      tutorialFlags,
      bugzeState: normalizeBugzeState(parsed.bugzeState),
      lastSaveTime: parsed.lastSaveTime
    };
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
    const normalized = SaveManager.normalizeSave(savedData) || savedData;

    if (!normalized || !normalized.lastSaveTime) {
      return { elapsedSeconds: 0, earnings: 0 };
    }

    const lastTime = normalized.lastSaveTime;
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

    const prestigeMultiplier = 1 + (normalized.prestigeCount || 0) * 0.5;
    const coinsPerSecond = calculateGridProduction(normalized.grid || [], prestigeMultiplier);
    const earnings = elapsedSeconds * coinsPerSecond;

    return {
      elapsedSeconds,
      earnings: Math.floor(earnings)
    };
  }
}
