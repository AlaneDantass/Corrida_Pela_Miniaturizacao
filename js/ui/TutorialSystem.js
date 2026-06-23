/* 🎓 js/ui/TutorialSystem.js */

import { Computer } from '../game/Computer.js';
import { audio } from '../audio/SoundManager.js';

export class TutorialSystem {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.currentStage = 0;
    this.active = false;

    // DOM Elements
    this.overlay  = document.getElementById('tutorial-overlay');
    this.textEl   = document.getElementById('tutorial-text');
    this.btnNext  = document.getElementById('btn-tutorial-next');
    this.btnSkip  = document.getElementById('btn-tutorial-skip');

    // Game refs
    this.economy = null;
    this.grid    = null;

    // Highlight tracking
    this.highlightedEl = null;
    this.liftedPanel   = null;

    /*
     * ROTEIRO (Tarefa 2) — cada stage tem:
     *  text          : fala da Amelia
     *  highlightId   : id do elemento a destacar (null = nenhum)
     *  showNext      : exibe botão [Próximo ➔]
     *  locks         : true → bloqueia o jogo até a ação; false → jogo livre, card é só dica
     *  trigger       : qual checkProgress() dispara este stage ('auto'|'click_research'|'buy_item'|'merge_items')
     *  autoDismiss   : se true, após renderizar aguarda a ação e o card some sozinho; sem botão Próximo
     */
    this.tutorialScript = [
      {
        id: 0,
        text: "Ah, finalmente você chegou! Achei que a fumaça das fábricas tivesse te cegado no caminho. Entre, entre!",
        highlightId: null,
        showNext: true,
        locks: false,
        trigger: 'auto'
      },
      {
        id: 1,
        text: "Está vendo aquele monstro de metal ali? É a Máquina Analítica. Ela leva duas horas só para somar coordenadas. Eu tentei fazê-la ir mais rápido e... bem, eu quebrei tudo.",
        highlightId: null,
        showNext: true,
        locks: false,
        trigger: 'auto'
      },
      {
        id: 2,
        text: "Nossa mesa está uma bagunça. Para consertar, precisamos de peças melhores. O metal tem um limite, mas podemos otimizá-lo!",
        highlightId: null,
        showNext: true,
        locks: false,
        trigger: 'auto'
      },
      {
        id: 3,
        text: "Clique no botão [Realizar Pesquisa] na Estação de Pesquisa ao lado. Isso vai nos dar algumas ideias e peças básicas.",
        highlightId: 'btn-research',
        showNext: false,
        locks: true,           // Só esse estágio trava o jogo
        trigger: 'auto'
      },
      // ── Abaixo: stages reativos — card aparece como dica, jogo livre ──
      {
        id: 4,
        text: "Brilhante! Agora compre um componente na Fábrica de Hardware. O botão fica disponível assim que você tiver PP suficientes!",
        highlightId: 'btn-buy',
        showNext: false,
        locks: false,
        trigger: 'click_research'   // aparece após o primeiro clique em Pesquisa
      },
      {
        id: 5,
        text: "Ótimo! Agora arraste um componente sobre outro igual para fundi-los. Dois Nível 1 viram um Nível 2!",
        highlightId: 'game-canvas',
        showNext: false,
        locks: false,
        trigger: 'buy_item'         // aparece após a primeira compra
      },
      {
        id: 6,
        text: "Perfeito! Continue fundindo para criar o item final da era. Quando atingir o topo, um desafio vai desbloqueá-la!",
        highlightId: null,
        showNext: true,
        locks: false,
        trigger: 'merge_items'      // aparece após o primeiro merge
      }
    ];

