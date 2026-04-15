import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionPreference } from '../../hooks/useMotionPreference';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const MotionDiv = motion.div;
const MotionImg = motion.img;
const MotionButton = motion.button;
const MotionSpan = motion.span;

const HINT_STEPS = [
  { label: 'Pistas basicas', copy: 'Usa el tipo y los puntos de vida para descartar opciones.', count: 2 },
  { label: 'Pista de identidad', copy: 'Ahora tenes rareza e inicial para deducir con mas precision.', count: 4 },
  { label: 'Pista completa', copy: 'Ultima ayuda: cantidad de letras y set de la carta.', count: 6 },
];

export default function TriviaGame({
  estado,
  trivia,
  triviaLoading,
  selectedOption,
  triviaResult,
  onStart,
  onAnswer,
}) {
  const prefersReducedMotion = useMotionPreference();
  const imageSrc = trivia?.imagen || trivia?.image || trivia?.imageUrl || '';
  const options = trivia?.opciones || trivia?.options || [];
  const clues = trivia?.pistas || trivia?.hints || [];
  const [imageError, setImageError] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const hasAnswered = !!triviaResult;
  const activeHint = HINT_STEPS[hintLevel] || HINT_STEPS[0];
  const visibleClues = clues.slice(0, activeHint.count);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setImageError(false);
      setHintLevel(0);
    });

    return () => cancelAnimationFrame(frame);
  }, [imageSrc]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        delayChildren: prefersReducedMotion ? 0 : 0.16,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const getOptionClass = (opt) => {
    const base =
      'w-full text-xs font-black tracking-[0.12em] uppercase transition-all rounded-lg flex items-center gap-3 border disabled:cursor-not-allowed relative';

    if (!hasAnswered) {
      return `${base} bg-[#ddb7ff]/5 border-[#ddb7ff]/30 hover:border-[#ffe083] hover:bg-[#ffe083]/10 hover:text-white text-[#d9cfe0]`;
    }

    if (selectedOption === opt) {
      return triviaResult.success || triviaResult.correct
        ? `${base} bg-gradient-to-r from-green-500/25 to-green-400/5 text-green-300 shadow-[0_0_22px_rgba(34,197,94,0.45)] border-green-400`
        : `${base} bg-gradient-to-r from-red-500/25 to-red-400/5 text-red-300 shadow-[0_0_22px_rgba(239,68,68,0.45)] border-red-400`;
    }

    return `${base} bg-white/[0.03] border-white/10 text-[#8f8598]`;
  };

  return (
    <MotionDiv
      className="bg-[#1c1b1b]/70 backdrop-blur-[20px] border border-[#4d4354] flex flex-col overflow-hidden rounded-xl vault-panel"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay: 0.2 }}
      whileHover={{ borderColor: 'rgba(221, 183, 255, 0.6)', transition: { duration: 0.25 } }}
    >
      <MotionDiv
        className="bg-[#2a2a2a] border-b border-[#4d4354] relative"
        style={{ padding: '20px 24px' }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="absolute text-[40px] font-black text-[#ddb7ff]/5 select-none leading-none"
          style={{ left: '14px', top: '4px' }}
        >
          02
        </div>

        <span className="text-sm font-black tracking-[0.14em] uppercase text-[#ddb7ff] relative z-10">
          Quien es ese Pokemon
        </span>
      </MotionDiv>

      <MotionDiv
        className="flex-1 flex flex-col items-center justify-center text-center"
        style={{ padding: '24px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionDiv
          className="relative bg-gradient-to-b from-[#f5ecff] via-[#d8c2ff] to-[#7b5aa8] overflow-hidden border-2 border-[#ddb7ff]/30 rounded-xl shadow-[0_0_20px_rgba(221,183,255,0.2)]"
          style={{
            width: '220px',
            height: '220px',
            marginBottom: '16px',
          }}
          whileHover={{ borderColor: 'rgba(221, 183, 255, 0.5)' }}
          transition={{ duration: 0.2 }}
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            {triviaLoading ? (
              <MotionDiv
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <MotionDiv
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-[#ddb7ff]/30 border-t-[#ddb7ff] rounded-full"
                />
              </MotionDiv>
            ) : trivia && imageSrc && !imageError ? (
              <MotionDiv
                key="trivia-img"
                className="relative z-10 h-full w-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,224,131,0.3),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.35),rgba(73,45,104,0.35))]" />
                <MotionImg
                  src={imageSrc}
                  className={`relative z-10 transition-all duration-500 ${
                    hasAnswered ? 'h-full w-full object-contain' : 'absolute left-1/2 top-1/2 w-[118%] max-w-none'
                  }`}
                  alt={hasAnswered ? 'Carta revelada' : 'Recorte parcial de la carta'}
                  style={{
                    padding: hasAnswered ? '18px' : '0',
                    filter: hasAnswered
                      ? 'drop-shadow(0 14px 24px rgba(33, 18, 54, 0.45))'
                      : 'saturate(1.05) contrast(1.08) drop-shadow(0 18px 22px rgba(0,0,0,0.35))',
                    transform: hasAnswered ? 'scale(1)' : 'translate(-50%, -52%) scale(1.72)',
                  }}
                  onError={() => setImageError(true)}
                />

                {!hasAnswered && (
                  <div className="absolute inset-x-0 bottom-0 z-20 bg-[#130f18]/88 border-t border-[#ffe083]/25 px-3 py-2">
                    <p className="text-[#ffe083] text-[10px] font-black uppercase tracking-[0.14em]">
                      Recorte visual
                    </p>
                  </div>
                )}
              </MotionDiv>
            ) : trivia ? (
              <MotionDiv
                key="image-error"
                className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
                style={{ gap: '10px' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="material-symbols-outlined text-[#2a1642] text-4xl">
                  broken_image
                </span>
                <p className="text-[#2a1642] text-xs font-black uppercase tracking-[0.12em] leading-relaxed">
                  No se pudo cargar la imagen
                </p>
              </MotionDiv>
            ) : (
              <MotionDiv
                key="empty"
                className="flex flex-col items-center justify-center h-full px-4"
                style={{ gap: '14px' }}
                initial={{ scale: 0.84, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <MotionSpan
                  className="text-[#ddb7ff]/40 text-5xl font-black"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ?
                </MotionSpan>

                <p className="text-[#cfc2d6] text-xs font-bold uppercase tracking-[0.14em] text-center leading-relaxed">
                  Comenza el juego para ver la silueta
                </p>
              </MotionDiv>
            )}
          </AnimatePresence>
        </MotionDiv>

        <AnimatePresence>
          {trivia && !hasAnswered && (
            <MotionDiv
              className="w-full text-left"
              style={{ marginBottom: '16px' }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              variants={itemVariants}
            >
              <p className="text-sm font-black text-white uppercase tracking-[0.08em] text-center">
                {activeHint.label}
              </p>
              <p className="mt-2 text-xs font-semibold text-[#cfc2d6] leading-relaxed text-center">
                {activeHint.copy}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {visibleClues.map((clue) => (
                  <div
                    key={`${clue.label}-${clue.value}`}
                    className="rounded-lg border border-[#ddb7ff]/25 bg-[#ddb7ff]/8 px-3 py-2 text-left"
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#ddb7ff]/70">
                      {clue.label}
                    </p>
                    <p className="mt-1 text-xs font-black text-white leading-tight">
                      {clue.value}
                    </p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setHintLevel((prev) => Math.min(prev + 1, HINT_STEPS.length - 1))}
                disabled={hintLevel >= HINT_STEPS.length - 1}
                className="mt-3 w-full rounded-lg border border-[#ffe083]/35 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#ffe083] transition-all hover:bg-[#ffe083]/10 disabled:opacity-35 disabled:cursor-not-allowed"
              >
                {hintLevel >= HINT_STEPS.length - 1 ? 'Todas las pistas visibles' : 'Mostrar mas pistas'}
              </button>
            </MotionDiv>
          )}
        </AnimatePresence>

        <MotionDiv
          className="w-full"
          style={{ display: 'grid', gap: '10px' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {options.length > 0 ? (
            options.map((opt, i) => (
              <MotionButton
                key={opt}
                onClick={() => onAnswer(opt)}
                disabled={hasAnswered}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : i * 0.04 }}
                whileHover={!hasAnswered ? { scale: 1.012, x: 4 } : {}}
                whileTap={!hasAnswered ? { scale: 0.985 } : {}}
                className={getOptionClass(opt)}
                style={{
                  minHeight: '52px',
                  padding: '12px 14px',
                }}
              >
                <span
                  className={`font-black text-sm flex items-center justify-center rounded border ${
                    selectedOption === opt && hasAnswered
                      ? 'bg-white/15 border-white/35'
                      : 'bg-[#ddb7ff]/20 border-[#ddb7ff]/40'
                  }`}
                  style={{
                    width: '28px',
                    height: '28px',
                    flexShrink: 0,
                  }}
                >
                  {OPTION_LETTERS[i]}
                </span>
                <span className="text-left">{opt}</span>
              </MotionButton>
            ))
          ) : (
            <MotionButton
              onClick={onStart}
              disabled={(estado?.energy || 0) <= 0 || triviaLoading}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="w-full border-2 border-[#ddb7ff]/40 text-[#ddb7ff] text-xs font-black uppercase tracking-[0.14em] hover:bg-[#ddb7ff] hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed rounded-lg gold-btn"
              style={{
                minHeight: '54px',
                padding: '14px 16px',
              }}
              variants={itemVariants}
            >
              Comenzar (1 energia)
            </MotionButton>
          )}
        </MotionDiv>

        <AnimatePresence>
          {triviaResult && (
            <MotionDiv
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full border text-xs font-black text-center uppercase tracking-[0.12em] rounded-lg shadow-lg ${
                triviaResult.success || triviaResult.correct
                  ? 'bg-green-500/10 border-green-500 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                  : 'bg-red-500/10 border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              }`}
              style={{
                marginTop: '16px',
                padding: '14px 16px',
              }}
            >
              <MotionDiv
                animate={
                  triviaResult.success || triviaResult.correct
                    ? { scale: [1, 1.03, 1] }
                    : { x: [-4, 4, -4, 4, 0] }
                }
                transition={{ duration: 0.5 }}
              >
                {triviaResult.mensaje || triviaResult.message}
              </MotionDiv>
            </MotionDiv>
          )}
        </AnimatePresence>
      </MotionDiv>
    </MotionDiv>
  );
}
