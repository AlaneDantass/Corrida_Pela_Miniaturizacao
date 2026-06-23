/* 🔌 js/render/Background.js */

class Trace {
  constructor(width, height) {
    this.points = [];
    
    // Choose a random starting edge or point
    let x = Math.random() * width;
    let y = Math.random() * height;
    
    this.points.push({ x, y });
    
    // Generate 3-5 connected segments (horizontal/vertical/45deg branches)
    const segments = 2 + Math.floor(Math.random() * 4);
    const length = 50 + Math.random() * 150;
    
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 0.707, dy: 0.707 },
      { dx: -0.707, dy: 0.707 },
      { dx: 0.707, dy: -0.707 },
      { dx: -0.707, dy: -0.707 }
    ];

    let lastDir = null;
    for (let i = 0; i < segments; i++) {
      // Pick a direction that isn't reversing the last one
      let dir;
      do {
        dir = directions[Math.floor(Math.random() * directions.length)];
      } while (lastDir && dir.dx === -lastDir.dx && dir.dy === -lastDir.dy);
      
      lastDir = dir;
      const segLen = length * (0.5 + Math.random() * 0.8);
      x += dir.dx * segLen;
      y += dir.dy * segLen;
      
      // Clamp coordinates to screen
      x = Math.max(0, Math.min(width, x));
      y = Math.max(0, Math.min(height, y));
      
      this.points.push({ x, y });
    }

    // Pulse animation state
    this.pulseProgress = Math.random(); // 0 to 1
    this.pulseSpeed = 0.003 + Math.random() * 0.005;
  }

  update() {
    this.pulseProgress += this.pulseSpeed;
    if (this.pulseProgress > 1.0) {
      this.pulseProgress = 0.0;
    }
  }

  getPulsePosition() {
    if (this.points.length < 2) return null;
    
    const totalSegments = this.points.length - 1;
    const targetSegment = Math.floor(this.pulseProgress * totalSegments);
    const segmentProgress = (this.pulseProgress * totalSegments) - targetSegment;
    
    const p1 = this.points[targetSegment];
    const p2 = this.points[targetSegment + 1];
    
    return {
      x: p1.x + (p2.x - p1.x) * segmentProgress,
      y: p1.y + (p2.y - p1.y) * segmentProgress
    };
  }
}

export class Background {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.traces = [];
    this.meshCanvas = null;
    
    this.resize();
    this.generateTraces();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.generateTraces();
      }, 100);
    });
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w;
    this.canvas.height = h;

    // Cache the mesh points to an offscreen canvas to avoid doing 1200+ fillRect calls on every frame
    if (!this.meshCanvas) {
      this.meshCanvas = document.createElement('canvas');
    }
    this.meshCanvas.width = w;
    this.meshCanvas.height = h;

    const mctx = this.meshCanvas.getContext('2d');
    mctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    const dotSpacing = 40;
    for (let dx = 0; dx < w; dx += dotSpacing) {
      for (let dy = 0; dy < h; dy += dotSpacing) {
        mctx.fillRect(dx, dy, 2, 2);
      }
    }
  }

  generateTraces() {
    this.traces = [];
    const count = Math.floor((this.canvas.width * this.canvas.height) / 30000);
    const safeCount = Math.max(15, Math.min(60, count));
    
    for (let i = 0; i < safeCount; i++) {
      this.traces.push(new Trace(this.canvas.width, this.canvas.height));
    }
  }

  /**
   * Draws the background circuit pattern.
   * @param {string} accentColorHex - Color of the current era accent
   */
  draw(accentColorHex = '#FFB74D') {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // Draw pre-rendered static background mesh points (instant, GPU accelerated)
    if (this.meshCanvas) {
      ctx.drawImage(this.meshCanvas, 0, 0);
    }
    
    // Draw traces
    this.traces.forEach(trace => {
      trace.update();
      
      // Draw static copper track line
      ctx.strokeStyle = `${accentColorHex}12`; // low alpha hex (e.g. ~7% opacity)
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      trace.points.forEach((pt, index) => {
        if (index === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      });
      ctx.stroke();

      // Draw junction circles at start and end
      ctx.fillStyle = `${accentColorHex}12`;
      ctx.beginPath();
      ctx.arc(trace.points[0].x, trace.points[0].y, 3, 0, Math.PI * 2);
      ctx.arc(trace.points[trace.points.length - 1].x, trace.points[trace.points.length - 1].y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw flowing pulse
      const pulsePos = trace.getPulsePosition();
      if (pulsePos) {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = accentColorHex;
        
        ctx.fillStyle = `${accentColorHex}cc`; // brighter alpha
        ctx.beginPath();
        ctx.arc(pulsePos.x, pulsePos.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    });
  }
}
