import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_FILTERS, CATEGORIES } from './filters';
import { PREMIUM_FILTERS } from './premiumFilters';

const FULL_FILTER_LIST = [...ALL_FILTERS, ...PREMIUM_FILTERS];

// Deduplicate by id (in case filters.js is updated)
const UNIQUE_FILTERS = FULL_FILTER_LIST.filter((f, i, arr) => arr.findIndex(x => x.id === f.id) === i);

export default function FilterCarousel({ activeFilter, onSelectFilter, showGallery, onToggleGallery }) {
  const scrollRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFilters = useMemo(() =>
    activeCategory === 'all'
      ? UNIQUE_FILTERS
      : UNIQUE_FILTERS.filter(f => f.category === activeCategory || (activeCategory === 'premium' && f.premium)),
    [activeCategory]
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">

      {/* ── Full filter gallery ───────────────────────────────────────── */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            className="absolute bottom-full left-0 right-0 bg-black/90 backdrop-blur-2xl rounded-t-3xl border-t border-white/10"
            style={{ maxHeight: '62vh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-white/20" />
            </div>

            {/* Category chips */}
            <div className="flex gap-1.5 px-3 pb-3 overflow-x-auto no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                    activeCategory === cat.id
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/10 text-white/65'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Filter grid */}
            <div
              className="grid gap-2 px-3 pb-6 overflow-y-auto"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
                maxHeight: '44vh',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {filteredFilters.map(filter => (
                <motion.button
                  key={filter.id}
                  whileTap={{ scale: 0.86 }}
                  onClick={() => { onSelectFilter(filter.id); onToggleGallery(); }}
                  className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all relative ${
                    activeFilter === filter.id
                      ? 'bg-yellow-400/20 ring-2 ring-yellow-400'
                      : 'bg-white/6'
                  }`}
                >
                  {filter.premium && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400" />
                  )}
                  <span className="text-2xl leading-none">{filter.emoji}</span>
                  <span className={`text-[9px] font-bold leading-none ${
                    activeFilter === filter.id ? 'text-yellow-400' : 'text-white/55'
                  }`}>
                    {filter.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom controls ──────────────────────────────────────────── */}
      <div
        className="pt-2"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 65%, transparent 100%)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 14px)',
        }}
      >
        {/* Horizontal filter strip */}
        <div
          ref={scrollRef}
          className="flex gap-2 px-4 overflow-x-auto no-scrollbar mb-2.5"
          style={{ WebkitOverflowScrolling: 'touch', paddingTop: 4, paddingBottom: 4 }}
        >
          {UNIQUE_FILTERS.map(filter => (
            <motion.button
              key={filter.id}
              whileTap={{ scale: 0.86 }}
              onClick={() => onSelectFilter(filter.id)}
              className="flex-shrink-0 flex flex-col items-center gap-1"
            >
              <div className={`flex items-center justify-center rounded-full transition-all relative
                w-12 h-12 sm:w-14 sm:h-14 text-lg sm:text-xl
                ${activeFilter === filter.id
                  ? 'bg-yellow-400/25 ring-2 ring-yellow-400 ring-offset-1 ring-offset-transparent shadow-lg shadow-yellow-400/20'
                  : 'bg-white/12'
                }`}
              >
                {filter.emoji}
                {filter.premium && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-yellow-400 border border-black" />
                )}
              </div>
              <span className={`text-[8px] sm:text-[9px] font-bold leading-none ${
                activeFilter === filter.id ? 'text-yellow-400' : 'text-white/40'
              }`}>
                {filter.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-center gap-6 px-6">
          {/* Gallery toggle */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onToggleGallery}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              showGallery
                ? 'bg-yellow-400/30 ring-1 ring-yellow-400'
                : 'bg-white/12'
            }`}
          >
            <span className="text-xl">🎭</span>
          </motion.button>

          {/* Capture slot */}
          <div className="w-20 h-20 flex-shrink-0" />

          {/* Balance spacer */}
          <div className="w-11 h-11" />
        </div>
      </div>
    </div>
  );
}