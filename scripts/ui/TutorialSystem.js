/* 🎓 scripts/ui/TutorialSystem.js - Bugsy Tutorial & Narrative System */

import { Computer } from '../game/Computer.js';
import { audio } from '../audio/SoundManager.js';

export class TutorialSystem {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.currentStage = 0;
    this.active = false;
    this.isFrustrationActive = false;

    // DOM Elements
    this.bugsyOverlay = document.getElementById('bugsy-overlay');
    this.bugsyText = document.getElementById('bugsy-text');
    this.btnBugsyNext = document.getElementById('btn-bugsy-next');
    this.avatarContainer = document.getElementById('avatar-bugsy-container');

    // Game refs
    this.economy = null;
    this.grid = null;

    // Highlight tracking
    this.highlightedEl = null;
    this.liftedPanel = null;

    // ROTEIRO DO TUTORIAL INICIAL (Tarefa 2)
    this.tutorialScript = [
      {
        id: 0,
        text: "Hehehe... Olá, assistente! Olhe para todas essas máquinas brilhantes e cheias de engrenagens... Elas são tão atraentes. Eu adoro entrar no meio delas!",
        showNext: true,
        locks: true,
        trigger: 'auto'
      },
      {
        id: 1,
        text: "Mas essa mesa está muito bagunçada. Para a tecnologia evoluir e ficar ainda mais... apetitosa, preciso que você junte essas peças.",
        showNext: true,
        locks: true,
        trigger: 'auto'
      },
      {
        id: 2,
        text: "Clique no botão [Realizar Pesquisa] ali na esquerda para gerar dois itens base na grade.",
        showNext: false,
        locks: true,
        trigger: 'click_research'
      },
      {
        id: 3,
        text: "Isso! Agora arraste uma engrenagem em cima da outra para fundi-las e criar algo maior. Vá em frente!",
        showNext: false,
        locks: true,
        trigger: 'merge_items'
      }
    ];

