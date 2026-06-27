/* 🏁 js/game/Grid.js */

import { GRID_COLS, GRID_ROWS, TOTAL_SLOTS } from '../config.js';

export class Grid {
  constructor() {
    this.slots = new Array(TOTAL_SLOTS).fill(null);
    this.cellWidth = 160;
    this.cellHeight = 160;
    this.width = GRID_COLS * this.cellWidth;   // 480
    this.height = GRID_ROWS * this.cellHeight; // 640
  }

  getSlotCoordinates(index) {
    if (index < 0 || index >= TOTAL_SLOTS) return null;
    
    const col = index % GRID_COLS;
    const row = Math.floor(index / GRID_COLS);
    
    const x = col * this.cellWidth;
    const y = row * this.cellHeight;
    
    return {
      x,
      y,
      width: this.cellWidth,
      height: this.cellHeight,
      centerX: x + this.cellWidth / 2,
      centerY: y + this.cellHeight / 2
    };
  }

  getSlotAt(x, y) {
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      return -1;
    }
    
    const col = Math.floor(x / this.cellWidth);
    const row = Math.floor(y / this.cellHeight);
    
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
      return -1;
    }
    
    return row * GRID_COLS + col;
  }

  getComputer(index) {
    return this.slots[index];
  }

  placeComputer(computer, index) {
    if (index < 0 || index >= TOTAL_SLOTS) return false;
    this.slots[index] = computer;
    if (computer) {
      computer.slotIndex = index;
      const coords = this.getSlotCoordinates(index);
      computer.setTargetPosition(coords.centerX, coords.centerY);
    }
    return true;
  }

  removeComputer(index) {
    if (index < 0 || index >= TOTAL_SLOTS) return null;
    const comp = this.slots[index];
    this.slots[index] = null;
    return comp;
  }

  getFreeSlots() {
    const free = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      if (this.slots[i] === null) {
        free.push(i);
      }
    }
    return free;
  }

  getRandomFreeSlot() {
    const free = this.getFreeSlots();
    if (free.length === 0) return -1;
    const randIdx = Math.floor(Math.random() * free.length);
    return free[randIdx];
  }

  isFull() {
    return this.getFreeSlots().length === 0;
  }

  getOccupiedCount() {
    return this.slots.filter(s => s !== null).length;
  }

  clear() {
    this.slots.fill(null);
  }
}
