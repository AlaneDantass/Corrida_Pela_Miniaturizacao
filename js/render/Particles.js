/* 🚀 js/render/Particles.js */

class Particle {
  constructor(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.color = options.color || '#fff';
    this.size = options.size || 3;
    this.alpha = 1.0;
    this.life = 1.0;
    this.decay = options.decay || 0.02;
    this.type = options.type || 'spark'; // 'spark', 'text', 'ring', 'star'
    this.text = options.text || '';
    this.gravity = options.gravity || 0;
    this.glow = options.glow || false;
    this.rotation = options.rotation || 0;
    this.rotationSpeed = options.rotationSpeed || 0;
    this.scaleStart = options.scaleStart || 1;
    this.scaleEnd = options.scaleEnd || 1;
    this.friction = options.friction || 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.life -= this.decay;
    this.alpha = Math.max(0, this.life);
    this.rotation += this.rotationSpeed;
  }

  getScale() {
    const t = 1 - this.life;
    return this.scaleStart + (this.scaleEnd - this.scaleStart) * t;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    
    const scale = this.getScale();

    if (this.type === 'spark') {
      if (this.glow) {
        // Draw soft glow rings instead of expensive shadowBlur
        const baseColor = this.color.startsWith('rgba') ? this.color : this.color;
        ctx.fillStyle = baseColor.startsWith('#') ? `${baseColor}15` : 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * scale * 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = baseColor.startsWith('#') ? `${baseColor}35` : 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * scale * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * scale, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'text') {
      ctx.fillStyle = this.color;
      ctx.font = `bold ${this.size * scale}px 'Orbitron', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Text outline for readability
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 3;
      ctx.strokeText(this.text, this.x, this.y);
      ctx.fillText(this.text, this.x, this.y);
    } else if (this.type === 'star') {
      if (this.glow) {
        const baseColor = this.color.startsWith('rgba') ? this.color : this.color;
        ctx.fillStyle = baseColor.startsWith('#') ? `${baseColor}20` : 'rgba(255,255,255,0.12)';
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        this.drawStar(ctx, 0, 0, 5, this.size * scale * 1.8, this.size * scale * 0.4 * 1.8);
        ctx.fill();
        ctx.restore();
      }
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      this.drawStar(ctx, 0, 0, 5, this.size * scale, this.size * scale * 0.4);
      ctx.fill();
      ctx.restore();
    } else if (this.type === 'ring') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2 * this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * scale, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  addSparks(x, y, color, count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 4,
        decay: 0.015 + Math.random() * 0.02,
        gravity: 0.05,
        glow: true,
        friction: 0.97
      }));
    }
  }

  /**
   * Adds an explosion of stars for merge events.
   */
  addMergeExplosion(x, y, color, count = 20) {
    // Sparks
    this.addSparks(x, y, color, count);

    // Stars
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        color,
        size: 5 + Math.random() * 6,
        decay: 0.012 + Math.random() * 0.015,
        gravity: 0.03,
        glow: true,
        type: 'star',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: 0.1 + Math.random() * 0.15,
        friction: 0.96
      }));
    }

    // Expanding rings
    for (let i = 0; i < 3; i++) {
      this.particles.push(new Particle({
        x,
        y,
        vx: 0,
        vy: 0,
        color,
        size: 10 + i * 15,
        decay: 0.025 + i * 0.008,
        glow: true,
        type: 'ring',
        scaleStart: 0.5,
        scaleEnd: 3
      }));
    }
  }

  addFloatingText(x, y, text, color = '#ffffff') {
    // Floating text goes upwards, fades quickly
    this.particles.push(new Particle({
      x,
      y: y - 10,
      vx: (Math.random() - 0.5) * 1.0,
      vy: -1.5 - Math.random() * 1.5,
      color,
      size: 14 + Math.random() * 4,
      decay: 0.018,
      type: 'text',
      text,
      glow: true,
      scaleStart: 0.5,
      scaleEnd: 1.2
    }));
  }

  /**
   * Adds a big "LEVEL UP" text particle.
   */
  addLevelUpText(x, y, level, color) {
    this.particles.push(new Particle({
      x,
      y: y - 30,
      vx: 0,
      vy: -1.0,
      color,
      size: 20,
      decay: 0.012,
      type: 'text',
      text: `⬆ LVL ${level}`,
      glow: true,
      scaleStart: 0.3,
      scaleEnd: 1.4
    }));
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }

  clear() {
    this.particles = [];
  }
}
