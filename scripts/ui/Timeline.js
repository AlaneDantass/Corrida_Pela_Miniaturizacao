/* 🎛️ js/ui/Timeline.js */

import { ERAS_DATA } from '../config.js';

const ROMAN_NUMERALS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

export class Timeline {
  /**
   * @param {string} containerId - ID of the top timeline container
   * @param {(eraLevel: number) => void} [onEraSelect] - Called when an unlocked era node is clicked (story replay)
   */
  constructor(containerId, onEraSelect) {
    this.container = document.getElementById(containerId);
    this.onEraSelect = onEraSelect;
    this.initHTML();
  }

  initHTML() {
    if (!this.container) return;

    this.container.innerHTML = '';
    this.container.classList.add('timeline-bar');

    // Horizontal node per era: dot (roman numeral) + label. Ids kept stable
    // so update() can flip state without rebuilding the DOM.
    ERAS_DATA.forEach(era => {
      const node = document.createElement('div');
      node.className = 'era-node';
      node.id = `timeline-era-${era.level}`;

      const dot = document.createElement('div');
      dot.className = 'era-dot';
      dot.textContent = ROMAN_NUMERALS[era.level] || String(era.level);

      const label = document.createElement('span');
      label.className = 'era-label';
      label.id = `timeline-name-${era.level}`;
      label.textContent = '???';

      node.appendChild(dot);
      node.appendChild(label);
      // Clicking an unlocked era replays its story.
      node.addEventListener('click', () => {
        if (this.onEraSelect && node.classList.contains('unlocked-era')) {
          this.onEraSelect(era.level);
        }
      });
      this.container.appendChild(node);
    });
  }

  /**
   * Updates the visual state of the top timeline nodes and the progress trail.
   * @param {Set<number>|Iterable<number>} erasDiscovered - Unlocked era levels
   * @param {number} activeLevel - Current active era level
   */
  update(erasDiscovered, activeLevel) {
    const discovered = erasDiscovered instanceof Set
      ? erasDiscovered
      : new Set(erasDiscovered || []);

    ERAS_DATA.forEach(era => {
      const node = document.getElementById(`timeline-era-${era.level}`);
      const nameEl = document.getElementById(`timeline-name-${era.level}`);

      if (!node) return;

      const isActive = era.level === activeLevel;
      // Progressed trail: any era before the active one, or explicitly
      // discovered, counts as unlocked so the trail stays lit behind the marker.
      const isUnlocked = era.level < activeLevel || discovered.has(era.level);

      node.classList.remove('unlocked-era', 'active-era');

      if (isActive) {
        node.classList.add('unlocked-era', 'active-era');
      } else if (isUnlocked) {
        node.classList.add('unlocked-era');
      }

      if (nameEl) {
        nameEl.textContent = (isActive || isUnlocked) ? era.name : 'Tecnologia Bloqueada';
      }
    });

    // Drive the trail fill as a 0..1 fraction so the CSS ::after width tracks
    // the active marker (era 1 = 0%, last era = 100%).
    if (this.container && this.container.style) {
      const total = ERAS_DATA.length;
      const fraction = total > 1
        ? Math.min(1, Math.max(0, (activeLevel - 1) / (total - 1)))
        : 0;
      this.container.style.setProperty('--timeline-progress', String(fraction));
    }
  }
}
