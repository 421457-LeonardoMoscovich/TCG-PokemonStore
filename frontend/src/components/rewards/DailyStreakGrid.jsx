import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionPreference } from '../../hooks/useMotionPreference';

export default function DailyStreakGrid({ estado, onClaim, claiming }) {
  const prefersReducedMotion = useMotionPreference();
  const [particles, setParticles] = useState([]);

  const handleClaim = async () => {
    // Trigger particle burst (only if user doesn't prefer reduced motion)
    if (!prefersReducedMotion) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        scale: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 0.2,
        angle: (i / 8) * Math.PI * 2
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
    }

    await onClaim();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.04,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const dayVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.05, duration: 0.4 }
    })
  };

  return (
    <motion.section className="mb-16" initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.6, delay: 0.1 }}>
      <div className="mb-8 relative">
        <div className="absolute -left-8 top-0 text-[60px] font-black text-[#ddb7ff]/5 select-none leading-none">01</div>
        <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none mb-2">Bonificación Diaria</h2>
        <p className="text-[#ddb7ff] text-sm">Racha actual: <span className="font-bold">{String(estado?.streak || 0).padStart(2, '0')} días</span></p>
      </div>

      <motion.div
        className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[1, 2, 3, 4, 5, 6, 7].map((num, idx) => {
          const isClaimed = (estado?.streak || 0) >= num;
          const isNext = (estado?.streak || 0) + 1 === num && estado?.bonusDisponible;
          const isDay7 = num === 7;

          return (
            <motion.div
              key={num}
              custom={idx}
              variants={dayVariants}
              whileHover={!isClaimed && !isNext ? {} : 'hover'}
              className={`border transition-all p-4 flex flex-col items-center justify-center aspect-square md:aspect-auto md:min-h-[160px] min-w-[44px] relative overflow-hidden cursor-pointer rounded-lg ${
                isNext
                  ? 'border-[#ffe083] bg-[#ffe083]/5 shadow-[0_0_30px_rgba(255,224,131,0.2)]'
                  : isClaimed
                    ? 'border-[#ddb7ff]/40 bg-[#ddb7ff]/5 opacity-60'
                    : 'border-white/5 bg-white/[0.02] opacity-30 scanline-subtle'
              } ${isDay7 ? 'border-2' : ''}`}
            >
              {!isClaimed && !isNext && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-20 z-0" />
              )}

              {isNext && (
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-[#ffe083] via-transparent to-[#ffe083] rounded-lg"
                  animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ opacity: 0.3, zIndex: 0 }}
                />
              )}

              <span className={`text-[10px] font-black mb-4 uppercase tracking-[0.2em] relative z-10 ${isClaimed || isNext ? 'text-[#ddb7ff]' : 'text-[#e5e2e1]/40'}`}>
                Día {num}
              </span>

              {isDay7 ? (
                <div className="flex flex-col items-center relative z-10">
                  <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: isNext ? "'FILL' 1" : "'FILL' 0", color: isNext ? '#ffe083' : '#e5e2e1'}} >card_membership</span>
                  <span className={`text-[11px] font-black mt-2 ${isNext ? 'text-[#ffe083]' : 'text-[#e5e2e1]/20'}`}>
                    Pack Maestro
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center relative z-10">
                  <motion.span
                    className="material-symbols-outlined text-3xl"
                    style={{color: isClaimed ? '#ddb7ff' : '#e5e2e1'}}
                    animate={isNext ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    check_circle
                  </motion.span>
                  <span className={`text-[11px] font-black mt-2 ${isClaimed ? 'text-[#ddb7ff]' : (isNext ? 'text-white' : 'text-[#e5e2e1]/20')}`}>
                    {estado?.streakRewards?.[num - 1] || 50}
                  </span>
                </div>
              )}

              <div className={`text-[9px] font-black uppercase mt-4 tracking-widest relative z-10 ${isClaimed ? 'text-[#ddb7ff]' : (isNext ? 'text-[#ffe083]' : 'text-[#e5e2e1]/50')}`}>
                {isClaimed ? 'Obtenido' : (isNext ? 'Disponible' : 'Bloqueado')}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="bg-[#1c1b1b]/70 backdrop-blur-[20px] border-l-4 border-[#ffe083] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 rounded-lg relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none scanline-effect" />
        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-1">
            {estado?.mensajeBonus || "Vuelve mañana para más premios"}
          </h3>
          <p className="text-[10px] text-[#e5e2e1]/30 font-black uppercase tracking-widest">Se actualiza cada 24 horas</p>
        </div>
        <motion.button
          onClick={handleClaim}
          disabled={claiming || !estado?.bonusDisponible}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-auto min-h-[48px] px-8 md:px-12 py-3 md:py-5 bg-gradient-to-br from-[#ffe083] via-[#eec200] to-[#b68a00] text-black font-black text-sm tracking-widest uppercase transition-all shadow-[0_0_40px_rgba(255,224,131,0.2)] disabled:grayscale disabled:opacity-40 hover:brightness-110 disabled:cursor-not-allowed disabled:hover:brightness-100 whitespace-nowrap relative z-10 rounded-lg flex items-center justify-center"
        >
          {claiming ? 'Procesando...' : 'Reclamar Ahora'}
        </motion.button>
      </motion.div>

      {/* Particles */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="fixed w-2 h-2 bg-[#ffe083] rounded-full pointer-events-none"
            initial={{
              x: window.innerWidth / 2,
              y: window.innerHeight - 100,
              scale: 0,
              opacity: 1
            }}
            animate={{
              x: window.innerWidth / 2 + p.x * 50,
              y: window.innerHeight - 100 + p.y * 50,
              scale: 0,
              opacity: 0
            }}
            transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </motion.section>
  );
}
