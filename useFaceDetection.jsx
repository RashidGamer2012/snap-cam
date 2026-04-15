import { useEffect, useRef } from 'react';

// Lerp factor for temporal smoothing (0 = frozen, 1 = instant)
const LERP = 0.22;
const DETECT_INTERVAL_MS = 90; // detection throttle

function lerp(a, b, t) { return a + (b - a) * t; }

function smoothFace(prev, next) {
  if (!prev) return next;
  return {
    x:      lerp(prev.x,      next.x,      LERP),
    y:      lerp(prev.y,      next.y,      LERP),
    width:  lerp(prev.width,  next.width,  LERP),
    height: lerp(prev.height, next.height, LERP),
    roll:   lerp(prev.roll ?? 0, next.roll ?? 0, LERP),
    // landmarks smoothed too
    landmarks: next.landmarks ? {
      leftEye:  lerpPt(prev.landmarks?.leftEye,  next.landmarks.leftEye,  LERP),
      rightEye: lerpPt(prev.landmarks?.rightEye, next.landmarks.rightEye, LERP),
      nose:     lerpPt(prev.landmarks?.nose,     next.landmarks.nose,     LERP),
      mouth:    lerpPt(prev.landmarks?.mouth,    next.landmarks.mouth,    LERP),
    } : prev.landmarks,
  };
}

function lerpPt(a, b, t) {
  if (!a || !b) return b || a;
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

// Derive approximate landmarks from bounding box
// These are relative estimates that work surprisingly well for filter anchoring
function estimateLandmarks(x, y, w, h) {
  return {
    leftEye:  { x: x + w * 0.31, y: y + h * 0.36 },
    rightEye: { x: x + w * 0.69, y: y + h * 0.36 },
    nose:     { x: x + w * 0.50, y: y + h * 0.58 },
    mouth:    { x: x + w * 0.50, y: y + h * 0.74 },
  };
}

// Estimate face roll angle from eye positions
function estimateRoll(landmarks) {
  if (!landmarks) return 0;
  const { leftEye, rightEye } = landmarks;
  const dx = rightEye.x - leftEye.x;
  const dy = rightEye.y - leftEye.y;
  return Math.atan2(dy, dx); // radians
}

export default function useFaceDetection(videoRef, isActive, performanceMode = false) {
  const facesRef        = useRef([]);
  const smoothedRef     = useRef([]); // smoothed faces for rendering
  const detectorRef     = useRef(null);
  const animFrameRef    = useRef(null);
  const intervalRef     = useRef(null);
  const sampleCanvasRef = useRef(null); // reuse canvas to avoid GC pressure
  const lastDetectRef   = useRef(0);
  const mountedRef      = useRef(false);

  useEffect(() => {
    if (!isActive) return;
    mountedRef.current = true;

    // Reuse a small canvas for skin-tone sampling
    sampleCanvasRef.current = document.createElement('canvas');

    const init = async () => {
      // Try native FaceDetector first
      if (typeof window.FaceDetector !== 'undefined') {
        try {
          const fd = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
          const testCanvas = document.createElement('canvas');
          testCanvas.width = 4; testCanvas.height = 4;
          await fd.detect(testCanvas);
          if (!mountedRef.current) return;
          detectorRef.current = fd;
          startNativeLoop();
          return;
        } catch { /* fall through */ }
      }
      // Fallback to skin-tone estimation
      startFallbackLoop();
    };

    init();

    return () => {
      mountedRef.current = false;
      if (animFrameRef.current)  cancelAnimationFrame(animFrameRef.current);
      if (intervalRef.current)   clearInterval(intervalRef.current);
    };
  }, [isActive, performanceMode]); // eslint-disable-line

  function startNativeLoop() {
    const loop = async (ts) => {
      if (!mountedRef.current) return;
      animFrameRef.current = requestAnimationFrame(loop);

      // Throttle detection
      if (ts - lastDetectRef.current < DETECT_INTERVAL_MS) return;
      lastDetectRef.current = ts;

      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      try {
        const results = await detectorRef.current.detect(video);
        if (!mountedRef.current) return;
        const raw = results.map(f => {
          const x = f.boundingBox.x, y = f.boundingBox.y;
          const w = f.boundingBox.width, h = f.boundingBox.height;
          const lm = estimateLandmarks(x, y, w, h);
          return { x, y, width: w, height: h, landmarks: lm, roll: estimateRoll(lm) };
        });
        updateFaces(raw);
      } catch { /* skip frame */ }
    };
    animFrameRef.current = requestAnimationFrame(loop);
  }

  function startFallbackLoop() {
    const interval = performanceMode ? 120 : DETECT_INTERVAL_MS;
    intervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !mountedRef.current) return;
      const vw = video.videoWidth, vh = video.videoHeight;
      if (!vw || !vh) return;

      const sc = sampleCanvasRef.current;
      const scaleF = performanceMode ? 0.06 : 0.09;
      sc.width  = Math.max(1, Math.floor(vw * scaleF));
      sc.height = Math.max(1, Math.floor(vh * scaleF));
      const sCtx = sc.getContext('2d', { willReadFrequently: true });
      sCtx.drawImage(video, 0, 0, sc.width, sc.height);

      const sw = sc.width, sh = sc.height;
      const imgData = sCtx.getImageData(0, 0, sw, sh).data;

      let sumX = 0, sumY = 0, count = 0;
      const rowLimit = sh * 0.75;
      for (let py = 0; py < rowLimit; py++) {
        for (let px = 0; px < sw; px++) {
          const i = (py * sw + px) * 4;
          const r = imgData[i], g = imgData[i+1], b = imgData[i+2];
          if (r > 90 && g > 40 && b > 15 && r > g && r > b &&
              (r - Math.min(g, b)) > 12 && Math.abs(r - g) > 10) {
            sumX += px; sumY += py; count++;
          }
        }
      }

      let face;
      if (count > 15) {
        const nx = (sumX / count) / sw;
        const ny = (sumY / count) / sh;
        const fw = vw * 0.44, fh = vh * 0.54;
        face = {
          x: Math.max(0, nx * vw - fw / 2),
          y: Math.max(0, ny * vh - fh * 0.28),
          width: fw, height: fh,
        };
      } else {
        face = { x: vw * 0.18, y: vh * 0.06, width: vw * 0.64, height: vh * 0.56 };
      }
      const lm = estimateLandmarks(face.x, face.y, face.width, face.height);
      face.landmarks = lm;
      face.roll = 0; // no roll in fallback mode
      updateFaces([face]);
    }, interval);
  }

  function updateFaces(rawFaces) {
    const prev = smoothedRef.current;
    const smoothed = rawFaces.map((f, i) => smoothFace(prev[i] || null, f));
    smoothedRef.current = smoothed;
    facesRef.current    = smoothed;
  }

  // Return only the ref — no useState to avoid re-renders in render loop
  return { facesRef };
}