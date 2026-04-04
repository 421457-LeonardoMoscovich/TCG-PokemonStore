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
  'común': {
    bg: '#4a5568',
    border: '#718096',
    glow: 'rgba(113, 128, 150, 0.3)',
    icon: '#94a3b8',
    gradient: 'linear-gradient(135deg, #4a5568, #64748b)'
  },
  'raro': {
    bg: '#1e40af',
    border: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.4)',
    icon: '#60a5fa',
    gradient: 'linear-gradient(135deg, #1e40af, #2563eb)'
  },
  'épico': {
    bg: '#6b21a8',
    border: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
    icon: '#c084fc',
    gradient: 'linear-gradient(135deg, #6b21a8, #7c3aed)'
  },
  'legendario': {
    bg: '#b45309',
    border: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.5)',
    icon: '#fbbf24',
    gradient: 'linear-gradient(135deg, #b45309, #d97706)'
  },
};

export default function AchievementCard({ logro, index, isNew = false, onClaim, claiming = false }) {
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
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: index * 0.08, duration: 0.5, ease: 'easeOut' }
    }
  };

  const unlockVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 300 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={isComplete ? { y: -8, transition: { duration: 0.2 } } : {}}
      className="relative overflow-hidden rounded-lg"
    >
      <div
        className="bg-[#0e0e0e] p-6 border-l-4 border-t border-r border-b relative overflow-hidden cursor-pointer transition-all"
        style={{
          borderColor: tier.border,
          borderLeftColor: tier.border,
          backgroundColor: `${tier.bg}20`,
          boxShadow: isComplete ? `0 0 20px ${tier.glow}, inset 0 0 20px ${tier.glow}` : 'none'
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: tier.bg }}
        />

        {/* Ghost number */}
        <motion.div
          className="absolute top-0 right-0 text-[40px] font-black select-none leading-none -mr-2 -mt-2"
          style={{ color: `${tier.border}20` }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        {/* Content */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex-1">
            <h4 className="text-sm font-black text-[#e5e2e1] uppercase mb-1">{logro.titulo}</h4>
            <p className="text-xs text-[#cfc2d6]">{logro.desc || logro.descripcion}</p>
          </div>

          {/* Icon Container */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-4 border transition-all"
            style={{
              backgroundColor: `${tier.border}15`,
              borderColor: tier.border,
              boxShadow: `0 0 15px ${tier.glow}`
            }}
          >
            <motion.span
              className="material-symbols-outlined text-lg"
              style={{ color: tier.border }}
              animate={isComplete ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {icon}
            </motion.span>
          </div>

          {/* Unlock badge */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                variants={unlockVariants}
                initial="hidden"
                animate="visible"
                className="absolute -top-4 -right-4 w-16 h-16 flex items-center justify-center rounded-full shadow-lg"
                style={{ background: tier.gradient }}
              >
                <motion.span
                  className="material-symbols-outlined text-white text-2xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{fontVariationSettings: "'FILL' 1"}}
                >
                  verified
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <motion.div
          className="w-full min-h-[4px] md:h-2 bg-[#1a1a1a] rounded-full overflow-hidden"
          whileHover={{ height: 12 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full transition-all"
            style={{
              background: `linear-gradient(90deg, ${tier.border}, ${tier.glow})`,
              boxShadow: `0 0 10px ${tier.glow}`
            }}
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex justify-between mt-3 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xs font-bold" style={{ color: tier.border }}>
            {Math.min(Math.round(progress), 100)}%
          </span>
          <span className="text-xs font-bold text-[#cfc2d6]">
            {logro.actual} / {logro.meta}
          </span>
        </motion.div>

        {/* Rarity label */}
        <motion.div
          className="absolute bottom-2 left-6 text-[9px] font-black uppercase tracking-wider"
          style={{ color: tier.border }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {rarity}
        </motion.div>

        {/* Claim Button */}
        <AnimatePresence>
          {isComplete && !logro.reclamado && (
            <motion.button
              onClick={() => onClaim && onClaim(logro.id)}
              disabled={claiming}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-4 py-3 bg-gradient-to-br from-[#ffe083] via-[#eec200] to-[#b68a00] text-black font-black text-[10px] tracking-widest uppercase rounded flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,224,131,0.3)] disabled:grayscale disabled:opacity-50 relative z-20"
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
            className="w-full mt-4 py-3 border border-[#ddb7ff]/20 bg-[#ddb7ff]/5 text-[#ddb7ff] font-black text-[10px] tracking-widest uppercase rounded flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Recompensa Reclamada
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
