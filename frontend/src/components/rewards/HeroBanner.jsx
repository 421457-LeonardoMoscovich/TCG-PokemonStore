import { motion } from 'framer-motion';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function HeroBanner({ estado, onClaim, claiming }) {
  const streak = estado?.streak || 0;
  const nextEnergyIn = estado?.nextEnergyIn || 0;

  const formatCountdown = (minutes) => {
    if (minutes <= 0) return 'Ya disponible';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <motion.div
      className="relative overflow-hidden border border-[#7c3aed]/30 rounded-2xl"
      style={{
        padding: '30px',
        background:
          'radial-gradient(circle at 100% 0%, rgba(124, 58, 237, 0.10), rgba(13, 13, 20, 0.88))',
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <motion.div
        className="inline-flex items-center rounded-full border border-[#7c3aed]/40 bg-[#7c3aed]/10"
        style={{
          marginBottom: '22px',
          padding: '8px 14px',
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08 }}
      >
        <span className="text-xs font-semibold text-[#a78bfa] tracking-[0.04em]">
          Temporada 3 — Semana 2
        </span>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-black text-white"
        style={{
          marginBottom: '12px',
          lineHeight: 0.95,
        }}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.16 }}
      >
        Mis recompensas
      </motion.h1>

      <motion.p
        className="text-[#cfc2d6] text-sm md:text-base"
        style={{
          marginBottom: '28px',
          lineHeight: 1.5,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.24 }}
      >
        Racha de <span className="font-bold text-white">{streak} días</span> • Próxima recompensa en{' '}
        <span className="font-bold text-[#e8b800]">{formatCountdown(nextEnergyIn)}</span>
      </motion.p>

      <motion.div
        className="flex flex-wrap"
        style={{
          gap: '18px',
          marginBottom: '28px',
        }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
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
              className={`flex flex-col items-center ${isDay7 ? 'relative' : ''}`}
              style={{ gap: '8px' }}
              variants={{
                hidden: { opacity: 0, scale: 0.84 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <motion.div
                className={`rounded-full flex items-center justify-center font-black transition-all ${
                  isToday
                    ? 'border-2 border-[#7c3aed] bg-[#7c3aed]/20'
                    : isClaimed
                    ? 'border-2 border-[#e8b800]/60 bg-transparent'
                    : 'border-2 border-[#555] bg-transparent'
                }`}
                style={{
                  width: '52px',
                  height: '52px',
                  fontSize: '18px',
                }}
              >
                {isClaimed ? (
                  <span
                    className="material-symbols-outlined text-[#e8b800]"
                    style={{ fontSize: '20px' }}
                  >
                    check
                  </span>
                ) : isDay7 ? (
                  <span className="text-xl">🎴</span>
                ) : (
                  <span className={isToday ? 'text-[#7c3aed]' : 'text-[#666]'}>
                    {idx + 1}
                  </span>
                )}
              </motion.div>

              <span
                className={`text-xs font-bold uppercase tracking-[0.08em] ${
                  isToday ? 'text-[#7c3aed]' : 'text-[#999]'
                }`}
              >
                {day}
              </span>

              {isDay7 && (
                <motion.div
                  className="absolute bg-[#e8b800] rounded-full flex items-center justify-center text-white font-black"
                  style={{
                    top: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px',
                    fontSize: '11px',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280 }}
                >
                  +
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <motion.button
        onClick={onClaim}
        disabled={claiming || !estado?.bonusDisponible}
        className={`font-black text-sm tracking-[0.14em] uppercase transition-all rounded-lg ${
          estado?.bonusDisponible
            ? 'bg-gradient-to-r from-[#e8b800] to-[#d4a000] text-black hover:brightness-110 active:scale-95'
            : 'bg-[#666] text-[#999] cursor-not-allowed'
        }`}
        style={{
          padding: '14px 24px',
          minHeight: '52px',
        }}
        whileHover={estado?.bonusDisponible ? { scale: 1.02 } : {}}
        whileTap={estado?.bonusDisponible ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
      >
        {claiming ? 'Procesando...' : '✨ Reclamar ahora'}
      </motion.button>
    </motion.div>
  );
}