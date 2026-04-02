import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { ShieldAlert, Fingerprint, RefreshCcw, ArrowRight, Zap, Target, ArrowUpRight, Battery, Activity } from 'lucide-react';
import api from '../services/api';


const TYPE_BADGE = {
  Fire:      { border: '#ef4444', text: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  Water:     { border: '#3b82f6', text: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
  Grass:     { border: '#22c55e', text: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' },
  Lightning: { border: '#eab308', text: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' },
  Psychic:   { border: '#a855f7', text: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  Fighting:  { border: '#f97316', text: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
  Darkness:  { border: '#6b7280', text: '#9ca3af', glow: 'rgba(107, 114, 128, 0.4)' },
  Metal:     { border: '#94a3b8', text: '#cbd5e1', glow: 'rgba(148, 163, 184, 0.4)' },
  Dragon:    { border: '#6366f1', text: '#818cf8', glow: 'rgba(99, 102, 241, 0.4)' },
  Colorless: { border: '#9ca3af', text: '#e5e7eb', glow: 'rgba(156, 163, 175, 0.4)' },
};

/* ─────────────────────────────── CORE ANIMATED COUNTER ─────────────────────── */
function AnimatedCounter({ from = 0, to, duration = 0.5, prefix = "", suffix = "" }) {
  const nodeRef = useRef();
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = `${prefix}${Math.round(value).toLocaleString('es-AR')}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [from, to, duration, prefix, suffix]);

  return <span ref={nodeRef} />;
}

/* ─────────────────────────────── BIOMETRIC CHECKOUT MODAL ─────────────────────── */
function CheckoutModal({ carrito, subtotal, totalItems, onConfirm, onClose, confirming }) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(12px)' }}
      >
        {/* Background crosshairs for military feel */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-amber-500 rounded-full flex items-center justify-center">
            <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] border border-dashed border-amber-500/50 rounded-full animate-spin-slow" style={{ animationDuration: '40s' }} />
          </div>
          <div className="absolute w-full h-[1px] bg-amber-500/20" />
          <div className="absolute h-full w-[1px] bg-amber-500/20" />
        </div>

        <motion.div
          key="modal"
          initial={{ scale: 0.95, opacity: 0, rotateX: 20 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.95, opacity: 0, rotateX: -20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="w-full max-w-2xl border-2 border-amber-500 bg-black/80 relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)]"
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          {/* Tactical cutouts / markings */}
          <div className="absolute top-0 left-0 w-8 h-8 border-r-2 border-b-2 border-amber-500 bg-amber-500/20" />
          <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-amber-500 bg-amber-500/20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-r-2 border-t-2 border-amber-500 bg-amber-500/20" />
          
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8 border-b border-amber-500/30 pb-6 relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mb-4 relative"
              >
                {/* Scanner line over icon */}
                <motion.div 
                  animate={{ y: ['0%', '100%', '0%'] }} 
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-0 left-0 w-full h-1 bg-amber-400 shadow-[0_0_10px_#fbbf24] z-20"
                />
                <Fingerprint className="w-8 h-8 text-amber-500 relative z-10" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-mono font-black text-amber-500 tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
                Confirmación_Biométrica
              </h2>
              <p className="text-xs font-mono tracking-widest text-amber-500/60 mt-2 uppercase">
                Se requiere autorización para la transferencia de fondos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {/* Manifest List */}
              <div className="border border-white/10 bg-white/[2%] p-4 overflow-hidden flex flex-col h-64 relative">
                <p className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest mb-3 pb-2 border-b border-white/10">{`> MANIFIESTO_A_EXTRAER (${carrito.length})`}</p>
                <div className="space-y-3 overflow-y-auto pr-2 flex-1" style={{ scrollbarWidth: 'none' }}>
                  <style>{`.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>
                  {carrito.map((item, i) => (
                    <motion.div 
                      key={item.cardId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (i * 0.05) }}
                      className="flex items-center gap-3 w-full p-2 border border-white/5 bg-black hover:bg-white/5 transition-colors"
                    >
                      <div className="w-6 h-8 border border-white/20 shrink-0">
                        {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover grayscale opacity-80" /> : <div className="w-full h-full bg-white/10" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-mono font-bold text-gray-300 truncate uppercase">{item.name}</p>
                        <p className="text-[9px] font-mono text-gray-600 tracking-widest">ID:{item.cardId.slice(0, 6)}</p>
                      </div>
                      <div className="text-[11px] font-mono font-black text-white bg-white/10 px-2 py-0.5">
                        x{item.quantity}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Warning Totals */}
              <div className="flex flex-col justify-between h-64 border border-amber-500/30 bg-amber-500/5 p-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
                <ShieldAlert className="absolute -right-10 -bottom-10 w-48 h-48 text-amber-500/10 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                
                <div>
                  <p className="text-[10px] font-mono font-black text-amber-500/80 uppercase tracking-widest mb-4">
                    {"> DEBITO_REQUERIDO"}
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-amber-500/20 pb-2">
                      <span className="text-xs font-mono text-amber-500/60 uppercase tracking-wider">Unidades Totales</span>
                      <span className="text-xl font-mono font-black text-white">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-mono text-amber-500/80 uppercase tracking-wider">Monto Total</span>
                      <span className="text-4xl font-mono font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                        ${subtotal.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#fbbf24', color: '#000' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    disabled={confirming}
                    className="w-full py-4 border-2 border-amber-500 bg-amber-500/20 text-amber-400 font-mono font-black text-sm uppercase tracking-[0.2em] transition-colors disabled:opacity-50 disabled:grayscale relative overflow-hidden"
                  >
                    {confirming ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCcw className="w-4 h-4 animate-spin" /> PROCESANDO...
                      </span>
                    ) : (
                      'Autorizar DeducCióN'
                    )}
                    {/* Animated Glitch Line */}
                    <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-white opacity-50 pointer-events-none" style={{ animation: 'glitch-slide 2s infinite linear' }} />
                  </motion.button>
                  <button
                    onClick={onClose}
                    disabled={confirming}
                    className="w-full py-2.5 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors border border-transparent hover:border-white/20"
                  >
                    Abortar Operación
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────── CARGO ROW (Replaces ItemCard) ──────────────────────────── */
function CargoRow({ item, idx, onRemove, onChangeQty }) {
  const badge = TYPE_BADGE[item.type] || TYPE_BADGE.Colorless;
  const lineTotal = parseInt(item.quantity) * (item.price || 0);

  // Tiny 3D tilt for the image thumbnail only, to add that premium feel
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-15deg", "15deg"]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleMouseLeave() {
    x.set(0); y.set(0);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: idx * 0.05, type: 'spring', stiffness: 220, damping: 20 }}
      className="w-full flex flex-col md:flex-row bg-white/[1%] border border-white/10 hover:border-white/20 transition-all duration-300 relative group overflow-hidden"
    >
      {/* Decorative vertical line matching the Card Type */}
      <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 group-hover:w-1.5" style={{ backgroundColor: badge.border }} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(90deg, ${badge.glow}, transparent)`, right: '20%' }} />

      <div className="p-4 flex items-center justify-between w-full h-full gap-4 md:gap-6 ml-2 relative z-10">
        
        {/* LEFT: Image & Core Info */}
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <motion.div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 600 }}
            className="w-16 h-24 md:w-20 md:h-28 shrink-0 border border-white/20 bg-bg-elevated flex items-center justify-center relative shadow-[4px_4px_0_rgba(0,0,0,0.5)] cursor-crosshair overflow-hidden"
          >
            {/* Holographic foil on image hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500 z-20 pointer-events-none" style={{ transform: 'translateZ(20px)' }} />
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="text-xl opacity-20 font-mono">?</div>
            )}
          </motion.div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-lg md:text-xl font-mono font-black text-white leading-tight uppercase truncate drop-shadow-md">
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-widest border" style={{ borderColor: badge.border, color: badge.text, backgroundColor: `${badge.border}15` }}>
                {item.type}
              </span>
              <span className="text-[10px] font-mono text-gray-400">ID: {item.cardId.slice(0, 8)}</span>
            </div>
          </div>
        </div>

        {/* MID: Tactical Quantity Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center border border-white/20 bg-black shadow-inner">
            <motion.button
              whileTap={{ scale: 0.9, backgroundColor: 'rgba(255,255,255,0.1)' }}
              onClick={() => onChangeQty(item.cardId, -1)}
              className="w-10 h-10 flex items-center justify-center text-lg font-mono text-gray-500 hover:text-white transition-colors border-r border-white/10"
            >
              −
            </motion.button>
            <div className="w-12 h-10 flex items-center justify-center relative overflow-hidden">
              <span className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
              <motion.span
                key={item.quantity}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-sm font-mono font-black text-purple-400 relative z-10"
              >
                {item.quantity}
              </motion.span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9, backgroundColor: 'rgba(168,85,247,0.2)' }}
              onClick={() => onChangeQty(item.cardId, 1)}
              className="w-10 h-10 flex items-center justify-center text-lg font-mono text-purple-400 border-l border-white/10 transition-colors"
            >
              +
            </motion.button>
          </div>
        </div>

        {/* RIGHT: Price & Delete */}
        <div className="flex items-center gap-6 shrink-0 justify-end w-32 md:w-40" style={{ marginRight: '32px' }}>
          <div className="text-right">
            <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Costo Total</span>
            <div className="text-xl md:text-2xl font-mono font-black text-white">
              <AnimatedCounter prefix="$" to={lineTotal} duration={0.3} />
            </div>
          </div>
          
          {/* Delete execution button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => onRemove(item.cardId)}
            className="w-8 h-8 rounded-full border border-red-500/50 flex flex-col items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors group/del"
            title="Purgar"
          >
            <div className="w-3 h-0.5 bg-current rotate-45 absolute" />
            <div className="w-3 h-0.5 bg-current -rotate-45 absolute" />
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}

/* ─────────────────────────────── MAIN TERMINAL COMPONENT ──────────────────────────── */
export default function Carrito() {
  const navigate = useNavigate();
  const [carrito, setCarrito]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [completing, setCompleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Previous subtotal state specifically for Counter interpolation
  const [prevSubtotal, setPrevSubtotal] = useState(0);

  useEffect(() => { fetchCarrito(); }, []);

  async function fetchCarrito() {
    setLoading(true);
    try {
      const { data } = await api.get('/compras/carrito');
      setCarrito(data.carrito || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(cardId) {
    setCarrito((c) => c.filter((i) => i.cardId !== cardId));
    try {
      await api.post('/compras/carrito', { cardId, quantity: 0 });
    } catch { fetchCarrito(); }
  }

  async function changeQty(cardId, delta) {
    const item = carrito.find((i) => i.cardId === cardId);
    if (!item) return;
    const next = parseInt(item.quantity) + delta;
    if (next <= 0) { removeItem(cardId); return; }
    
    // Store previous total for animation
    const currentSub = carrito.reduce((s, i) => s + (parseInt(i.quantity) * (i.price || 0)), 0);
    setPrevSubtotal(currentSub);

    setCarrito((c) => c.map((i) => i.cardId === cardId ? { ...i, quantity: next } : i));
    try {
      await api.post('/compras/carrito', { cardId, quantity: next });
    } catch { fetchCarrito(); }
  }

  async function vaciarCarrito() {
    await api.delete('/compras/carrito');
    setCarrito([]);
  }

  async function confirmarCompra() {
    setCompleting(true);
    try {
      const { data } = await api.post('/compras/completar');
      setCarrito([]);
      setShowModal(false);
      setSuccessMsg(`TRANSFERENCIA COMPLETADA. TOTAL DEDUCIDO: $${data.totalPrice}`);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err) {
      setShowModal(false);
      setSuccessMsg(err.response?.data?.error || 'ERROR CRÍTICO AL CONTACTAR EL SERVIDOR DE FONDOS');
    } finally {
      setCompleting(false);
    }
  }

  const totalItems = carrito.reduce((s, i) => s + parseInt(i.quantity), 0);
  const subtotal   = carrito.reduce((s, i) => s + (parseInt(i.quantity) * (i.price || 0)), 0);

  /* ── 1. LOADING STATE ── */
  if (loading) return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-2 border-primary border-t-transparent border-b-transparent animate-spin rounded-full mb-4" />
        <p className="font-mono text-primary tracking-widest text-xs uppercase animate-pulse">ESTABLECIENDO ENLACE CON MANIFIESTO...</p>
      </div>
    </div>
  );

  /* ── 2. EMPTY STATE (Military radar feel) ── */
  if (carrito.length === 0) return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[800px] w-full px-6 flex flex-col items-center text-center relative z-10"
      >
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full animate-spin-slow" />
          <div className="absolute inset-4 border border-primary/20 rounded-full" />
          <Target className="w-12 h-12 text-primary/40 absolute" strokeWidth={1} />
          <motion.div 
            animate={{ height: ['0%', '100%', '0%'] }} 
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute w-full bg-primary/20 mix-blend-screen overflow-hidden" 
          />
        </div>

        <h2 className="text-3xl md:text-5xl font-mono font-black text-white uppercase tracking-[0.2em] drop-shadow-lg mb-2">
          Manifiesto_Vacío
        </h2>
        <p className="text-gray-500 font-mono tracking-widest text-sm uppercase max-w-lg mb-12">
          No hay componentes detectados en la plataforma de transferencia. Proceda al catálogo para iniciar la adquisición.
        </p>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 px-6 py-4 border font-mono font-black uppercase text-xs tracking-widest mb-8 shadow-[4px_4px_0_rgba(0,0,0,0.5)] ${successMsg.includes('ERROR') ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-green-500/10 border-green-500/40 text-green-400'}`}
          >
            {successMsg.includes('ERROR') ? <ShieldAlert className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            {successMsg}
          </motion.div>
        )}

        <div className="flex gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/cartas" className="px-8 py-4 border-2 border-primary bg-primary/10 text-primary font-mono font-black uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-black transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,235,59,0.2)]">
              <Zap className="w-4 h-4" /> Iniciar Inserción
            </Link>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="px-8 py-4 border border-white/20 text-gray-400 font-mono font-bold uppercase tracking-widest text-sm hover:text-white hover:bg-white/5 transition-colors">
              Abortar
            </Link>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  /* ── Compute type distribution for visual breakdown ── */
  const typeBreakdown = carrito.reduce((acc, item) => {
    const t = item.type || 'Colorless';
    acc[t] = (acc[t] || 0) + parseInt(item.quantity);
    return acc;
  }, {});
  const dominantType = Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Colorless';
  const dominantBadge = TYPE_BADGE[dominantType] || TYPE_BADGE.Colorless;

  /* ── 3. MAIN TERMINAL VIEW ── */
  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden flex flex-col pt-8 pb-32">
      <style>
        {`
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 20s linear infinite; }
          @keyframes glitch-slide { 0% { left: -100%; opacity: 0; } 50% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
          @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        `}
      </style>
      
      {/* ═══ RICH AMBIENT BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Structural grid lines */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Primary glow - top right, psychic purple */}
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[15%] -right-[5%] w-[50vw] h-[50vw] blur-[150px] mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 60%)' }}
        />
        {/* Secondary glow - bottom left, deep violet */}
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-[20%] -left-[10%] w-[45vw] h-[45vw] blur-[140px] mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.35) 0%, transparent 60%)' }}
        />
        {/* Tertiary glow - center, pink accent */}
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-[30%] left-[40%] w-[30vw] h-[30vw] blur-[120px] mix-blend-color-dodge"
          style={{ background: 'radial-gradient(circle, rgba(233,30,99,0.2) 0%, transparent 60%)' }}
        />
        {/* Noise texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
        
        {/* Slow scanline effect - purple */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-40" style={{ animation: 'scanline 8s linear infinite' }} />
      </div>

      {/* ═══ PIXEL ART SPRITES ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 top-16">
        {/* Eevee trotting across the bottom */}
        <motion.div
          initial={{ x: '-10vw' }}
          animate={{ x: '110vw' }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear', delay: 1 }}
          className="absolute bottom-[3%] left-0 opacity-15 mix-blend-screen"
          style={{ transform: 'scale(1.4)' }}
        >
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif" alt="" style={{ imageRendering: 'pixelated' }} />
        </motion.div>
        
        {/* Dragonite flying high */}
        <motion.div
          initial={{ x: '110vw', y: 0 }}
          animate={{ x: '-15vw', y: [-10, 10, -10] }}
          transition={{ x: { duration: 30, repeat: Infinity, ease: 'linear', delay: 3 }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute top-[8%] right-0 opacity-10 mix-blend-screen"
          style={{ transform: 'scaleX(-1) scale(1.6)' }}
        >
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/149.gif" alt="" style={{ imageRendering: 'pixelated' }} />
        </motion.div>
        
        {/* Jigglypuff bouncing slowly across middle */}
        <motion.div
          initial={{ x: '-15vw', y: 0 }}
          animate={{ x: '110vw', y: [0, -15, 0] }}
          transition={{ x: { duration: 45, repeat: Infinity, ease: 'linear', delay: 8 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute top-[55%] left-0 opacity-[0.08] mix-blend-screen"
          style={{ transform: 'scale(1.3)' }}
        >
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/39.gif" alt="" style={{ imageRendering: 'pixelated' }} />
        </motion.div>
      </div>

      {showModal && (
        <CheckoutModal
          carrito={carrito}
          subtotal={subtotal}
          totalItems={totalItems}
          onConfirm={confirmarCompra}
          onClose={() => !completing && setShowModal(false)}
          confirming={completing}
        />
      )}

      <div className="w-full relative z-10 flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
        
        {/* LEFT COLUMN: The rows (scrollable, with padding) */}
        <div className="flex-1 flex flex-col min-w-0 px-4 md:px-8 lg:px-12 pt-6 pb-32" style={{ marginRight: '440px' }}>
          
          <header className="mb-8 border-b-2 border-purple-500/20 pb-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                <h1 className="text-sm font-mono font-black text-purple-400 tracking-[0.4em] uppercase">Transfer_Terminal</h1>
              </div>
              <h2 className="text-3xl md:text-5xl font-mono font-black text-white uppercase tracking-tight drop-shadow-md">
                Manifiesto de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Carga</span>
              </h2>
              <p className="text-gray-500 font-mono text-xs mt-2 tracking-wider uppercase">
                {carrito.length} variante{carrito.length !== 1 ? 's' : ''} registrada{carrito.length !== 1 ? 's' : ''} &middot; {totalItems} unidad{totalItems !== 1 ? 'es' : ''} en plataforma
              </p>
            </div>
            
            <button
              onClick={vaciarCarrito}
              className="px-4 py-2 border border-red-500/30 text-[10px] font-mono font-black uppercase text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors tracking-widest hidden md:block"
            >
              Purgar Plataforma
            </button>
          </header>

          <AnimatePresence mode="popLayout">
            <div className="flex flex-col gap-3">
              {carrito.map((item, idx) => (
                <CargoRow
                  key={item.cardId}
                  item={item}
                  idx={idx}
                  onRemove={removeItem}
                  onChangeQty={changeQty}
                />
              ))}
            </div>
          </AnimatePresence>

          {/* Suggestion / Upsell below items */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 border border-dashed border-purple-500/30 bg-purple-500/[0.03] px-6 py-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 border border-purple-500/40 bg-purple-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">{"¿Necesitás más cartas?"}</p>
              <p className="text-[10px] font-mono text-gray-500 mt-1">Sumá más unidades al manifiesto antes de autorizar la transferencia.</p>
            </div>
            <Link to="/cartas" className="px-4 py-2 border border-purple-500/50 text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-colors shrink-0">
              Catálogo
            </Link>
          </motion.div>

          <button
            onClick={vaciarCarrito}
            className="mt-6 py-3 border border-red-500/30 text-xs font-mono font-black uppercase text-red-500 hover:bg-red-500/10 w-full md:hidden transition-colors tracking-widest"
          >
            Purgar Plataforma
          </button>
        </div>

        {/* RIGHT COLUMN: Fixed Panel hugging right + bottom edge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex fixed top-[76px] right-0 bottom-0 w-[360px] lg:w-[440px] border-l-2 border-white/10 bg-bg-surface/95 backdrop-blur-xl flex-col shadow-[-8px_0_30px_rgba(0,0,0,0.6)] z-20 overflow-hidden"
        >
          {/* Corner decals */}
          <div className="absolute top-0 left-0 w-4 h-4 border-r-2 border-b-2 border-purple-500/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-r-2 border-t-2 border-purple-500/40" />
          
          {/* Side accent bar */}
          <div className="absolute left-0 top-8 w-1 h-20 bg-purple-500/60" />
          
          {/* Background inner glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 blur-[60px] opacity-25 pointer-events-none" style={{ background: 'rgba(168,85,247,0.5)' }} />
          <div className="absolute -bottom-20 -right-10 w-36 h-36 blur-[50px] opacity-15 pointer-events-none" style={{ background: 'rgba(233,30,99,0.4)' }} />

          {/* ═══════════════════════════════════════════════
              TOP: ALAKAZAM PSYCHIC SHOWCASE
          ═══════════════════════════════════════════════ */}
          <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden min-h-[240px]">
            {/* Psychic energy field behind Alakazam */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-48 h-48 rounded-full blur-[50px]"
              style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(233,30,99,0.3) 50%, transparent 70%)' }}
            />
            {/* Secondary psychic ripple */}
            <motion.div
              animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute w-36 h-36 rounded-full blur-[40px]"
              style={{ background: 'radial-gradient(circle, rgba(255,235,59,0.3) 0%, transparent 60%)' }}
            />
            
            {/* Rotating psychic ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute w-40 h-40 border border-dashed border-purple-500/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-56 h-56 border border-dotted border-pink-500/10 rounded-full"
            />

            {/* Floating spoon particles */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -12, 0, 8, 0], 
                  x: [0, 6, -4, 2, 0],
                  rotate: [0, 15, -10, 5, 0],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ 
                  duration: 3 + i * 0.5, 
                  repeat: Infinity, 
                  ease: 'easeInOut', 
                  delay: i * 0.7 
                }}
                className="absolute text-lg select-none"
                style={{ 
                  top: `${15 + i * 15}%`, 
                  left: `${10 + (i % 2 === 0 ? 65 : 15)}%`,
                  filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.6))',
                  fontSize: '20px'
                }}
              >
                🥄
              </motion.div>
            ))}

            {/* ALAKAZAM - The star of the show */}
            <motion.div
              animate={{ y: [0, -8, 0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              {/* Glow under Alakazam */}
              <motion.div
                animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full blur-md bg-purple-500/40"
              />
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/65.gif" 
                alt="Alakazam" 
                className="relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                style={{ imageRendering: 'pixelated', transform: 'scale(3)', transformOrigin: 'center' }}
              />
            </motion.div>

            {/* Label */}
            <motion.p 
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[9px] font-mono font-black text-purple-400 uppercase tracking-[0.5em] mt-16 relative z-10"
            >
              Psi_Guardian
            </motion.p>
          </div>

          {/* ═══════════════════════════════════════════════
              BOTTOM: ALL DATA + CTA (pushed down)
          ═══════════════════════════════════════════════ */}
          <div className="p-6 lg:p-8 border-t border-white/10 bg-black/30 relative z-10 shrink-0">

            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <Battery className="w-4 h-4 text-purple-400" />
              <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">Logística_Resumen</h3>
            </div>

            {/* Compact Stats Row */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-black/40 px-3 py-2 border border-white/5 text-center">
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block">Variantes</span>
                <span className="text-xl font-mono font-black text-white">{carrito.length}</span>
              </div>
              <div className="bg-black/40 px-3 py-2 border border-white/5 text-center">
                <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest block">Unidades</span>
                <span className="text-xl font-mono font-black text-purple-400">{totalItems}</span>
              </div>
            </div>

            {/* Type Breakdown Bar (compact) */}
            <div className="mb-4">
              <div className="w-full h-2 bg-black/60 border border-white/10 flex overflow-hidden">
                {Object.entries(typeBreakdown).map(([type, count]) => {
                  const b = TYPE_BADGE[type] || TYPE_BADGE.Colorless;
                  const pct = (count / totalItems) * 100;
                  return (
                    <motion.div
                      key={type}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ backgroundColor: b.border }}
                      className="h-full"
                      title={`${type}: ${count}`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
                {Object.entries(typeBreakdown).map(([type, count]) => {
                  const b = TYPE_BADGE[type] || TYPE_BADGE.Colorless;
                  return (
                    <span key={type} className="text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5" style={{ backgroundColor: b.border }} />
                      <span style={{ color: b.text }}>{type}</span>
                      <span className="text-gray-600">({count})</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Total Price */}
            <div className="mb-4 flex items-baseline justify-between">
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Total</p>
              <div className="text-4xl font-mono font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] tracking-tighter">
                <AnimatedCounter prefix="$" from={prevSubtotal} to={subtotal} duration={0.6} />
              </div>
            </div>

            {/* Capacity bar */}
            <div className="mb-5">
              <div className="flex justify-between text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                <span>Carga</span>
                <span className="text-purple-400">{Math.min(totalItems, 50)}/50</span>
              </div>
              <div className="w-full h-1.5 bg-black/60 border border-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalItems / 50) * 100, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#c084fc' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="w-full py-3.5 bg-purple-500 text-white font-mono font-black text-sm uppercase tracking-[0.2em] shadow-[4px_4px_0_rgba(168,85,247,0.3)] border border-transparent flex items-center justify-center gap-2 transition-all hover:shadow-[6px_6px_0_rgba(168,85,247,0.5)]"
            >
              Iniciar Checkout <ArrowUpRight strokeWidth={3} className="w-5 h-5" />
            </motion.button>
            
            <Link to="/cartas" className="mt-3 w-full py-2.5 border border-purple-500/20 text-gray-400 hover:text-purple-300 hover:border-purple-500/40 text-[10px] font-mono font-bold uppercase tracking-widest text-center transition-colors block">
              Continuar Selección
            </Link>

          </div>

        </motion.div>

        {/* MOBILE SUMMARY (shown below on small screens) */}
        <div className="md:hidden px-4 pb-8">
          <div className="border-2 border-white/10 bg-bg-surface/90 backdrop-blur-xl p-6 flex flex-col relative overflow-hidden mt-6">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <Battery className="w-5 h-5 text-primary" />
              <h3 className="text-xs font-mono font-black uppercase tracking-[0.3em]">Resumen</h3>
            </div>
            <div className="text-4xl font-mono font-black text-white mb-4">
              <AnimatedCounter prefix="$" from={prevSubtotal} to={subtotal} duration={0.6} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="w-full py-4 bg-primary text-black font-mono font-black text-sm uppercase tracking-[0.2em]"
            >
              Iniciar Checkout <ArrowUpRight strokeWidth={3} className="w-4 h-4 inline" />
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
}
