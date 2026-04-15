import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share2, CheckCircle } from 'lucide-react';

export default function PhotoPreview({ photoData, onClose, filterName }) {
  const [saved, setSaved] = useState(false);

  if (!photoData) return null;

  const handleSave = () => {
    const link = document.createElement('a');
    link.download = `snapcam-${filterName || 'photo'}-${Date.now()}.png`;
    link.href = photoData;
    link.click();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await (await fetch(photoData)).blob();
        const file = new File([blob], 'snapcam-photo.png', { type: 'image/png' });
        await navigator.share({ files: [file], title: 'SnapCam Photo' });
      } catch {
        handleSave();
      }
    } else {
      handleSave();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <span className="text-white/50 text-sm font-medium tracking-wide uppercase text-xs">
            {filterName}
          </span>
          <div className="w-10" />
        </div>

        {/* Photo */}
        <div className="flex-1 flex items-center justify-center px-3 py-2">
          <motion.img
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            src={photoData}
            alt="Captured"
            className="max-w-full max-h-full rounded-3xl object-contain shadow-2xl"
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}
          />
        </div>

        {/* Save confirmation toast */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-36 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full shadow-xl font-semibold text-sm"
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
              Saved to device!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom actions */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', damping: 22 }}
          className="flex items-center justify-center gap-3 px-6 pt-4"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}
        >
          {/* Save button — large, prominent, Snapchat-style */}
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2.5 bg-yellow-400 text-black rounded-2xl py-4 text-base font-black active:scale-95 transition-transform shadow-xl"
            style={{ minHeight: 58 }}
          >
            <Download className="w-5 h-5 flex-shrink-0" />
            Save Photo
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/15 active:scale-95 transition-transform flex-shrink-0"
            style={{ minHeight: 58 }}
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}