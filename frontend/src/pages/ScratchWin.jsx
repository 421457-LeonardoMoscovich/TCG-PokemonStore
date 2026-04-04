import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Ticket, Sparkles, Coins, Trophy, RotateCcw } from 'lucide-react';
import api from '../services/api';

const TYPE = {
  Fire:      { border: '#E53935', glow: 'rgba(229,57,53,0.8)',  badge: '#7f1d1d' },
  Water:     { border: '#1E88E5', glow: 'rgba(30,136,229,0.8)', badge: '#1e3a5f' },
  Grass:     { border: '#43A047', glow: 'rgba(67,160,71,0.8)',  badge: '#14532d' },
  Electric:  { border: '#FFEB3B', glow: 'rgba(255,235,59,0.8)', badge: '#713f12' },
  Lightning: { border: '#FFEB3B', glow: 'rgba(255,235,59,0.8)', badge: '#713f12' },
  'Trainer/Energy': { border: '#BDBDBD', glow: 'rgba(252,211,77,0.3)', badge: '#451a03' },
  Psychic:   { border: '#E91E63', glow: 'rgba(233,30,99,0.8)',  badge: '#4a1772' },
  Dragon:    { border: '#7C4DFF', glow: 'rgba(124,77,255,0.8)', badge: '#312e81' },
  Colorless: { border: '#9E9E9E', glow: 'rgba(158,158,158,0.5)', badge: '#374151' },
  Fighting:  { border: '#F57C00', glow: 'rgba(245,124,0,0.8)',  badge: '#7c2d12' },
  Darkness:  { border: '#607D8B', glow: 'rgba(96,125,139,0.8)', badge: '#1f2937' },
  Metal:     { border: '#90A4AE', glow: 'rgba(144,164,174,0.8)', badge: '#1e293b' },
};
const DEFAULT_TYPE = TYPE.Colorless;

const CARD_W = 320;
const CARD_H = 448;

