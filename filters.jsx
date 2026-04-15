// Filter definitions
// drawOnFace receives a `face` object in offscreen canvas pixel space:
// { x, y, width: w, height: h, landmarks: { leftEye, rightEye, nose, mouth }, roll }
//
// KEY ANATOMY ANCHORS (as fractions of face height from face.y):
//   eyes   ≈ 0.35 * h
//   nose   ≈ 0.55 * h
//   mouth  ≈ 0.72 * h
//   top of head ≈ y - 0.1*h  (hair/crown zone)

export const FILTERS = [
  {
    id: 'none',
    name: 'Normal',
    emoji: '📷',
    category: 'basic',
    apply: () => {}
  },
  {
    id: 'warm',
    name: 'Warm',
    emoji: '🌅',
    category: 'color',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     = Math.min(255, d.data[i] + 25);
        d.data[i + 1] = Math.min(255, d.data[i + 1] + 10);
        d.data[i + 2] = Math.max(0,   d.data[i + 2] - 15);
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'cool',
    name: 'Cool',
    emoji: '❄️',
    category: 'color',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     = Math.max(0,   d.data[i] - 15);
        d.data[i + 1] = Math.min(255, d.data[i + 1] + 5);
        d.data[i + 2] = Math.min(255, d.data[i + 2] + 30);
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    emoji: '📼',
    category: 'color',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const r = d.data[i], g = d.data[i+1], b = d.data[i+2];
        d.data[i]     = Math.min(255, r * 0.9 + 40);
        d.data[i + 1] = Math.min(255, g * 0.7 + 20);
        d.data[i + 2] = Math.min(255, b * 0.5 + 10);
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'bw',
    name: 'B&W',
    emoji: '🖤',
    category: 'color',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const avg = d.data[i]*0.299 + d.data[i+1]*0.587 + d.data[i+2]*0.114;
        d.data[i] = d.data[i+1] = d.data[i+2] = avg;
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'sepia',
    name: 'Sepia',
    emoji: '🤎',
    category: 'color',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const r = d.data[i], g = d.data[i+1], b = d.data[i+2];
        d.data[i]     = Math.min(255, r*0.393 + g*0.769 + b*0.189);
        d.data[i + 1] = Math.min(255, r*0.349 + g*0.686 + b*0.168);
        d.data[i + 2] = Math.min(255, r*0.272 + g*0.534 + b*0.131);
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    emoji: '💜',
    category: 'creative',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     = Math.min(255, d.data[i] * 1.3);
        d.data[i + 1] = Math.min(255, d.data[i+1] * 0.6);
        d.data[i + 2] = Math.min(255, d.data[i+2] * 1.5);
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌇',
    category: 'creative',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     = Math.min(255, d.data[i] * 1.2 + 20);
        d.data[i + 1] = Math.min(255, d.data[i+1] * 0.8 + 10);
        d.data[i + 2] = Math.max(0,   d.data[i+2] * 0.6);
      }
      ctx.putImageData(d, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, 'rgba(255,100,0,0.15)');
      g.addColorStop(1, 'rgba(255,0,80,0.1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyber',
    emoji: '🤖',
    category: 'creative',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     = Math.min(255, d.data[i] * 0.8 + 30);
        d.data[i + 1] = Math.min(255, d.data[i+1] * 1.1);
        d.data[i + 2] = Math.min(255, d.data[i+2] * 1.4 + 20);
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'pop',
    name: 'Pop Art',
    emoji: '🎨',
    category: 'creative',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     = d.data[i] > 128     ? 255 : Math.min(255, d.data[i] * 1.8);
        d.data[i + 1] = d.data[i+1] > 128   ? 255 : Math.min(255, d.data[i+1] * 1.8);
        d.data[i + 2] = d.data[i+2] > 128   ? 255 : Math.min(255, d.data[i+2] * 1.8);
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    emoji: '✨',
    category: 'beauty',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     = Math.min(255, d.data[i] * 1.05 + 15);
        d.data[i + 1] = Math.min(255, d.data[i+1] * 1.05 + 10);
        d.data[i + 2] = Math.min(255, d.data[i+2] * 1.08 + 15);
      }
      ctx.putImageData(d, 0, 0);
      ctx.fillStyle = 'rgba(255,220,255,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  },
  {
    id: 'glow',
    name: 'Glow',
    emoji: '🌟',
    category: 'beauty',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     = Math.min(255, d.data[i] + 20);
        d.data[i + 1] = Math.min(255, d.data[i+1] + 20);
        d.data[i + 2] = Math.min(255, d.data[i+2] + 20);
      }
      ctx.putImageData(d, 0, 0);
      const g = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, canvas.height*0.2,
        canvas.width/2, canvas.height/2, canvas.height*0.8
      );
      g.addColorStop(0, 'rgba(255,255,255,0.1)');
      g.addColorStop(1, 'rgba(0,0,0,0.05)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  },
  {
    id: 'vignette',
    name: 'Vignette',
    emoji: '🔲',
    category: 'basic',
    apply: (ctx, canvas) => {
      const g = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, canvas.height*0.3,
        canvas.width/2, canvas.height/2, canvas.height*0.85
      );
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  },
  {
    id: 'negative',
    name: 'Negative',
    emoji: '🔄',
    category: 'creative',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i] = 255 - d.data[i];
        d.data[i+1] = 255 - d.data[i+1];
        d.data[i+2] = 255 - d.data[i+2];
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'comic',
    name: 'Comic',
    emoji: '💥',
    category: 'creative',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]   = Math.round(d.data[i] / 64) * 64;
        d.data[i+1] = Math.round(d.data[i+1] / 64) * 64;
        d.data[i+2] = Math.round(d.data[i+2] / 64) * 64;
      }
      ctx.putImageData(d, 0, 0);
    }
  },
  {
    id: 'matrix',
    name: 'Matrix',
    emoji: '💚',
    category: 'creative',
    apply: (ctx, canvas) => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const avg = (d.data[i] + d.data[i+1] + d.data[i+2]) / 3;
        d.data[i]   = 0;
        d.data[i+1] = Math.min(255, avg * 1.3);
        d.data[i+2] = Math.min(255, avg * 0.3);
      }
      ctx.putImageData(d, 0, 0);
    }
  },
];

