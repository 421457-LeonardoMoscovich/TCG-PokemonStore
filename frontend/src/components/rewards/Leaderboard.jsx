import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEADERBOARD_DATA } from '../../lib/mockData';

const TABS = ['Amigos', 'Global', 'Semana'];

const getRankMedal = (rank) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `#${rank}`;
  }
};

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('Global');
  const data = LEADERBOARD_DATA[activeTab.toLowerCase()] || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.045, delayChildren: 0.12 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -18 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, x: 18, transition: { duration: 0.18 } },
  };

  return (
    <motion.section
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, delay: 0.35 }}
    >
      <div
        style={{
          marginBottom: '22px',
          paddingLeft: '2px',
        }}
      >
        <h2
          className="text-2xl md:text-3xl font-black text-white"
          style={{ marginBottom: '12px' }}
        >
          Tabla de clasificación
        </h2>

        <div
          className="flex items-center border-b border-[#7c3aed]/20"
          style={{
            gap: '6px',
            paddingBottom: '2px',
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative font-black text-xs md:text-sm uppercase tracking-[0.14em] transition-all rounded-t-md ${
                activeTab === tab
                  ? 'text-[#e8b800]'
                  : 'text-[#999] hover:text-[#cfc2d6]'
              }`}
              style={{
                padding: '12px 14px',
              }}
            >
              {tab}

              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8b800]"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col"
        style={{ gap: '12px' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col"
            style={{ gap: '12px' }}
          >
            {data.map((player, idx) => (
              <motion.div
                key={`${activeTab}-${idx}`}
                variants={rowVariants}
                className={`border rounded-xl transition-all ${
                  player.isCurrent
                    ? 'border-[#7c3aed] bg-[#7c3aed]/10'
                    : 'border-[#7c3aed]/10 bg-[#1c1b1b]/70 backdrop-blur-[20px] hover:bg-[#1c1b1b]/90'
                }`}
                style={{
                  padding: '16px 18px',
                }}
              >
                <div
                  className="flex items-center"
                  style={{ gap: '14px' }}
                >
                  <div
                    className="text-center shrink-0"
                    style={{ width: '52px' }}
                  >
                    <span className="text-lg md:text-xl font-black text-white">
                      {getRankMedal(player.rank)}
                    </span>
                  </div>

                  <div
                    className={`rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 bg-gradient-to-br ${player.color}`}
                    style={{
                      width: '44px',
                      height: '44px',
                    }}
                  >
                    {player.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-black text-sm md:text-base truncate ${
                        player.isCurrent ? 'text-[#e8b800]' : 'text-white'
                      }`}
                    >
                      {player.name}
                    </p>
                  </div>

                  <div
                    className="text-right shrink-0"
                    style={{ minWidth: '92px' }}
                  >
                    <p className="font-black text-white text-lg leading-none">
                      {player.xp.toLocaleString()}
                    </p>
                    <p
                      className="text-[10px] text-[#999] uppercase tracking-[0.16em]"
                      style={{ marginTop: '6px' }}
                    >
                      XP
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}