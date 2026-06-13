/* ⚙️ js/game/GameEngine.js */

import { Grid } from './Grid.js';
import { Economy } from './Economy.js';
import { Computer } from './Computer.js';
import { SaveManager } from '../storage/SaveManager.js';
import { Renderer } from '../render/Renderer.js';
import { Background } from '../render/Background.js';
import { ParticleSystem } from '../render/Particles.js';
import { HUD } from '../ui/HUD.js';
import { Timeline } from '../ui/Timeline.js';
import { EraCard } from '../ui/EraCard.js';
import { DragDrop } from '../input/DragDrop.js';
import { ClickHandler } from '../input/ClickHandler.js';
import { getEra, ERAS_DATA } from '../config.js';
import { audio } from '../audio/SoundManager.js';

export class GameEngine {
  constructor() {
    this.state = {
      maxEraUnlocked: 1,
      erasDiscovered: new Set([1]),
      prestigeCount: 0,
      isPaused: false,
      victoryTriggered: false,
      victoryDismissed: false,
      startTime: Date.now()
    };

    // Core systems
    this.grid = new Grid();
    this.economy = new Economy();
    this.particleSystem = new ParticleSystem();

    // Timers
    this.lastFrameTime = 0;
    this.saveTimer = 0;
    this.saveInterval = 30; // 30 seconds auto-save

    // Coin generation visual timer
    this.coinTickTimer = 0;
    this.coinTickInterval = 2.0; // show floating coins every 2s

    this.init();
  }