    this.bindEvents();
  }

  bindEvents() {
    if (this.btnBugsyNext) {
      this.btnBugsyNext.addEventListener('click', () => {
        audio.playClick();
        if (this.isFrustrationActive) {
          this.closeBugsyFrustration();
        } else {
          this.nextStep();
        }
      });
    }
  }

  /* ── Inicia o tutorial ── */
  start(economy, grid) {
    this.economy = economy;
    this.grid = grid;
    this.currentStage = 0;
    this.active = true;
    this.isFrustrationActive = false;

    if (this.avatarContainer) {
      this.avatarContainer.classList.remove('angry');
    }
    if (this.btnBugsyNext) {
      this.btnBugsyNext.textContent = "[Próximo ➔]";
    }

    this.showOverlay();
    this.renderStage();
  }

  showOverlay() {
    if (this.bugsyOverlay) {
      this.bugsyOverlay.style.display = 'flex';
    }
  }

  hideOverlay() {
    if (this.bugsyOverlay) {
      this.bugsyOverlay.style.display = 'none';
    }
  }

  /* ── Renderiza o stage atual ── */
  renderStage() {
    const stage = this.tutorialScript[this.currentStage];
    if (!stage) return;

    // Texto
    if (this.bugsyText) {
      this.bugsyText.textContent = stage.text;
    }

    // Botão Próximo
    if (this.btnBugsyNext) {
      this.btnBugsyNext.style.display = stage.showNext ? 'inline-block' : 'none';
      this.btnBugsyNext.textContent = "[Próximo ➔]";
    }

    // Trava o jogo se necessário
    this.updateLock(stage.locks);

    // Destaques / Highlights visuais
    this.clearHighlight();
    if (stage.id === 2) {
      const el = document.getElementById('btn-research');
      if (el) this.applyHighlight(el);
    } else if (stage.id === 3) {
      const el = document.getElementById('game-board-container') || document.getElementById('game-canvas');
      if (el) this.applyHighlight(el);
    }

    this.showOverlay();
  }

  /* ── Gerencia a classe de trava no body ── */
  updateLock(shouldLock) {
    if (shouldLock) {
      document.body.classList.add('tutorial-active', 'tutorial-locked');
    } else {
      document.body.classList.add('tutorial-active');
      document.body.classList.remove('tutorial-locked');
    }
  }

  applyHighlight(element) {
    this.highlightedEl = element;
    element.classList.add('tutorial-highlight');
    const panel = element.closest('.panel, .game-board-container');
    if (panel) {
      panel.classList.add('tutorial-panel-lift');
      this.liftedPanel = panel;
    }
  }

  clearHighlight() {
    if (this.highlightedEl) {
      this.highlightedEl.classList.remove('tutorial-highlight');
      this.highlightedEl = null;
    }
    if (this.liftedPanel) {
      this.liftedPanel.classList.remove('tutorial-panel-lift');
      this.liftedPanel = null;
    }
  }

  nextStep() {
    this.currentStage++;
    if (this.currentStage >= this.tutorialScript.length) {
      this.complete();
    } else {
      this.renderStage();
    }
  }

  /*
   * checkProgress — chamado pelo GameEngine quando o jogador age
   */
  checkProgress(actionType) {
    if (!this.active || this.isFrustrationActive) return;

    const cur = this.tutorialScript[this.currentStage];
    if (!cur) return;

    if (cur.id === 2 && actionType === 'click_research') {
      // Tarefa 2: Gera dois itens base na grade
      if (this.grid) {
        this.grid.clear();
        
        // Coloca item N1 no slot 0
        const coords0 = this.grid.getSlotCoordinates(0);
        const comp0 = new Computer(1, 0, coords0.centerX, coords0.centerY);
        this.grid.placeComputer(comp0, 0);

        // Coloca item N1 no slot 1
        const coords1 = this.grid.getSlotCoordinates(1);
        const comp1 = new Computer(1, 1, coords1.centerX, coords1.centerY);
        this.grid.placeComputer(comp1, 1);

        // Salva o estado atual
        if (this.callbacks.onStateSave) {
          this.callbacks.onStateSave();
        }
      }

      // Avança para a fala 4
      this.currentStage = 3;
      this.renderStage();
    } else if (cur.id === 3 && actionType === 'merge_items') {
      // Quando o primeiro merge acontece, a caixa some e o jogo roda normalmente
      this.complete();
    }
  }

  /* ── Pausa e retoma ── */
  pause() {
    if (!this.active) return;
    this.clearHighlight();
    document.body.classList.remove('tutorial-active', 'tutorial-locked');
    this.hideOverlay();
  }

  resume() {
    if (!this.active) return;
    this.showOverlay();
    this.renderStage();
  }

  complete() {
    this.active = false;
    this.clearHighlight();
    document.body.classList.remove('tutorial-active', 'tutorial-locked');
    this.hideOverlay();
    if (this.callbacks.onComplete) this.callbacks.onComplete();
  }

  /* ======================================================== */
  /* TAREFA 3: O GATILHO DE FRUSTRAÇÃO NA ERA 3               */
  /* ======================================================== */
  showBugsyFrustration(onFinishCallback) {
    this.active = true;
    this.isFrustrationActive = true;
    this.frustrationCallback = onFinishCallback;

    // Atualiza texto e botão
    if (this.bugsyText) {
      this.bugsyText.textContent = "Ei, espera aí... O que você fez?! Um Circuito Integrado?! Droga, agora os espaços estão ficando menores para mim! Onde eu vou me esconder se tudo virar um chip minúsculo de silício? Pare com isso!";
    }

    if (this.btnBugsyNext) {
      this.btnBugsyNext.style.display = 'inline-block';
      this.btnBugsyNext.textContent = "[Entendi]";
    }

    // Expressão irritada / irada (efeito visual e vibração por CSS)
    if (this.avatarContainer) {
      this.avatarContainer.classList.add('angry');
    }

    // Trava interações com o jogo
    this.updateLock(true);
    this.showOverlay();
  }

  closeBugsyFrustration() {
    this.isFrustrationActive = false;
    this.active = false;
    
    if (this.avatarContainer) {
      this.avatarContainer.classList.remove('angry');
    }
    
    this.updateLock(false);
    this.hideOverlay();

    if (this.frustrationCallback) {
      this.frustrationCallback();
      this.frustrationCallback = null;
    }
  }
}
