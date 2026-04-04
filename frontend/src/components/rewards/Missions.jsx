import { motion } from 'framer-motion';
import { MISSIONS } from '../../lib/mockData';

export default function Missions() {
  const getBarColor = (color) => {
    switch (color) {
      case 'purple':
        return 'from-[#7c3aed] to-[#a78bfa]';
      case 'orange':
        return 'from-[#ff8800] to-[#ffaa00]';
      case 'gold':
        return 'from-[#e8b800] to-[#ffd700]';
      default:
        return 'from-[#7c3aed] to-[#a78bfa]';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section className="mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
      <h2 className="text-2xl font-black text-white mb-10">Misiones activas</h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {MISSIONS.map((mission, idx) => {
          const progress = (mission.progress / mission.target) * 100;

          return (
            <motion.div
              key={idx}
              className={`rounded-xl border p-6 transition-all ${
                mission.special
                  ? 'border-[#e8b800]/40 bg-[#1c1b1b]/70 backdrop-blur-[20px]'
                  : 'border-[#7c3aed]/20 bg-[#1c1b1b]/70 backdrop-blur-[20px]'
              }`}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase ${
                    mission.special
                      ? 'bg-[#e8b800]/20 text-[#e8b800]'
                      : 'bg-[#7c3aed]/20 text-[#a78bfa]'
                  }`}
                >
                  {mission.type}
                </span>
                {mission.special && <span className="text-lg">⭐</span>}
              </div>

              {/* Title & Description */}
              <h3 className="font-black text-white mb-1">{mission.title}</h3>
              <p className="text-xs text-[#cfc2d6] mb-4">{mission.description}</p>

              {/* Progress Counter & Reward */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-white">
                  {mission.progress} / {mission.target}
                </span>
                <div className="text-right">
                  <span className="text-xs font-black text-[#7c3aed]">+{mission.xpReward} XP</span>
                  {mission.extra && <p className="text-[10px] text-[#999]">{mission.extra}</p>}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 rounded-full bg-[#1a1a1a] overflow-hidden border border-[#7c3aed]/20">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getBarColor(mission.barColor)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.5 + idx * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
