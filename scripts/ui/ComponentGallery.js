/* 🗃️ js/ui/ComponentGallery.js */

import { ERAS_DATA } from '../config.js';
import { Sprites } from '../render/Sprites.js';
import { audio } from '../audio/SoundManager.js';

export class ComponentGallery {
  constructor() {
    this.eraLevel = 1;
    this.items = Array.from(document.querySelectorAll('.gallery-item'));
    this.highlightedIndex = -1;
    this.descriptions = {};

    // Carregar descrições
    fetch('desc.json')
      .then(res => res.json())
      .then(data => {
        this.descriptions = data;
      })
      .catch(err => console.error("Error loading desc.json", err));

    // Adicionar eventos de clique para cada item da galeria
    this.items.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.showItemDetails(index);
      });
    });

    // Evento para o botão de fechar do modal
    const closeBtn = document.getElementById('btn-close-gallery-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideItemDetails();
      });
    }

    // Fechar ao clicar fora do card (no overlay)
    const modal = document.getElementById('modal-gallery-item');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideItemDetails();
        }
      });
    }
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

    // Determine highest active item level on the board (from the grid)
    let highestLevel = 0;
    const engine = window.gameEngine;
    if (engine && engine.grid && Array.isArray(engine.grid.slots)) {
      engine.grid.slots.forEach(comp => {
        if (comp && typeof comp.level === 'number' && comp.level > highestLevel) {
          highestLevel = comp.level;
        }
      });
    }

    // Normalize to gallery index (0-based). If no items present, do not highlight.
    const highlightIndex = (highestLevel >= 1 && highestLevel <= this.items.length) ? highestLevel - 1 : -1;

    // Update DOM classes for visual highlight and draw previews
    this.items.forEach((item, index) => {
      if (index === highlightIndex) {
        if (!item.classList.contains('highlight')) item.classList.add('highlight');
      } else {
        item.classList.remove('highlight');
      }

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

  /**
   * Exibe o modal com os detalhes de um item específico da galeria.
   * @param {number} index - Índice do item clicado na galeria (0 a 2)
   */
  showItemDetails(index) {
    const eraData = ERAS_DATA.find(e => e.level === this.eraLevel);
    if (!eraData) return;

    const names = [eraData.itemN1, eraData.itemN2, eraData.itemN3];
    const itemName = names[index];
    if (!itemName) return;

    // Mapear correspondência com o desc.json para casos específicos ou normalizar
    let searchName = itemName.trim().toLowerCase();
    if (searchName === "engrenagens") searchName = "engrenagem";
    if (searchName === "computador quântico") searchName = "computador quântica";

    let description = "";
    if (this.descriptions) {
      for (const key of Object.keys(this.descriptions)) {
        if (key.toLowerCase() === searchName) {
          description = this.descriptions[key];
          break;
        }
      }
    }

    if (!description) {
      description = this.descriptions[itemName] || "Descrição não disponível.";
    }

    const modal = document.getElementById('modal-gallery-item');
    if (!modal) return;

    const titleEl = modal.querySelector('#gallery-item-title');
    const descEl = modal.querySelector('#gallery-item-desc');
    const canvasEl = modal.querySelector('#gallery-item-canvas');

    if (titleEl) titleEl.textContent = itemName;
    if (descEl) descEl.textContent = description;

    // Desenhar o sprite do item no canvas
    if (canvasEl) {
      const ctx = canvasEl.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        // Desenhar brilho de fundo customizado com a cor da Era
        const grad = ctx.createRadialGradient(
          canvasEl.width / 2, canvasEl.height / 2, 10,
          canvasEl.width / 2, canvasEl.height / 2, canvasEl.width / 2
        );
        grad.addColorStop(0, `${eraData.color}33`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(canvasEl.width / 2, canvasEl.height / 2, canvasEl.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Desenha o sprite centralizado estaticamente (time = 0)
        Sprites.draw(
          ctx,
          this.eraLevel,
          index + 1,
          canvasEl.width / 2,
          canvasEl.height / 2,
          canvasEl.width * 0.75,
          0
        );
      }
    }

    // Exibir o overlay modal e pausar o jogo
    modal.style.display = 'block';

    const engine = window.gameEngine;
    if (engine) {
      engine.state.isPaused = true;
      if (engine.tutorialSystem) {
        engine.tutorialSystem.pause();
      }
    }

    audio.playUnlock();
  }

  /**
   * Oculta o modal de detalhes e retoma o jogo.
   */
  hideItemDetails() {
    const modal = document.getElementById('modal-gallery-item');
    if (modal) {
      modal.style.display = 'none';
    }

    const engine = window.gameEngine;
    if (engine) {
      engine.state.isPaused = false;
      if (engine.tutorialSystem) {
        engine.tutorialSystem.resume();
      }
    }

    audio.playClick();
  }
}

