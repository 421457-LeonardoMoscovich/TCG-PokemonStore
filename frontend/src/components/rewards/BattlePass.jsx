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
      className="mb-12 rounded-xl border border-[#7c3aed]/20 bg-[#1c1b1b]/70 p-8 backdrop-blur-[20px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Pase de batalla</h2>
          <p className="text-xs text-[#cfc2d6] uppercase tracking-widest">Temporada 3</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10">
            <span className="text-xs font-black text-[#a78bfa]">BETA</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#999] uppercase tracking-widest">Nivel</p>
            <p className="text-2xl font-black text-[#e8b800]">{level}</p>
          </div>
        </div>
      </div>

      {/* Battle Pass Track */}
      <div className="mb-8 relative">
        {/* Connecting line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed]/30 via-[#7c3aed]/50 to-[#7c3aed]/30 pointer-events-none" />

        {/* Nodes */}
        <motion.div
          className="flex justify-between relative z-10"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="visible"
        >
          {BATTLE_PASS_NODES.map((node, idx) => {
            const isUnlocked = node.state === 'unlocked' || node.state === 'current';
            const isCurrent = node.state === 'current';
            const isLocked = node.state === 'locked';

            return (
              <motion.div
                key={node.id}
                className="flex flex-col items-center gap-3"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node circle */}
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black relative transition-all ${
                    isCurrent
                      ? 'border-2 border-[#e8b800] bg-[#e8b800]/20 shadow-[0_0_20px_rgba(232,184,0,0.4)]'
                      : isUnlocked
                        ? 'border-2 border-[#7c3aed] bg-[#7c3aed]/10'
                        : 'border-2 border-[#444] bg-[#1a1a1a] opacity-30'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span>{node.icon}</span>
                </motion.div>

                {/* Node number */}
                <span className={`text-xs font-black ${isCurrent ? 'text-[#e8b800]' : isUnlocked ? 'text-[#7c3aed]' : 'text-[#666]'}`}>
                  {node.special ? '★' : node.id}
                </span>

                {/* Tooltip */}
                {hoveredNode === node.id && isLocked && (
                  <motion.div
                    className="absolute top-full mt-2 px-3 py-2 rounded-lg bg-[#0d0d14] border border-[#7c3aed]/50 text-xs font-bold text-[#cfc2d6] whitespace-nowrap z-50"
                    initial={{ opacity: 0, y: -5 }}
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

      {/* XP Progress Bar */}
      <div className="mb-4">
        <motion.div
          className="h-3 rounded-full bg-[#1a1a1a] overflow-hidden border border-[#7c3aed]/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          />
        </motion.div>
      </div>

      {/* XP Footer */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-black text-white">
          {currentXP} / {maxXP} XP
        </span>
        <span className="text-xs text-[#999]">Gana XP jugando y girando la ruleta</span>
      </div>
    </motion.div>
  );
}
