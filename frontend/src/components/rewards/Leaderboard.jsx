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
  const [activeTab, setActiveTab] = useState('global');
  const data = LEADERBOARD_DATA[activeTab.toLowerCase()];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  return (
    <motion.section className="mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
      <div className="mb-12">
        <h2 className="text-2xl font-black text-white mb-6">Tabla de clasificación</h2>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#7c3aed]/20">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-black text-sm uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-[#e8b800]' : 'text-[#999] hover:text-[#cfc2d6]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8b800]"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Rows */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {data.map((player, idx) => (
              <motion.div
                key={`${activeTab}-${idx}`}
                className={`flex items-center gap-4 px-5 py-4 rounded-lg border transition-all ${
                  player.isCurrent
                    ? 'border-[#7c3aed] bg-[#7c3aed]/10'
                    : 'border-[#7c3aed]/10 bg-[#1c1b1b]/70 backdrop-blur-[20px] hover:bg-[#1c1b1b]/90'
                }`}
                variants={rowVariants}
              >
                {/* Rank */}
                <div className="w-10 text-center">
                  <span className="text-lg font-black">
                    {typeof getRankMedal(player.rank) === 'string' && getRankMedal(player.rank).length === 1
                      ? getRankMedal(player.rank)
                      : getRankMedal(player.rank).startsWith('#')
                        ? getRankMedal(player.rank)
                        : getRankMedal(player.rank)}
                  </span>
                </div>

                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm bg-gradient-to-br ${player.color}`}
                >
                  {player.avatar}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className={`font-black text-sm ${player.isCurrent ? 'text-[#e8b800]' : 'text-white'}`}>{player.name}</p>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="font-black text-white">{player.xp.toLocaleString()}</p>
                  <p className="text-[10px] text-[#999] uppercase tracking-widest">XP</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
