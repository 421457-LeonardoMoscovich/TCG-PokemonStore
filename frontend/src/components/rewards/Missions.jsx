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
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <motion.section
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ marginBottom: '12px' }}
    >
      <div
        style={{
          marginBottom: '24px',
          paddingLeft: '2px',
        }}
      >
        <h2
          className="text-2xl md:text-3xl font-black text-white"
          style={{ marginBottom: '6px' }}
        >
          Misiones activas
        </h2>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{
          gap: '22px',
          alignItems: 'start',
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {MISSIONS.map((mission, idx) => {
          const progress = Math.min((mission.progress / mission.target) * 100, 100);

          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className={`rounded-xl border backdrop-blur-[20px] transition-all ${
                mission.special
                  ? 'border-[#e8b800]/35 bg-[#1c1b1b]/70'
                  : 'border-[#7c3aed]/18 bg-[#1c1b1b]/70'
              }`}
              style={{
                padding: '22px',
                minHeight: '168px',
              }}
            >
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: '18px' }}
              >
                <span
                  className={`text-[11px] font-black tracking-[0.14em] uppercase rounded-full ${
                    mission.special
                      ? 'bg-[#e8b800]/20 text-[#e8b800]'
                      : 'bg-[#7c3aed]/18 text-[#a78bfa]'
                  }`}
                  style={{
                    padding: '7px 12px',
                    lineHeight: 1,
                  }}
                >
                  {mission.type}
                </span>

                {mission.special && (
                  <span
                    className="text-lg"
                    style={{ marginLeft: '12px' }}
                  >
                    ⭐
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <h3
                  className="font-black text-white text-lg leading-tight"
                  style={{ marginBottom: '8px' }}
                >
                  {mission.title}
                </h3>

                <p
                  className="text-sm text-[#cfc2d6] leading-relaxed"
                  style={{ minHeight: '40px' }}
                >
                  {mission.description}
                </p>
              </div>

              <div
                className="flex items-end justify-between"
                style={{ marginBottom: '12px', gap: '12px' }}
              >
                <span className="text-base font-black text-white">
                  {mission.progress} / {mission.target}
                </span>

                <div className="text-right">
                  <span
                    className={`text-sm font-black ${
                      mission.special ? 'text-[#e8b800]' : 'text-[#7c3aed]'
                    }`}
                  >
                    +{mission.xpReward} XP
                  </span>

                  {mission.extra && (
                    <p
                      className="text-[11px] text-[#999]"
                      style={{ marginTop: '4px' }}
                    >
                      {mission.extra}
                    </p>
                  )}
                </div>
              </div>

              <div
                className="rounded-full bg-[#1a1a1a] overflow-hidden border border-[#7c3aed]/20"
                style={{
                  height: '10px',
                }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${getBarColor(mission.barColor)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 + idx * 0.08 }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}