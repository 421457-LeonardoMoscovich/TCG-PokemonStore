import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEGMENTS = [
  { label: '50', sublabel: 'Monedas', icon: 'attach_money', color: '#FFD700' },
  { label: 'Épica', sublabel: 'Carta', icon: 'card_giftcard', color: '#B138EE' },
  { label: '100', sublabel: 'Monedas', icon: 'attach_money', color: '#FFD700' },
  { label: '+1', sublabel: 'Energía', icon: 'bolt', color: '#ddb7ff' },
  { label: '75', sublabel: 'Monedas', icon: 'attach_money', color: '#FFD700' },
  { label: 'Rara', sublabel: 'Carta', icon: 'card_giftcard', color: '#2196F3' },
  { label: '200', sublabel: 'Monedas', icon: 'attach_money', color: '#FFD700' },
  { label: 'JACKPOT', sublabel: '1000', icon: 'stars', color: '#FF6B6B' },
];

const FULL_TURN = 360;
const POINTER_ANGLE = 0;
const FIRST_SEGMENT_CENTER_ANGLE = 0;

export default function RouletteWheel({ estado, onSpin, spinning, result }) {
  const [rotation, setRotation] = useState(0);

  const segmentAngle = FULL_TURN / SEGMENTS.length;

  const handleSpin = async () => {
    if (spinning || (estado?.energy || 0) < 2) return;

    // Giro visual inicial para que empiece a moverse inmediatamente.
    setRotation((prev) => prev + 360 * 3);

    onSpin();
  };

  useEffect(() => {
    if (result && result.index !== undefined) {
      const normalizedIndex =
        ((result.index % SEGMENTS.length) + SEGMENTS.length) % SEGMENTS.length;

      // La flecha está fija arriba, así que la rueda debe rotar en sentido inverso
      // al índice para que el segmento correcto quede bajo la flecha.
      const winningSegmentCenter =
        FIRST_SEGMENT_CENTER_ANGLE + normalizedIndex * segmentAngle;
      const targetAngle =
        (POINTER_ANGLE - winningSegmentCenter + FULL_TURN) % FULL_TURN;

      const frame = requestAnimationFrame(() => setRotation((prev) => {
        const currentAngle = ((prev % FULL_TURN) + FULL_TURN) % FULL_TURN;
        const delta = (targetAngle - currentAngle + FULL_TURN) % FULL_TURN;

        // Sumamos vueltas extra para que el cierre del spin sea vistoso.
        return prev + FULL_TURN * 4 + delta;
      }));

      return () => cancelAnimationFrame(frame);
    }
  }, [result, segmentAngle]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl vault-panel bg-[#1c1b1b]/70 backdrop-blur-[20px] border border-[#4d4354]"
      style={{ padding: '26px' }}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay: 0.15 }}
      whileHover={{ borderColor: 'rgba(221, 183, 255, 0.6)', transition: { duration: 0.25 } }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ddb7ff] via-transparent to-[#ddb7ff] opacity-50" />

      <motion.div
        className="flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h3
          className="text-2xl md:text-3xl font-black text-white uppercase relative z-10"
          style={{ marginBottom: '20px' }}
          variants={itemVariants}
        >
          Ruleta de premios
        </motion.h3>

        <motion.div
          className="relative flex items-center justify-center"
          style={{
            width: '300px',
            height: '300px',
            marginBottom: '24px',
          }}
          variants={itemVariants}
        >
          <motion.div
            className="absolute inset-0 border-2 border-[#ddb7ff]/20 rounded-full"
            animate={{ scale: spinning ? [1, 1.08, 1] : [1, 1.03, 1] }}
            transition={{ duration: spinning ? 0.5 : 2, repeat: Infinity }}
          />
          <div className="absolute inset-[16px] border border-[#ddb7ff]/35 rounded-full" />
          <div className="absolute inset-[30px] border border-[#ddb7ff]/15 rounded-full" />

          <motion.div
            className="absolute rounded-full border-[5px] border-[#f4d98a]/80 shadow-[0_0_30px_rgba(221,183,255,0.22)] overflow-hidden"
            style={{
              inset: '34px',
              background: `conic-gradient(
                from -22.5deg,
                #FFD700 0deg 45deg,
                #B138EE 45deg 90deg,
                #FFD700 90deg 135deg,
                #C9A7FF 135deg 180deg,
                #FFD700 180deg 225deg,
                #3498DB 225deg 270deg,
                #FFD700 270deg 315deg,
                #FF6B6B 315deg 360deg
              )`,
            }}
            animate={{ rotate: rotation }}
            transition={{
              duration: spinning ? 3 : 1.2,
              ease: spinning ? 'easeInOut' : 'easeOut',
            }}
          >
            {SEGMENTS.map((seg, idx) => {
              const angle = idx * 45;

              return (
                <div
                  key={idx}
                  className="absolute left-1/2 top-1/2 pointer-events-none"
                  style={{
                    width: '0px',
                    height: '0px',
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div
                    style={{
                      transform: 'translate(-50%, -50%) translateY(-88px) rotate(22.5deg)',
                      width: '64px',
                    }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '13px',
                        color: '#fff7cc',
                        marginBottom: '2px',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.85))',
                      }}
                    >
                      {seg.icon}
                    </span>

                    <div
                      style={{
                        fontSize: '11px',
                        lineHeight: '1',
                        fontWeight: 900,
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.85)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {seg.label}
                    </div>

                    <div
                      style={{
                        fontSize: '8px',
                        lineHeight: '1.05',
                        marginTop: '2px',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)',
                        textShadow: '0 1px 3px rgba(0,0,0,0.85)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {seg.sublabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            className="relative rounded-full bg-[#1c1b1b]/88 backdrop-blur-[20px] border border-white/15 flex items-center justify-center z-10"
            style={{
              width: '112px',
              height: '112px',
              boxShadow: spinning
                ? '0 0 55px rgba(255, 224, 131, 0.45)'
                : '0 0 30px rgba(221, 183, 255, 0.25)',
            }}
            animate={{
              boxShadow: spinning
                ? '0 0 55px rgba(255, 224, 131, 0.45)'
                : '0 0 30px rgba(221, 183, 255, 0.25)',
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="material-symbols-outlined text-4xl text-[#ffe083]"
              style={{ fontVariationSettings: "'FILL' 1" }}
              animate={{ scale: spinning ? [1, 1.14, 1] : [1, 1.05, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              bolt
            </motion.span>
          </motion.div>

          <div
            className="absolute left-1/2 z-20"
            style={{ top: '-4px', transform: 'translateX(-50%)' }}
          >
            <motion.div
              className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[12px] border-l-transparent border-r-transparent border-t-[#ffe083]"
              style={{ filter: 'drop-shadow(0 0 8px #ffe083)' }}
              animate={{ scale: spinning ? [1, 1.16, 1] : [1, 1.04, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.p
          className="text-[#cfc2d6] text-sm leading-relaxed"
          style={{
            marginBottom: '22px',
            maxWidth: '420px',
          }}
          variants={itemVariants}
        >
          Gira la ruleta y prueba tu suerte. Puedes ganar monedas, energía o cartas especiales.
        </motion.p>

        <motion.div
          className="flex flex-col w-full"
          style={{ gap: '14px' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            onClick={handleSpin}
            disabled={spinning || (estado?.energy || 0) < 2}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            className="w-full bg-gradient-to-br from-[#ffe083] via-[#eec200] to-[#b68a00] text-[#3c2f00] font-black uppercase transition-all disabled:grayscale disabled:opacity-40 hover:brightness-110 disabled:cursor-not-allowed disabled:hover:brightness-100 flex items-center justify-center gap-2 rounded-lg gold-btn"
            style={{
              minHeight: '58px',
              padding: '16px 18px',
              fontSize: '14px',
              letterSpacing: '0.14em',
            }}
            variants={itemVariants}
          >
            <motion.span
              className="material-symbols-outlined"
              animate={{ rotate: spinning ? 360 : 0 }}
              transition={{ duration: 1, repeat: spinning ? Infinity : 0 }}
            >
              play_arrow
            </motion.span>
            {spinning ? 'Girando...' : 'Girar ahora (2 energía)'}
          </motion.button>

          <motion.div
            className="flex items-center justify-center border border-[#4d4354] rounded-lg"
            style={{
              minHeight: '50px',
              padding: '12px 16px',
              gap: '10px',
            }}
            whileHover={{ borderColor: 'rgba(221, 183, 255, 0.4)' }}
            transition={{ duration: 0.2 }}
            variants={itemVariants}
          >
            <span className="text-[#cfc2d6] text-[10px] font-bold uppercase tracking-[0.12em]">
              Intentos disponibles:
            </span>
            <motion.span
              className="text-[#ddb7ff] font-black text-lg"
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {Math.floor((estado?.energy || 0) / 2)} / 3
            </motion.span>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {result && !spinning && (
            <motion.div
              className="w-full flex items-center justify-center rounded-lg border border-[#ffe083]/30 bg-[#ffe083]/5 shadow-[0_0_20px_rgba(255,224,131,0.2)]"
              style={{
                marginTop: '18px',
                padding: '14px 16px',
                gap: '10px',
              }}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
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
              <span className="text-white font-black text-sm">
                Ganaste: {result.recompensa || result.premio?.label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
