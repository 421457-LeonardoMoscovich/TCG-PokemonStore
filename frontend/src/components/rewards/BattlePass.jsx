import { useState } from 'react';
import { motion } from 'framer-motion';
import { BATTLE_PASS_NODES } from '../../lib/mockData';

export default function BattlePass() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const currentXP = 60;
  const maxXP = 100;
  const level = 4;
  const xpPercent = (currentXP / maxXP) * 100;

  return (
    <motion.div
      className="rounded-xl border border-[#7c3aed]/20 bg-[#1c1b1b]/70 backdrop-blur-[20px]"
      style={{
        padding: '28px',
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between"
        style={{
          marginBottom: '28px',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2
            className="text-2xl md:text-3xl font-black text-white"
            style={{ marginBottom: '8px' }}
          >
            Pase de batalla
          </h2>
          <p className="text-xs text-[#cfc2d6] uppercase tracking-[0.14em]">
            Temporada 3
          </p>
        </div>

        <div
          className="flex items-center"
          style={{ gap: '14px' }}
        >
          <div
            className="inline-flex items-center rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10"
            style={{ padding: '7px 12px' }}
          >
            <span className="text-xs font-black text-[#a78bfa] tracking-[0.14em]">
              BETA
            </span>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-[#999] uppercase tracking-[0.16em]">
              Nivel
            </p>
            <p
              className="text-2xl md:text-3xl font-black text-[#e8b800]"
              style={{ marginTop: '4px' }}
            >
              {level}
            </p>
          </div>
        </div>
      </div>

      {/* Track */}
      <div
        className="relative"
        style={{ marginBottom: '26px' }}
      >
        <div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed]/25 via-[#7c3aed]/50 to-[#7c3aed]/25 pointer-events-none"
          style={{ top: '24px' }}
        />

        <motion.div
          className="flex justify-between relative z-10"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="visible"
        >
          {BATTLE_PASS_NODES.map((node) => {
            const isUnlocked = node.state === 'unlocked' || node.state === 'current';
            const isCurrent = node.state === 'current';

            return (
              <motion.div
                key={node.id}
                className="relative flex flex-col items-center"
                style={{ gap: '10px' }}
                variants={{
                  hidden: { opacity: 0, scale: 0.82 },
                  visible: { opacity: 1, scale: 1 },
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <motion.div
                  className={`rounded-full flex items-center justify-center text-xl font-black relative transition-all ${
                    isCurrent
                      ? 'border-2 border-[#e8b800] bg-[#e8b800]/20 shadow-[0_0_20px_rgba(232,184,0,0.35)]'
                      : isUnlocked
                      ? 'border-2 border-[#7c3aed] bg-[#7c3aed]/10'
                      : 'border-2 border-[#444] bg-[#1a1a1a] opacity-35'
                  }`}
                  style={{
                    width: '48px',
                    height: '48px',
                  }}
                  animate={isCurrent ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span>{node.icon}</span>
                </motion.div>

                <span
                  className={`text-xs font-black ${
                    isCurrent
                      ? 'text-[#e8b800]'
                      : isUnlocked
                      ? 'text-[#7c3aed]'
                      : 'text-[#666]'
                  }`}
                >
                  {node.special ? '★' : node.id}
                </span>

                {hoveredNode === node.id && (
                  <motion.div
                    className="absolute top-full rounded-lg bg-[#0d0d14] border border-[#7c3aed]/40 text-xs font-bold text-[#cfc2d6] whitespace-nowrap z-50"
                    style={{
                      marginTop: '10px',
                      padding: '9px 12px',
                    }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {node.reward}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* XP */}
      <div style={{ marginBottom: '14px' }}>
        <motion.div
          className="rounded-full bg-[#1a1a1a] overflow-hidden border border-[#7c3aed]/20"
          style={{ height: '12px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
          />
        </motion.div>
      </div>

      <div
        className="flex items-center justify-between"
        style={{
          gap: '14px',
          flexWrap: 'wrap',
        }}
      >
        <span className="font-black text-white text-base">
          {currentXP} / {maxXP} XP
        </span>

        <span className="text-xs text-[#999]">
          Gana XP jugando y girando la ruleta
        </span>
      </div>
    </motion.div>
  );
}
