import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { 
  User, Mail, Wallet, Calendar, Package, TrendingUp, 
  ShoppingBag, ChevronDown, CheckCircle2, Clock, 
  ShieldCheck, ArrowUpRight, Zap, Target, BookOpen, ChevronLeft, ChevronRight as ChevronRightIcon 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

/* ── Custom Animated Number Component ── */
function AnimatedCounter({ from = 0, to, duration = 2, prefix = "", suffix = "" }) {
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

/* ── Pixel Art Background Sprites (Holographic Ecosystem) ── */
function PixelArtBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden top-16">

      {/* FOOTER LAYER (Lower ground) */}
      {/* Pikachu - Dimmed and integrated */}
      <motion.div
        initial={{ x: '-10vw' }}
        animate={{ x: '110vw' }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 2 }}
        className="absolute bottom-[2%] left-0 opacity-20 mix-blend-screen z-0"
        style={{ transform: 'scale(1.5)' }}
      >
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif" alt="Pikachu" style={{ imageRendering: 'pixelated' }} />
      </motion.div>

      {/* Bulbasaur - Slower, walking the other way */}
      <motion.div
        initial={{ x: '110vw' }}
        animate={{ x: '-10vw' }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear', delay: 5 }}
        className="absolute bottom-[4%] left-0 opacity-15 mix-blend-screen z-0"
        style={{ transform: 'scaleX(-1) scale(1.4)' }}
      >
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif" alt="Bulbasaur" style={{ imageRendering: 'pixelated' }} />
      </motion.div>

      {/* MID-LEVEL LAYER (Floating/Ghost) */}
      {/* Gengar - Floating slow */}
      <motion.div
        initial={{ x: '-15vw', y: 0 }}
        animate={{ x: '110vw', y: [0, 20, 0] }}
        transition={{ x: { duration: 55, repeat: Infinity, ease: 'linear', delay: 15 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute top-[45%] left-0 opacity-[0.12] mix-blend-screen z-0"
        style={{ transform: 'scale(1.8)' }}
      >
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif" alt="Gengar" style={{ imageRendering: 'pixelated' }} />
      </motion.div>

      {/* Mew - Chaotic floating */}
      <motion.div
        initial={{ x: '110vw', y: 0 }}
        animate={{ x: '-15vw', y: [0, -30, 10, -10, 0] }}
        transition={{ x: { duration: 30, repeat: Infinity, ease: 'linear', delay: 10 }, y: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute top-[35%] left-0 opacity-20 mix-blend-screen z-0"
        style={{ transform: 'scaleX(-1) scale(1.3)' }}
      >
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif" alt="Mew" style={{ imageRendering: 'pixelated' }} />
      </motion.div>

      {/* HIGHER LEVEL (Flying) */}
      {/* Charizard - Flying */}
      <motion.div
        initial={{ x: '110vw', y: 0 }}
        animate={{ x: '-20vw', y: [-15, 15, -15] }}
        transition={{ x: { duration: 28, repeat: Infinity, ease: 'linear', delay: 2 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute top-[12%] right-0 opacity-15 mix-blend-screen z-0"
        style={{ transform: 'scaleX(-1) scale(1.8)' }}
      >
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif" alt="Charizard" style={{ imageRendering: 'pixelated' }} />
      </motion.div>

      {/* Pidgeot - Fast flying */}
      <motion.div
        initial={{ x: '-20vw', y: 0 }}
        animate={{ x: '110vw', y: [-5, 5, -5] }}
        transition={{ x: { duration: 18, repeat: Infinity, ease: 'linear', delay: 8 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute top-[20%] left-0 opacity-10 mix-blend-screen z-0"
        style={{ transform: 'scale(1.5)' }}
      >
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/18.gif" alt="Pidgeot" style={{ imageRendering: 'pixelated' }} />
      </motion.div>

      {/* Lugia - Legendary, very slow and imposing */}
      <motion.div
        initial={{ x: '-30vw', y: 0 }}
        animate={{ x: '110vw', y: [0, -20, 0] }}
        transition={{ x: { duration: 80, repeat: Infinity, ease: 'linear', delay: 0 }, y: { duration: 12, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute top-[5%] left-0 opacity-[0.08] mix-blend-screen z-0"
        style={{ transform: 'scale(2.5)' }}
      >
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/249.gif" alt="Lugia" style={{ imageRendering: 'pixelated' }} />
      </motion.div>

    </div>
  );
}

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [coleccionCards, setColeccionCards] = useState([]);
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get('/usuarios/perfil'),
      api.get('/compras/historial'),
      api.get('/usuarios/coleccion'),
    ])
      .then(([p, h, c]) => {
        setPerfil(p.data);
        setUsername(p.data.username || '');
        setHistorial(h.data.compras || []);
        setColeccionCards(c.data.coleccion || []);
      })
      .catch(console.error);
  }, []);

  async function guardarPerfil(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await api.put('/usuarios/perfil', { username });
      setPerfil((p) => ({ ...p, username }));
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, username }));
      setMsg('Identidad sincronizada.');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error al actualizar');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  }

  if (!perfil) return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing loading core (SHARP square design) */}
        <div className="w-24 h-24 border-2 border-primary/20 border-t-primary animate-spin" />
        <p className="font-mono tracking-[0.4em] uppercase text-primary mt-8 animate-pulse text-sm">
          CARGANDO_SISTEMA
        </p>
      </div>
    </div>
  );

  const totalGastado = historial.reduce((sum, c) => sum + (c.totalPrice || 0), 0);
  const totalCartas = historial.reduce(
    (sum, c) => sum + Object.values(c.items || {}).reduce((a, b) => a + b, 0), 0
  );

  return (
    <div className="h-[calc(100vh-76px)] bg-bg-base text-white relative overflow-hidden flex flex-col">
      {/* Dynamic Animated Pixel Art Layer */}
      <PixelArtBackground />

      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Massive top left glow */}
        <motion.div
          animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] blur-[140px] mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.4) 0%, transparent 70%)' }}
        />
        {/* Bottom right glow */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] blur-[140px] mix-blend-color-dodge"
          style={{ background: 'radial-gradient(circle, rgba(255,235,59,0.3) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 pt-16 flex flex-col gap-0 max-w-[1600px] mx-auto">

        {/* ── HEADER (Sharp/Retro Style) ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center gap-4 mb-16 border-b-2 border-white/[8%] pb-8"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-[#7C4DFF] to-primary flex items-center justify-center shrink-0 shadow-[4px_4px_0_rgba(124,77,255,0.5)] border border-white/20">
            <ShieldCheck className="w-7 h-7 text-black" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-2xl uppercase">
              Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#F57C00]">Comando</span>
            </h1>
            <p className="text-gray-400 text-sm font-mono tracking-wide mt-1 uppercase">
              SYS.REG // Telemetría del Inventario
            </p>
          </div>
        </motion.header>

        {/* ── WIDE LAYOUT GRID ── */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch pb-12">
          
          {/* LEFT COLUMN: Trainer Card & Stats */}
          <div className="lg:col-span-4 flex flex-col gap-10 h-full">
            <TrainerCard perfil={perfil} username={username} setUsername={setUsername} onSave={guardarPerfil} saving={saving} msg={msg} />

            {/* Stats Telemetry (Sharp layout) */}
            <div className="grid grid-cols-2 gap-5">
              <StatCard label="Aprobación" icon={<ShieldCheck strokeWidth={3} className="w-5 h-5" />} color="#7C4DFF" delay={0.1}>
                Lv. <AnimatedCounter to={Math.max(1, Math.floor(totalCartas / 10))} />
              </StatCard>
              <StatCard label="Patrimonio Neto" icon={<TrendingUp strokeWidth={3} className="w-5 h-5"/>} color="#FFEB3B" delay={0.2} prefix="$">
                <AnimatedCounter to={perfil.balance || 0} />
              </StatCard>
              <StatCard label="Cartas Obtenidas" icon={<Target strokeWidth={3} className="w-5 h-5" />} color="#00BCD4" delay={0.3}>
                <AnimatedCounter to={totalCartas} />
              </StatCard>
              <StatCard label="Valor Adquirido" icon={<Zap strokeWidth={3} className="w-5 h-5" />} color="#F57C00" delay={0.4} prefix="$">
                <AnimatedCounter to={totalGastado} />
              </StatCard>
            </div>

            {/* ── POKÉDEX PREVIEW CAROUSEL ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="p-5 border-2 border-[#7C4DFF]/30 bg-bg-surface/80 backdrop-blur-md relative overflow-hidden shadow-[6px_6px_0_rgba(124,77,255,0.15)]"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-r-2 border-b-2 border-[#7C4DFF]/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-l-2 border-b-2 border-[#7C4DFF]/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-r-2 border-t-2 border-[#7C4DFF]/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-l-2 border-t-2 border-[#7C4DFF]/50" />

              {/* Background glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#7C4DFF]/10 blur-[60px] pointer-events-none" />

              {/* Title */}
              <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                <div className="p-2 bg-[#7C4DFF]/15 border-2 border-[#7C4DFF]/40">
                  <BookOpen className="w-5 h-5 text-[#7C4DFF]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-widest uppercase">Tu Pokédex</h3>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500 mt-0.5">
                    {coleccionCards.length} CARTA{coleccionCards.length !== 1 ? 'S' : ''} CAPTURADA{coleccionCards.length !== 1 ? 'S' : ''}
                  </p>
                </div>
              </div>

              {coleccionCards.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="w-16 h-16 border-2 border-dashed border-white/20 flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400 font-mono text-xs">Sin cartas aún. ¡Explorá el catálogo!</p>
                </div>
              ) : (
                <>
                  {/* Carousel: 1 big + 2 small */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Prev Button */}
                    <button
                      onClick={() => setCarouselIndex(prev => (prev - 1 + coleccionCards.length) % coleccionCards.length)}
                      className="shrink-0 w-8 h-8 border border-white/20 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Cards Display */}
                    <div className="flex-1 flex items-center gap-3 justify-center min-h-[160px]">
                      {/* Small card (prev) */}
                      {coleccionCards.length > 1 && (
                        <div className="w-[70px] h-[100px] shrink-0 rounded-md overflow-hidden border border-white/10 opacity-50 hidden sm:block relative">
                          <AnimatePresence mode="popLayout">
                            <motion.img
                              key={`prev-${(carouselIndex - 1 + coleccionCards.length) % coleccionCards.length}`}
                              src={coleccionCards[(carouselIndex - 1 + coleccionCards.length) % coleccionCards.length]?.image}
                              alt={coleccionCards[(carouselIndex - 1 + coleccionCards.length) % coleccionCards.length]?.name}
                              className="w-full h-full object-cover absolute inset-0"
                              loading="lazy"
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 12 }}
                              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                            />
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Big card (current) */}
                      <div className="w-[110px] h-[155px] shrink-0 rounded-md overflow-hidden border-2 border-[#7C4DFF]/50 shadow-[0_0_20px_rgba(124,77,255,0.3)] relative">
                        <AnimatePresence mode="popLayout">
                          <motion.img
                            key={`main-${carouselIndex}`}
                            src={coleccionCards[carouselIndex]?.image}
                            alt={coleccionCards[carouselIndex]?.name}
                            className="w-full h-full object-cover absolute inset-0"
                            loading="lazy"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          />
                        </AnimatePresence>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-1.5 z-10">
                          <p className="text-[9px] font-black text-white truncate text-center">{coleccionCards[carouselIndex]?.name}</p>
                        </div>
                      </div>

                      {/* Small card (next) */}
                      {coleccionCards.length > 2 && (
                        <div className="w-[70px] h-[100px] shrink-0 rounded-md overflow-hidden border border-white/10 opacity-50 hidden sm:block relative">
                          <AnimatePresence mode="popLayout">
                            <motion.img
                              key={`next-${(carouselIndex + 1) % coleccionCards.length}`}
                              src={coleccionCards[(carouselIndex + 1) % coleccionCards.length]?.image}
                              alt={coleccionCards[(carouselIndex + 1) % coleccionCards.length]?.name}
                              className="w-full h-full object-cover absolute inset-0"
                              loading="lazy"
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -12 }}
                              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                            />
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setCarouselIndex(prev => (prev + 1) % coleccionCards.length)}
                      className="shrink-0 w-8 h-8 border border-white/20 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-all"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Go to Pokédex Button */}
                  <Link
                    to="/pokedex"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#7C4DFF]/15 border border-[#7C4DFF]/40 text-[#7C4DFF] font-mono font-black text-xs uppercase tracking-widest hover:bg-[#7C4DFF]/25 hover:border-[#7C4DFF]/60 transition-all shadow-[2px_2px_0_rgba(124,77,255,0.2)]"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Ir a la Pokédex
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: The Vault (History) */}
          <div className="lg:col-span-8 flex flex-col h-full overflow-hidden pb-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 border-2 border-white/10 relative overflow-hidden flex-1 flex flex-col bg-bg-surface/80 backdrop-blur-md shadow-[8px_8px_0_rgba(0,0,0,0.6)]"
              style={{ marginRight: '440px' }}
            >
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 blur-[80px] pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10 border-b border-white/10 pb-4 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/15 border-2 border-primary/40">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-lg uppercase">La Bóveda</h2>
                    <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-gray-500 mt-1">
                      REG / MANIFIESTO_TRANSACCIONES
                    </p>
                  </div>
                </div>
                {historial.length > 0 && (
                  <div className="px-4 py-2 border-t-2 border-l-2 border-r-2 border-b-2 border-white/20 text-sm font-mono font-black text-gray-300 bg-white/5 shadow-[2px_2px_0_rgba(255,255,255,0.1)]">
                    {historial.length} REGISTROS
                  </div>
                )}
              </div>

              {historial.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="relative mb-6"
                  >
                    <div className="w-32 h-32 border-2 border-dotted border-white/20 flex items-center justify-center">
                      <div className="w-24 h-24 border border-primary/30 flex items-center justify-center bg-primary/5">
                        <ShoppingBag className="w-10 h-10 text-primary/40" />
                      </div>
                    </div>
                  </motion.div>
                  <p className="text-xl font-mono font-black text-white tracking-widest uppercase">Cámara Vacía</p>
                  <p className="text-gray-400 mt-2 max-w-sm font-mono text-xs">No entries found in databank. Awaiting fresh catalog acquisitions.</p>
                </div>
              ) : (
                <div 
                  className="relative z-10 space-y-4 overflow-y-auto flex-1 pb-10"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', position: 'relative' }}
                >
                  <style>{`.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>

                  {historial.map((compra, idx) => {
                    const isOpen = expandedId === compra._id;
                    const itemCount = Object.values(compra.items || {}).reduce((a, b) => a + b, 0);
                    const isCompleted = compra.status === 'completed';

                    return (
                      <motion.div
                        key={compra._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                        className={`border-2 transition-all duration-300 overflow-hidden ${
                          isOpen 
                            ? 'bg-bg-elevated border-primary/60 shadow-[4px_4px_0_rgba(255,235,59,0.2)]' 
                            : 'bg-white/[2%] border-white/10 hover:border-white/20 hover:bg-white/[4%]'
                        }`}
                      >
                        {/* Transaction Header (Sharp layout logic) */}
                        <div 
                          className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer select-none relative group"
                          onClick={() => setExpandedId(isOpen ? null : compra._id)}
                        >
                          {/* Accent Marker */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${isCompleted ? 'bg-primary' : 'bg-amber-500'}`} />

                          {/* Index & Date */}
                          <div className="flex items-center gap-4 ml-2 shrink-0 sm:w-1/3">
                            <div className={`w-10 h-10 border flex items-center justify-center font-mono font-black ${isCompleted ? 'bg-primary/10 text-primary border-primary/40' : 'bg-amber-500/10 text-amber-500 border-amber-500/40'}`}>
                              {historial.length - idx}
                            </div>
                            <div>
                              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                                {new Date(compra.purchasedAt).toLocaleDateString('es-AR', { month: 'short', day: '2-digit' })}
                              </p>
                              <p className="text-sm font-mono font-medium text-gray-200 flex items-center gap-1.5 mt-0.5">
                                <Clock className="w-3.5 h-3.5 opacity-50" />
                                {new Date(compra.purchasedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                          {/* Items Summary */}
                          <div className="flex-1 min-w-0">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-bold uppercase bg-white/5 border border-white/10 text-gray-300">
                              <Package className="w-3.5 h-3.5" />
                              {itemCount} Unidad{itemCount !== 1 ? 'es' : ''}
                            </span>
                          </div>

                          {/* Total & Status */}
                          <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                            <div className="text-right">
                              <p className="text-lg font-mono font-black text-white tracking-tighter">
                                ${compra.totalPrice?.toLocaleString('es-AR')}
                              </p>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1 border text-[10px] font-mono font-black uppercase tracking-widest ${isCompleted ? 'bg-green-500/5 text-green-400 border-green-500/30' : 'bg-amber-500/5 text-amber-400 border-amber-500/30'}`}>
                              {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {isCompleted ? 'OK' : 'PND'}
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-white'}`} />
                          </div>
                        </div>

                        {/* Collapsible Details */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeOut' }}
                              className="border-t-2 border-white/5 bg-black/30"
                            >
                              <div className="p-5 overflow-hidden">
                                <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-gray-500 mb-4 ml-1">
                                  {"> DETALLE_MANIFIESTO"}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {Object.entries(compra.items || {}).map(([cardId, qty], i) => (
                                    <motion.div 
                                      key={cardId}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.05 + (i * 0.03) }}
                                      className="flex items-center gap-3 p-3 border border-white/[8%] bg-white/[2%] hover:bg-white/[5%] transition-colors shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
                                    >
                                      <div className="w-8 h-10 border border-white/20 bg-[#7C4DFF]/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs grayscale">🃏</span>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-gray-400 font-mono truncate uppercase tracking-widest">ID: {cardId}</p>
                                      </div>
                                      <div className="px-3 py-1 border border-primary/20 bg-primary/10 text-sm font-mono font-black text-primary">
                                        x{qty}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}

                  {/* Snorlax sleeping quietly at the bottom of the history */}
                  <div className="absolute opacity-50 mix-blend-screen select-none pointer-events-none" style={{ bottom: '40px', right: '40px', zIndex: 20 }}>
                    <img 
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/143.gif" 
                      alt="Snorlax" 
                      style={{ transform: 'scale(1.8)', imageRendering: 'pixelated' }} 
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRAINER CARD COMPONENT (Sharp Holographic Setup)
═══════════════════════════════════════════════════════════ */

function TrainerCard({ perfil, username, setUsername, onSave, saving, msg }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const shineOppacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.55]);
  const shineGradientPos = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "200%"]);

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const initial = perfil.username?.[0]?.toUpperCase() || perfil.email?.[0]?.toUpperCase() || '?';

  return (
    <div style={{ perspective: '1200px' }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full p-6 lg:p-8 bg-bg-surface border-2 border-primary/40 relative overflow-hidden flex flex-col items-center shadow-[6px_6px_0_rgba(255,235,59,0.15)]"
      >
        {/* Decorative mechanical corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-r-2 border-b-2 border-primary/50" />
        <div className="absolute top-0 right-0 w-3 h-3 border-l-2 border-b-2 border-primary/50" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-r-2 border-t-2 border-primary/50" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-l-2 border-t-2 border-primary/50" />

        {/* Sharp Holographic foil overlay */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge"
          style={{
            opacity: shineOppacity,
            background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.5) 25%, rgba(255,235,59,0.8) 45%, transparent 50%)`,
            backgroundPosition: shineGradientPos,
            backgroundSize: "200% 200%",
          }}
        />

        <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} className="w-full flex flex-col items-center relative z-20">
          
          <div className="text-center mb-6 w-full flex flex-col items-center">
            <h3 className="text-primary font-mono font-black uppercase tracking-[0.4em] text-[10px] mb-2 bg-primary/10 px-3 py-1 border border-primary/30 inline-block shadow-[2px_2px_0_rgba(255,235,59,0.2)]">
              LICENCIA / CLASE-X
            </h3>
            <div className="h-[1px] w-full max-w-[120px] bg-primary/20 mx-auto mt-2" />
          </div>

          <div className="mb-6 flex flex-col items-center">
            {/* The avatar container: Sharp square instead of circle */}
            <div className="w-24 h-24 border-2 border-primary/60 flex items-center justify-center text-4xl font-mono font-black bg-gradient-to-br from-[#FFEB3B] to-[#F57C00] text-black relative z-10 shadow-[4px_4px_0_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Scanline overlay over avatar */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40 animate-pulse pointer-events-none" />
              {initial}
            </div>
            
            <div className="mt-3 bg-bg-elevated border border-primary/50 text-primary px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest shadow-[2px_2px_0_rgba(255,235,59,0.2)] z-20">
              RANGO_MAX
            </div>
          </div>

          <div className="w-full bg-black/50 p-4 border border-white/15 flex flex-col gap-4 text-center shadow-inner relative overflow-hidden">
            {/* Inner tactical decor */}
            <div className="absolute right-2 top-2 grid grid-cols-2 gap-0.5 opacity-20">
               <div className="w-1 h-1 bg-white" /> <div className="w-1 h-1 bg-white" />
               <div className="w-1 h-1 bg-white" /> <div className="w-1 h-1 bg-white" />
            </div>

            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary mb-1">CALLSIGN</p>
              <h2 className="text-xl font-mono font-black text-white truncate max-w-[200px] mx-auto uppercase">{perfil.username || 'TRAINER_01'}</h2>
            </div>

            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary mb-1">LINK</p>
              <p className="text-[11px] font-mono text-gray-300 truncate max-w-[200px] mx-auto bg-white/5 py-1 px-2 border border-white/10">{perfil.email}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono font-black uppercase tracking-widest bg-primary/10 text-primary py-2 px-3 border border-primary/30 mx-auto w-max">
              <Calendar className="w-3 h-3" />
              ACTIVO_DESDE: {new Date(perfil.createdAt).toLocaleDateString('es-AR', { year: '2-digit', month: '2-digit' })}
            </div>
          </div>

          {/* Edit Console */}
          <div className="w-full mt-6 pt-5 border-t border-white/20 border-dashed" style={{ transform: "translateZ(20px)" }}>
            <p className="text-[10px] uppercase font-mono font-black tracking-[0.2em] text-gray-500 mb-2 text-left">{"> INIT_UPDATE_PROTOCOL"}</p>
            <form onSubmit={onSave} className="flex gap-2 relative">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm font-mono w-full bg-black/60 border border-white/30 text-white focus:outline-none focus:border-primary focus:bg-black/80 transition-all placeholder:text-gray-600 shadow-inner"
                placeholder="NUEVO_CALLSIGN..."
              />
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#FFD54F' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving || !username || username === perfil.username}
                className="px-4 py-2.5 text-xs font-mono font-black disabled:opacity-30 disabled:grayscale transition-all bg-primary text-black flex items-center justify-center shrink-0 border border-transparent shadow-[2px_2px_0_rgba(255,255,255,0.3)]"
              >
                {saving ? (
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping delay-100" />
                  </div>
                ) : (
                  <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
                )}
              </motion.button>
            </form>
            
            {/* Feedback Message */}
            <AnimatePresence>
              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden text-left"
                >
                  <p className={`text-[10px] uppercase font-mono font-black px-3 py-2 border flex items-center gap-2 shadow-[2px_2px_0_rgba(0,0,0,0.5)] ${msg.includes('Sincronizada') ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-red-500/20 text-red-400 border-red-500/40'}`}>
                    {msg.includes('Sincronizada') ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    {msg}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARP TELEMETRY STAT CARD
═══════════════════════════════════════════════════════════ */

function StatCard({ label, children, icon, color, delay }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 220 }}
      whileHover={{ scale: 1.02, y: -2, borderColor: color }}
      className="border-2 border-white/15 p-4 flex flex-col justify-between transition-all bg-bg-surface relative overflow-hidden group shadow-[4px_4px_0_rgba(0,0,0,0.5)] cursor-default"
    >
      {/* Background cyber accent */}
      <div 
        className="absolute -top-12 -right-12 w-24 h-24 blur-xl opacity-20 transition-opacity duration-300 group-hover:opacity-40" 
        style={{ background: color }} 
      />
      {/* Small corner cut emulation via borders */}
      <div className="absolute top-0 right-0 w-4 h-4 border-l border-b border-black bg-black transform translate-x-1/2 -translate-y-1/2 rotate-45 z-20" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="px-2.5 py-2 border bg-black/60 shadow-inner" style={{ color: color, borderColor: `${color}40` }}>
          {icon}
        </div>
        <div className="flex gap-1.5 opacity-60">
          <motion.div
            className="w-1.5 h-4 bg-white/20"
            animate={{ backgroundColor: ['rgba(255,255,255,0.2)', color, 'rgba(255,255,255,0.2)'] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: delay }}
          />
          <motion.div
            className="w-1.5 h-4 bg-white/20"
            animate={{ backgroundColor: ['rgba(255,255,255,0.2)', color, 'rgba(255,255,255,0.2)'] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: delay + 0.3 }}
          />
        </div>
      </div>
      
      <div className="relative z-10 mt-2">
        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-black mb-1.5">{label}</p>
        <p className="text-2xl xl:text-3xl font-mono font-black text-white leading-none tracking-tighter drop-shadow-md flex items-baseline gap-1" style={{ textShadow: `2px 2px 0 ${color}30` }}>
          {children}
        </p>
      </div>
    </motion.div>
  );
}
