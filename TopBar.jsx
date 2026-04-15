import React from 'react';
import { SwitchCamera, Zap, ZapOff, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar({ onFlipCamera, flashOn, onToggleFlash, performanceMode, onTogglePerformance }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
        paddingBottom: 10,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)',
      }}
    >
      {/* Logo */}
      <div className="text-white font-black text-xl tracking-tight leading-none select-none">
        <span className="text-yellow-400">Snap</span>Cam
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Performance toggle */}
        <button
          onClick={onTogglePerformance}
          title={performanceMode ? 'High Quality' : 'Performance Mode'}
          className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all active:scale-90 ${
            performanceMode ? 'bg-yellow-400/30 text-yellow-400' : 'bg-black/30 text-white/60'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Flash */}
        <button
          onClick={onToggleFlash}
          className={`w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all active:scale-90 ${
            flashOn ? 'ring-1 ring-yellow-400' : ''
          }`}
        >
          {flashOn
            ? <Zap className="w-4 h-4 text-yellow-400" />
            : <ZapOff className="w-4 h-4 text-white/70" />}
        </button>

        {/* Flip camera */}
        <button
          onClick={onFlipCamera}
          className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white transition-all active:scale-90"
        >
          <SwitchCamera className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}