/* 🎨 js/render/Renderer.js */

import { Sprites } from './Sprites.js';
import { getEra, ERAS_DATA } from '../config.js';

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas - The board canvas element
   * @param {Grid} grid - The game grid
   * @param {ParticleSystem} particleSystem - Particle manager
   */
  constructor(canvas, grid, particleSystem) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.grid = grid;
    this.particleSystem = particleSystem;
    
    // Set internal resolution of canvas
    this.canvas.width = grid.width;     // 480
    this.canvas.height = grid.height;   // 640

    // Shockwave effects for merge
    this.shockwaves = [];
  }

  /**
   * Triggers a visual shockwave at given position (called on merge).
   */
  addShockwave(x, y, colorHex) {
    this.shockwaves.push({
      x, y,
      radius: 5,
      maxRadius: 120,
      alpha: 1.0,
      color: colorHex,
      speed: 6
    });
  }

  /**
   * Main render loop call.
   * @param {number} time - Elapsed time in seconds
   * @param {Object} dragInfo - Current dragging state: { computer, slotIndex, hoverSlotIndex }
   * @param {string} accentColorHex - Hex color of active era
   */
  render(time, dragInfo = null, accentColorHex = '#FFB74D') {
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 0. Draw subtle grid background pattern
    this.drawGridBackground(ctx, accentColorHex, time);

    // 1. Draw Grid Slots
    for (let i = 0; i < this.grid.slots.length; i++) {
      const coords = this.grid.getSlotCoordinates(i);
      const computer = this.grid.getComputer(i);
      
      // Draw empty slot placeholder
      if (!computer || (dragInfo && dragInfo.computer === computer)) {
        this.drawEmptySlot(ctx, coords, accentColorHex, time);
      }
    }

    // 2. Draw Hover Target Highlight (from Drag and Drop)
    if (dragInfo && dragInfo.computer && dragInfo.hoverSlotIndex !== -1) {
      const hoverIdx = dragInfo.hoverSlotIndex;
      const dragComp = dragInfo.computer;
      const targetComp = this.grid.getComputer(hoverIdx);
      const coords = this.grid.getSlotCoordinates(hoverIdx);

      if (coords) {
        ctx.save();
        if (!targetComp || dragComp === targetComp) {
          // Empty slot hover - soft glow of accent
          ctx.strokeStyle = accentColorHex;
          ctx.fillStyle = `${accentColorHex}1A`; // 10% opacity
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          this.roundRect(ctx, coords.x + 4, coords.y + 4, coords.width - 8, coords.height - 8, 12);
          ctx.stroke();
          ctx.fill();
        } else if (targetComp.level === dragComp.level) {
          // Valid merge hover - vibrant green glow with pulsing
          const pulseAlpha = 0.15 + Math.sin(time * 8) * 0.08;
          ctx.strokeStyle = '#4CAF50';
          ctx.fillStyle = `rgba(76, 175, 80, ${pulseAlpha})`;
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#4CAF50';
          ctx.lineWidth = 3;
          this.roundRect(ctx, coords.x + 4, coords.y + 4, coords.width - 8, coords.height - 8, 12);
          ctx.stroke();
          ctx.fill();

          // Draw merge icon indicator
          ctx.fillStyle = 'rgba(76, 175, 80, 0.8)';
          ctx.font = "bold 22px 'Orbitron', monospace";
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', coords.centerX, coords.y + 18);
        } else {
          // Invalid merge hover - red cross alert
          ctx.strokeStyle = '#F44336';
          ctx.fillStyle = 'rgba(244, 67, 54, 0.15)';
          ctx.lineWidth = 3;
          this.roundRect(ctx, coords.x + 4, coords.y + 4, coords.width - 8, coords.height - 8, 12);
          ctx.stroke();
          ctx.fill();

          // Draw X mark
          ctx.strokeStyle = 'rgba(244, 67, 54, 0.6)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(coords.centerX - 10, coords.centerY - 10);
          ctx.lineTo(coords.centerX + 10, coords.centerY + 10);
          ctx.moveTo(coords.centerX + 10, coords.centerY - 10);
          ctx.lineTo(coords.centerX - 10, coords.centerY + 10);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // 3. Draw Computers (Not dragging)
    for (let i = 0; i < this.grid.slots.length; i++) {
      const computer = this.grid.getComputer(i);
      if (computer && (!dragInfo || dragInfo.computer !== computer)) {
        const coords = this.grid.getSlotCoordinates(i);
        const era = getEra(computer.level);
        const baseSize = Math.min(coords.width, coords.height);
        const spriteSize = baseSize * era.spriteSize * computer.scale;
        
        // Subtle idle bounce animation
        const bounceOffset = Math.sin(time * 1.5 + i * 0.7) * 2;
        
        // Draw ground shadow
        this.drawShadow(ctx, computer.x, computer.y + spriteSize * 0.4 + bounceOffset, spriteSize * 0.5, era.color);
        
        // Draw the sprite
        Sprites.draw(ctx, computer.level, computer.x, computer.y + bounceOffset, spriteSize, time);
        
        // Draw level badge
        this.drawLevelBadge(ctx, computer, coords, era, spriteSize, bounceOffset);
      }
    }

    // 4. Draw Shockwaves
    this.updateAndDrawShockwaves(ctx);

    // 5. Draw Particles
    this.particleSystem.draw(ctx);

    // 6. Draw Dragged Computer (On top of everything)
    if (dragInfo && dragInfo.computer) {
      const computer = dragInfo.computer;
      const coords = this.grid.getSlotCoordinates(computer.slotIndex);
      const era = getEra(computer.level);
      const baseSize = Math.min(coords.width, coords.height);
      const spriteSize = baseSize * era.spriteSize * 1.15; // Scale up slightly while dragging
      
      // Drop shadow under dragged item
      this.drawShadow(ctx, computer.x + 5, computer.y + spriteSize * 0.45, spriteSize * 0.55, era.color);

      // Glow under dragged item
      ctx.save();
      ctx.shadowBlur = 30;
      ctx.shadowColor = era.color;
      Sprites.draw(ctx, computer.level, computer.x, computer.y, spriteSize, time);
      ctx.restore();

      // Level badge while dragging
      this.drawLevelBadge(ctx, computer, { centerX: computer.x, centerY: computer.y, width: coords.width, height: coords.height }, era, spriteSize, 0);
    }
  }

  /**
   * Draws a subtle grid background pattern.
   */
  drawGridBackground(ctx, colorHex, time) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Subtle radial gradient overlay
    const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w);
    grad.addColorStop(0, `${colorHex}08`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  /**
   * Draws a shadow underneath a sprite.
   */
  drawShadow(ctx, x, y, width, colorHex) {
    ctx.save();
    const grad = ctx.createRadialGradient(x, y, 0, x, y, width);
    grad.addColorStop(0, `${colorHex}30`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, width, width * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Draws the level badge underneath a computer.
   */
  drawLevelBadge(ctx, computer, coords, era, spriteSize, bounceOffset) {
    ctx.save();

    const badgeY = computer.y + spriteSize * 0.38 + bounceOffset;
    const badgeText = `L${computer.level}`;
    const eraName = era.name.split('(')[0].split('/')[0].trim();
    
    // Badge background pill (no slow shadowBlur)
    const badgeWidth = 60;
    const badgeHeight = 18;
    ctx.fillStyle = `${era.color}CC`;
    this.roundRect(ctx, computer.x - badgeWidth / 2, badgeY - badgeHeight / 2, badgeWidth, badgeHeight, 9);
    ctx.fill();

    // Badge text
    ctx.fillStyle = '#0B0D17';
    ctx.font = "bold 10px 'Orbitron', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, computer.x, badgeY);

    ctx.restore();
  }

  /**
   * Updates and draws active shockwave effects.
   */
  updateAndDrawShockwaves(ctx) {
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      
      sw.radius += sw.speed;
      sw.alpha = 1.0 - (sw.radius / sw.maxRadius);

      if (sw.alpha <= 0) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      ctx.save();
      
      // Draw outer soft glow ring instead of expensive shadowBlur
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 6 * sw.alpha;
      ctx.globalAlpha = sw.alpha * 0.15;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw inner sharp ring
      ctx.lineWidth = 2 * sw.alpha;
      ctx.globalAlpha = sw.alpha * 0.7;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner glow solid ring
      ctx.globalAlpha = sw.alpha * 0.15;
      ctx.fillStyle = sw.color;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  /**
   * Draws an empty slot with rounded corners and subtle animation.
   */
  drawEmptySlot(ctx, coords, colorHex, time) {
    ctx.save();
    
    const inset = 10;
    const w = coords.width - inset * 2;
    const h = coords.height - inset * 2;
    const x = coords.x + inset;
    const y = coords.y + inset;

    // Subtle breathing border
    const breathe = Math.sin(time * 2) * 0.3 + 0.7;
    
    // Rounded dashed border
    ctx.strokeStyle = `${colorHex}${Math.floor(30 * breathe).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    this.roundRect(ctx, x, y, w, h, 12);
    ctx.stroke();

    // Center plus symbol
    ctx.strokeStyle = `${colorHex}${Math.floor(25 * breathe).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = 2;
    ctx.setLineDash([]); // solid line
    ctx.beginPath();
    // vertical
    ctx.moveTo(coords.centerX, coords.centerY - 8);
    ctx.lineTo(coords.centerX, coords.centerY + 8);
    // horizontal
    ctx.moveTo(coords.centerX - 8, coords.centerY);
    ctx.lineTo(coords.centerX + 8, coords.centerY);
    ctx.stroke();
    
    ctx.restore();
  }

  /**
   * Rounded rectangle helper.
   */
  roundRect(ctx, x, y, width, height, radius) {
    if (typeof radius === 'undefined') radius = 5;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
