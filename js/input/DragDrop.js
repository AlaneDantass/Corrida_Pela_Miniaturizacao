/* 🖱️ js/input/DragDrop.js */

import { MergeSystem } from '../game/MergeSystem.js';
import { getEra } from '../config.js';

export class DragDrop {
  /**
   * @param {HTMLCanvasElement} canvas - Game board canvas
   * @param {Grid} grid - Grid object
   * @param {Economy} economy - Economy object
   * @param {ParticleSystem} particleSystem - Particle manager
   * @param {Set<number>} erasDiscovered - Unlocked eras levels
   * @param {Object} callbacks - callbacks: { onMerge, onNewEra }
   * @param {Renderer} renderer - Renderer reference for shockwaves
   */
  constructor(canvas, grid, economy, particleSystem, erasDiscovered, callbacks, renderer = null) {
    this.canvas = canvas;
    this.grid = grid;
    this.economy = economy;
    this.particleSystem = particleSystem;
    this.erasDiscovered = erasDiscovered;
    this.callbacks = callbacks;
    this.renderer = renderer;

    this.draggedComputer = null;
    this.dragStartSlot = -1;
    this.hoverSlotIndex = -1;

    this.setupEvents();
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    
    // Support mouse and touch
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Map CSS size to canvas drawing buffer coordinates (480 x 640)
    const x = (clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (clientY - rect.top) * (this.canvas.height / rect.height);
    
    return { x, y };
  }

  setupEvents() {
    // Mouse Down
    this.canvas.addEventListener('mousedown', (e) => this.handleDragStart(e));
    // Touch Start (Mobile)
    this.canvas.addEventListener('touchstart', (e) => {
      this.handleDragStart(e);
    }, { passive: true });

    // Mouse Move
    window.addEventListener('mousemove', (e) => this.handleDragMove(e));
    // Touch Move (Mobile)
    window.addEventListener('touchmove', (e) => {
      this.handleDragMove(e);
    }, { passive: false });

    // Mouse Up
    window.addEventListener('mouseup', (e) => this.handleDragEnd(e));
    // Touch End (Mobile)
    window.addEventListener('touchend', (e) => this.handleDragEnd(e));
  }

  handleDragStart(e) {
    const coords = this.getCanvasCoords(e);
    const slotIdx = this.grid.getSlotAt(coords.x, coords.y);

    if (slotIdx !== -1) {
      const computer = this.grid.getComputer(slotIdx);
      if (computer) {
        this.draggedComputer = computer;
        this.dragStartSlot = slotIdx;
        this.draggedComputer.isDragging = true;
        
        // Initial drag offset matches mouse position
        this.draggedComputer.dragX = coords.x;
        this.draggedComputer.dragY = coords.y;
      }
    }
  }

  handleDragMove(e) {
    if (!this.draggedComputer) return;
    
    // Prevent default scroll on touch screens while dragging
    if (e.cancelable) {
      e.preventDefault();
    }

    const coords = this.getCanvasCoords(e);
    
    this.draggedComputer.dragX = coords.x;
    this.draggedComputer.dragY = coords.y;

    // Detect grid hover slot
    this.hoverSlotIndex = this.grid.getSlotAt(coords.x, coords.y);
  }

  handleDragEnd(e) {
    if (!this.draggedComputer) return;

    const comp = this.draggedComputer;
    comp.isDragging = false;

    const originSlot = this.dragStartSlot;
    const targetSlot = this.hoverSlotIndex;

    // Trigger merge log evaluation
    const result = MergeSystem.handleDrop(
      this.grid,
      this.economy,
      originSlot,
      targetSlot,
      this.erasDiscovered
    );

    if (result.success) {
      if (result.action === 'merge') {
        const nextLevel = result.level;
        const era = getEra(nextLevel);
        
        // Spawn spectacular merge explosion
        this.particleSystem.addMergeExplosion(result.centerX, result.centerY, era.color, 35);
        this.particleSystem.addLevelUpText(result.centerX, result.centerY, nextLevel, era.color);

        // Trigger shockwave on the renderer
        if (this.renderer) {
          this.renderer.addShockwave(result.centerX, result.centerY, era.color);
        }

        if (this.callbacks.onMerge) {
          this.callbacks.onMerge(nextLevel);
        }

        if (result.isNewEra && this.callbacks.onNewEra) {
          this.callbacks.onNewEra(nextLevel);
        }
      } else if (result.action === 'move') {
        if (this.callbacks.onMerge) {
          this.callbacks.onMerge();
        }
      }
    } else {
      // Put back with small bounce scale
      this.grid.placeComputer(comp, originSlot);
      comp.scale = 0.85; 
    }

    // Reset drag variables
    this.draggedComputer = null;
    this.dragStartSlot = -1;
    this.hoverSlotIndex = -1;
  }

  getDragState() {
    if (!this.draggedComputer) return null;
    return {
      computer: this.draggedComputer,
      slotIndex: this.dragStartSlot,
      hoverSlotIndex: this.hoverSlotIndex
    };
  }
}
