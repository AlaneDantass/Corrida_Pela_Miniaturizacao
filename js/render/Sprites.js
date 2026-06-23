/* 🎨 js/render/Sprites.js */

export class Sprites {
  /**
   * Draws an item sprite of a specific era and level at a given coordinate.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} eraLevel - Active Era level (1 to 6)
   * @param {number} itemLevel - Item level within the era (1 to 3)
   * @param {number} x - Center X coordinate
   * @param {number} y - Center Y coordinate
   * @param {number} size - Square bounding size
   * @param {number} time - Current game elapsed time in seconds (for animation)
   */
  static draw(ctx, eraLevel, itemLevel, x, y, size, time) {
    ctx.save();
    
    // Set shadow configs for glow
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    switch(eraLevel) {
      case 1: // Máquinas Mecânicas
        if (itemLevel === 1) this.drawGear(ctx, x, y, size, time);
        else if (itemLevel === 2) this.drawPascaline(ctx, x, y, size, time);
        else this.drawAnalyticalEngine(ctx, x, y, size, time);
        break;
      case 2: // Computadores Eletrônicos
        if (itemLevel === 1) this.drawVacuumTube(ctx, x, y, size, time);
        else if (itemLevel === 2) this.drawValvePanel(ctx, x, y, size, time);
        else this.drawMainframe(ctx, x, y, size, time);
        break;
      case 3: // Circuitos Integrados
        if (itemLevel === 1) this.drawICChip(ctx, x, y, size, time);
        else if (itemLevel === 2) this.drawLogicBoard(ctx, x, y, size, time);
        else this.drawApolloGuidance(ctx, x, y, size, time);
        break;
      case 4: // Revolução do Microprocessador
        if (itemLevel === 1) this.drawIntel4004(ctx, x, y, size, time);
        else if (itemLevel === 2) this.drawMotherboard(ctx, x, y, size, time);
        else this.drawClassicPC(ctx, x, y, size, time);
        break;
      case 5: // Computação Pessoal Portátil
        if (itemLevel === 1) this.drawCompactComponents(ctx, x, y, size, time);
        else if (itemLevel === 2) this.drawBrickPhone(ctx, x, y, size, time);
        else this.drawSmartphone(ctx, x, y, size, time);
        break;
      case 6: // Computação Ubíqua e Futuro
        if (itemLevel === 1) this.drawSoC(ctx, x, y, size, time);
        else if (itemLevel === 2) this.drawQuantumCells(ctx, x, y, size, time);
        else this.drawQuantum(ctx, x, y, size, time);
        break;
      default:
        // Fallback: draw a generic chip
        this.drawGeneric(ctx, x, y, size, itemLevel);
    }
    
    ctx.restore();
  }