// ─── FACE FILTERS ───────────────────────────────────────────────────────────
// All coordinates are derived from these canonical anchors:
//   cx      = face center X
//   eyeY    = face.y + face.height * 0.35   (eye line)
//   noseY   = face.y + face.height * 0.55   (nose tip)
//   mouthY  = face.y + face.height * 0.72   (mouth center)
//   topY    = face.y                         (top of detected box ≈ forehead)
//
// When landmarks are available they override the estimates above.

function getAnchors(face) {
  const { x, y, width: w, height: h, landmarks: lm } = face;
  const cx     = x + w / 2;
  const eyeY   = lm ? (lm.leftEye.y + lm.rightEye.y) / 2 : y + h * 0.35;
  const noseY  = lm ? lm.nose.y   : y + h * 0.55;
  const mouthY = lm ? lm.mouth.y  : y + h * 0.72;
  const leftEyeX  = lm ? lm.leftEye.x  : cx - w * 0.22;
  const rightEyeX = lm ? lm.rightEye.x : cx + w * 0.22;
  return { cx, eyeY, noseY, mouthY, leftEyeX, rightEyeX, topY: y };
}

export const FACE_FILTERS = [
  // ── DOG ───────────────────────────────────────────────────────────────────
  {
    id: 'dog',
    name: 'Puppy',
    emoji: '🐶',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h } = face;
      const { cx, noseY, mouthY } = getAnchors(face);
      const lw = Math.max(1, w * 0.005);

      // Ears — hang from the very top of the face box
      ctx.fillStyle = '#6B3A1F';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.42, y + h * 0.05, w * 0.15, h * 0.22, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#A0522D';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.42, y + h * 0.07, w * 0.09, h * 0.15, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#6B3A1F';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.42, y + h * 0.05, w * 0.15, h * 0.22, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#A0522D';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.42, y + h * 0.07, w * 0.09, h * 0.15, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Nose — centered on noseY
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.ellipse(cx, noseY, w * 0.08, h * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.02, noseY - h * 0.015, w * 0.022, h * 0.016, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tongue — below mouth
      ctx.fillStyle = '#FF69B4';
      ctx.beginPath();
      ctx.ellipse(cx, mouthY + h * 0.06, w * 0.09, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E0508A';
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(cx, mouthY);
      ctx.bezierCurveTo(cx - w * 0.01, mouthY + h * 0.03, cx - w * 0.01, mouthY + h * 0.06, cx, mouthY + h * 0.08);
      ctx.stroke();
    }
  },

  // ── CAT ───────────────────────────────────────────────────────────────────
  {
    id: 'cat',
    name: 'Kitty',
    emoji: '🐱',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h } = face;
      const { cx, noseY, mouthY } = getAnchors(face);
      const lw = Math.max(1, w * 0.006);

      // Cat ears — pointy, above top of face
      const earBase = y + h * 0.04;
      ctx.fillStyle = '#FFB6C1';
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.38, earBase);
      ctx.lineTo(cx - w * 0.24, y - h * 0.28);
      ctx.lineTo(cx - w * 0.1, earBase);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FF80AB';
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.34, earBase);
      ctx.lineTo(cx - w * 0.24, y - h * 0.18);
      ctx.lineTo(cx - w * 0.14, earBase);
      ctx.closePath(); ctx.fill();

      ctx.fillStyle = '#FFB6C1';
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.1, earBase);
      ctx.lineTo(cx + w * 0.24, y - h * 0.28);
      ctx.lineTo(cx + w * 0.38, earBase);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FF80AB';
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.14, earBase);
      ctx.lineTo(cx + w * 0.24, y - h * 0.18);
      ctx.lineTo(cx + w * 0.34, earBase);
      ctx.closePath(); ctx.fill();

      // Whiskers — anchored to nose
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      for (let i = -1; i <= 1; i++) {
        const wy = noseY + i * h * 0.04;
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.1, wy);
        ctx.lineTo(cx - w * 0.52, wy - i * h * 0.01);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + w * 0.1, wy);
        ctx.lineTo(cx + w * 0.52, wy - i * h * 0.01);
        ctx.stroke();
      }

      // Nose — small triangle
      ctx.fillStyle = '#FF69B4';
      ctx.beginPath();
      ctx.moveTo(cx, noseY - h * 0.03);
      ctx.lineTo(cx - w * 0.04, noseY + h * 0.02);
      ctx.lineTo(cx + w * 0.04, noseY + h * 0.02);
      ctx.closePath(); ctx.fill();

      // Mouth
      ctx.strokeStyle = 'rgba(100,0,50,0.7)';
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(cx, noseY + h * 0.02);
      ctx.quadraticCurveTo(cx - w * 0.09, mouthY - h * 0.01, cx - w * 0.15, mouthY - h * 0.03);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, noseY + h * 0.02);
      ctx.quadraticCurveTo(cx + w * 0.09, mouthY - h * 0.01, cx + w * 0.15, mouthY - h * 0.03);
      ctx.stroke();
    }
  },

  // ── CROWN ─────────────────────────────────────────────────────────────────
  {
    id: 'crown',
    name: 'Crown',
    emoji: '👑',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h } = face;
      const { cx } = getAnchors(face);
      // Crown sits on top of head — entirely above face.y
      const crownH = h * 0.32;
      const crownW = w * 0.85;
      const crownX = cx - crownW / 2;
      const crownY = y - crownH * 0.9;

      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(cx, y + h * 0.01, crownW * 0.45, h * 0.03, 0, 0, Math.PI * 2);
      ctx.fill();

      const gold = ctx.createLinearGradient(cx, crownY, cx, crownY + crownH);
      gold.addColorStop(0, '#FFD700');
      gold.addColorStop(0.5, '#FFA500');
      gold.addColorStop(1, '#CC8800');
      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.moveTo(crownX,              crownY + crownH);
      ctx.lineTo(crownX,              crownY + crownH * 0.45);
      ctx.lineTo(crownX + crownW * 0.22, crownY + crownH * 0.72);
      ctx.lineTo(cx,                  crownY);
      ctx.lineTo(crownX + crownW * 0.78, crownY + crownH * 0.72);
      ctx.lineTo(crownX + crownW,     crownY + crownH * 0.45);
      ctx.lineTo(crownX + crownW,     crownY + crownH);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = Math.max(1, w * 0.005);
      ctx.stroke();

      const gemR = w * 0.035;
      [
        { px: cx - crownW * 0.26, py: crownY + crownH * 0.58, color: '#FF4444' },
        { px: cx,                  py: crownY + crownH * 0.38, color: '#4488FF' },
        { px: cx + crownW * 0.26, py: crownY + crownH * 0.58, color: '#44FF88' },
      ].forEach(({ px, py, color }) => {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(px, py, gemR, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.arc(px - gemR * 0.3, py - gemR * 0.3, gemR * 0.35, 0, Math.PI * 2); ctx.fill();
      });

      const sparkleSize = Math.max(10, w * 0.06);
      ctx.font = `${sparkleSize}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('✨', cx - crownW * 0.52, crownY - h * 0.04);
      ctx.fillText('✨', cx + crownW * 0.52, crownY - h * 0.04);
    }
  },

  // ── GLASSES ───────────────────────────────────────────────────────────────
  {
    id: 'glasses',
    name: 'Shades',
    emoji: '😎',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { width: w, height: h } = face;
      const { cx, eyeY, leftEyeX, rightEyeX } = getAnchors(face);

      // Total glasses width = 90% of face width, each lens ~38%
      const totalW  = w * 0.9;
      const lensW   = totalW * 0.42;
      const lensH   = h * 0.13;
      const lw      = Math.max(1.5, w * 0.007);

      const leftCX  = cx - totalW * 0.26;
      const rightCX = cx + totalW * 0.26;

      // Left lens
      ctx.fillStyle = 'rgba(10,10,30,0.88)';
      ctx.beginPath();
      ctx.roundRect(leftCX - lensW / 2, eyeY - lensH / 2, lensW, lensH, lensH * 0.4);
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = lw;
      ctx.stroke();

      // Right lens
      ctx.fillStyle = 'rgba(10,10,30,0.88)';
      ctx.beginPath();
      ctx.roundRect(rightCX - lensW / 2, eyeY - lensH / 2, lensW, lensH, lensH * 0.4);
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = lw;
      ctx.stroke();

      // Bridge
      ctx.strokeStyle = '#222';
      ctx.lineWidth = lw * 0.75;
      ctx.beginPath();
      ctx.moveTo(leftCX + lensW / 2, eyeY);
      ctx.lineTo(rightCX - lensW / 2, eyeY);
      ctx.stroke();

      // Arms
      ctx.beginPath();
      ctx.moveTo(leftCX - lensW / 2, eyeY);
      ctx.lineTo(leftCX - lensW / 2 - w * 0.07, eyeY + lensH * 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rightCX + lensW / 2, eyeY);
      ctx.lineTo(rightCX + lensW / 2 + w * 0.07, eyeY + lensH * 0.15);
      ctx.stroke();

      // Reflections
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.ellipse(leftCX - lensW * 0.12, eyeY - lensH * 0.12, lensW * 0.22, lensH * 0.25, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(rightCX - lensW * 0.12, eyeY - lensH * 0.12, lensW * 0.22, lensH * 0.25, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // ── HEARTS ────────────────────────────────────────────────────────────────
  {
    id: 'hearts',
    name: 'Hearts',
    emoji: '💖',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h } = face;
      const { cx, leftEyeX, rightEyeX, eyeY } = getAnchors(face);
      const fontSize = Math.max(10, w * 0.18);

      ctx.font = `${fontSize}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('❤️', leftEyeX,  eyeY + h * 0.02);
      ctx.fillText('❤️', rightEyeX, eyeY + h * 0.02);

      const time = Date.now() / 1000;
      const smallFont = Math.max(8, w * 0.10);
      ctx.font = `${smallFont}px serif`;
      for (let i = 0; i < 6; i++) {
        const phase = (time * 0.8 + i * 0.55) % 3;
        const hx = cx + Math.sin(time * 1.5 + i * 1.1) * w * 0.42;
        const hy = y - phase * h * 0.32;
        ctx.globalAlpha = Math.max(0, 1 - phase / 2.5);
        ctx.fillText(i % 2 === 0 ? '💖' : '💕', hx, hy);
      }
      ctx.globalAlpha = 1;
    }
  },

  // ── DEMON ─────────────────────────────────────────────────────────────────
  {
    id: 'demon',
    name: 'Demon',
    emoji: '😈',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h } = face;
      const { cx, leftEyeX, rightEyeX, eyeY } = getAnchors(face);

      // Horns above forehead
      const hornBase = y + h * 0.03;
      const hornGrad = ctx.createLinearGradient(cx, y - h * 0.38, cx, hornBase);
      hornGrad.addColorStop(0, '#CC0000');
      hornGrad.addColorStop(1, '#660000');
      ctx.fillStyle = hornGrad;

      ctx.beginPath();
      ctx.moveTo(cx - w * 0.28, hornBase);
      ctx.quadraticCurveTo(cx - w * 0.4, y - h * 0.24, cx - w * 0.17, y - h * 0.36);
      ctx.quadraticCurveTo(cx - w * 0.13, y - h * 0.14, cx - w * 0.13, hornBase);
      ctx.closePath(); ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + w * 0.28, hornBase);
      ctx.quadraticCurveTo(cx + w * 0.4, y - h * 0.24, cx + w * 0.17, y - h * 0.36);
      ctx.quadraticCurveTo(cx + w * 0.13, y - h * 0.14, cx + w * 0.13, hornBase);
      ctx.closePath(); ctx.fill();

      // Fire eyes
      const fireSize = Math.max(10, w * 0.15);
      ctx.font = `${fireSize}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🔥', leftEyeX,  eyeY + h * 0.04);
      ctx.fillText('🔥', rightEyeX, eyeY + h * 0.04);

      const eyeGlow = ctx.createRadialGradient(cx, eyeY, 0, cx, eyeY, w * 0.32);
      eyeGlow.addColorStop(0, 'rgba(255,0,0,0.14)');
      eyeGlow.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.fillStyle = eyeGlow;
      ctx.fillRect(x, y, w, h);
    }
  },

  // ── BUNNY ─────────────────────────────────────────────────────────────────
  {
    id: 'bunny',
    name: 'Bunny',
    emoji: '🐰',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h } = face;
      const { cx, noseY, mouthY } = getAnchors(face);
      const lw = Math.max(1, w * 0.005);

      // Tall ears above head
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.2, y - h * 0.22, w * 0.08, h * 0.25, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFB6C1';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.2, y - h * 0.22, w * 0.05, h * 0.18, -0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.2, y - h * 0.22, w * 0.08, h * 0.25, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFB6C1';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.2, y - h * 0.22, w * 0.05, h * 0.18, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#FF80AB';
      ctx.beginPath();
      ctx.ellipse(cx, noseY, w * 0.04, h * 0.025, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mouth
      ctx.strokeStyle = '#cc5588';
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, noseY + h * 0.025);
      ctx.quadraticCurveTo(cx - w * 0.08, mouthY - h * 0.02, cx - w * 0.14, mouthY - h * 0.03);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, noseY + h * 0.025);
      ctx.quadraticCurveTo(cx + w * 0.08, mouthY - h * 0.02, cx + w * 0.14, mouthY - h * 0.03);
      ctx.stroke();

      // Teeth
      ctx.fillStyle = '#FAFAFA';
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = lw * 0.6;
      const tw = w * 0.036;
      const th = h * 0.06;
      ctx.beginPath();
      ctx.roundRect(cx - tw * 1.1, mouthY - h * 0.02, tw, th, [0, 0, tw * 0.3, tw * 0.3]);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(cx + tw * 0.1, mouthY - h * 0.02, tw, th, [0, 0, tw * 0.3, tw * 0.3]);
      ctx.fill(); ctx.stroke();
    }
  },

  // ── ALIEN ─────────────────────────────────────────────────────────────────
  {
    id: 'alien',
    name: 'Alien',
    emoji: '👽',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h } = face;
      const { cx, leftEyeX, rightEyeX, eyeY } = getAnchors(face);
      const lw = Math.max(1.5, w * 0.007);

      ctx.fillStyle = 'rgba(0,220,100,0.07)';
      ctx.fillRect(x - w * 0.1, y - h * 0.1, w * 1.2, h * 1.2);

      // Big eyes
      ctx.fillStyle = 'rgba(0,0,0,0.78)';
      ctx.beginPath();
      ctx.ellipse(leftEyeX,  eyeY, w * 0.16, h * 0.12, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(rightEyeX, eyeY, w * 0.16, h * 0.12,  0.2, 0, Math.PI * 2);
      ctx.fill();

      const glowFn = (ex, ey) => {
        const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, w * 0.09);
        g.addColorStop(0, 'rgba(0,255,120,0.9)');
        g.addColorStop(1, 'rgba(0,255,120,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(ex, ey, w * 0.09, h * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
      };
      glowFn(leftEyeX, eyeY);
      glowFn(rightEyeX, eyeY);

      // Antennae
      ctx.strokeStyle = '#44FF88';
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.06, y);
      ctx.quadraticCurveTo(cx - w * 0.14, y - h * 0.2, cx - w * 0.08, y - h * 0.3);
      ctx.stroke();
      ctx.fillStyle = '#00FF88';
      ctx.beginPath(); ctx.arc(cx - w * 0.08, y - h * 0.31, w * 0.025, 0, Math.PI * 2); ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + w * 0.06, y);
      ctx.quadraticCurveTo(cx + w * 0.14, y - h * 0.2, cx + w * 0.08, y - h * 0.3);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + w * 0.08, y - h * 0.31, w * 0.025, 0, Math.PI * 2); ctx.fill();
    }
  },

  // ── FIRE ──────────────────────────────────────────────────────────────────
  {
    id: 'fire',
    name: 'Fire',
    emoji: '🔥',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h } = face;
      const { cx, leftEyeX, rightEyeX, eyeY } = getAnchors(face);
      const fontSize = Math.max(10, w * 0.19);
      ctx.font = `${fontSize}px serif`;
      ctx.textAlign = 'center';

      const t = Date.now() / 300;
      for (let i = 0; i < 7; i++) {
        const fx = cx - w * 0.42 + (i / 6) * w * 0.84;
        const wobble = Math.sin(t + i * 0.9) * w * 0.04;
        ctx.fillText('🔥', fx + wobble, y - h * 0.02);
      }
      ctx.fillText('🔥', leftEyeX,  eyeY + h * 0.04);
      ctx.fillText('🔥', rightEyeX, eyeY + h * 0.04);
    }
  },

  // ── STARS ─────────────────────────────────────────────────────────────────
  {
    id: 'stars',
    name: 'Stardust',
    emoji: '⭐',
    category: 'face',
    drawOnFace: (ctx, face) => {
      const { x, y, width: w, height: h } = face;
      const { cx } = getAnchors(face);
      const t = Date.now() / 600;
      const fontSize = Math.max(8, w * 0.11);
      ctx.font = `${fontSize}px serif`;
      ctx.textAlign = 'center';

      const positions = [
        { dx: -0.46, dy: -0.18 }, { dx: 0.46, dy: -0.18 },
        { dx: -0.3,  dy: -0.36 }, { dx: 0.3,  dy: -0.36 },
        { dx:  0,    dy: -0.46 }, { dx: -0.52, dy: 0.08 }, { dx: 0.52, dy: 0.08 },
      ];
      positions.forEach(({ dx, dy }, i) => {
        const pulse = 0.7 + 0.3 * Math.sin(t + i * 0.8);
        ctx.globalAlpha = pulse;
        ctx.fillText(i % 2 === 0 ? '⭐' : '✨', cx + dx * w, y + dy * h);
      });
      ctx.globalAlpha = 1;
    }
  },
];

export const ALL_FILTERS = [...FILTERS, ...FACE_FILTERS];

export const CATEGORIES = [
  { id: 'all',      name: 'All',     emoji: '🎯' },
  { id: 'face',     name: 'Face',    emoji: '😀' },
  { id: 'premium',  name: 'Premium', emoji: '⭐' },
  { id: 'color',    name: 'Color',   emoji: '🎨' },
  { id: 'beauty',   name: 'Beauty',  emoji: '✨' },
  { id: 'creative', name: 'Creative',emoji: '🔮' },
  { id: 'basic',    name: 'Basic',   emoji: '📷' },
];