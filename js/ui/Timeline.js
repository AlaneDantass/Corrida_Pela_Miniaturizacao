/* 🎛️ js/ui/Timeline.js */

import { ERAS_DATA } from '../config.js';

export class Timeline {
  /**
   * @param {string} containerId - ID of timeline container
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.initHTML();
  }

  initHTML() {
    if (!this.container) return;

    this.container.innerHTML = '';
    
    // Generate list items for each Era
    ERAS_DATA.forEach(era => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.id = `timeline-era-${era.level}`;
      
      item.innerHTML = `
        <div class="timeline-dot">${era.level}</div>
        <div class="timeline-info">
          <span class="timeline-name" id="timeline-name-${era.level}">???</span>
          <span class="timeline-year">${era.period}</span>
        </div>
      `;
      
      this.container.appendChild(item);
    });
  }

  /**
   * Updates the visual state of timeline nodes.
   * @param {Set<number>} erasDiscovered - Set of unlocked era levels
   * @param {number} activeLevel - Current active era level
   */
  update(erasDiscovered, activeLevel) {
    ERAS_DATA.forEach(era => {
      const item = document.getElementById(`timeline-era-${era.level}`);
      const nameEl = document.getElementById(`timeline-name-${era.level}`);
      
      if (!item) return;

      const isUnlocked = erasDiscovered.has(era.level);
      const isActive = era.level === activeLevel;

      // Reset classes
      item.classList.remove('unlocked-era', 'active-era');

      if (isActive) {
        item.classList.add('active-era', 'unlocked-era');
      } else if (isUnlocked) {
        item.classList.add('unlocked-era');
      }

      // Display name if unlocked, otherwise obfuscate
      if (nameEl) {
        if (isUnlocked) {
          nameEl.textContent = era.name;
        } else {
          nameEl.textContent = 'Tecnologia Bloqueada';
        }
      }
    });
  }
}