  // 1. ENIAC - Cabinet with vacuum tubes
  static drawEniac(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.9;
    const left = x - w / 2;
    const top = y - h / 2;

    // Cabinet Main Body
    ctx.fillStyle = "#2D323E";
    ctx.strokeStyle = "#4D5361";
    ctx.lineWidth = 3;
    this.roundRect(ctx, left, top, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Inside dark panel
    ctx.fillStyle = "#161920";
    ctx.fillRect(left + 8, top + 8, w - 16, h - 16);

    // Grid of tubes
    const rows = 4;
    const cols = 4;
    const startX = left + 18;
    const startY = top + 18;
    const gapX = (w - 36) / (cols - 1);
    const gapY = (h - 36) / (rows - 1);

    // Draw wires in background
    ctx.strokeStyle = "rgba(100, 110, 130, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(startX + 30, startY + 50, startX + 50, startY + 10, startX + gapX * 2, startY + gapY * 2);
    ctx.stroke();

    // Vacuum tubes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tx = startX + c * gapX;
        const ty = startY + r * gapY;
        
        // Base of tube
        ctx.fillStyle = "#3c3f4a";
        ctx.fillRect(tx - 6, ty + 2, 12, 6);

        // Glass bulb
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillStyle = "rgba(40, 45, 55, 0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(tx, ty - 3, 6, Math.PI, 0, false);
        ctx.lineTo(tx + 6, ty + 2);
        ctx.lineTo(tx - 6, ty + 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing filaments (blinking at offset speeds)
        const blinkFreq = 1.5 + (r * 0.3) + (c * 0.2);
        const blinkVal = Math.sin(time * Math.PI * blinkFreq) * 0.5 + 0.5;
        
        if (blinkVal > 0.3) {
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#FF8A65";
          ctx.fillStyle = `rgba(255, 138, 101, ${blinkVal})`;
          ctx.beginPath();
          ctx.arc(tx, ty - 3, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Blinking lights row at the bottom
    for (let i = 0; i < 5; i++) {
      const lx = left + 15 + i * (w - 30) / 4;
      const ly = top + h - 14;
      const active = (Math.floor(time * 6 + i) % 3) !== 0;
      
      ctx.fillStyle = active ? "#4CAF50" : "#d32f2f";
      ctx.beginPath();
      ctx.arc(lx, ly, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Transistor Mainframe with magnetic reels
  static drawMainframe(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.9;
    const left = x - w / 2;
    const top = y - h / 2;

    // Outer metal frame
    ctx.fillStyle = "#1E2B38";
    ctx.strokeStyle = "#374B5C";
    ctx.lineWidth = 3;
    this.roundRect(ctx, left, top, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Reels section
    ctx.fillStyle = "#0D151D";
    ctx.fillRect(left + 8, top + 8, w - 16, h * 0.45);

    // Draw 2 Magnetic Tape Reels
    const reelY = top + 8 + (h * 0.45) / 2;
    const reelR = w * 0.16;
    const reel1X = left + 8 + (w - 16) * 0.28;
    const reel2X = left + 8 + (w - 16) * 0.72;

    this.drawTapeReel(ctx, reel1X, reelY, reelR, time * 1.5);
    this.drawTapeReel(ctx, reel2X, reelY, reelR, -time * 1.2);

    // Control console
    ctx.fillStyle = "#121A22";
    ctx.fillRect(left + 8, top + 14 + h * 0.45, w - 16, h * 0.4);

    // Buttons grid (switches)
    const switchRows = 2;
    const switchCols = 4;
    const swStartX = left + 16;
    const swStartY = top + 20 + h * 0.45;
    const swGapX = (w - 32) / (switchCols - 1);
    const swGapY = (h * 0.3) / switchRows;

    for (let r = 0; r < switchRows; r++) {
      for (let c = 0; c < switchCols; c++) {
        const sx = swStartX + c * swGapX;
        const sy = swStartY + r * swGapY;
        
        // Switch plate
        ctx.fillStyle = "#263238";
        ctx.fillRect(sx - 5, sy - 5, 10, 10);
        
        // Active state color
        const swActive = (Math.sin(time * 4 + r * 1.5 + c) > 0);
        ctx.fillStyle = swActive ? "#29B6F6" : "#FF7043";
        ctx.fillRect(sx - 3, sy - (swActive ? 4 : 1), 6, 5);
      }
    }
  }

  static drawTapeReel(ctx, rx, ry, r, rotation) {
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(rotation);

    // Inner circle tape
    ctx.fillStyle = "#ECEFF1";
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Reels structure (spokes)
    ctx.strokeStyle = "#546E7A";
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      ctx.stroke();
    }

    // Center hub
    ctx.fillStyle = "#37474F";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 3. Circuito Integrado - Retro Terminal with green CRT screen
  static drawCI(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.9;
    const left = x - w / 2;
    const top = y - h / 2;

    // Beige retro body
    ctx.fillStyle = "#CFD8DC";
    ctx.strokeStyle = "#B0BEC5";
    ctx.lineWidth = 3;
    this.roundRect(ctx, left, top, w, h * 0.75, 10);
    ctx.fill();
    ctx.stroke();

    // Neck/base connector
    ctx.fillStyle = "#90A4AE";
    ctx.fillRect(x - w * 0.15, top + h * 0.75, w * 0.3, h * 0.08);

    // Stand base
    ctx.fillStyle = "#78909C";
    ctx.beginPath();
    ctx.moveTo(x - w * 0.3, top + h * 0.83);
    ctx.lineTo(x + w * 0.3, top + h * 0.83);
    ctx.lineTo(x + w * 0.38, top + h * 0.93);
    ctx.lineTo(x - w * 0.38, top + h * 0.93);
    ctx.closePath();
    ctx.fill();

    // CRT screen bezel
    ctx.fillStyle = "#37474F";
    this.roundRect(ctx, left + 8, top + 8, w - 16, h * 0.6, 6);
    ctx.fill();

    // Green CRT Screen
    ctx.fillStyle = "#0A1B0E";
    this.roundRect(ctx, left + 14, top + 14, w - 28, h * 0.6 - 12, 4);
    ctx.fill();

    // Screen content - scan lines / terminal text
    ctx.strokeStyle = "rgba(102, 187, 106, 0.8)";
    ctx.lineWidth = 2;
    
    // Sine wave graph representing computation
    ctx.beginPath();
    for (let lx = 0; lx < w - 32; lx += 2) {
      const graphY = Math.sin((lx * 0.08) + time * 5) * 8 + (top + 14 + (h * 0.6 - 12) / 2);
      if (lx === 0) {
        ctx.moveTo(left + 16 + lx, graphY);
      } else {
        ctx.lineTo(left + 16 + lx, graphY);
      }
    }
    ctx.stroke();

    // Keyboard (bottom console base)
    ctx.fillStyle = "#90A4AE";
    ctx.fillRect(x - w * 0.42, top + h * 0.93, w * 0.84, h * 0.05);
  }

  // 4. PC / Microprocessador - Classic 90s Desktop Tower and Monitor
  static drawClassicPC(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.9;
    
    // Desktop layout is side by side: Monitor on left/center, Tower on right
    // Monitor casing
    const monW = w * 0.62;
    const monH = h * 0.62;
    const monLeft = x - w / 2;
    const monTop = y - h / 3.5;

    ctx.fillStyle = "#ECEFF1";
    ctx.strokeStyle = "#CFD8DC";
    ctx.lineWidth = 2.5;
    this.roundRect(ctx, monLeft, monTop, monW, monH, 6);
    ctx.fill();
    ctx.stroke();

    // Monitor base/stand
    ctx.fillStyle = "#CFD8DC";
    ctx.fillRect(monLeft + monW * 0.35, monTop + monH, monW * 0.3, h * 0.1);
    ctx.fillStyle = "#B0BEC5";
    ctx.fillRect(monLeft + monW * 0.2, monTop + monH + h * 0.08, monW * 0.6, h * 0.05);

    // Screen area
    ctx.fillStyle = "#1E293B";
    this.roundRect(ctx, monLeft + 6, monTop + 6, monW - 12, monH - 15, 3);
    ctx.fill();

    // Screen graphic (Desktop GUI layout)
    // Blue background (retro Windows)
    ctx.fillStyle = "#008080";
    ctx.fillRect(monLeft + 8, monTop + 8, monW - 16, monH - 19);

    // Draw little desktop icons
    ctx.fillStyle = "#FBC02D"; // yellow folder
    ctx.fillRect(monLeft + 12, monTop + 12, 5, 4);
    ctx.fillStyle = "#FFF";
    ctx.fillRect(monLeft + 12, monTop + 20, 5, 4);

    // Dialog box blinking
    if ((Math.floor(time * 1.5) % 2) === 0) {
      ctx.fillStyle = "#C0C0C0";
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 1;
      ctx.fillRect(monLeft + monW / 4, monTop + monH / 3, monW / 2, monH / 3);
      ctx.strokeRect(monLeft + monW / 4, monTop + monH / 3, monW / 2, monH / 3);
      
      ctx.fillStyle = "#000080"; // Title bar
      ctx.fillRect(monLeft + monW / 4 + 2, monTop + monH / 3 + 2, monW / 2 - 4, 4);
    }

    // Tower (Right side)
    const towW = w * 0.28;
    const towH = h * 0.85;
    const towLeft = x + w / 2 - towW;
    const towTop = y - h / 2.2;

    ctx.fillStyle = "#ECEFF1";
    ctx.strokeStyle = "#CFD8DC";
    ctx.lineWidth = 2.5;
    this.roundRect(ctx, towLeft, towTop, towW, towH, 4);
    ctx.fill();
    ctx.stroke();

    // Floppy disk drive slits
    ctx.fillStyle = "#37474F";
    ctx.fillRect(towLeft + 4, towTop + 14, towW - 8, 3);
    ctx.fillRect(towLeft + 4, towTop + 25, towW - 8, 3);
    
    // CD-ROM drive
    ctx.fillStyle = "#CFD8DC";
    ctx.fillRect(towLeft + 3, towTop + 38, towW - 6, 8);
    ctx.fillStyle = "#455A64";
    ctx.fillRect(towLeft + 6, towTop + 41, towW - 12, 2);

    // Power buttons
    ctx.fillStyle = "#E53935"; // Red power button
    ctx.fillRect(towLeft + 6, towTop + towH - 18, 4, 4);
    
    ctx.fillStyle = "#4CAF50"; // Green LED on
    ctx.beginPath();
    ctx.arc(towLeft + 15, towTop + towH - 16, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Smartphone - Modern bezel-less sleek touchscreen device
  static drawSmartphone(ctx, x, y, size, time) {
    const w = size * 0.75;
    const h = size * 0.95;
    const left = x - w / 2;
    const top = y - h / 2;

    // Phone casing (sleek black chrome)
    ctx.fillStyle = "#1E2022";
    ctx.strokeStyle = "#43464B";
    ctx.lineWidth = 2.5;
    this.roundRect(ctx, left, top, w, h, 14);
    ctx.fill();
    ctx.stroke();

    // Screen
    ctx.fillStyle = "#0A0D14";
    this.roundRect(ctx, left + 3, top + 3, w - 6, h - 6, 12);
    ctx.fill();

    // Screen gradient color wallpaper
    const grad = ctx.createLinearGradient(left, top, left + w, top + h);
    grad.addColorStop(0, "#EF5350");
    grad.addColorStop(0.5, "#E040FB");
    grad.addColorStop(1, "#3F51B5");
    ctx.fillStyle = grad;
    this.roundRect(ctx, left + 4, top + 10, w - 8, h - 20, 9);
    ctx.fill();

    // App icons (rows of colorful square pills)
    const iconRows = 4;
    const iconCols = 3;
    const iStartX = left + 12;
    const iStartY = top + 24;
    const iGapX = (w - 24) / (iconCols - 1);
    const iGapY = (h - 55) / (iconRows - 1);
    const colors = ["#FFF", "#FFEB3B", "#00E5FF", "#76FF03", "#FF4081", "#EA80FC", "#FFD180", "#18FFFF", "#A7FFEB"];

    for (let r = 0; r < iconRows; r++) {
      for (let c = 0; c < iconCols; c++) {
        const ix = iStartX + c * iGapX;
        const iy = iStartY + r * iGapY;
        const colorIdx = (r * iconCols + c) % colors.length;
        
        ctx.fillStyle = colors[colorIdx];
        this.roundRect(ctx, ix - 4, iy - 4, 8, 8, 2);
        ctx.fill();
      }
    }

    // Top Notch / Speaker
    ctx.fillStyle = "#1E2022";
    this.roundRect(ctx, x - 12, top + 3, 24, 6, 3);
    ctx.fill();
    
    // Bouncing loading indicator or swipe line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 12, top + h - 10);
    ctx.lineTo(x + 12, top + h - 10);
    ctx.stroke();
  }

  // 6. Quantum Cube - Futuristic holographic floating glass structure
  static drawQuantum(ctx, x, y, size, time) {
    const w = size * 0.95;
    const h = size * 0.95;
    const rad = w * 0.32;

    // Draw background energy field (glowing pulses)
    const glowScale = Math.sin(time * 3) * 0.15 + 0.95;
    const grad = ctx.createRadialGradient(x, y, 2, x, y, rad * 1.5 * glowScale);
    grad.addColorStop(0, "rgba(0, 229, 255, 0.25)");
    grad.addColorStop(0.5, "rgba(24, 255, 255, 0.08)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad * 1.8 * glowScale, 0, Math.PI * 2);
    ctx.fill();

    // Outer orbiting rings
    ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
    ctx.lineWidth = 1;
    
    // Ring 1
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 0.8);
    ctx.beginPath();
    ctx.ellipse(0, 0, rad * 1.3, rad * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Orbiting particle 1
    ctx.fillStyle = "#00E5FF";
    ctx.beginPath();
    ctx.arc(rad * 1.3, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Ring 2
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-time * 1.1 + Math.PI / 3);
    ctx.beginPath();
    ctx.ellipse(0, 0, rad * 1.3, rad * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Orbiting particle 2
    ctx.fillStyle = "#18FFFF";
    ctx.beginPath();
    ctx.arc(-rad * 1.3, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Central core - 3D glass cube layout representation
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 0.3);

    // Front/Back wireframe vertices
    const half = rad * 0.7;
    const points = [
      {x: -half, y: -half, z: -half},
      {x: half, y: -half, z: -half},
      {x: half, y: half, z: -half},
      {x: -half, y: half, z: -half},
      {x: -half, y: -half, z: half},
      {x: half, y: -half, z: half},
      {x: half, y: half, z: half},
      {x: -half, y: half, z: half}
    ];

    // Orthographic projection to 2D
    const angleX = 0.5; // pitch
    const angleY = 0.6; // yaw
    const projected = points.map(p => {
      // Rotate around Y
      let x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
      let z1 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
      // Rotate around X
      let y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
      return {x: x1, y: y2};
    });

    // Draw cube lines
    ctx.strokeStyle = "rgba(0, 229, 255, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00E5FF";

    const drawLine = (i, j) => {
      ctx.beginPath();
      ctx.moveTo(projected[i].x, projected[i].y);
      ctx.lineTo(projected[j].x, projected[j].y);
      ctx.stroke();
    };

    // Connections
    drawLine(0, 1); drawLine(1, 2); drawLine(2, 3); drawLine(3, 0); // back face
    drawLine(4, 5); drawLine(5, 6); drawLine(6, 7); drawLine(7, 4); // front face
    drawLine(0, 4); drawLine(1, 5); drawLine(2, 6); drawLine(3, 7); // interconnects

    // Center quantum core (highly glowing core)
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, half * 0.8);
    coreGrad.addColorStop(0, "#FFFFFF");
    coreGrad.addColorStop(0.4, "#00E5FF");
    coreGrad.addColorStop(1, "rgba(0, 229, 255, 0)");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, half * 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Fallback / Helper draw
  static drawGeneric(ctx, x, y, size, level) {
    ctx.fillStyle = "#555";
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    this.roundRect(ctx, x - size / 2, y - size / 2, size, size, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("L" + level, x, y);
  }

  // Rounded rectangle helper
  static roundRect(ctx, x, y, width, height, radius) {
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
  }

  // --- ERA 1: Máquinas Mecânicas ---
  
  // N1: Engrenagens
  static drawGear(ctx, x, y, size, time) {
    const rOuter = size * 0.4;
    const rInner = size * 0.15;
    const teeth = 8;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 2.0); // Spin!
    
    // Draw Teeth
    ctx.fillStyle = "#FFB74D"; // Brass
    ctx.strokeStyle = "#E65100";
    ctx.lineWidth = 2;
    
    for (let i = 0; i < teeth; i++) {
      ctx.rotate((Math.PI * 2) / teeth);
      ctx.beginPath();
      ctx.rect(-size * 0.08, -rOuter - size * 0.06, size * 0.16, size * 0.12);
      ctx.fill();
      ctx.stroke();
    }
    
    // Outer circle
    ctx.beginPath();
    ctx.arc(0, 0, rOuter, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Inner hole
    ctx.fillStyle = "#0B0D17"; // Grid bg color
    ctx.beginPath();
    ctx.arc(0, 0, rInner, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
  }

  // N2: Calculadora de Pascal
  static drawPascaline(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.55;
    const left = x - w / 2;
    const top = y - h / 2;

    // Wooden body
    ctx.fillStyle = "#8D6E63";
    ctx.strokeStyle = "#4E342E";
    ctx.lineWidth = 3;
    this.roundRect(ctx, left, top, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Brass metal top plate
    ctx.fillStyle = "#FFE082";
    ctx.strokeStyle = "#FFB300";
    ctx.lineWidth = 1.5;
    ctx.fillRect(left + 6, top + 6, w - 12, h - 12);
    ctx.strokeRect(left + 6, top + 6, w - 12, h - 12);

    // 4 spinning gears/dials
    const dialCount = 4;
    const gap = (w - 20) / (dialCount + 1);
    for (let i = 0; i < dialCount; i++) {
      const dx = left + 10 + (i + 1) * gap;
      const dy = y;
      
      // Dial wheel
      ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(time * 1.2 * (i % 2 === 0 ? 1 : -1));
      
      ctx.fillStyle = "#FFB300";
      ctx.strokeStyle = "#FF6F00";
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // spokes
      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        ctx.rotate(Math.PI / 3);
        ctx.moveTo(0, 0);
        ctx.lineTo(size * 0.12, 0);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // N3: Máquina Analítica (Steampunk gear machine)
  static drawAnalyticalEngine(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.9;
    const left = x - w / 2;
    const top = y - h / 2;

    // Heavy cast iron framing
    ctx.fillStyle = "#455A64";
    ctx.strokeStyle = "#37474F";
    ctx.lineWidth = 3;
    this.roundRect(ctx, left, top, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Brass core
    ctx.fillStyle = "#FFB300";
    ctx.fillRect(left + 10, top + 10, w - 20, h - 20);

    // Drawing interlocking gears
    ctx.save();
    // Gear A
    ctx.translate(x - w * 0.22, y - h * 0.22);
    ctx.rotate(time * 1.5);
    this.drawGearShape(ctx, size * 0.22, 10, "#FFD54F");
    ctx.restore();

    ctx.save();
    // Gear B (interlocking)
    ctx.translate(x + w * 0.22, y - h * 0.22);
    ctx.rotate(-time * 1.5 + 0.2);
    this.drawGearShape(ctx, size * 0.22, 10, "#FFD54F");
    ctx.restore();

    ctx.save();
    // Gear C (middle large)
    ctx.translate(x, y + h * 0.15);
    ctx.rotate(time * 0.8);
    this.drawGearShape(ctx, size * 0.32, 12, "#FFE082");
    ctx.restore();

    // Punch cards hanging out of the slots
    ctx.fillStyle = "#D7CCC8";
    ctx.strokeStyle = "#8D6E63";
    ctx.lineWidth = 1;
    ctx.fillRect(left + w * 0.15, top + h * 0.72, w * 0.7, h * 0.18);
    ctx.strokeRect(left + w * 0.15, top + h * 0.72, w * 0.7, h * 0.18);

    // Punch card holes
    ctx.fillStyle = "#3E2723";
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 2; r++) {
        if ((c + r) % 2 === 0) {
          ctx.fillRect(left + w * 0.25 + c * 10, top + h * 0.76 + r * 6, 4, 3);
        }
      }
    }
  }

  // Gear drawing helper
  static drawGearShape(ctx, radius, teeth, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    
    for (let i = 0; i < teeth; i++) {
      ctx.rotate((Math.PI * 2) / teeth);
      ctx.beginPath();
      ctx.rect(-radius * 0.16, -radius - radius * 0.15, radius * 0.32, radius * 0.3);
      ctx.fill();
      ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- ERA 2: Computadores Eletrônicos ---

  // N1: Válvula a Vácuo (Vacuum Tube)
  static drawVacuumTube(ctx, x, y, size, time) {
    ctx.save();
    // Base connector
    ctx.fillStyle = "#37474F";
    ctx.strokeStyle = "#263238";
    ctx.lineWidth = 2;
    ctx.fillRect(x - size * 0.2, y + size * 0.25, size * 0.4, size * 0.15);
    ctx.strokeRect(x - size * 0.2, y + size * 0.25, size * 0.4, size * 0.15);

    // Pins
    ctx.fillStyle = "#CFD8DC";
    ctx.fillRect(x - size * 0.1, y + size * 0.4, size * 0.05, size * 0.08);
    ctx.fillRect(x + size * 0.05, y + size * 0.4, size * 0.05, size * 0.08);

    // Glass bulb outline
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.strokeStyle = "#ECEFF1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.05, size * 0.25, Math.PI, 0, false);
    ctx.lineTo(x + size * 0.25, y + size * 0.25);
    ctx.lineTo(x - size * 0.25, y + size * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Filament (animated pulse)
    const glowVal = Math.sin(time * 5.0) * 0.3 + 0.7;
    ctx.strokeStyle = `rgba(255, 87, 34, ${glowVal})`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FF5722";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.06, y + size * 0.25);
    ctx.lineTo(x - size * 0.06, y - size * 0.08);
    ctx.lineTo(x, y - size * 0.16);
    ctx.lineTo(x + size * 0.06, y - size * 0.08);
    ctx.lineTo(x + size * 0.06, y + size * 0.25);
    ctx.stroke();

    ctx.restore();
  }

  // N2: Painel de Distribuição (Panel of 4 blinking valves)
  static drawValvePanel(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.9;
    const left = x - w / 2;
    const top = y - h / 2;

    // Cabinet backing
    ctx.fillStyle = "#2D323E";
    ctx.strokeStyle = "#4D5361";
    ctx.lineWidth = 2.5;
    this.roundRect(ctx, left, top, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Dark inset
    ctx.fillStyle = "#11141A";
    ctx.fillRect(left + 6, top + 6, w - 12, h - 12);

    // 4 mini vacuum tubes in grid
    const cols = 2;
    const rows = 2;
    const gapX = (w - 12) / cols;
    const gapY = (h - 12) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tx = left + 6 + c * gapX + gapX / 2;
        const ty = top + 6 + r * gapY + gapY / 2;
        
        // Render small vacuum tube
        this.drawVacuumTube(ctx, tx, ty - 6, size * 0.48, time + (r * 2 + c) * 0.5);
      }
    }
  }

  // --- ERA 3: Circuitos Integrados ---

  // N1: Circuito Integrado (IC Chip DIP)
  static drawICChip(ctx, x, y, size, time) {
    const w = size * 0.8;
    const h = size * 0.45;
    const left = x - w / 2;
    const top = y - h / 2;

    ctx.save();
    // Metal pins on the sides
    ctx.fillStyle = "#CFD8DC";
    const pinsCount = 6;
    const pinGap = w / (pinsCount + 1);

    for (let i = 0; i < pinsCount; i++) {
      const px = left + (i + 1) * pinGap;
      // Top pins
      ctx.fillRect(px - size * 0.03, top - size * 0.08, size * 0.06, size * 0.09);
      // Bottom pins
      ctx.fillRect(px - size * 0.03, top + h - 0.01, size * 0.06, size * 0.09);
    }

    // Black main body
    ctx.fillStyle = "#263238";
    ctx.strokeStyle = "#455A64";
    ctx.lineWidth = 2.5;
    this.roundRect(ctx, left, top, w, h, 4);
    ctx.fill();
    ctx.stroke();

    // Center indentation notch (DIP indicator)
    ctx.fillStyle = "#37474F";
    ctx.beginPath();
    ctx.arc(left, y, size * 0.08, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    // Golden dot pin 1 marker
    ctx.fillStyle = "#FFD54F";
    ctx.beginPath();
    ctx.arc(left + pinGap, top + h - size * 0.08, size * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Subtle laser etching text
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.font = `bold ${Math.floor(size * 0.08)}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("TI-7400", x, y);

    ctx.restore();
  }

  // N2: Placa Lógica de Silício
  static drawLogicBoard(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.9;
    const left = x - w / 2;
    const top = y - h / 2;

    // Green PCB
    ctx.fillStyle = "#1B5E20";
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 3;
    this.roundRect(ctx, left, top, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Draw tracks (circuit copper lines)
    ctx.strokeStyle = "rgba(255,235,59,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(left + 15, top + 15);
    ctx.lineTo(left + w - 15, top + 15);
    ctx.lineTo(left + w - 15, y - 5);
    ctx.lineTo(x, y - 5);
    ctx.lineTo(x, top + h - 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(left + 15, top + h - 15);
    ctx.lineTo(left + 15, y + 10);
    ctx.lineTo(left + w - 15, y + 10);
    ctx.stroke();

    // Draw capacitors (small circles)
    ctx.fillStyle = "#4FC3F7"; // light blue caps
    ctx.beginPath();
    ctx.arc(left + 25, top + 25, size * 0.06, 0, Math.PI * 2);
    ctx.arc(left + w - 25, top + h - 25, size * 0.06, 0, Math.PI * 2);
    ctx.fill();

    // Resistors
    ctx.fillStyle = "#A1887F";
    ctx.fillRect(left + 18, y - 16, w * 0.15, h * 0.05);

    // Draw two logic IC chips
    this.drawICChip(ctx, x, y - size * 0.15, size * 0.52, time);
    this.drawICChip(ctx, x, y + size * 0.22, size * 0.52, time);
  }

  // N3: Apollo Guidance Computer Console (DSKY console interface)
  static drawApolloGuidance(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.9;
    const left = x - w / 2;
    const top = y - h / 2;

    // Metal gray chassis
    ctx.fillStyle = "#B0BEC5";
    ctx.strokeStyle = "#78909C";
    ctx.lineWidth = 3;
    this.roundRect(ctx, left, top, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Top Segment Display Screen
    ctx.fillStyle = "#101010";
    ctx.fillRect(left + 8, top + 8, w - 16, h * 0.45);

    // DSKY labels and status indicators
    ctx.fillStyle = "#FFB300"; // orange digit colors
    ctx.font = `bold ${Math.floor(size * 0.09)}px 'Orbitron', monospace`;
    ctx.textAlign = "right";
    
    // Status text (Comp Activity, Program, Verb, Noun)
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(left + 14, top + 14, 12, 12); // Comp act light blinking
    
    const active = Math.sin(time * 6.0) > 0;
    if (active) {
      ctx.fillStyle = "rgba(76, 175, 80, 0.4)";
      ctx.fillRect(left + 14, top + 14, 12, 12);
    }
    
    ctx.fillStyle = "#FFB300";
    ctx.fillText("PROG   06", left + w - 16, top + 26);
    ctx.fillText("VERB   37", left + w - 16, top + 52);
    ctx.fillText("NOUN   88", left + w - 16, top + 78);

    // Keyboard keys grid (at the bottom)
    const keyRows = 3;
    const keyCols = 4;
    const kw = (w - 24) / keyCols;
    const kh = (h * 0.42) / keyRows;

    for (let r = 0; r < keyRows; r++) {
      for (let c = 0; c < keyCols; c++) {
        const kx = left + 12 + c * kw;
        const ky = top + h * 0.5 + r * kh;
        
        ctx.fillStyle = "#37474F";
        ctx.fillRect(kx + 2, ky + 2, kw - 4, kh - 4);
        
        // white keycap letters
        ctx.fillStyle = "#FFF";
        ctx.font = `bold ${Math.floor(size * 0.05)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        let label = "KEY";
        if (r === 0 && c === 0) label = "VERB";
        else if (r === 0 && c === 1) label = "NOUN";
        else if (r === 0 && c === 2) label = "CLR";
        else if (r === 0 && c === 3) label = "PRO";
        else if (r === 2 && c === 3) label = "ENTR";
        else label = `${(r * keyCols + c) % 10}`;

        ctx.fillText(label, kx + kw / 2, ky + kh / 2);
      }
    }
  }

  // --- ERA 4: Revolução do Microprocessador ---

  // N1: Intel 4004 (Dual-in-line gold-cap microprocessor)
  static drawIntel4004(ctx, x, y, size, time) {
    const w = size * 0.85;
    const h = size * 0.42;
    const left = x - w / 2;
    const top = y - h / 2;

    ctx.save();
    // Silver pins
    ctx.fillStyle = "#B0BEC5";
    const pinsCount = 8;
    const pinGap = w / (pinsCount + 1);

    for (let i = 0; i < pinsCount; i++) {
      const px = left + (i + 1) * pinGap;
      ctx.fillRect(px - size * 0.02, top - size * 0.07, size * 0.04, size * 0.08);
      ctx.fillRect(px - size * 0.02, top + h - 0.01, size * 0.04, size * 0.08);
    }

    // Grey ceramic body
    ctx.fillStyle = "#CFD8DC";
    ctx.strokeStyle = "#90A4AE";
    ctx.lineWidth = 2;
    this.roundRect(ctx, left, top, w, h, 3);
    ctx.fill();
    ctx.stroke();

    // Center Gold cap/die
    ctx.fillStyle = "#FFD54F";
    ctx.strokeStyle = "#FFB300";
    ctx.lineWidth = 1.5;
    ctx.fillRect(x - w * 0.2, top + h * 0.15, w * 0.4, h * 0.7);
    ctx.strokeRect(x - w * 0.2, top + h * 0.15, w * 0.4, h * 0.7);

    // Intel logo-like text etching
    ctx.fillStyle = "#0D47A1";
    ctx.font = `italic bold ${Math.floor(size * 0.06)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("intel 4004", x, y);

    ctx.restore();
  }

  // N2: Placa-Mãe Antiga
  static drawMotherboard(ctx, x, y, size, time) {
    const w = size * 0.9;
    const h = size * 0.9;
    const left = x - w / 2;
    const top = y - h / 2;

    // Cyan/Dark blue PCB board
    ctx.fillStyle = "#006064";
    ctx.strokeStyle = "#004d40";
    ctx.lineWidth = 3;
    this.roundRect(ctx, left, top, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Draw copper tracks
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.moveTo(left + 15 + i * 8, top + 15);
      ctx.lineTo(left + 15 + i * 8, top + h - 15);
    }
    ctx.stroke();

    // Socket for CPU (white grid)
    ctx.fillStyle = "#ECEFF1";
    ctx.fillRect(left + 15, y - size * 0.25, size * 0.4, size * 0.4);

    // Ram Slots (long slots on the side)
    ctx.fillStyle = "#000";
    ctx.fillRect(left + w - 24, top + 15, 6, h - 30);
    ctx.fillRect(left + w - 14, top + 15, 6, h - 30);
    
    // Ram sticks
    ctx.fillStyle = "#2E7D32";
    ctx.fillRect(left + w - 23, top + 25, 4, h - 50);
    ctx.fillRect(left + w - 13, top + 25, 4, h - 50);

    // CPU chip in socket (the 4004)
    this.drawIntel4004(ctx, left + 15 + size * 0.2, y - size * 0.05, size * 0.38, time);
  }

  // --- ERA 5: Computação Pessoal Portátil ---

  // N1: Componentes Compactos (SMD components and small sensor chip)
  static drawCompactComponents(ctx, x, y, size, time) {
    const w = size * 0.8;
    const h = size * 0.8;
    const left = x - w / 2;
    const top = y - h / 2;

    // Tiny blue system board
    ctx.fillStyle = "#1565C0";
    ctx.strokeStyle = "#0D47A1";
    ctx.lineWidth = 2;
    this.roundRect(ctx, left, top, w, h, 4);
    ctx.fill();
    ctx.stroke();

    // Draw little surface mount chips
    // Chip A
    ctx.fillStyle = "#000";
    ctx.fillRect(left + 8, top + 8, w * 0.35, h * 0.35);
    ctx.fillStyle = "#ECEFF1";
    ctx.fillRect(left + 10, top + 10, 4, 4); // pin 1 marker

    // Chip B (flat package)
    ctx.fillStyle = "#37474F";
    ctx.fillRect(left + w - 26, top + h - 26, 18, 18);

    // Silver capacitors
    ctx.fillStyle = "#B0BEC5";
    ctx.fillRect(left + w * 0.6, top + 12, 10, 6);
    ctx.fillStyle = "#D7CCC8"; // tantalum brown cap
    ctx.fillRect(left + 12, top + h * 0.6, 12, 8);
  }

  // N2: Celular Tijolão (Retro brick phone)
  static drawBrickPhone(ctx, x, y, size, time) {
    const w = size * 0.45;
    const h = size * 0.95;
    const left = x - w / 2;
    const top = y - h / 2;

    ctx.save();
    // Antenna
    ctx.fillStyle = "#000";
    ctx.fillRect(left + 8, top - size * 0.2, 4, size * 0.2);

    // Phone plastic body
    ctx.fillStyle = "#37474F";
    ctx.strokeStyle = "#263238";
    ctx.lineWidth = 2.5;
    this.roundRect(ctx, left, top, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Small LCD screen bezel
    ctx.fillStyle = "#CFD8DC";
    ctx.fillRect(left + 4, top + 8, w - 8, h * 0.2);

    // Screen text (Green background)
    ctx.fillStyle = "#9CCC65";
    ctx.fillRect(left + 6, top + 10, w - 12, h * 0.2 - 4);
    
    // Small pixel text representation
    ctx.fillStyle = "#1B5E20";
    ctx.fillRect(left + 10, top + 16, w - 20, 2);
    ctx.fillRect(left + 10, top + 21, w - 24, 2);

    // Keypad keys grid
    const keyRows = 4;
    const keyCols = 3;
    const kw = (w - 12) / keyCols;
    const kh = (h * 0.5) / keyRows;

    for (let r = 0; r < keyRows; r++) {
      for (let c = 0; c < keyCols; c++) {
        const kx = left + 6 + c * kw;
        const ky = top + h * 0.35 + r * kh;
        
        ctx.fillStyle = "#B0BEC5";
        ctx.fillRect(kx + 1, ky + 1, kw - 2, kh - 2);
      }
    }

    ctx.restore();
  }

  // --- ERA 6: Computação Ubíqua e Futuro ---

  // N1: SoC Avançado (Glowing mobile system-on-chip)
  static drawSoC(ctx, x, y, size, time) {
    const w = size * 0.85;
    const h = size * 0.85;
    const left = x - w / 2;
    const top = y - h / 2;

    ctx.save();
    // Metal base
    ctx.fillStyle = "#212121";
    ctx.strokeStyle = "#424242";
    ctx.lineWidth = 2;
    this.roundRect(ctx, left, top, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Center metallic lid
    ctx.fillStyle = "#2D3033";
    this.roundRect(ctx, left + 8, top + 8, w - 16, h - 16, 4);
    ctx.fill();

    // Glowing laser tracks (representing futuristic high-speed buses)
    const intensity = Math.sin(time * 6.0) * 0.25 + 0.75;
    ctx.strokeStyle = `rgba(0, 229, 255, ${intensity})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00E5FF";
    ctx.lineWidth = 1.5;

    // Draw symmetric glowing circuit design
    ctx.beginPath();
    ctx.moveTo(left + 16, top + 16);
    ctx.lineTo(x, y);
    ctx.lineTo(left + w - 16, top + 16);
    ctx.moveTo(left + 16, top + h - 16);
    ctx.lineTo(x, y);
    ctx.lineTo(left + w - 16, top + h - 16);
    ctx.stroke();

    // Center silicon die core
    ctx.fillStyle = "#1A1D20";
    ctx.shadowBlur = 0; // reset shadow for core fill
    ctx.fillRect(x - 12, y - 12, 24, 24);

    ctx.fillStyle = "#00E5FF";
    ctx.font = `bold ${Math.floor(size * 0.07)}px 'Orbitron', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BIONIC", x, y);

    ctx.restore();
  }

  // N2: Células Lógicas Quânticas (Quantum entanglement nodes)
  static drawQuantumCells(ctx, x, y, size, time) {
    const r = size * 0.35;

    ctx.save();
    // Draw background energy field (glowing pulses)
    const innerGlow = ctx.createRadialGradient(x, y, 0, x, y, r * 1.5);
    innerGlow.addColorStop(0, "rgba(24, 255, 255, 0.15)");
    innerGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Nodes coordinate list
    const nodes = [
      { dx: -r * 0.8, dy: -r * 0.6 },
      { dx: r * 0.8, dy: -r * 0.5 },
      { dx: -r * 0.3, dy: r * 0.7 },
      { dx: r * 0.5, dy: r * 0.8 },
      { dx: 0, dy: -r * 0.1 }
    ];

    // Draw connection waves/lines
    ctx.strokeStyle = "rgba(0, 229, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        ctx.moveTo(x + nodes[i].dx, y + nodes[i].dy);
        ctx.lineTo(x + nodes[j].dx, y + nodes[j].dy);
      }
    }
    ctx.stroke();

    // Draw glowing nodes (orbiting / vibrating slightly)
    nodes.forEach((node, idx) => {
      const vibX = Math.sin(time * 4.0 + idx) * 3;
      const vibY = Math.cos(time * 3.5 + idx) * 3;
      const nx = x + node.dx + vibX;
      const ny = y + node.dy + vibY;

      ctx.fillStyle = idx === 4 ? "#FFF" : "#00E5FF";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#00E5FF";
      ctx.beginPath();
      ctx.arc(nx, ny, idx === 4 ? 4.5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }
}
