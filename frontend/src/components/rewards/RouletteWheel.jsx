import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionPreference } from '../../hooks/useMotionPreference';

const SEGMENTS = [
  { label: '50 Monedas', icon: 'attach_money', color: '#FFD700' },
  { label: '¡Carta Épica!', icon: 'card_giftcard', color: '#B138EE' },
  { label: '100 Monedas', icon: 'attach_money', color: '#FFD700' },
  { label: '+1 Energía', icon: 'bolt', color: '#ddb7ff' },
  { label: '75 Monedas', icon: 'attach_money', color: '#FFD700' },
  { label: 'Carta Rara', icon: 'card_giftcard', color: '#2196F3' },
  { label: '200 Monedas', icon: 'attach_money', color: '#FFD700' },
  { label: '¡JACKPOT! (1000)', icon: 'stars', color: '#FF6B6B' },
];

export default function RouletteWheel({ estado, onSpin, spinning, result, onResultClose }) {
  const prefersReducedMotion = useMotionPreference();
  const [rotation, setRotation] = useState(0);

  const handleSpin = async () => {
    if (spinning || (estado?.energy || 0) < 2) return;
    
    // Al empezar, solo disparamos el evento al padre
    onSpin();
  };

  // Efecto para controlar la rotación cuando llega el resultado
  useEffect(() => {
    if (result && result.index !== undefined) {
      // Calculamos la rotación final: vueltas completas + el índice del premio
      // El índice 0 es 0deg, el 1 es 45deg, etc.
      // Pero como gira a la izquierda/derecha, compensamos
      const targetRotation = (result.index * 45) + (360 * 5); // 5 vueltas extra
      setRotation(targetRotation);
    }
  }, [result]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="bg-[#1c1b1b]/70 backdrop-blur-[20px] border border-[#4d4354] p-8 relative overflow-hidden rounded-lg vault-panel"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay: 0.15 }}
      whileHover={{ borderColor: 'rgba(221, 183, 255, 0.6)', transition: { duration: 0.3 } }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ddb7ff] via-transparent to-[#ddb7ff] opacity-50" />

      <motion.div
        className="flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h3
          className="text-2xl font-black text-white mb-6 uppercase relative z-10"
          variants={itemVariants}
        >
          Ruleta de Premios
        </motion.h3>

        <motion.div
          className="relative w-64 h-64 flex items-center justify-center mb-8"
          variants={itemVariants}
        >
          {/* Outer rings */}
          <motion.div
            className="absolute inset-0 border-2 border-[#ddb7ff]/20 rounded-full"
            animate={{ scale: spinning ? [1, 1.1, 1] : [1, 1.05, 1] }}
            transition={{ duration: spinning ? 0.5 : 2, repeat: Infinity }}
          />
          <div className="absolute inset-4 border border-[#ddb7ff]/40 rounded-full" />

          {/* Wheel with conic gradient */}
          <motion.div
            className="absolute inset-8 rounded-full border-4 border-[#ddb7ff]/60 flex items-center justify-center shadow-[0_0_30px_rgba(221,183,255,0.3)]"
            style={{
              background: `conic-gradient(
                from 0deg,
                #FFD700 0deg 45deg,
                #9C27B0 45deg 90deg,
                #FFD700 90deg 135deg,
                #ddb7ff 135deg 180deg,
                #FFD700 180deg 225deg,
                #2196F3 225deg 270deg,
                #FFD700 270deg 315deg,
                #FF6B6B 315deg 360deg
              )`
            }}
            animate={{ rotate: spinning ? 360 : rotation }}
            transition={{
              duration: spinning ? 1.5 : 1.2,
              ease: spinning ? 'easeInOut' : 'easeOut'
            }}
          >
            {/* Segment labels */}
            {SEGMENTS.map((seg, idx) => (
              <div
                key={idx}
                className="absolute w-full h-full flex items-center justify-center pointer-events-none"
                style={{
                  transform: `rotate(${idx * 45}deg) translateY(-55px)`
                }}
              >
                <div className="text-white font-black text-xs leading-tight text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{maxWidth: '50px'}}>
                  {seg.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Center orb */}
          <motion.div
            className="relative w-32 h-32 rounded-full bg-[#1c1b1b]/80 backdrop-blur-[20px] border border-white/20 flex items-center justify-center shadow-[0_0_40px_rgba(221,183,255,0.4)] z-10"
            animate={{ boxShadow: spinning ? '0 0 60px rgba(255, 224, 131, 0.6)' : '0 0 40px rgba(221, 183, 255, 0.4)' }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="material-symbols-outlined text-5xl text-[#ffe083] drop-shadow-[0_0_10px_#ffe083]"
              style={{fontVariationSettings: "'FILL' 1"}}
              animate={{ scale: spinning ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              bolt
            </motion.span>
          </motion.div>

          {/* Pointer at top */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
            <motion.div
              className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-[#ffe083] drop-shadow-[0_0_8px_#ffe083]"
              animate={{ scale: spinning ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.p
          className="text-[#cfc2d6] text-sm mb-8 max-w-xs"
          variants={itemVariants}
        >
          Gira la ruleta y prueba tu suerte. Puedes ganar monedas, energía o cartas especiales.
        </motion.p>

        <motion.div className="flex flex-col gap-5 w-full" variants={containerVariants} initial="hidden" animate="visible">
          <motion.button
            onClick={handleSpin}
            disabled={spinning || (estado?.energy || 0) < 2}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full min-h-[52px] px-6 py-5 bg-gradient-to-br from-[#ffe083] via-[#eec200] to-[#b68a00] text-[#3c2f00] font-black tracking-widest uppercase transition-all disabled:grayscale disabled:opacity-40 hover:brightness-110 disabled:cursor-not-allowed disabled:hover:brightness-100 flex items-center justify-center gap-2 rounded-lg gold-btn"
            variants={itemVariants}
          >
            <motion.span
              className="material-symbols-outlined"
              animate={{ rotate: spinning ? 360 : 0 }}
              transition={{ duration: 1, repeat: spinning ? Infinity : 0 }}
            >
              play_arrow
            </motion.span>
            {spinning ? 'Girando...' : 'Girar Ahora (2 energía)'}
          </motion.button>

          <motion.div
            className="flex items-center gap-3 justify-center min-h-[48px] px-5 py-3 border border-[#4d4354] rounded-lg"
            whileHover={{ borderColor: 'rgba(221, 183, 255, 0.4)' }}
            transition={{ duration: 0.2 }}
            variants={itemVariants}
          >
            <span className="text-[#cfc2d6] text-[10px] font-bold uppercase">Intentos disponibles:</span>
            <motion.span
              className="text-[#ddb7ff] font-black"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {Math.floor((estado?.energy || 0) / 2)} / 3
            </motion.span>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              className="mt-8 p-5 border border-[#ffe083]/30 bg-[#ffe083]/5 w-full flex items-center gap-3 justify-center rounded-lg shadow-[0_0_20px_rgba(255,224,131,0.2)]"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <motion.span
                className="material-symbols-outlined text-[#ffe083]"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                stars
              </motion.span>
              <span className="text-white font-black text-sm">Ganaste: {result.recompensa || result.premio?.label}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
