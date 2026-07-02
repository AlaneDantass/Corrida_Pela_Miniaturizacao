/* 🗃️ js/game/Collection.js — pure collection model (no DOM) */

import { COMPONENTS_DATA, getComponentByLevel, getEra } from '../config.js';

const LOCKED_NAME = '???';

/**
 * Tracks which of the 18 global components the player has discovered and
 * exposes display metadata per level. Locked levels are hidden behind a
 * curiosity-friendly placeholder. This model owns no DOM so it can be unit
 * tested directly, mirroring Grid/Economy.
 */
export class Collection {
  /**
   * @param {Iterable<number>} [discovered] - Initially discovered global levels
   */
  constructor(discovered) {
    this.discovered = new Set();
    // A new game always knows the first component (1 Engrenagem).
    this.markDiscovered(1);
    if (discovered) {
      for (const level of discovered) this.markDiscovered(level);
    }
  }

  /**
   * Replaces the discovered set with an authoritative one (e.g. from save/load
   * or engine state), always keeping level 1 known.
   * @param {Iterable<number>} discovered
   */
  setDiscovered(discovered) {
    this.discovered = new Set();
    this.markDiscovered(1);
    if (discovered) {
      for (const level of discovered) this.markDiscovered(level);
    }
  }

  /**
   * Marks a single global level discovered. Ignores invalid levels.
   * @param {number} level
   * @returns {boolean} whether the level was a valid component
   */
  markDiscovered(level) {
    const component = getComponentByLevel(level);
    if (!component) return false;
    this.discovered.add(component.globalLevel);
    return true;
  }

  isDiscovered(level) {
    return this.discovered.has(level);
  }

  get discoveredCount() {
    return this.discovered.size;
  }

  /**
   * Display metadata for one global level. Locked levels return placeholder
   * copy so the view never leaks undiscovered names or sprites.
   * @param {number} level
   * @returns {object|null}
   */
  getEntry(level) {
    const component = getComponentByLevel(level);
    if (!component) return null;

    const discovered = this.discovered.has(component.globalLevel);
    const era = getEra(component.eraLevel);

    return {
      globalLevel: component.globalLevel,
      eraLevel: component.eraLevel,
      eraName: era?.name ?? '',
      period: era?.period ?? '',
      localItemIndex: component.localItemIndex,
      discovered,
      locked: !discovered,
      name: discovered ? component.name : LOCKED_NAME,
      description: discovered ? component.description : null,
      spritePath: discovered ? component.spritePath : null
    };
  }

  /** All 18 entries in global-level order. */
  getEntries() {
    return COMPONENTS_DATA.map((component) => this.getEntry(component.globalLevel));
  }

  /** Entries grouped by era for discreet section headers. */
  getEntriesByEra() {
    const groups = new Map();

    for (const entry of this.getEntries()) {
      if (!groups.has(entry.eraLevel)) {
        groups.set(entry.eraLevel, {
          eraLevel: entry.eraLevel,
          eraName: entry.eraName,
          period: entry.period,
          entries: []
        });
      }
      groups.get(entry.eraLevel).entries.push(entry);
    }

    return Array.from(groups.values());
  }
}
