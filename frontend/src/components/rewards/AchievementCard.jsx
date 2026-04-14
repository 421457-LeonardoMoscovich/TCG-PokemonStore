import { motion, AnimatePresence } from 'framer-motion';

const ACHIEVEMENT_ICONS = {
  'Primera Compra': 'shopping_cart',
  'Coleccionista': 'collections',
  'Racha de Oro': 'local_fire_department',
  'Ganadero': 'diamond',
  'Millonario': 'money',
  'Adivino': 'psychology',
  'Afortunado': 'casino',
  'Maestro': 'star',
};

const RARITY_TIERS = {
  común: {
    bg: '#4a5568',
    border: '#718096',
    glow: 'rgba(113, 128, 150, 0.28)',
    icon: '#94a3b8',
    gradient: 'linear-gradient(135deg, #4a5568, #64748b)',
  },
  raro: {
    bg: '#1e40af',
    border: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.35)',
    icon: '#60a5fa',
    gradient: 'linear-gradient(135deg, #1e40af, #2563eb)',
  },
  épico: {
    bg: '#6b21a8',
    border: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.38)',
    icon: '#c084fc',
    gradient: 'linear-gradient(135deg, #6b21a8, #7c3aed)',
  },
  legendario: {
    bg: '#b45309',
    border: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.45)',
    icon: '#fbbf24',
    gradient: 'linear-gradient(135deg, #b45309, #d97706)',
  },
};

export default function AchievementCard({
  logro,
  index,
  onClaim,
  claiming = false,
}) {
  const getRarity = (title) => {
    if (title.includes('Maestro') || title.includes('Primera')) return 'legendario';
    if (title.includes('Millonario')) return 'épico';
    if (title.includes('Racha')) return 'raro';
    return 'común';
  };

  const rarity = getRarity(logro.titulo);
  const tier = RARITY_TIERS[rarity] || RARITY_TIERS.común;
  const icon = ACHIEVEMENT_ICONS[logro.titulo] || 'achievement';
  const progress = Math.min((logro.actual / logro.meta) * 100, 100);
  const isComplete = logro.completado;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 18 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: index * 0.07, duration: 0.45, ease: 'easeOut' },
    },
  };

  const unlockVariants = {
    hidden: { scale: 0, rotate: -160 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 280, damping: 18 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.18 } }}
      className="relative overflow-hidden rounded-xl"
    >
      <div
        className="relative overflow-hidden transition-all"
        style={{
          padding: '22px',
          borderTop: `1px solid ${tier.border}`,
          borderRight: `1px solid ${tier.border}`,
          borderBottom: `1px solid ${tier.border}`,
          borderLeft: `4px solid ${tier.border}`,
          borderRadius: '14px',
          backgroundColor: `${tier.bg}20`,
          boxShadow: isComplete
            ? `0 0 18px ${tier.glow}, inset 0 0 12px ${tier.glow}`
            : 'none',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ background: tier.bg }}
        />

        <motion.div
          className="absolute top-0 right-0 text-[38px] font-black select-none leading-none"
          style={{
            color: `${tier.border}1f`,
            marginTop: '-2px',
            marginRight: '6px',
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        <div
          className="relative z-10"
          style={{ marginBottom: '16px' }}
        >
          <div
            className="flex justify-between items-start"
            style={{ gap: '16px' }}
          >
            <div className="flex-1 min-w-0">
              <h4
                className="text-sm md:text-base font-black text-[#e5e2e1] uppercase"
                style={{
                  marginBottom: '8px',
                  lineHeight: 1.15,
                  paddingRight: '10px',
                }}
              >
                {logro.titulo}
              </h4>

              <p
                className="text-sm text-[#cfc2d6] leading-relaxed"
                style={{ paddingRight: '6px' }}
              >
                {logro.desc || logro.descripcion}
              </p>
            </div>

            <div
              className="rounded-lg flex items-center justify-center shrink-0 border transition-all"
              style={{
                width: '50px',
                height: '50px',
                marginTop: '2px',
                backgroundColor: `${tier.border}15`,
                borderColor: tier.border,
                boxShadow: `0 0 14px ${tier.glow}`,
              }}
            >
              <motion.span
                className="material-symbols-outlined text-lg"
                style={{ color: tier.border }}
                animate={isComplete ? { rotate: 360 } : {}}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
              >
                {icon}
              </motion.span>
            </div>

            <AnimatePresence>
              {isComplete && (
                <motion.div
                  variants={unlockVariants}
                  initial="hidden"
                  animate="visible"
                  className="absolute flex items-center justify-center shadow-lg"
                  style={{
                    top: '-14px',
                    right: '-14px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '999px',
                    background: tier.gradient,
                  }}
                >
                  <motion.span
                    className="material-symbols-outlined text-white text-xl"
                    animate={{ scale: [1, 1.14, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          className="w-full rounded-full overflow-hidden"
          style={{
            height: '10px',
            background: '#1a1a1a',
            border: '1px solid rgba(124, 58, 237, 0.16)',
          }}
          whileHover={{ height: 12 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${tier.border}, ${tier.icon})`,
              boxShadow: `0 0 10px ${tier.glow}`,
            }}
          />
        </motion.div>

        <motion.div
          className="flex justify-between relative z-10"
          style={{ marginTop: '12px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
        >
          <span
            className="text-xs font-bold"
            style={{ color: tier.border }}
          >
            {Math.min(Math.round(progress), 100)}%
          </span>

          <span className="text-xs font-bold text-[#cfc2d6]">
            {logro.actual} / {logro.meta}
          </span>
        </motion.div>

        <motion.div
          className="text-[10px] font-black uppercase tracking-[0.14em]"
          style={{
            color: tier.border,
            marginTop: '12px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {rarity}
        </motion.div>

        <AnimatePresence>
          {isComplete && !logro.reclamado && (
            <motion.button
              onClick={() => onClaim && onClaim(logro.id)}
              disabled={claiming}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-black font-black uppercase rounded flex items-center justify-center gap-2 disabled:grayscale disabled:opacity-50 relative z-20"
              style={{
                marginTop: '18px',
                padding: '13px 16px',
                fontSize: '11px',
                letterSpacing: '0.14em',
                background: 'linear-gradient(135deg, #ffe083, #eec200, #b68a00)',
                boxShadow: '0 0 20px rgba(255,224,131,0.25)',
              }}
            >
              <span className="material-symbols-outlined text-sm">stars</span>
              {claiming ? 'Procesando...' : `Reclamar ${logro.premio} Monedas`}
            </motion.button>
          )}
        </AnimatePresence>

        {logro.reclamado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full border border-[#ddb7ff]/20 bg-[#ddb7ff]/5 text-[#ddb7ff] font-black uppercase rounded flex items-center justify-center gap-2"
            style={{
              marginTop: '18px',
              padding: '13px 16px',
              fontSize: '11px',
              letterSpacing: '0.14em',
            }}
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Recompensa reclamada
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
