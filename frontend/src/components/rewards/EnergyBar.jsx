import { useState, useRef, useEffect } from 'react';
import { motion, animate } from 'framer-motion';

function AnimCounter({ to, prefix = '', suffix = '' }) {
  const ref = useRef();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ctrl = animate(0, to, {
      duration: 1.2, ease: 'easeOut',
      onUpdate(v) { node.textContent = `${prefix}${Math.round(v)}${suffix}`; },
    });
    return () => ctrl.stop();
  }, [to, prefix, suffix]);
  return <span ref={ref}>0</span>;
}

export default function EnergyBar({ energy = 0, maxEnergy = 5 }) {
  const orbs = Array.from({ length: maxEnergy }, (_, i) => i < energy);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const orbVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300 } }
  };

  return (
    <motion.div
      className="flex items-center gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-[#ddb7ff] uppercase tracking-widest">Energía</span>
        <div className="flex gap-2">
          {orbs.map((isFilled, idx) => (
            <motion.div
              key={idx}
              variants={orbVariants}
              className={`w-3 h-3 rounded-full transition-all ${
                isFilled
                  ? 'bg-[#ddb7ff] shadow-[0_0_12px_rgba(221,183,255,0.6)]'
                  : 'bg-white/10 shadow-none'
              } ${isFilled ? 'animate-pulse' : ''}`}
              animate={isFilled ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </div>
        <span className="text-xs font-black text-[#ddb7ff]">
          <AnimCounter to={energy} suffix={`/${maxEnergy}`} />
        </span>
      </div>
    </motion.div>
  );
}