  init() {
    // 1. Elements
    const canvas = document.getElementById('game-canvas');
    const bgCanvas = document.getElementById('circuit-bg');

    // 2. Visual rendering setups
    this.background = new Background(bgCanvas);
    this.renderer = new Renderer(canvas, this.grid, this.particleSystem);
    
    // 3. UI controllers
    this.hud = new HUD();
    this.timeline = new Timeline('timeline-list');
    
    this.eraCard = new EraCard('modal-era', {
      onShow: () => {
        this.state.isPaused = true;
      },
      onClose: (level) => {
        this.state.isPaused = false;
        this.updateTheme();
        
        // Check if level 6 unlocked -> Victory
        if (level === ERAS_DATA.length && !this.state.victoryTriggered && !this.state.victoryDismissed) {
          this.triggerVictory();
        }
      }
    });

    // 4. Load Saved Game or Create default setup
    this.loadGame();

    // 5. Connect Drag and Drop (Canvas mouse/touch) — pass renderer for shockwaves
    this.dragDrop = new DragDrop(
      canvas,
      this.grid,
      this.economy,
      this.particleSystem,
      this.state.erasDiscovered,
      {
        onMerge: (nextLevel) => {
          if (nextLevel && nextLevel > this.state.maxEraUnlocked) {
            this.state.maxEraUnlocked = nextLevel;
          }
          this.saveGame();
        },
        onNewEra: (level) => {
          this.eraCard.show(level);
        }
      },
      this.renderer
    );

    // 6. Connect Button / controls click handler
    this.clickHandler = new ClickHandler(
      this.economy,
      this.grid,
      this.particleSystem,
      this.state,
      {
        onStateChange: () => this.hud.update(this.economy, this.grid, this.state.maxEraUnlocked),
        onBuy: () => {
          this.hud.update(this.economy, this.grid, this.state.maxEraUnlocked);
          this.saveGame();
        },
        onReset: () => this.resetGame()
      }
    );

    // 7. Initialize audio visual configurations
    this.updateTheme();
    this.setupVictoryEvents();

    // Update mute icon visual representation initially
    const isMuted = audio.isMuted();
    this.clickHandler.updateMuteIcon(isMuted);

    // 8. Start game loop
    this.lastFrameTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  loadGame() {
    const saved = SaveManager.load();
    
    if (saved) {
      this.economy.coins = saved.coins;
      this.economy.totalCoinsEarned = saved.totalCoinsEarned || saved.coins;
      this.economy.totalPurchases = saved.totalPurchases || 0;
      this.economy.prestigeCount = saved.prestigeCount || 0;
      
      this.state.maxEraUnlocked = saved.maxEraUnlocked || 1;
      this.state.erasDiscovered = saved.erasDiscovered;
      this.state.prestigeCount = saved.prestigeCount || 0;

      // Recreate computers in grid slots
      if (saved.grid) {
        saved.grid.forEach(compData => {
          const coords = this.grid.getSlotCoordinates(compData.slot);
          const comp = new Computer(
            compData.level,
            compData.slot,
            coords.centerX,
            coords.centerY
          );
          // Spawn instantly with target scale
          comp.scale = 1.0; 
          this.grid.placeComputer(comp, compData.slot);
        });
      }

      // Offline Earnings calculation
      const offline = SaveManager.calculateOfflineEarnings(saved);
      if (offline.earnings > 0) {
        this.showOfflineModal(offline.elapsedSeconds, offline.earnings);
      }
    } else {
      // New Game Headstart: place level 1 computer in slot 0
      const coords = this.grid.getSlotCoordinates(0);
      const startComp = new Computer(1, 0, coords.centerX, coords.centerY);
      this.grid.placeComputer(startComp, 0);
      
      // Auto-save initial state
      this.saveGame();
    }
  }

  saveGame() {
    SaveManager.save({
      coins: this.economy.coins,
      totalCoinsEarned: this.economy.totalCoinsEarned,
      totalPurchases: this.economy.totalPurchases,
      maxEraUnlocked: this.state.maxEraUnlocked,
      erasDiscovered: this.state.erasDiscovered,
      prestigeCount: this.economy.prestigeCount,
      grid: this.grid.slots
    });
  }

  resetGame() {
    SaveManager.clear();
    
    // Clear state
    this.grid.clear();
    this.particleSystem.clear();
    
    this.economy.coins = 0;
    this.economy.totalCoinsEarned = 0;
    this.economy.totalPurchases = 0;
    this.economy.prestigeCount = 0;

    this.state.maxEraUnlocked = 1;
    this.state.erasDiscovered = new Set([1]);
    this.state.victoryTriggered = false;
    this.state.victoryDismissed = false;
    this.state.startTime = Date.now();

    // Add level 1 computer to slot 0
    const coords = this.grid.getSlotCoordinates(0);
    const startComp = new Computer(1, 0, coords.centerX, coords.centerY);
    this.grid.placeComputer(startComp, 0);

    this.updateTheme();
    this.saveGame();
    
    // Close modals
    const modalVictory = document.getElementById('modal-victory');
    if (modalVictory) modalVictory.style.display = 'none';
  }

  showOfflineModal(elapsedSeconds, earnings) {
    const modal = document.getElementById('modal-offline');
    if (!modal) return;

    // Format time
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;
    
    let timeStr = '';
    if (hrs > 0) timeStr += `${hrs}h `;
    if (mins > 0 || hrs > 0) timeStr += `${mins}m `;
    timeStr += `${secs}s`;

    modal.querySelector('.offline-time').textContent = timeStr;
    modal.querySelector('.offline-earnings').textContent = this.hud.formatNumber(earnings);
    
    this.economy.addCoins(earnings);
    modal.style.display = 'block';
    
    this.state.isPaused = true;

    modal.querySelector('.btn-modal-action').onclick = () => {
      modal.style.display = 'none';
      audio.playClick();
      this.state.isPaused = false;
    };
  }

  triggerVictory() {
    this.state.victoryTriggered = true;
    this.state.isPaused = true;

    const modal = document.getElementById('modal-victory');
    if (!modal) return;

    // Calculate game stats
    const totalTimeMs = Date.now() - this.state.startTime;
    const hours = Math.floor(totalTimeMs / 3600000);
    const minutes = Math.floor((totalTimeMs % 3600000) / 60000);
    const seconds = Math.floor((totalTimeMs % 60000) / 1000);
    
    let timeText = '';
    if (hours > 0) timeText += `${hours}h `;
    if (minutes > 0) timeText += `${minutes}m `;
    timeText += `${seconds}s`;

    // Inject stats
    modal.querySelector('.victory-stat-time').textContent = timeText;
    modal.querySelector('.victory-stat-total-coins').textContent = this.hud.formatNumber(this.economy.totalCoinsEarned);
    modal.querySelector('.victory-stat-prestige').textContent = `+${this.economy.prestigeCount * 50}%`;

    modal.style.display = 'block';
  }

  setupVictoryEvents() {
    const modal = document.getElementById('modal-victory');
    if (!modal) return;

    // Prestige option
    const btnPrestige = modal.querySelector('#btn-prestige');
    if (btnPrestige) {
      btnPrestige.addEventListener('click', () => {
        // Prestige: reset game, but increment prestige multiplier count
        this.economy.prestige();
        
        // Reset grid but preserve prestige multiplier
        const savedPrestigeCount = this.economy.prestigeCount;
        this.resetGame();
        
        // Apply back the prestige count increment
        this.economy.prestigeCount = savedPrestigeCount;
        this.state.prestigeCount = savedPrestigeCount;
        this.saveGame();
        
        modal.style.display = 'none';
        this.state.isPaused = false;
      });
    }

    // Sandbox option (Keep playing)
    const btnSandbox = modal.querySelector('#btn-sandbox');
    if (btnSandbox) {
      btnSandbox.addEventListener('click', () => {
        modal.style.display = 'none';
        this.state.isPaused = false;
        this.state.victoryDismissed = true;
        audio.playClick();
      });
    }
  }

  updateTheme() {
    const era = getEra(this.state.maxEraUnlocked);
    if (!era) return;

    // 1. Update body class (triggers CSS custom property transition)
    document.body.className = '';
    document.body.classList.add(era.themeClass);

    // 2. Update timeline highlights
    this.timeline.update(this.state.erasDiscovered, this.state.maxEraUnlocked);
  }

  loop(timestamp) {
    const elapsedMs = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    
    // Scale deltaTime to seconds
    const dt = Math.min(0.1, elapsedMs / 1000);

    if (!this.state.isPaused) {
      this.update(dt);
    }

    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // 1. Accumulate passive cycle earnings
    const cps = this.economy.calculateCps(this.grid.slots);
    const coinsGenerated = cps * dt;
    this.economy.addCoins(coinsGenerated);

    // 2. Visual coin generation feedback (floating +coins text periodically)
    if (cps > 0) {
      this.coinTickTimer += dt;
      if (this.coinTickTimer >= this.coinTickInterval) {
        this.coinTickTimer = 0;
        const earned = Math.floor(cps * this.coinTickInterval);
        if (earned > 0) {
          // Show floating earnings on a random occupied slot
          const occupied = this.grid.slots
            .map((comp, idx) => comp ? idx : -1)
            .filter(idx => idx !== -1);
          if (occupied.length > 0) {
            const randSlot = occupied[Math.floor(Math.random() * occupied.length)];
            const coords = this.grid.getSlotCoordinates(randSlot);
            const era = getEra(this.grid.getComputer(randSlot).level);
            this.particleSystem.addFloatingText(
              coords.centerX, coords.centerY - 20,
              `+${this.hud.formatNumber(earned)} ⚡`,
              era.color
            );
          }
        }
      }
    }

    // 3. Update slots (positions / animations)
    this.grid.slots.forEach(comp => {
      if (comp) comp.update(dt);
    });

    // 4. Update particle animations
    this.particleSystem.update();

    // 5. Update HUD values
    this.hud.update(this.economy, this.grid, this.state.maxEraUnlocked);

    // 6. Check auto-save timer
    this.saveTimer += dt;
    if (this.saveTimer >= this.saveInterval) {
      this.saveTimer = 0;
      this.saveGame();
      console.log("Game auto-saved.");
    }
  }

  draw() {
    const era = getEra(this.state.maxEraUnlocked);
    const accentHex = era ? era.color : '#FFB74D';

    // Render animated PCB background
    this.background.draw(accentHex);

    // Render game board canvas (grid + computers + active drags)
    const dragState = this.dragDrop.getDragState();
    this.renderer.render(performance.now() / 1000, dragState, accentHex);
  }
}
