/* 💻 js/game/Computer.js */

import { getComponentByLevel, getEraByGlobalLevel } from '../config.js';

export class Computer {
  constructor(level, slotIndex, startX = 0, startY = 0) {
    this.level = level;
    this.slotIndex = slotIndex;
    
    // Animation/Position variables
    // Start position: drop from above the grid (like Cow Evolution)
    this.x = startX;
    this.y = startY - 100; // Start above the target position
    this.targetX = startX;
    this.targetY = startY;
    this.scale = 0.0; // Start at 0 for spawn animation
    this.targetScale = 1.0;
    this.isDragging = false;
    this.dragX = 0;
    this.dragY = 0;

    // Spawn bounce state
    this.spawnBounceTime = 0;
    this.isSpawning = true;
    this.bounceCount = 0;
  }

  getEraData() {
    return getEraByGlobalLevel(this.level);
  }

  getComponentData() {
    return getComponentByLevel(this.level);
  }

  getCoinsPerSecond() {
    const component = this.getComponentData();
    return component?.coinsPerSecond ?? 0;
  }

  setTargetPosition(tx, ty, instant = false) {
    this.targetX = tx;
    this.targetY = ty;
    if (instant) {
      this.x = tx;
      this.y = ty;
    }
  }

  update(deltaTime) {
    // Lerp scale with overshoot (spring effect)
    if (this.scale < this.targetScale) {
      this.scale += (this.targetScale - this.scale) * 0.18;
      if (this.targetScale - this.scale < 0.01) {
        this.scale = this.targetScale;
      }
    }

    // When returning from drag, snap back with spring
    if (this.scale > this.targetScale) {
      this.scale += (this.targetScale - this.scale) * 0.15;
      if (this.scale - this.targetScale < 0.01) {
        this.scale = this.targetScale;
      }
    }

    // Lerp position when not being dragged
    if (!this.isDragging) {
      const lerpSpeed = this.isSpawning ? 0.12 : 0.2;
      this.x += (this.targetX - this.x) * lerpSpeed;
      this.y += (this.targetY - this.y) * lerpSpeed;
      
      // Check if spawn animation is complete
      if (this.isSpawning) {
        if (Math.abs(this.targetY - this.y) < 1) {
          this.isSpawning = false;
        }
      }

      // Snap to target if very close
      if (Math.abs(this.targetX - this.x) < 0.1) this.x = this.targetX;
      if (Math.abs(this.targetY - this.y) < 0.1) this.y = this.targetY;
    } else {
      // Follow drag coordinates
      this.x = this.dragX;
      this.y = this.dragY;
    }
  }
}
