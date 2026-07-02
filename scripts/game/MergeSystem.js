/* 🔗 js/game/MergeSystem.js */

import { Computer } from './Computer.js';
import { audio } from '../audio/SoundManager.js';
import {
  ERA_START_LEVELS,
  MAX_GLOBAL_LEVEL,
  getComponentByLevel,
  getEraLevelForGlobalLevel
} from '../config.js';

export class MergeSystem {
  /**
   * Evaluates dropping a computer from dragSlot to targetSlot.
   * @param {Grid} grid - The game grid
   * @param {Economy} economy - The game economy
   * @param {number} dragIndex - Origin slot index
   * @param {number} targetIndex - Target slot index
   * @param {Set<number>} erasDiscovered - Set of unlocked era levels
   * @returns {Object} Result of the merge operation
   */
  static handleDrop(grid, economy, dragIndex, targetIndex, erasDiscovered) {
    const computer = grid.getComputer(dragIndex);
    
    // Safety check
    if (!computer) {
      return { success: false, action: 'none' };
    }

    // Dropped outside or on same slot
    if (targetIndex === -1 || dragIndex === targetIndex) {
      grid.placeComputer(computer, dragIndex); // Put back
      return { success: false, action: 'return' };
    }

    const targetComputer = grid.getComputer(targetIndex);

    // Slot is empty - move it
    if (!targetComputer) {
      grid.removeComputer(dragIndex);
      grid.placeComputer(computer, targetIndex);
      audio.playClick();
      return { success: true, action: 'move' };
    }

    // Slot occupied by same level - merge!
    if (computer.level === targetComputer.level) {
      const currentLevel = computer.level;
      const component = getComponentByLevel(currentLevel);
      if (!component) {
        grid.placeComputer(computer, dragIndex);
        audio.playError();
        return { success: false, action: 'invalid_level' };
      }

      // Already max level
      if (currentLevel >= MAX_GLOBAL_LEVEL) {
        grid.placeComputer(computer, dragIndex); // Put back
        audio.playError();
        return { success: false, action: 'max_level' };
      }

      const nextLevel = currentLevel + 1;
      
      // Perform the merge
      grid.removeComputer(dragIndex);
      grid.removeComputer(targetIndex);

      const targetCoords = grid.getSlotCoordinates(targetIndex);
      const newComp = new Computer(nextLevel, targetIndex, targetCoords.centerX, targetCoords.centerY);
      grid.placeComputer(newComp, targetIndex);

      audio.playMerge();

      const mergedComponent = getComponentByLevel(nextLevel);
      const newEraLevel = ERA_START_LEVELS.includes(nextLevel) && nextLevel !== ERA_START_LEVELS[0]
        ? getEraLevelForGlobalLevel(nextLevel)
        : null;
      const isNewEra = !!newEraLevel && !erasDiscovered?.has(newEraLevel);
      const isFinalComponent = nextLevel === MAX_GLOBAL_LEVEL;

      return {
        success: true,
        action: 'merge',
        level: nextLevel,
        component: mergedComponent,
        isNewComponent: true,
        isNewEra,
        newEraLevel,
        isFinalComponent,
        isFinalItem: isFinalComponent,
        centerX: targetCoords.centerX,
        centerY: targetCoords.centerY
      };
    }

    // Slot occupied by different level - reject/swap
    grid.placeComputer(computer, dragIndex); // Put back
    audio.playError();
    return { success: false, action: 'reject' };
  }
}