    this.bindEvents();
  }

  bindEvents() {
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        audio.playClick();
        this.nextStep();
      });
    }
    if (this.btnSkip) {
      this.btnSkip.addEventListener('click', () => {
        audio.playClick();
        this.skipPermanently();
      });
    }
  }

  /* ── Inicia o tutorial ── */
  start(economy, grid) {
    this.economy = economy;
    this.grid    = grid;
    this.currentStage = 0;
    this.active  = true;

    this.showOverlay();
    this.renderStage();
  }

  /* ── Mostra o overlay sem escurecer (não-bloqueante por padrão) ── */
  showOverlay() {
    if (this.overlay) this.overlay.style.display = 'flex';
  }

  hideOverlay() {
    if (this.overlay) this.overlay.style.display = 'none';
  }

  /* ── Renderiza o stage atual ── */
  renderStage() {
    const stage = this.tutorialScript[this.currentStage];
    if (!stage) return;

    // Texto
    if (this.textEl) this.textEl.textContent = stage.text;

    // Botão Próximo
    if (this.btnNext) {
      this.btnNext.style.display = stage.showNext ? 'inline-block' : 'none';
    }

    // Trava o jogo se necessário
    this.updateLock(stage.locks);

    // Highlight
    this.clearHighlight();
    if (stage.highlightId) {
      const el = document.getElementById(stage.highlightId);
      if (el) this.applyHighlight(el);
    }
    // Mostra o overlay
    this.showOverlay();

    // Se a fase for apenas informativa (não trava) a caixa desaparece imediatamente,
    // permitindo que o jogador continue livremente.
    if (!stage.locks) {
      this.hideOverlay();
    }

    if (this.callbacks.onNextStep) this.callbacks.onNextStep(stage.id);
  }

  /* ── Gerencia a classe de trava no body ── */
    updateLock(shouldLock) {
      if (shouldLock) {
        document.body.classList.add('tutorial-active', 'tutorial-locked');
      } else {
        document.body.classList.add('tutorial-active');
        document.body.classList.remove('tutorial-locked');
        // Quando a trava é removida, o overlay pode ficar visível; ocultamos para que o jogo continue livremente.
        this.hideOverlay();
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
   * Avança para o próximo stage cujo trigger bate com a ação
   */
  checkProgress(actionType) {
    if (!this.active) return;

    // Estágio 3 (locks=true): só avança via click_research
    const cur = this.tutorialScript[this.currentStage];
    if (!cur) return;

    if (cur.trigger !== 'auto' && cur.trigger !== actionType) return;

    // Encontra o próximo stage que é disparado por essa ação
    const nextIdx = this.tutorialScript.findIndex(
      (s, i) => i > this.currentStage && s.trigger === actionType
    );

    if (nextIdx !== -1) {
      this.currentStage = nextIdx;
      this.renderStage();
    } else if (cur.id === 3 && actionType === 'click_research') {
      // Stage 3 aguardava o clique em Pesquisa → avança para stage 4
      this.currentStage = 4;
      this.renderStage();
    } else if (cur.id === 4 && actionType === 'buy_item') {
      this.currentStage = 5;
      this.renderStage();
    } else if (cur.id === 5 && actionType === 'merge_items') {
      this.currentStage = 6;
      this.renderStage();
    } else if (cur.id === 6 && actionType === 'merge_items') {
      // Stage 6 já mostrado; nada a fazer até o jogador clicar Próximo
    }
  }

  /* ── Pular narração permanentemente ── */
  skipPermanently() {
    this.active = false;
    this.clearHighlight();
    document.body.classList.remove('tutorial-active', 'tutorial-locked');
    this.hideOverlay();
    if (this.callbacks.onSkip) this.callbacks.onSkip();
  }

  /* ── Pausa o tutorial temporariamente (quando um modal externo abre) ── */
  pause() {
    if (!this.active) return;
    this.clearHighlight();
    document.body.classList.remove('tutorial-active', 'tutorial-locked');
    this.hideOverlay();
  }

  /* ── Retoma o tutorial após o modal externo fechar ── */
  resume() {
    if (!this.active) return;
    this.showOverlay();
    this.renderStage();
  }

  /* ── Completa o tutorial (último Próximo clicado) ── */
  complete() {
    this.active = false;
    this.clearHighlight();
    document.body.classList.remove('tutorial-active', 'tutorial-locked');
    this.hideOverlay();
    if (this.callbacks.onComplete) this.callbacks.onComplete();
  }
}
