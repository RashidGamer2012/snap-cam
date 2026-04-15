import React, { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import useFaceDetection from './useFaceDetection';
import { FACE_FILTERS, FILTERS } from './filters';
import { PREMIUM_FILTERS } from './premiumFilters';

const ALL_FACE_FILTERS = [...FACE_FILTERS, ...PREMIUM_FILTERS];

const CameraView = forwardRef(({ activeFilter, facingMode, performanceMode = false }, ref) => {
  const videoRef      = useRef(null);
  const offscreenRef  = useRef(null); // full-res offscreen canvas for capture
  const displayRef    = useRef(null); // visible canvas fitted to screen
  const streamRef     = useRef(null);
  const animRef       = useRef(null);
  const dispSizeRef   = useRef({ w: 0, h: 0, dpr: 1 });
  const vidSizeRef    = useRef({ w: 0, h: 0 });
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const { facesRef } = useFaceDetection(videoRef, cameraReady, performanceMode);

  // ── Capture (returns full-res PNG with filters baked in) ─────────────────
  useImperativeHandle(ref, () => ({
    capture: () => offscreenRef.current?.toDataURL('image/png', 0.92) ?? null
  }));

  // ── Camera start / flip ──────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    setCameraReady(false);
    setCameraError(null);

    const startCamera = async () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      try {
        const constraints = {
          video: {
            facingMode,
            width:  { ideal: performanceMode ? 640  : 1280 },
            height: { ideal: performanceMode ? 480  : 720  },
          },
          audio: false,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        const vid = videoRef.current;
        if (vid) {
          vid.srcObject = stream;
          vid.onloadedmetadata = () => { vid.play(); if (mounted) setCameraReady(true); };
        }
      } catch (err) {
        if (mounted) setCameraError(err.name === 'NotAllowedError' ? 'permission' : 'unavailable');
      }
    };

    startCamera();
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [facingMode, performanceMode]);

  // ── Resize display canvas (device-pixel-ratio aware) ─────────────────────
  useEffect(() => {
    const disp = displayRef.current;
    if (!disp) return;
    const parent = disp.parentElement;
    const dpr = window.devicePixelRatio || 1;

    const resize = (entries) => {
      const { width, height } = entries ? entries[0].contentRect
        : parent.getBoundingClientRect();
      const pw = Math.round(width  * dpr);
      const ph = Math.round(height * dpr);
      if (pw !== disp.width || ph !== disp.height) {
        disp.width  = pw;
        disp.height = ph;
        disp.style.width  = width  + 'px';
        disp.style.height = height + 'px';
        dispSizeRef.current = { w: pw, h: ph, dpr };
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize(null); // initial
    return () => ro.disconnect();
  }, []);

  // ── Main render loop ─────────────────────────────────────────────────────
  const render = useCallback(() => {
    const video   = videoRef.current;
    const offsc   = offscreenRef.current;
    const disp    = displayRef.current;
    if (!video || !offsc || !disp || video.readyState < 2) {
      animRef.current = requestAnimationFrame(render);
      return;
    }

    const vw = video.videoWidth, vh = video.videoHeight;
    if (!vw || !vh) { animRef.current = requestAnimationFrame(render); return; }

    // Resize offscreen only when video dimensions change
    if (vidSizeRef.current.w !== vw || vidSizeRef.current.h !== vh) {
      offsc.width  = vw;
      offsc.height = vh;
      vidSizeRef.current = { w: vw, h: vh };
    }

    const ctx = offsc.getContext('2d', { willReadFrequently: true, alpha: false });

    // ── Draw mirrored video ──
    ctx.save();
    if (facingMode === 'user') { ctx.translate(vw, 0); ctx.scale(-1, 1); }
    ctx.drawImage(video, 0, 0, vw, vh);
    ctx.restore();

    // ── Color filter ──
    const colorFilter = FILTERS.find(f => f.id === activeFilter);
    if (colorFilter && colorFilter.id !== 'none') colorFilter.apply(ctx, offsc);

    // ── Face filter ──
    const faceFilter = ALL_FACE_FILTERS.find(f => f.id === activeFilter);
    if (faceFilter) {
      const currentFaces = facesRef.current;
      currentFaces.forEach(rawFace => {
        // Clamp face size to reasonable bounds (0.6–1.2× detected width)
        const clampedW = Math.min(Math.max(rawFace.width, vw * 0.15), vw * 0.95);
        const clampedH = clampedW * (rawFace.height / Math.max(rawFace.width, 1));
        // Re-center after clamping
        const clampedX = rawFace.x + (rawFace.width - clampedW) / 2;
        const clampedY = rawFace.y + (rawFace.height - clampedH) / 2;

        // For front camera the video is drawn mirrored, so mirror face X too
        const mirroredX = facingMode === 'user' ? vw - clampedX - clampedW : clampedX;
        const mirrorLM  = (pt) => pt ? { x: vw - pt.x, y: pt.y } : null;

        const face = {
          x: mirroredX,
          y: clampedY,
          width: clampedW,
          height: clampedH,
          roll: rawFace.roll ? (facingMode === 'user' ? -rawFace.roll : rawFace.roll) : 0,
          landmarks: rawFace.landmarks && facingMode === 'user' ? {
            leftEye:  mirrorLM(rawFace.landmarks.rightEye),
            rightEye: mirrorLM(rawFace.landmarks.leftEye),
            nose:     mirrorLM(rawFace.landmarks.nose),
            mouth:    mirrorLM(rawFace.landmarks.mouth),
          } : rawFace.landmarks,
        };
        faceFilter.drawOnFace(ctx, face);
      });
    }

    // ── Blit to display canvas (object-cover crop) ──
    const { w: dw, h: dh } = dispSizeRef.current;
    if (dw > 0 && dh > 0) {
      const scale  = Math.max(dw / vw, dh / vh);
      const drawW  = vw * scale;
      const drawH  = vh * scale;
      const ox     = (dw - drawW) / 2;
      const oy     = (dh - drawH) / 2;
      const dCtx   = disp.getContext('2d', { alpha: false });
      dCtx.drawImage(offsc, ox, oy, drawW, drawH);
    }

    animRef.current = requestAnimationFrame(render);
  }, [activeFilter, facingMode, facesRef]);

  useEffect(() => {
    if (!cameraReady) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(render);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [cameraReady, render]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <video ref={videoRef} playsInline muted autoPlay
        className="absolute opacity-0 pointer-events-none w-0 h-0" />
      <canvas ref={offscreenRef} className="hidden" />
      <canvas ref={displayRef}
        className="absolute inset-0"
        style={{ display: 'block', touchAction: 'none' }} />

      {/* Loading */}
      {!cameraReady && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-4 z-10">
          <div className="w-12 h-12 rounded-full border-2 border-white/15 border-t-yellow-400 animate-spin" />
          <p className="text-white/40 text-sm font-medium tracking-wide">Starting camera…</p>
        </div>
      )}

      {/* Camera error */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-5 z-10 px-8 text-center">
          <div className="text-5xl">📷</div>
          <p className="text-white font-semibold text-lg">
            {cameraError === 'permission' ? 'Camera Access Required' : 'Camera Unavailable'}
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            {cameraError === 'permission'
              ? 'Please allow camera access in your browser settings, then reload the page.'
              : 'No camera was found on this device.'}
          </p>
        </div>
      )}
    </div>
  );
});

CameraView.displayName = 'CameraView';
export default CameraView;