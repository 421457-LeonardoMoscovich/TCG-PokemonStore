import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionPreference } from '../../hooks/useMotionPreference';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function TriviaGame({
  estado,
  trivia,
  triviaLoading,
  selectedOption,
  triviaResult,
  onStart,
  onAnswer,
  onResultClose
}) {
  const prefersReducedMotion = useMotionPreference();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        delayChildren: prefersReducedMotion ? 0 : 0.25
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="bg-[#1c1b1b]/70 backdrop-blur-[20px] border border-[#4d4354] flex flex-col overflow-hidden rounded-lg vault-panel"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ borderColor: 'rgba(221, 183, 255, 0.6)', transition: { duration: 0.3 } }}
    >
      <motion.div
        className="bg-[#2a2a2a] px-8 py-6 border-b border-[#4d4354] relative"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute left-4 top-2 text-[40px] font-black text-[#ddb7ff]/5 select-none leading-none">02</div>
        <span className="text-sm font-black tracking-widest uppercase text-[#ddb7ff] relative z-10">Adivina el Pokémon</span>
      </motion.div>

      <motion.div
        className="flex-1 p-8 flex flex-col items-center justify-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Silhouette panel */}
        <motion.div
          className="relative w-48 h-48 bg-gradient-to-b from-[#1a1a1a] to-black mb-8 overflow-hidden border-2 border-[#ddb7ff]/30 rounded-lg shadow-[0_0_20px_rgba(221,183,255,0.2)]"
          whileHover={{ borderColor: 'rgba(221, 183, 255, 0.5)' }}
          transition={{ duration: 0.2 }}
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-30 z-20" />

          <AnimatePresence mode="wait">
            {triviaLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-[#ddb7ff]/30 border-t-[#ddb7ff] rounded-full"
                />
              </motion.div>
            ) : trivia ? (
              <motion.img
                key="trivia-img"
                src={trivia.imagen || trivia.image}
                className={`h-full w-full object-contain filter transition-all duration-500 ${
                  triviaResult?.success || triviaResult?.correct
                    ? 'grayscale-0 brightness-100'
                    : 'grayscale brightness-0'
                }`}
                alt="Pokémon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div
                key="empty"
                className="flex flex-col items-center justify-center h-full gap-4 px-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <motion.span
                  className="text-[#ddb7ff]/40 text-5xl font-black"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ?
                </motion.span>
                <p className="text-[#cfc2d6] text-xs font-bold uppercase tracking-widest text-center">
                  Comienza el juego para revelar
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {trivia && !triviaResult && (
            <motion.p
              className="text-sm font-bold text-white mb-6 uppercase"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              variants={itemVariants}
            >
              ¿Cuál es este Pokémon?
            </motion.p>
          )}
        </AnimatePresence>

        {/* Answer options - A/B/C/D lettered */}
        <motion.div
          className="w-full space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {(trivia?.opciones || trivia?.options)?.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => onAnswer(opt)}
              disabled={!!triviaResult}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : i * 0.04 }}
              whileHover={!triviaResult ? { scale: 1.02, x: 4 } : {}}
              whileTap={!triviaResult ? { scale: 0.98 } : {}}
              className={`w-full min-h-[48px] px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all rounded-lg flex items-center gap-3 border ${
                selectedOption === opt
                  ? (triviaResult?.success || triviaResult?.correct)
                    ? 'bg-gradient-to-r from-green-500/20 to-green-400/5 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] border-green-500'
                    : 'bg-gradient-to-r from-red-500/20 to-red-400/5 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] border-red-500'
                  : 'bg-[#ddb7ff]/5 border border-[#ddb7ff]/30 hover:border-[#ddb7ff] hover:bg-[#ddb7ff]/15 text-[#cfc2d6]'
              } disabled:cursor-not-allowed relative`}
            >
              <span className="font-black text-sm w-6 h-6 flex items-center justify-center bg-[#ddb7ff]/20 rounded border border-[#ddb7ff]/40">
                {OPTION_LETTERS[i]}
              </span>
              {opt}
            </motion.button>
          )) || (
            <motion.button
              onClick={onStart}
              disabled={(estado?.energy || 0) <= 0}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 border-2 border-[#ddb7ff]/40 text-[#ddb7ff] text-xs font-black uppercase tracking-widest hover:bg-[#ddb7ff] hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed rounded-lg gold-btn"
              variants={itemVariants}
            >
              Comenzar (1 energía)
            </motion.button>
          )}
        </motion.div>

        {/* Result feedback */}
        <AnimatePresence>
          {triviaResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`mt-6 p-4 border text-xs font-black text-center uppercase tracking-widest w-full rounded-lg shadow-lg ${
                (triviaResult.success || triviaResult.correct)
                  ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                  : 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              }`}
            >
              <motion.div
                animate={(triviaResult.success || triviaResult.correct) ? {} : { x: [-5, 5, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {triviaResult.mensaje || triviaResult.message}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
