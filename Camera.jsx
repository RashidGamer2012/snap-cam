import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraView from '../components/camera/CameraView';
import TopBar from '../components/camera/TopBar';
import CaptureButton from '../components/camera/CaptureButton';
import FilterCarousel from '../components/camera/FilterCarousel';
import PhotoPreview from '../components/camera/PhotoPreview';
import { ALL_FILTERS } from '../components/camera/filters';
import { PREMIUM_FILTERS } from '../components/camera/premiumFilters';

const FULL_LIST = [...ALL_FILTERS, ...PREMIUM_FILTERS];

export default function Camera() {
  const [activeFilter,   setActiveFilter]   = useState('none');
  const [facingMode,     setFacingMode]      = useState('user');
  const [flashOn,        setFlashOn]         = useState(false);
  const [capturedPhoto,  setCapturedPhoto]   = useState(null);
  const [showFlash,      setShowFlash]       = useState(false);
  const [showGallery,    setShowGallery]     = useState(false);
  const [performanceMode,setPerformanceMode] = useState(false);
  const cameraRef = useRef(null);

  const handleCapture = useCallback(() => {
    if (!cameraRef.current) return;
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 350);
    const photoData = cameraRef.current.capture();
    if (photoData) setCapturedPhoto(photoData);
  }, []);

  const handleFlipCamera = useCallback(() => {
    setFacingMode(p => p === 'user' ? 'environment' : 'user');
  }, []);

  const activeFilterObj = FULL_LIST.find(f => f.id === activeFilter);
  const filterName  = activeFilterObj?.name  ?? '';
  const filterEmoji = activeFilterObj?.emoji ?? '';

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    >
      {/* ── Camera ─────────────────────────────────────────────────── */}
      <CameraView
        ref={cameraRef}
        activeFilter={activeFilter}
        facingMode={facingMode}
        performanceMode={performanceMode}
      />

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <TopBar
        onFlipCamera={handleFlipCamera}
        flashOn={flashOn}
        onToggleFlash={() => setFlashOn(p => !p)}
        performanceMode={performanceMode}
        onTogglePerformance={() => setPerformanceMode(p => !p)}
      />

      {/* ── Active filter badge ──────────────────────────────────────── */}
      <AnimatePresence>
        {activeFilter !== 'none' && (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, scale: 0.75, y: -4 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ type: 'spring', damping: 18 }}
            className="absolute z-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md"
            style={{ top: 'max(env(safe-area-inset-top, 0px), 12px)', marginTop: 44 }}
          >
            <span className="text-sm">{filterEmoji}</span>
            <span className="text-white text-xs font-bold tracking-wide">{filterName}</span>
            {activeFilterObj?.premium && (
              <span className="text-yellow-400 text-[9px] font-black">PRO</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Performance mode indicator ───────────────────────────────── */}
      <AnimatePresence>
        {performanceMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-14 right-3 z-20 px-2 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40"
          >
            <span className="text-yellow-400 text-[9px] font-bold tracking-widest">ECO</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filter carousel ──────────────────────────────────────────── */}
      <FilterCarousel
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        showGallery={showGallery}
        onToggleGallery={() => setShowGallery(p => !p)}
      />

      {/* ── Capture button (overlaid on carousel action row) ─────────── */}
      <div
        className="absolute z-30 left-1/2 -translate-x-1/2"
        style={{
          bottom: 'calc(max(env(safe-area-inset-bottom, 0px), 14px) + 14px)',
        }}
      >
        <CaptureButton onCapture={handleCapture} />
      </div>

      {/* ── Flash overlay ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-white z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ── Photo preview ────────────────────────────────────────────── */}
      {capturedPhoto && (
        <PhotoPreview
          photoData={capturedPhoto}
          filterName={filterName}
          onClose={() => setCapturedPhoto(null)}
        />
      )}
    </div>
  );
}