// Premium face filters — all use landmarks for precise anchoring
// face = { x, y, width, height, landmarks: { leftEye, rightEye, nose, mouth }, roll }

export const PREMIUM_FILTERS = [
  // ── 1. GOLDEN BUTTERFLY ────────────────────────────────────────────────────
  {
    id: 'butterfly',
    name: 'Butterfly',
    emoji: '🦋',
    category: 'face',
    premium: true,
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h, landmarks: lm, roll = 0 } = face;
      const cx = x + w / 2;
      const eyeMidX = lm ? (lm.leftEye.x + lm.rightEye.x) / 2 : cx;
      const eyeMidY = lm ? (lm.leftEye.y + lm.rightEye.y) / 2 : y + h * 0.36;

      ctx.save();
      ctx.translate(eyeMidX, eyeMidY);
      ctx.rotate(roll);

      const t = Date.now() / 800;
      const flapAngle = Math.sin(t * 3) * 0.18;
      const wingW = w * 0.72, wingH = h * 0.38;

      // Left wing
      ctx.save();
      ctx.scale(-1 - Math.abs(flapAngle), 1);
      const lgL = ctx.createRadialGradient(-wingW * 0.35, -wingH * 0.1, 0, -wingW * 0.35, 0, wingW * 0.5);
      lgL.addColorStop(0, 'rgba(255,210,0,0.85)');
      lgL.addColorStop(0.5, 'rgba(255,140,0,0.65)');
      lgL.addColorStop(1, 'rgba(200,0,120,0.0)');
      ctx.fillStyle = lgL;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-wingW * 0.1, -wingH * 0.6, -wingW * 0.7, -wingH * 0.55, -wingW, -wingH * 0.1);
      ctx.bezierCurveTo(-wingW * 0.8, wingH * 0.3, -wingW * 0.2, wingH * 0.2, 0, wingH * 0.08);
      ctx.fill();
      ctx.strokeStyle = 'rgba(180,80,0,0.4)';
      ctx.lineWidth = Math.max(1, w * 0.004);
      ctx.stroke();
      ctx.restore();

      // Right wing
      ctx.save();
      ctx.scale(1 + Math.abs(flapAngle), 1);
      const lgR = ctx.createRadialGradient(wingW * 0.35, -wingH * 0.1, 0, wingW * 0.35, 0, wingW * 0.5);
      lgR.addColorStop(0, 'rgba(255,210,0,0.85)');
      lgR.addColorStop(0.5, 'rgba(255,140,0,0.65)');
      lgR.addColorStop(1, 'rgba(200,0,120,0.0)');
      ctx.fillStyle = lgR;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(wingW * 0.1, -wingH * 0.6, wingW * 0.7, -wingH * 0.55, wingW, -wingH * 0.1);
      ctx.bezierCurveTo(wingW * 0.8, wingH * 0.3, wingW * 0.2, wingH * 0.2, 0, wingH * 0.08);
      ctx.fill();
      ctx.strokeStyle = 'rgba(180,80,0,0.4)';
      ctx.lineWidth = Math.max(1, w * 0.004);
      ctx.stroke();
      ctx.restore();

      // Wing dots
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      const dotR = w * 0.022;
      [[-wingW * 0.5, -wingH * 0.2], [-wingW * 0.3, wingH * 0.05],
       [wingW * 0.5, -wingH * 0.2],  [wingW * 0.3, wingH * 0.05]].forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.arc(dx, dy, dotR, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    }
  },

  // ── 2. NEON GLOW ──────────────────────────────────────────────────────────
  {
    id: 'neon_face',
    name: 'Neon',
    emoji: '🌈',
    category: 'face',
    premium: true,
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h, landmarks: lm, roll = 0 } = face;
      const cx = x + w / 2;
      const t = Date.now() / 1000;

      // Animated rainbow hue
      const hue = (t * 60) % 360;

      // Neon outline around face
      ctx.save();
      ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;
      ctx.shadowBlur = w * 0.08;
      ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
      ctx.lineWidth = Math.max(2, w * 0.012);
      ctx.beginPath();
      ctx.ellipse(cx, y + h * 0.5, w * 0.46, h * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Neon eyes
      if (lm) {
        [lm.leftEye, lm.rightEye].forEach((eye, i) => {
          const eyeHue = (hue + i * 60) % 360;
          ctx.save();
          ctx.shadowColor = `hsl(${eyeHue}, 100%, 55%)`;
          ctx.shadowBlur = w * 0.05;
          ctx.strokeStyle = `hsl(${eyeHue}, 100%, 75%)`;
          ctx.lineWidth = Math.max(1.5, w * 0.008);
          ctx.beginPath();
          ctx.ellipse(eye.x, eye.y, w * 0.08, h * 0.05, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });
      }

      // Neon sparkle particles
      const sparkCount = 8;
      ctx.font = `${Math.max(8, w * 0.06)}px serif`;
      ctx.textAlign = 'center';
      for (let i = 0; i < sparkCount; i++) {
        const angle = (t * 0.7 + i / sparkCount * Math.PI * 2);
        const radius = w * (0.55 + Math.sin(t * 2 + i) * 0.06);
        const px = cx + Math.cos(angle) * radius;
        const py = (y + h * 0.5) + Math.sin(angle) * (h * 0.52);
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 3 + i);
        ctx.fillText('✦', px, py);
      }
      ctx.globalAlpha = 1;
    }
  },

  // ── 3. FLOWER CROWN ───────────────────────────────────────────────────────
  {
    id: 'flower_crown',
    name: 'Florals',
    emoji: '🌸',
    category: 'face',
    premium: true,
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h, landmarks: lm, roll = 0 } = face;
      const cx = lm ? (lm.leftEye.x + lm.rightEye.x) / 2 : x + w / 2;
      const topY = y - h * 0.04;

      ctx.save();
      ctx.translate(cx, topY);
      ctx.rotate(roll);

      // Vine / stem
      ctx.strokeStyle = '#2d7a2d';
      ctx.lineWidth = Math.max(2, w * 0.013);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-w * 0.48, h * 0.04);
      ctx.bezierCurveTo(-w * 0.35, -h * 0.08, -w * 0.15, -h * 0.12, 0, -h * 0.1);
      ctx.bezierCurveTo(w * 0.15, -h * 0.12, w * 0.35, -h * 0.08, w * 0.48, h * 0.04);
      ctx.stroke();

      const flowers = [
        { dx: -w * 0.46, dy: h * 0.02, size: 0.11, color: '#ff6eb4', center: '#fff200' },
        { dx: -w * 0.3,  dy:-h * 0.1,  size: 0.09, color: '#ff4fa3', center: '#fff200' },
        { dx: -w * 0.14, dy:-h * 0.13, size: 0.1,  color: '#c77dff', center: '#fff176' },
        { dx:  0,         dy:-h * 0.12, size: 0.12, color: '#ff6eb4', center: '#fff200' },
        { dx:  w * 0.14, dy:-h * 0.13, size: 0.1,  color: '#ff9a3c', center: '#fff176' },
        { dx:  w * 0.3,  dy:-h * 0.1,  size: 0.09, color: '#ff4fa3', center: '#fff200' },
        { dx:  w * 0.46, dy: h * 0.02, size: 0.11, color: '#c77dff', center: '#fff200' },
      ];

      const t = Date.now() / 2000;
      flowers.forEach(({ dx, dy, size, color, center }, i) => {
        const r = w * size;
        const bob = Math.sin(t * 2 + i * 0.9) * h * 0.008;
        ctx.save();
        ctx.translate(dx, dy + bob);
        // Petals
        for (let p = 0; p < 5; p++) {
          const angle = (p / 5) * Math.PI * 2;
          ctx.save();
          ctx.rotate(angle);
          const petalGrad = ctx.createRadialGradient(0, -r * 0.5, 0, 0, -r, r * 0.6);
          petalGrad.addColorStop(0, color);
          petalGrad.addColorStop(1, color + '99');
          ctx.fillStyle = petalGrad;
          ctx.beginPath();
          ctx.ellipse(0, -r * 0.65, r * 0.35, r * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // Center
        ctx.fillStyle = center;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Leaves
      ctx.fillStyle = '#3a9a3a';
      [[-w * 0.38, -h * 0.04], [w * 0.38, -h * 0.04]].forEach(([lx, ly], i) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(i === 0 ? -0.5 : 0.5);
        ctx.beginPath();
        ctx.ellipse(0, 0, w * 0.06, h * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
    }
  },

  // ── 4. GALAXY / SPACE ─────────────────────────────────────────────────────
  {
    id: 'galaxy',
    name: 'Galaxy',
    emoji: '🌌',
    category: 'face',
    premium: true,
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h, landmarks: lm } = face;
      const cx = x + w / 2, cy = y + h * 0.5;
      const t  = Date.now() / 1000;

      // Subtle galaxy overlay on face
      const gal = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.5);
      gal.addColorStop(0,   'rgba(60,0,120,0.0)');
      gal.addColorStop(0.5, 'rgba(60,0,120,0.18)');
      gal.addColorStop(1,   'rgba(0,0,60,0.35)');
      ctx.fillStyle = gal;
      ctx.fillRect(x - w * 0.05, y - h * 0.05, w * 1.1, h * 1.1);

      // Orbiting stars
      const starCount = 12;
      for (let i = 0; i < starCount; i++) {
        const angle  = (t * 0.4 + i / starCount * Math.PI * 2);
        const orbit  = w * (0.52 + (i % 3) * 0.06);
        const orbitY = h * (0.48 + (i % 3) * 0.055);
        const px = cx + Math.cos(angle) * orbit;
        const py = cy + Math.sin(angle) * orbitY;
        const sz = Math.max(1, w * 0.012) * (0.6 + 0.4 * Math.sin(t * 2 + i));
        ctx.fillStyle = `hsla(${200 + i * 15}, 100%, 80%, ${0.5 + 0.5 * Math.sin(t * 3 + i)})`;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fill();
      }

      // Star eyes
      if (lm) {
        [lm.leftEye, lm.rightEye].forEach(eye => {
          const starGrad = ctx.createRadialGradient(eye.x, eye.y, 0, eye.x, eye.y, w * 0.1);
          starGrad.addColorStop(0, 'rgba(160,80,255,0.8)');
          starGrad.addColorStop(1, 'rgba(80,0,200,0)');
          ctx.fillStyle = starGrad;
          ctx.beginPath();
          ctx.ellipse(eye.x, eye.y, w * 0.1, h * 0.07, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Comet
      const cometAngle = (t * 1.2) % (Math.PI * 2);
      const cometX = cx + Math.cos(cometAngle) * w * 0.58;
      const cometY = cy + Math.sin(cometAngle) * h * 0.55;
      const tailLen = w * 0.18;
      const comet = ctx.createLinearGradient(
        cometX, cometY,
        cometX - Math.cos(cometAngle) * tailLen,
        cometY - Math.sin(cometAngle) * tailLen
      );
      comet.addColorStop(0, 'rgba(255,255,255,0.9)');
      comet.addColorStop(1, 'rgba(100,100,255,0)');
      ctx.strokeStyle = comet;
      ctx.lineWidth = Math.max(1, w * 0.008);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cometX, cometY);
      ctx.lineTo(cometX - Math.cos(cometAngle) * tailLen, cometY - Math.sin(cometAngle) * tailLen);
      ctx.stroke();
    }
  },

  // ── 5. VAMPIRE ────────────────────────────────────────────────────────────
  {
    id: 'vampire',
    name: 'Vampire',
    emoji: '🧛',
    category: 'face',
    premium: true,
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h, landmarks: lm, roll = 0 } = face;
      const cx = x + w / 2;
      const lw = Math.max(1, w * 0.006);

      // Dark cape collar
      const capeY = y + h * 0.88;
      const capeGrad = ctx.createLinearGradient(cx - w * 0.6, capeY, cx + w * 0.6, capeY + h * 0.35);
      capeGrad.addColorStop(0, '#1a0010');
      capeGrad.addColorStop(0.5, '#3d0020');
      capeGrad.addColorStop(1, '#1a0010');
      ctx.fillStyle = capeGrad;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.6, capeY);
      ctx.bezierCurveTo(cx - w * 0.4, capeY - h * 0.08, cx - w * 0.15, capeY + h * 0.1, cx, capeY);
      ctx.bezierCurveTo(cx + w * 0.15, capeY + h * 0.1, cx + w * 0.4, capeY - h * 0.08, cx + w * 0.6, capeY);
      ctx.lineTo(cx + w * 0.7, capeY + h * 0.4);
      ctx.lineTo(cx - w * 0.7, capeY + h * 0.4);
      ctx.closePath();
      ctx.fill();

      // Fangs
      if (lm) {
        const mouthX = lm.mouth.x, mouthY = lm.mouth.y;
        const fangW = w * 0.045, fangH = h * 0.085;
        ctx.fillStyle = '#FAFAFA';
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = lw * 0.5;
        // Left fang
        ctx.beginPath();
        ctx.moveTo(mouthX - w * 0.06, mouthY - fangH * 0.1);
        ctx.lineTo(mouthX - w * 0.06 - fangW * 0.5, mouthY + fangH);
        ctx.lineTo(mouthX - w * 0.06 + fangW * 0.5, mouthY + fangH * 0.3);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Right fang
        ctx.beginPath();
        ctx.moveTo(mouthX + w * 0.06, mouthY - fangH * 0.1);
        ctx.lineTo(mouthX + w * 0.06 - fangW * 0.5, mouthY + fangH * 0.3);
        ctx.lineTo(mouthX + w * 0.06 + fangW * 0.5, mouthY + fangH);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Blood drip
        const t = Date.now() / 1000;
        const dripProgress = (Math.sin(t * 0.8) * 0.5 + 0.5);
        ctx.fillStyle = '#cc0000';
        ctx.beginPath();
        ctx.ellipse(mouthX - w * 0.055, mouthY + fangH * 1.1 + dripProgress * h * 0.06,
          w * 0.018, h * 0.016 * (1 + dripProgress * 0.5), 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Red glowing eyes
      if (lm) {
        [lm.leftEye, lm.rightEye].forEach(eye => {
          const glow = ctx.createRadialGradient(eye.x, eye.y, 0, eye.x, eye.y, w * 0.1);
          glow.addColorStop(0, 'rgba(255,0,0,0.9)');
          glow.addColorStop(0.4, 'rgba(200,0,0,0.5)');
          glow.addColorStop(1, 'rgba(150,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.ellipse(eye.x, eye.y, w * 0.1, h * 0.07, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Widow's peak hairline (dark)
      ctx.fillStyle = 'rgba(10,0,20,0.65)';
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.48, y - h * 0.02);
      ctx.lineTo(cx - w * 0.32, y + h * 0.04);
      ctx.lineTo(cx,             y - h * 0.1);
      ctx.lineTo(cx + w * 0.32, y + h * 0.04);
      ctx.lineTo(cx + w * 0.48, y - h * 0.02);
      ctx.lineTo(cx + w * 0.5, y - h * 0.18);
      ctx.lineTo(cx,            y - h * 0.22);
      ctx.lineTo(cx - w * 0.5, y - h * 0.18);
      ctx.closePath(); ctx.fill();
    }
  },

  // ── 6. GLITTER MAKEUP ────────────────────────────────────────────────────
  {
    id: 'glitter',
    name: 'Glitter',
    emoji: '💫',
    category: 'face',
    premium: true,
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h, landmarks: lm } = face;
      const t = Date.now() / 400;

      if (!lm) return;

      // Glitter eye shadow
      [{ eye: lm.leftEye, hue: 260 }, { eye: lm.rightEye, hue: 300 }].forEach(({ eye, hue }) => {
        const shadow = ctx.createRadialGradient(eye.x, eye.y - h * 0.025, 0, eye.x, eye.y, w * 0.14);
        shadow.addColorStop(0, `hsla(${hue},100%,70%,0.75)`);
        shadow.addColorStop(1, `hsla(${hue},100%,60%,0)`);
        ctx.fillStyle = shadow;
        ctx.beginPath();
        ctx.ellipse(eye.x, eye.y - h * 0.02, w * 0.14, h * 0.07, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Glitter sparkles on cheeks and eyes
      const sparkles = 20;
      for (let i = 0; i < sparkles; i++) {
        const side = i < sparkles / 2 ? -1 : 1;
        const baseX = x + w * (side < 0 ? 0.22 : 0.78);
        const baseY = y + h * 0.58;
        const px = baseX + Math.sin(i * 2.3 + t * 0.5) * w * 0.1;
        const py = baseY + Math.cos(i * 1.7 + t * 0.4) * h * 0.07;
        const sparkHue = (i * 20 + t * 30) % 360;
        const alpha = 0.5 + 0.5 * Math.sin(t * 2 + i);
        ctx.fillStyle = `hsla(${sparkHue}, 100%, 75%, ${alpha})`;
        const sr = Math.max(1, w * 0.012);
        ctx.beginPath();
        ctx.arc(px, py, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lip gloss
      const mouthX = lm.mouth.x, mouthY = lm.mouth.y;
      const lipGloss = ctx.createRadialGradient(mouthX, mouthY - h * 0.01, 0, mouthX, mouthY, w * 0.14);
      lipGloss.addColorStop(0, 'rgba(255,100,150,0.5)');
      lipGloss.addColorStop(0.6, 'rgba(220,50,100,0.3)');
      lipGloss.addColorStop(1, 'rgba(180,0,60,0)');
      ctx.fillStyle = lipGloss;
      ctx.beginPath();
      ctx.ellipse(mouthX, mouthY, w * 0.14, h * 0.055, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lip shine
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.ellipse(mouthX - w * 0.03, mouthY - h * 0.015, w * 0.04, h * 0.016, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  },
];