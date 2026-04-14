import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Ticket, Sparkles, Coins, Trophy, RotateCcw } from 'lucide-react';
import api from '../services/api';

const TYPE = {
  Fire: { border: '#E53935', glow: 'rgba(229,57,53,0.8)', badge: '#7f1d1d' },
  Water: { border: '#1E88E5', glow: 'rgba(30,136,229,0.8)', badge: '#1e3a5f' },
  Grass: { border: '#43A047', glow: 'rgba(67,160,71,0.8)', badge: '#14532d' },
  Electric: { border: '#FFEB3B', glow: 'rgba(255,235,59,0.8)', badge: '#713f12' },
  Lightning: { border: '#FFEB3B', glow: 'rgba(255,235,59,0.8)', badge: '#713f12' },
  'Trainer/Energy': { border: '#BDBDBD', glow: 'rgba(252,211,77,0.3)', badge: '#451a03' },
  Psychic: { border: '#E91E63', glow: 'rgba(233,30,99,0.8)', badge: '#4a1772' },
  Dragon: { border: '#7C4DFF', glow: 'rgba(124,77,255,0.8)', badge: '#312e81' },
  Colorless: { border: '#9E9E9E', glow: 'rgba(158,158,158,0.5)', badge: '#374151' },
  Fighting: { border: '#F57C00', glow: 'rgba(245,124,0,0.8)', badge: '#7c2d12' },
  Darkness: { border: '#607D8B', glow: 'rgba(96,125,139,0.8)', badge: '#1f2937' },
  Metal: { border: '#90A4AE', glow: 'rgba(144,164,174,0.8)', badge: '#1e293b' },
};

const DEFAULT_TYPE = TYPE.Colorless;

