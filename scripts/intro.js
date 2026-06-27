/* 🎬 scripts/intro.js - Cinematic Intro Choreography (Scene 1, 2 & 3) */

import { audio } from './audio/SoundManager.js';

export class IntroController {
  constructor() {
    this.container = document.getElementById('intro-container');
    this.valve = document.getElementById('intro-valve');
    this.text = document.getElementById('intro-text');
    this.skipBtn = document.getElementById('btn-intro-skip');
    
    // Scene 2 elements
    this.eniacBg = document.getElementById('eniac-bg');
    this.scientist = document.getElementById('scientist-silhouette');

    // Scene 3 elements
    this.timelineContainer = document.getElementById('timeline-container');
    this.timelineYear = document.getElementById('timeline-year');
    this.timelineImage = document.getElementById('timeline-image');
    this.timelineImgEl = document.getElementById('timeline-img-el');
    this.timelineDesc = document.getElementById('timeline-desc');
    
    this.timeouts = [];
    this.isSkipped = false;
  }

  init() {
    if (!this.container) {
      console.warn("Intro container not found in DOM.");
      return;
    }

    console.log("Initializing Extended Intro Controller...");

    // Click handler for skip button
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.skip();
      });
    }

    // Keydown listener for Space bar
    this.keydownHandler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.skip();
      }
    };
    window.addEventListener('keydown', this.keydownHandler);

    // Start scene timeline
    this.start();
  }

  registerTimeout(callback, ms) {
    const id = setTimeout(callback, ms);
    this.timeouts.push(id);
  }

  start() {
    console.log("Intro Scene 1: The Thermionic Valve.");

    // ── SCENE 1: THE THERMIONIC VALVE ──

    // 1s: The Valve (image) appears smoothly (fade-in)
    this.registerTimeout(() => {
      if (this.isSkipped || !this.valve) return;
      this.valve.classList.add('fade-in');
    }, 1000);

    // 3s: Text appears over the valve: "1946"
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.textContent = "1946";
      this.text.classList.remove('fade-out');
      this.text.classList.add('fade-in');
    }, 3000);

    // 5s: Text "1946" disappears
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-in');
      this.text.classList.add('fade-out');
    }, 5000);

    // 6s: Text appears: "Para construir um computador..."
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-out');
      this.text.textContent = "Para construir um computador...";
      this.text.classList.add('fade-in');
    }, 6000);

    // 8s: Text disappears...
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-in');
      this.text.classList.add('fade-out');
    }, 8000);

    // 9s: ...and reappears as: "...era necessário ocupar uma sala inteira."
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-out');
      this.text.textContent = "...era necessário ocupar uma sala inteira.";
      this.text.classList.add('fade-in');
    }, 9000);

    // 11s: The valve image begins to shrink (zoom-out camera effect)
    this.registerTimeout(() => {
      if (this.isSkipped || !this.valve) return;
      this.valve.classList.add('zoom-out');
    }, 11000);

    // 11.5s: Text fades out
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-in');
      this.text.classList.add('fade-out');
    }, 11500);

    // ── SCENE 2: THE ENIAC ROOM ──

    // 12s: Enquanto a válvula diminui, o fundo do ENIAC surge e reduz a escala (efeito Parallax)
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      console.log("Intro Scene 2: The ENIAC.");
      
      if (this.valve) {
        this.valve.classList.remove('fade-in');
        this.valve.classList.add('fade-out');
      }
      if (this.eniacBg) {
        this.eniacBg.classList.add('fade-in');
      }
    }, 12000);

    // 13s: A silhueta do cientista começa a atravessar a tela
    this.registerTimeout(() => {
      if (this.isSkipped || !this.scientist) return;
      this.scientist.classList.add('walk');
    }, 13000);

    // 14s: O texto centralizado de legenda surge por cima da sala do ENIAC
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-out');
      this.text.textContent = "O ENIAC pesava dezenas de toneladas.";
      this.text.classList.add('fade-in');
    }, 14000);

    // 16.5s: O texto apaga
    this.registerTimeout(() => {
      if (this.isSkipped || !this.text) return;
      this.text.classList.remove('fade-in');
      this.text.classList.add('fade-out');
    }, 16500);

    // 17.5s: Fim da Cena 2 - Fundo e silhueta apagam (tela escurece para transição)
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      console.log("Intro Scene 2 fading out...");
      
      if (this.eniacBg) {
        this.eniacBg.classList.remove('fade-in');
      }
      if (this.scientist) {
        this.scientist.style.opacity = '0';
      }
    }, 17500);

    // ── SCENE 3: EVOLUTION TIMELINE ──

    // 18.5s: O #timeline-container aparece
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      console.log("Intro Scene 3: The Timeline.");
      
      // Cleanup Scene 1 & 2 objects to free resource and avoid overlapping layers
      if (this.valve) this.valve.remove();
      if (this.eniacBg) this.eniacBg.remove();
      if (this.scientist) this.scientist.remove();
      if (this.text) this.text.remove();

      if (this.timelineContainer) {
        this.timelineContainer.classList.remove('hide');
        this.timelineContainer.classList.add('fade-in');
      }
    }, 18500);

    // 19s: "1946" - Válvula
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      this.showTimelineStep(
        "1946",
        "assets/images/sprites/valvula.png",
        "A Válvula Termiônica inaugura a primeira geração de computadores eletrônicos."
      );
    }, 19000);

    // 21.5s: "1956" - Transistor
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      this.transitionTimelineStep(
        "1956",
        "assets/images/sprites/era2_mainframe.png",
        "O Transistor substitui as válvulas a vácuo, tornando as máquinas muito menores e eficientes."
      );
    }, 21500);

    // 24s: "1964" - Circuito Integrado
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      this.transitionTimelineStep(
        "1964",
        "assets/images/sprites/era3_ic_chip.png",
        "O Circuito Integrado une múltiplos transistores em uma única pastilha de silício."
      );
    }, 24000);

    // 26.5s: "1971" - Microprocessador
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      this.transitionTimelineStep(
        "1971",
        "assets/images/sprites/era4_intel4004.png",
        "O Microprocessador reúne a unidade de processamento central (CPU) inteira em um único chip."
      );
    }, 26500);

    // 29s: Fim da Linha do Tempo - Fade out do container da timeline
    this.registerTimeout(() => {
      if (this.isSkipped || !this.timelineContainer) return;
      this.timelineContainer.classList.remove('fade-in');
    }, 29000);

    // 30.5s: Fim total da introdução cinematográfica
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      this.finish();
    }, 30500);
  }

  showTimelineStep(year, imgSrc, desc) {
    if (!this.timelineYear || !this.timelineImgEl || !this.timelineDesc) return;
    
    this.timelineYear.textContent = year;
    this.timelineImgEl.src = imgSrc;
    this.timelineDesc.textContent = desc;

    this.timelineYear.classList.add('show');
    this.timelineImage.classList.add('show');
    this.timelineDesc.classList.add('show');
  }

  transitionTimelineStep(year, imgSrc, desc) {
    if (!this.timelineYear || !this.timelineImgEl || !this.timelineDesc) return;

    // 1. Inicia o Fade-out do elemento atual
    this.timelineYear.classList.remove('show');
    this.timelineImage.classList.remove('show');
    this.timelineDesc.classList.remove('show');

    // 2. Após a conclusão do fade-out (800ms), atualiza o conteúdo e inicia o Fade-in
    this.registerTimeout(() => {
      if (this.isSkipped) return;
      
      this.timelineYear.textContent = year;
      this.timelineImgEl.src = imgSrc;
      this.timelineDesc.textContent = desc;

      this.timelineYear.classList.add('show');
      this.timelineImage.classList.add('show');
      this.timelineDesc.classList.add('show');
    }, 800);
  }

  skip() {
    if (this.isSkipped) return;
    this.isSkipped = true;
    console.log("Intro skip requested.");
    
    // Tocando som de clique ao pular, se inicializado
    try {
      audio.playClick();
    } catch(e) {}
    
    this.finish(true); // true aciona o fade-out rápido de 0.5s
  }

  finish(fast = false) {
    // Cancela todos os timeouts agendados na linha do tempo
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts = [];

    // Remove ouvinte de teclado global da introdução
    window.removeEventListener('keydown', this.keydownHandler);

    if (this.container) {
      this.container.style.transition = fast ? 'opacity 0.5s ease-in-out' : 'opacity 1.5s ease-in-out';
      this.container.style.opacity = '0';
      
      setTimeout(() => {
        this.container.style.display = 'none';
        this.container.remove();
        this.releaseGame();
      }, fast ? 500 : 1500);
    } else {
      this.releaseGame();
    }
  }

  releaseGame() {
    console.log("Intro sequence complete. Releasing game control...");
    
    // Inicializa contexto de áudio em resposta à interação do jogador
    try {
      audio.initContext();
    } catch (e) {
      console.warn("Failed to initialize audio context on intro end:", e);
    }

    const event = new CustomEvent('introFinished');
    window.dispatchEvent(event);
  }
}
