import { useState } from 'react';
import { motion } from 'framer-motion';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function HeroBanner({ estado, onClaim, claiming }) {
  const streak = estado?.streak || 0;
  const nextEnergyIn = estado?.nextEnergyIn || 0;

  // Format countdown: nextEnergyIn is in minutes
  const formatCountdown = (minutes) => {
    if (minutes <= 0) return 'Ya disponible';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // Get today's day index (0=Mon, 6=Sun)
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <motion.div
      className="relative mb-12 rounded-2xl overflow-hidden border border-[#7c3aed]/30 p-10 md:p-16"
      style={{
        background: 'radial-gradient(circle at 100% 0%, rgba(124, 58, 237, 0.1), rgba(13, 13, 20, 0.8))',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Season chip */}
      <motion.div
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[#7c3aed]/40 bg-[#7c3aed]/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-xs font-semibold text-[#a78bfa]">Temporada 3 — Semana 2</span>
      </motion.div>

      {/* Title & Subtitle */}
      <motion.h1
        className="text-4xl md:text-5xl font-black text-white mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        Mis recompensas
      </motion.h1>

      <motion.p
        className="text-[#cfc2d6] mb-10 text-sm md:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Racha de <span className="font-bold text-white">{streak} días</span> • Próxima recompensa en{' '}
        <span className="font-bold text-[#e8b800]">{formatCountdown(nextEnergyIn)}</span>
      </motion.p>

      {/* 7-Day Streak Circles */}
      <motion.div
        className="flex gap-5 mb-10 flex-wrap"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
        initial="hidden"
        animate="visible"
      >
        {DAYS.map((day, idx) => {
          const isClaimed = idx < streak;
          const isToday = idx === todayIndex;
          const isDay7 = idx === 6;

          return (
            <motion.div
              key={idx}
              className={`flex flex-col items-center gap-2 ${isDay7 ? 'relative' : ''}`}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              {/* Circle */}
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black transition-all ${
                  isToday
                    ? 'border-2 border-[#7c3aed] bg-[#7c3aed]/20'
                    : isClaimed
                      ? 'border-2 border-[#e8b800]/60 bg-transparent'
                      : 'border-2 border-[#555] bg-transparent'
                }`}
              >
                {isClaimed ? (
                  <span className="material-symbols-outlined text-[#e8b800]" style={{ fontSize: '20px' }}>
                    check
                  </span>
                ) : isDay7 ? (
                  <span className="text-xl">🎴</span>
                ) : (
                  <span className={isToday ? 'text-[#7c3aed]' : 'text-[#666]'}>{idx + 1}</span>
                )}
              </motion.div>

              {/* Day label */}
              <span className={`text-xs font-bold uppercase ${isToday ? 'text-[#7c3aed]' : 'text-[#999]'}`}>{day}</span>

              {/* Day 7 special badge */}
              {isDay7 && (
                <motion.div
                  className="absolute -top-2 -right-2 w-5 h-5 bg-[#e8b800] rounded-full flex items-center justify-center text-white text-xs font-black"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  +
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Claim Button */}
      <motion.button
        onClick={onClaim}
        disabled={claiming || !estado?.bonusDisponible}
        className={`px-8 py-4 rounded-lg font-black text-sm tracking-widest uppercase transition-all ${
          estado?.bonusDisponible
            ? 'bg-gradient-to-r from-[#e8b800] to-[#d4a000] text-black hover:brightness-110 active:scale-95'
            : 'bg-[#666] text-[#999] cursor-not-allowed'
        }`}
        whileHover={estado?.bonusDisponible ? { scale: 1.05 } : {}}
        whileTap={estado?.bonusDisponible ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {claiming ? 'Procesando...' : '✨ Reclamar ahora'}
      </motion.button>
    </motion.div>
  );
}
