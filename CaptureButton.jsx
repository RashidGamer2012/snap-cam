import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CaptureButton({ onCapture }) {
  const [pressed, setPressed] = useState(false);

  const handleCapture = () => {
    setPressed(true);
    onCapture();
    setTimeout(() => setPressed(false), 300);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={handleCapture}
      className="relative w-20 h-20 flex items-center justify-center"
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-white/90" />
      {/* Inner circle */}
      <motion.div
        animate={pressed ? { scale: 0.85 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
        className="w-16 h-16 rounded-full bg-white"
      />
    </motion.button>
  );
}