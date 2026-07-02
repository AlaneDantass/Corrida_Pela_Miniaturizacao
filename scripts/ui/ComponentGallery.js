/* 🗃️ js/ui/ComponentGallery.js — right-side collection of all 18 components */

import { getComponentByLevel } from '../config.js';
import { Collection } from '../game/Collection.js';
import { Sprites } from '../render/Sprites.js';

export class ComponentGallery {
  /**
   * @param {string} [containerId] - Collection container element id
   * @param {string} [modalId] - Component detail modal element id
   */
  constructor(containerId = 'gallery-collection', modalId = 'modal-component') {
    this.container = document.getElementById(containerId);
    this.modal = document.getElementById(modalId);
    this.collection = new Collection();
    this.itemsByLevel = new Map();

    this.buildDom();
    this.bindModal();
  }

  /** Builds the full 18-slot collection grouped by era with discreet headers. */
  buildDom() {
    if (!this.container) return;

    this.container.innerHTML = '';
    this.itemsByLevel.clear();

    for (const group of this.collection.getEntriesByEra()) {
      const header = document.createElement('div');
      header.className = 'gallery-era-header';

      const eraName = document.createElement('span');
      eraName.className = 'gallery-era-name';
      eraName.textContent = group.eraName;
      const eraPeriod = document.createElement('span');
      eraPeriod.className = 'gallery-era-period';
      eraPeriod.textContent = group.period;
      header.appendChild(eraName);
      header.appendChild(eraPeriod);
      this.container.appendChild(header);

      for (const entry of group.entries) {
        this.container.appendChild(this.buildItem(entry));
      }
    }
  }

  buildItem(entry) {
    const item = document.createElement('div');
    item.className = 'gallery-item locked';
    item.dataset.level = String(entry.globalLevel);

    const level = document.createElement('div');
    level.className = 'gallery-level';
    level.textContent = `N${entry.globalLevel}`;

    const preview = document.createElement('div');
    preview.className = 'gallery-preview';
    const canvas = document.createElement('canvas');
    canvas.className = 'gallery-preview-canvas';
    canvas.width = 70;
    canvas.height = 70;
    const lock = document.createElement('span');
    lock.className = 'gallery-lock';
    lock.textContent = '?';
    preview.appendChild(canvas);
    preview.appendChild(lock);

    const name = document.createElement('div');
    name.className = 'gallery-name';
    name.textContent = '???';

    item.appendChild(level);
    item.appendChild(preview);
    item.appendChild(name);
    item.addEventListener('click', () => this.handleItemClick(entry.globalLevel));

    this.itemsByLevel.set(entry.globalLevel, item);
    return item;
  }

  /**
   * Syncs visual state to the authoritative discovered set.
   * @param {Iterable<number>} discoveredComponents - Discovered global levels
   */
  update(discoveredComponents) {
    if (discoveredComponents) {
      this.collection.setDiscovered(discoveredComponents);
    }

    this.itemsByLevel.forEach((item, level) => {
      const entry = this.collection.getEntry(level);
      const nameEl = item.querySelector('.gallery-name');

      if (entry.discovered) {
        // First reveal of a previously locked item: play the discovery pulse.
        if (item.classList.contains('locked')) {
          item.classList.add('just-discovered');
          if (typeof setTimeout === 'function') {
            setTimeout(() => item.classList.remove('just-discovered'), 900);
          }
        }
        item.classList.remove('locked');
        item.classList.add('discovered');
        if (nameEl) nameEl.textContent = entry.name;
      } else {
        item.classList.add('locked');
        item.classList.remove('discovered');
        if (nameEl) nameEl.textContent = '???';
      }
    });
  }

  /**
   * Draws sprite previews for discovered components. Locked slots keep their
   * silhouette/question-mark state from CSS.
   * @param {number} time - Elapsed game time in seconds (sprite animation)
   */
  draw(time) {
    this.itemsByLevel.forEach((item, level) => {
      if (!this.collection.isDiscovered(level)) return;

      const canvas = item.querySelector('.gallery-preview-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const component = getComponentByLevel(level);
      if (component) {
        Sprites.draw(
          ctx,
          component.eraLevel,
          component.localItemIndex,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.75,
          time
        );
      }
    });
  }

  handleItemClick(level) {
    // Locked components never open the detail panel — preserves curiosity.
    if (!this.collection.isDiscovered(level)) return;
    this.openDetail(level);
  }

  openDetail(level) {
    if (!this.modal) return;
    const entry = this.collection.getEntry(level);
    if (!entry || !entry.discovered) return;

    const setText = (selector, text) => {
      const el = this.modal.querySelector(selector);
      if (el) el.textContent = text;
    };

    setText('.component-detail-name', entry.name);
    setText('.component-detail-era', `Era ${entry.eraLevel} — ${entry.eraName}`);
    setText('.component-detail-level', `Nível Global N${entry.globalLevel}`);
    setText('.component-detail-desc', entry.description || '');

    const img = this.modal.querySelector('.component-detail-img');
    if (img) {
      img.src = entry.spritePath || '';
      img.alt = entry.name;
    }

    this.modal.style.display = 'block';
  }

  bindModal() {
    if (!this.modal) return;
    const close = () => { this.modal.style.display = 'none'; };
    this.modal.querySelectorAll('[data-close-component]').forEach((el) => {
      el.addEventListener('click', close);
    });
    // Click outside the card closes the panel.
    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) close();
    });
  }
}