const CARD_W = 250;
const CARD_H = 350;

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

  useEffect(() => {
    api
      .get('/usuarios/perfil')
      .then((res) => setBalance(res.data.balance || 0))
      .catch(() => {});
  }, []);

  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const springX = useSpring(motionX, { stiffness: 300, damping: 40 });
  const springY = useSpring(motionY, { stiffness: 300, damping: 40 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-14deg', '14deg']);
  const shineOpacity = useTransform(springY, [-0.5, 0.5], [0, 0.55]);
  const shinePos = useTransform(springX, [-0.5, 0.5], ['-100%', '200%']);

  function onCardMouseMove(e) {
    if (!cardRef.current || phase !== 'revealed') return;
    const r = cardRef.current.getBoundingClientRect();
    motionX.set((e.clientX - r.left) / r.width - 0.5);
    motionY.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onCardMouseLeave() {
    motionX.set(0);
    motionY.set(0);
  }

  useEffect(() => {
    if (phase === 'revealed') {
      setSparkles(
        Array.from({ length: 16 }, (_, i) => ({
          id: i,
          x: Math.random() * 70 - 35,
          y: Math.random() * 70 - 35,
          scale: Math.random() * 1.1 + 0.4,
          delay: Math.random() * 0.45,
        })),
      );
    } else {
      setSparkles([]);
    }
  }, [phase]);

  const canvasRefCallback = useCallback((node) => {
    canvasRef.current = node;
    if (!node) return;
    if (canvasReadyRef.current) return;

    const ctx = node.getContext('2d', { willReadFrequently: true });
    node.width = CARD_W;
    node.height = CARD_H;

    ctx.globalCompositeOperation = 'source-over';

    const grad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
    grad.addColorStop(0, '#C0C0C0');
    grad.addColorStop(0.5, '#A8A8A8');
    grad.addColorStop(1, '#808080');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 2;
    for (let i = -CARD_W; i < CARD_W * 2; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + CARD_H, CARD_H);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.font = 'bold 18px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ RASPA AQUÍ ✦', CARD_W / 2, CARD_H / 2);

    ctx.globalCompositeOperation = 'destination-out';
    canvasReadyRef.current = true;
  }, []);

  useEffect(() => {
    if (phase === 'scratching') {
      canvasReadyRef.current = false;
      revealedRef.current = false;
      strokeRef.current = 0;
    }
  }, [phase]);

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

  const triggerReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    scratchingRef.current = false;
    setPhase('revealed');
  }, []);

  useEffect(() => {
    if (phase !== 'scratching') return;

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
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(px, py, 28, 0, Math.PI * 2);
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

      c._cleanup = () => {
        c.removeEventListener('pointerdown', onDown);
        c.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        c.removeEventListener('touchstart', onDown);
        c.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);
      };
    }, 50);

    return () => {
      clearTimeout(timer);
      const c = canvasRef.current;
      if (c?._cleanup) c._cleanup();
    };
  }, [phase, getScratchPercent, triggerReveal]);

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

  const t = carta ? TYPE[carta.type] || DEFAULT_TYPE : DEFAULT_TYPE;

  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center"
      style={{
        paddingTop: '22px',
        paddingBottom: '32px',
        paddingLeft: '12px',
        paddingRight: '12px',
      }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '620px',
          height: '240px',
          background: 'radial-gradient(ellipse at top, rgba(255,235,59,0.10), transparent 72%)',
        }}
      />

      <div
        className="z-10 text-center"
        style={{
          marginBottom: '8px',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <h1
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#F57C00] font-black"
          style={{
            fontSize: 'clamp(1.95rem, 5vw, 3rem)',
            lineHeight: 0.98,
            letterSpacing: '0.12em',
            marginBottom: '6px',
          }}
        >
          RASPA Y GANA
        </h1>

        <p
          className="text-gray-400 font-bold uppercase"
          style={{
            fontSize: '0.76rem',
            lineHeight: 1.3,
            letterSpacing: '0.16em',
            margin: '0 auto',
          }}
        >
          Descubrí tu próxima carta premium
        </p>
      </div>

      <div
        className="z-10 flex items-center bg-white/5 border border-white/10 backdrop-blur-sm"
        style={{
          gap: '8px',
          padding: '7px 14px',
          borderRadius: '999px',
          marginBottom: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
        }}
      >
        <Coins className="text-yellow-400 w-4 h-4" />
        <span
          className="text-white font-bold"
          style={{
            fontSize: '0.9rem',
            letterSpacing: '0.01em',
          }}
        >
          {balance} Monedas
        </span>
      </div>

      <div
        className="relative z-10"
        style={{
          width: CARD_W,
          height: CARD_H,
          marginBottom: '12px',
          maxWidth: '100%',
        }}
      >
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute inset-0 border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm"
              style={{
                borderRadius: '12px',
                padding: '20px 16px',
              }}
            >
              <Ticket
                className="w-12 h-12 text-white/30"
                style={{ marginBottom: '14px' }}
              />
              <p
                className="text-gray-400 font-bold text-center"
                style={{
                  maxWidth: '180px',
                  fontSize: '0.9rem',
                  lineHeight: 1.45,
                }}
              >
                Comprá tu ticket para raspar y expandir tu colección
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/5"
              style={{
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div className="w-12 h-12 border-2 border-primary/20 border-t-primary animate-spin rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(phase === 'error' || phase === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute inset-0 border bg-[#111] flex flex-col items-center justify-center text-center shadow-2xl"
              style={{
                borderRadius: '12px',
                padding: '22px 18px',
                borderColor: phase === 'complete' ? '#4CAF50' : '#F44336',
              }}
            >
              {phase === 'complete' ? (
                <Trophy className="w-14 h-14 text-green-500" style={{ marginBottom: '12px' }} />
              ) : (
                <RotateCcw className="w-10 h-10 text-red-500" style={{ marginBottom: '12px' }} />
              )}

              <h3
                className="text-white font-bold"
                style={{
                  fontSize: '1.1rem',
                  marginBottom: '8px',
                  lineHeight: 1.2,
                }}
              >
                {phase === 'complete' ? '¡Colección Completa!' : 'Error'}
              </h3>

              <p
                className="text-gray-400"
                style={{
                  fontSize: '0.86rem',
                  lineHeight: 1.45,
                  maxWidth: '190px',
                }}
              >
                {errorMsg}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'scratching' && carta && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: '12px' }}
          >
            <img
              src={carta.image}
              alt={carta.name}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <canvas
              ref={canvasRefCallback}
              className="absolute inset-0 w-full h-full"
              style={{
                touchAction: 'none',
                cursor: 'crosshair',
              }}
            />
          </div>
        )}

        <AnimatePresence>
          {phase === 'revealed' && carta && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 0.45, scale: 1.15 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full blur-[60px] pointer-events-none -z-10"
                style={{ background: t.glow }}
              />

              <motion.div
                ref={cardRef}
                onMouseMove={onCardMouseMove}
                onMouseLeave={onCardMouseLeave}
                initial={{ y: 46, scale: 0.82, rotateX: 26, opacity: 0 }}
                animate={{ y: 0, scale: 1, rotateX: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 1.15 }}
                className="relative w-full h-full overflow-hidden border-2 cursor-grab active:cursor-grabbing"
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                  boxShadow: `0 18px 42px -10px ${t.glow}, 0 0 20px ${t.glow}`,
                  borderColor: t.border,
                  borderRadius: '12px',
                }}
              >
                <motion.div
                  className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge"
                  style={{
                    opacity: shineOpacity,
                    background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.35) 25%, ${t.glow} 45%, transparent 50%)`,
                    backgroundPosition: shinePos,
                    backgroundSize: '200% 200%',
                  }}
                />

                <div
                  className="w-full h-full relative"
                  style={{
                    transform: 'translateZ(22px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <img
                    src={carta.image}
                    alt={carta.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent"
                    style={{ padding: '14px 12px 12px' }}
                  >
                    <h3
                      className="text-white font-bold"
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.2,
                        marginBottom: '5px',
                      }}
                    >
                      {carta.name}
                    </h3>

                    <div
                      className="flex gap-2 font-bold uppercase"
                      style={{
                        fontSize: '0.64rem',
                        letterSpacing: '0.11em',
                        flexWrap: 'wrap',
                      }}
                    >
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

      <div
        className="z-10 flex flex-col items-center"
        style={{
          width: '100%',
          maxWidth: `${CARD_W}px`,
        }}
      >
        {(phase === 'idle' || phase === 'error') && (
          <button
            onClick={handleBuyTicket}
            disabled={balance < 50}
            className="flex items-center justify-center bg-[linear-gradient(135deg,#FFEB3B,#F57C00)] text-[#0a0a0a] font-black uppercase transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover:shadow-[0_0_25px_rgba(255,235,59,0.4)]"
            style={{
              gap: '8px',
              width: '100%',
              minHeight: '44px',
              padding: '10px 14px',
              borderRadius: '10px',
              letterSpacing: '0.08em',
              fontSize: '0.82rem',
              lineHeight: 1.1,
            }}
          >
            <Ticket className="w-4 h-4" />
            Comprar Ticket — 50 Monedas
          </button>
        )}

        {phase === 'scratching' && (
          <p
            className="text-white font-bold animate-pulse uppercase"
            style={{
              fontSize: '0.9rem',
              letterSpacing: '0.11em',
              marginTop: '4px',
              textAlign: 'center',
            }}
          >
            ¡Raspa la tarjeta!
          </p>
        )}

        {phase === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2px',
            }}
          >
            <button
              onClick={handleReset}
              className="flex items-center justify-center bg-white text-black font-black uppercase transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              style={{
                width: '100%',
                minHeight: '44px',
                padding: '10px 14px',
                borderRadius: '10px',
                letterSpacing: '0.08em',
                fontSize: '0.82rem',
                lineHeight: 1.1,
              }}
            >
              ¡Raspar Otra!
            </button>
          </motion.div>
        )}

        {phase === 'complete' && (
          <button
            onClick={() => {
              window.location.href = '/pokedex';
            }}
            className="text-gray-400 hover:text-white transition-colors underline uppercase font-bold"
            style={{
              letterSpacing: '0.1em',
              fontSize: '0.74rem',
              marginTop: '12px',
            }}
          >
            Ver mi Pokédex
          </button>
        )}
      </div>

      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, s.scale, 0],
            x: `${s.x}vw`,
            y: `${s.y}vh`,
          }}
          transition={{ duration: 1.3, delay: s.delay, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 pointer-events-none z-50 text-yellow-400"
        >
          <Sparkles className="w-5 h-5" fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}