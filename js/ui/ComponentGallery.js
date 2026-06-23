/* 🗃️ js/ui/ComponentGallery.js */

import { ERAS_DATA } from '../config.js';
import { Sprites } from '../render/Sprites.js';

export class ComponentGallery {
  constructor() {
    this.eraLevel = 1;
    this.items = document.querySelectorAll('.gallery-item');
  }

  /**
   * Atualiza as labels textuais das peças com base na Era atual.
   * @param {number} eraLevel - Nível da Era atual (1 a 6)
   */
  update(eraLevel) {
    this.eraLevel = eraLevel;
    const eraData = ERAS_DATA.find(e => e.level === eraLevel);
    if (!eraData || this.items.length === 0) return;

    const names = [eraData.itemN1, eraData.itemN2, eraData.itemN3];

    this.items.forEach((item, index) => {
      const nameEl = item.querySelector('.gallery-name');
      if (nameEl && names[index]) {
        nameEl.textContent = names[index];
      }
    });
  }

  /**
   * Renderiza as peças correspondentes nos canvas da galeria.
   * @param {number} time - Tempo decorrido do jogo em segundos (para animações)
   */
  draw(time) {
    if (this.items.length === 0) return;

    this.items.forEach((item, index) => {
      const canvas = item.querySelector('.gallery-preview-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Limpa o canvas de preview
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenha o sprite da peça
      // Sprites.draw(ctx, eraLevel, itemLevel, x, y, size, time)
      // O itemLevel é index + 1 (N1, N2, N3)
      Sprites.draw(ctx, this.eraLevel, index + 1, canvas.width / 2, canvas.height / 2, canvas.width * 0.75, time);
    });
  }
}