export default function ScratchWin() {
  const [phase, setPhase] = useState('idle');
  const [balance, setBalance] = useState(0);
  const [carta, setCarta] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [sparkles, setSparkles] = useState([]);

  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const scratchingRef = useRef(false);
  const revealedRef = useRef(false);
  const strokeRef = useRef(0);
  const canvasReadyRef = useRef(false);

  // Balance
  useEffect(() => {
    api.get('/usuarios/perfil')
      .then(res => setBalance(res.data.balance || 0))
      .catch(() => {});
  }, []);

  // 3D tilt for revealed card
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const springX = useSpring(motionX, { stiffness: 300, damping: 40 });
  const springY = useSpring(motionY, { stiffness: 300, damping: 40 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-18deg", "18deg"]);
  const shineOpacity = useTransform(springY, [-0.5, 0.5], [0, 0.7]);
  const shinePos = useTransform(springX, [-0.5, 0.5], ["-100%", "200%"]);

  function onCardMouseMove(e) {
    if (!cardRef.current || phase !== 'revealed') return;
    const r = cardRef.current.getBoundingClientRect();
    motionX.set((e.clientX - r.left) / r.width - 0.5);
    motionY.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onCardMouseLeave() { motionX.set(0); motionY.set(0); }

  // Sparkles on reveal
  useEffect(() => {
    if (phase === 'revealed') {
      setSparkles(Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        scale: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 0.5,
      })));
    } else {
      setSparkles([]);
    }
  }, [phase]);

  // ───────────────────────────────────────
  //  CANVAS SCRATCH LOGIC
  // ───────────────────────────────────────

  // Paint the silver layer on the canvas — called via ref callback, NOT useEffect
  // This avoids StrictMode double-execution issues
  const canvasRefCallback = useCallback((node) => {
    canvasRef.current = node;
    if (!node) return;
    if (canvasReadyRef.current) return; // Already painted, don't repaint

    const ctx = node.getContext('2d', { willReadFrequently: true });
    node.width = CARD_W;
    node.height = CARD_H;

    // Paint silver gradient
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
    grad.addColorStop(0, '#C0C0C0');
    grad.addColorStop(0.5, '#A8A8A8');
    grad.addColorStop(1, '#808080');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    // Diagonal lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 2;
    for (let i = -CARD_W; i < CARD_W * 2; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + CARD_H, CARD_H);
      ctx.stroke();
    }

    // Text
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.font = 'bold 22px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ RASPA AQUÍ ✦', CARD_W / 2, CARD_H / 2);

    // Set erase mode
    ctx.globalCompositeOperation = 'destination-out';
    canvasReadyRef.current = true;
  }, []);

  // Reset canvasReady when phase changes to scratching
  useEffect(() => {
    if (phase === 'scratching') {
      canvasReadyRef.current = false;
      revealedRef.current = false;
      strokeRef.current = 0;
    }
  }, [phase]);

  // Calculate scratch percentage
  const getScratchPercent = useCallback(() => {
    const c = canvasRef.current;
    if (!c || c.width === 0) return 0;
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let clear = 0;
    const total = data.length / 4;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) clear++;
    }
    return (clear / total) * 100;
  }, []);

  // Trigger reveal animation
  const triggerReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    scratchingRef.current = false;
    setPhase('revealed');
  }, []);

  // Attach canvas pointer events
  useEffect(() => {
    if (phase !== 'scratching') return;

    // Wait a tick for the canvas ref callback to fire
    const timer = setTimeout(() => {
      const c = canvasRef.current;
      if (!c) return;

      function getPos(e) {
        const rect = c.getBoundingClientRect();
        const scaleX = c.width / rect.width;
        const scaleY = c.height / rect.height;
        const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY,
        };
      }

      function draw(px, py) {
        const ctx = c.getContext('2d');
        // Setting opaque color is CRUCIAL for destination-out to fully erase
        ctx.fillStyle = '#000000'; 
        ctx.beginPath();
        ctx.arc(px, py, 35, 0, Math.PI * 2);
        ctx.fill();
      }

      function onDown(e) {
        e.preventDefault();
        scratchingRef.current = true;
        const { x, y } = getPos(e);
        draw(x, y);
      }

      function onMove(e) {
        if (!scratchingRef.current) return;
        e.preventDefault();
        const { x, y } = getPos(e);
        draw(x, y);
        strokeRef.current++;
        if (strokeRef.current % 6 === 0) {
          const pct = getScratchPercent();
          if (pct > 51) triggerReveal();
        }
      }

      function onUp() {
        if (!scratchingRef.current) return;
        scratchingRef.current = false;
        const pct = getScratchPercent();
        if (pct > 51) triggerReveal();
      }

      c.addEventListener('pointerdown', onDown);
      c.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      c.addEventListener('touchstart', onDown, { passive: false });
      c.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);

      // Store cleanup reference
      c._cleanup = () => {
        c.removeEventListener('pointerdown', onDown);
        c.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        c.removeEventListener('touchstart', onDown);
        c.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);
      };
    }, 50); // Small delay ensures canvas is painted first

    return () => {
      clearTimeout(timer);
      const c = canvasRef.current;
      if (c?._cleanup) c._cleanup();
    };
  }, [phase, getScratchPercent, triggerReveal]);

  // ───────────────────────────────────────
  //  Actions
  // ───────────────────────────────────────

  async function handleBuyTicket() {
    setPhase('loading');
    setErrorMsg('');
    try {
      const res = await api.post('/scratch/comprar');
      setCarta(res.data.carta);
      setBalance(res.data.nuevoBalance);
      setPhase('scratching');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al comprar el ticket';
      setErrorMsg(msg);
      setPhase(msg.includes('Pokédex') ? 'complete' : 'error');
    }
  }

  function handleReset() {
    setCarta(null);
    setPhase('idle');
  }

  const t = carta ? (TYPE[carta.type] || DEFAULT_TYPE) : DEFAULT_TYPE;

  // ───────────────────────────────────────
  //  RENDER
  // ───────────────────────────────────────

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center pt-12 pb-24">
      {/* Background ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(255,235,59,0.1),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="z-10 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#F57C00] mb-2 tracking-widest">
          RASPA Y GANA
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
          Descubrí tu próxima carta premium
        </p>
      </div>

      {/* Balance */}
      <div className="z-10 flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full mb-12 backdrop-blur-sm">
        <Coins className="text-yellow-400 w-5 h-5" />
        <span className="text-white font-bold">{balance} Monedas</span>
      </div>

      {/* ─── Card Area ─── */}
      <div className="relative z-10 mb-12" style={{ width: CARD_W, height: CARD_H }}>

        {/* IDLE */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 rounded-md border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm"
            >
              <Ticket className="w-16 h-16 text-white/30 mb-4" />
              <p className="text-gray-400 font-bold max-w-[200px] text-center">
                Comprá tu ticket para raspar y expandir tu colección
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING */}
        <AnimatePresence>
          {phase === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-md flex flex-col items-center justify-center bg-white/5"
            >
              <div className="w-16 h-16 border-2 border-primary/20 border-t-primary animate-spin rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR / COMPLETE */}
        <AnimatePresence>
          {(phase === 'error' || phase === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 rounded-md border bg-[#111] p-6 flex flex-col items-center justify-center text-center shadow-2xl"
              style={{ borderColor: phase === 'complete' ? '#4CAF50' : '#F44336' }}
            >
              {phase === 'complete'
                ? <Trophy className="w-16 h-16 text-green-500 mb-4" />
                : <RotateCcw className="w-12 h-12 text-red-500 mb-4" />}
              <h3 className="text-white font-bold text-xl mb-2">
                {phase === 'complete' ? '¡Colección Completa!' : 'Error'}
              </h3>
              <p className="text-gray-400 text-sm">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SCRATCHING: card image + canvas overlay */}
        {phase === 'scratching' && carta && (
          <div className="absolute inset-0 rounded-md overflow-hidden">
            <img
              src={carta.image}
              alt={carta.name}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <canvas
              ref={canvasRefCallback}
              style={{ touchAction: 'none', cursor: 'crosshair' }}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {/* REVEALED: 3D animated card */}
        <AnimatePresence>
          {phase === 'revealed' && carta && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
              style={{ perspective: '1200px' }}
            >
              {/* Type glow behind card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.5, scale: 1.3 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full blur-[80px] pointer-events-none -z-10"
                style={{ background: t.glow }}
              />

              <motion.div
                ref={cardRef}
                onMouseMove={onCardMouseMove}
                onMouseLeave={onCardMouseLeave}
                initial={{ y: 80, scale: 0.7, rotateX: 40, opacity: 0 }}
                animate={{ y: 0, scale: 1, rotateX: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 1.2 }}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                  boxShadow: `0 25px 60px -12px ${t.glow}, 0 0 30px ${t.glow}`,
                  borderColor: t.border,
                }}
                className="relative w-full h-full rounded-md overflow-hidden border-2 cursor-grab active:cursor-grabbing"
              >
                {/* Holographic foil */}
                <motion.div
                  className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge"
                  style={{
                    opacity: shineOpacity,
                    background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, ${t.glow} 45%, transparent 50%)`,
                    backgroundPosition: shinePos,
                    backgroundSize: '200% 200%',
                  }}
                />

                {/* 3D depth layer */}
                <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }} className="w-full h-full relative">
                  <img
                    src={carta.image}
                    alt={carta.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent"
                  >
                    <h3 className="text-white font-bold text-lg">{carta.name}</h3>
                    <div className="flex gap-2 text-xs font-bold mt-1 uppercase tracking-widest">
                      <span style={{ color: t.border }}>{carta.type}</span>
                      <span className="text-gray-400">{carta.rarity}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Action Buttons ─── */}
      <div className="z-10 flex flex-col items-center">
        {(phase === 'idle' || phase === 'error') && (
          <button
            onClick={handleBuyTicket}
            disabled={balance < 50}
            className="flex items-center gap-3 bg-[linear-gradient(135deg,#FFEB3B,#F57C00)] text-[#0a0a0a] font-black uppercase px-8 py-4 rounded-md tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover:shadow-[0_0_25px_rgba(255,235,59,0.4)]"
          >
            <Ticket className="w-5 h-5" />
            Comprar Ticket — 50 Monedas
          </button>
        )}

        {phase === 'scratching' && (
          <p className="text-white font-bold animate-pulse text-lg tracking-widest uppercase">
            ¡Raspa la tarjeta!
          </p>
        )}

        {phase === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={handleReset}
              className="flex items-center gap-3 bg-white text-black font-black uppercase px-8 py-4 rounded-md tracking-widest transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            >
              ¡Raspar Otra!
            </button>
          </motion.div>
        )}

        {phase === 'complete' && (
          <button
            onClick={() => window.location.href = '/pokedex'}
            className="text-gray-400 hover:text-white transition-colors underline uppercase tracking-widest font-bold text-sm mt-4"
          >
            Ver mi Pokédex
          </button>
        )}
      </div>

      {/* Sparkles */}
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, s.scale, 0],
            x: s.x + 'vw',
            y: s.y + 'vh',
          }}
          transition={{ duration: 1.5, delay: s.delay, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 pointer-events-none z-50 text-yellow-400"
        >
          <Sparkles className="w-6 h-6" fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}
