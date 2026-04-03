import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const TYPE_STYLES = {
  Fire:      { border: 'var(--color-type-fire)',     glow: 'rgba(229,57,53,0.4)',   badge: '#7f1d1d', badgeBorder: '#ef4444', emoji: '🔥', gradient: 'from-red-900/30 to-transparent' },
  Water:     { border: 'var(--color-type-water)',    glow: 'rgba(30,136,229,0.4)',  badge: '#1e3a5f', badgeBorder: '#3b82f6', emoji: '💧', gradient: 'from-blue-900/30 to-transparent' },
  Grass:     { border: 'var(--color-type-grass)',    glow: 'rgba(67,160,71,0.4)',   badge: '#14532d', badgeBorder: '#22c55e', emoji: '🌿', gradient: 'from-green-900/30 to-transparent' },
  Electric:  { border: 'var(--color-type-electric)', glow: 'rgba(255,235,59,0.4)',  badge: '#713f12', badgeBorder: '#eab308', emoji: '⚡', gradient: 'from-yellow-900/30 to-transparent' },
  Psychic:   { border: 'var(--color-type-psychic)',  glow: 'rgba(233,30,99,0.4)',   badge: '#4a1772', badgeBorder: '#a855f7', emoji: '🔮', gradient: 'from-pink-900/30 to-transparent' },
  Fighting:  { border: 'var(--color-type-fighting)', glow: 'rgba(245,124,0,0.4)',   badge: '#7c2d12', badgeBorder: '#f97316', emoji: '🥊', gradient: 'from-orange-900/30 to-transparent' },
  Darkness:  { border: 'var(--color-type-darkness)', glow: 'rgba(96,125,139,0.3)',  badge: '#1f2937', badgeBorder: '#6b7280', emoji: '🌑', gradient: 'from-slate-900/30 to-transparent' },
  Metal:     { border: 'var(--color-type-metal)',    glow: 'rgba(144,164,174,0.3)', badge: '#1e293b', badgeBorder: '#94a3b8', emoji: '⚙️', gradient: 'from-zinc-900/30 to-transparent' },
  Dragon:    { border: 'var(--color-type-dragon)',   glow: 'rgba(124,77,255,0.4)',  badge: '#312e81', badgeBorder: '#6366f1', emoji: '🐉', gradient: 'from-indigo-900/30 to-transparent' },
  Colorless: { border: 'var(--color-type-colorless)',glow: 'rgba(158,158,158,0.2)', badge: '#374151', badgeBorder: '#9ca3af', emoji: '⭐', gradient: 'from-gray-900/30 to-transparent' },
};

export default function CartaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carta, setCarta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState('');

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    api.get(`/cartas/${id}`)
      .then(({ data }) => setCarta(data))
      .catch(() => navigate('/cartas'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  async function agregarAlCarrito() {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setAdding(true);
    setMsg('');
    try {
      await api.post('/compras/carrito', { cardId: id, quantity: 1 });
      setMsg('Agregado al carrito');
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error al agregar');
    } finally {
      setAdding(false);
    }
  }

  if (loading) return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12 max-w-[1400px] mx-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="h-8 bg-gray-800 rounded w-1/3 animate-pulse" />
        <div className="flex gap-8">
          <div className="w-72 aspect-[3/4] bg-gray-800 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-800 rounded w-3/4" />
            <div className="h-5 bg-gray-800 rounded w-1/2" />
            <div className="h-5 bg-gray-800 rounded w-1/3" />
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (!carta) return null;

  const t = TYPE_STYLES[carta.type] || TYPE_STYLES.Colorless;
  const isDarkType = ['Darkness', 'Metal', 'Colorless'].includes(carta.type);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full relative transition-colors duration-1000"
      style={{
        background: `radial-gradient(circle at 50% -20%, ${t.glow.replace('0.4', '0.15')}, #0a0a1a 80%)`,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <motion.button 
          onClick={() => navigate(-1)} 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Volver
      </motion.button>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-md bg-bg-elevated"
        style={{
          border: `1px solid ${t.border}44`,
          boxShadow: `0 0 60px ${t.glow}`,
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} pointer-events-none`} />
        
        <div className="relative flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-full lg:w-80 shrink-0 perspective-1000"
            onMouseMove={handleMouseMove}
          >
            <motion.div 
              className="relative rounded-lg overflow-hidden preserve-3d"
              style={{
                boxShadow: `0 25px 60px ${t.glow}, 0 0 0 1px ${t.border}33`,
                rotateY: (mousePos.x - 0.5) * 15,
                rotateX: (mousePos.y - 0.5) * -15,
              }}
            >
              {carta.image ? (
                <img 
                  src={carta.image} 
                  alt={carta.name} 
                  className="w-full aspect-[3/4] object-cover"
                />
              ) : (
                <div 
                  className="w-full aspect-[3/4] flex items-center justify-center text-7xl bg-bg-surface opacity-30"
                >
                  {t.emoji}
                </div>
              )}
              
              {/* Shine Effect */}
              <motion.div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                style={{
                  background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                }}
              />
              
              {/* Rainbow Tint (Holographic) */}
              <motion.div 
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-color-dodge z-20"
                style={{
                  background: `linear-gradient(${135 + mousePos.x * 45}deg, #ff0000, #00ff00, #0000ff, #ff00ff)`,
                  backgroundSize: '200% 200%',
                  backgroundPosition: `${mousePos.x * 100}% ${mousePos.y * 100}%`
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-4 flex-1"
          >
            <div className="flex items-start justify-between gap-4">
              <motion.h1 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-4xl font-black text-white tracking-tight"
                style={{ textShadow: `0 0 30px ${t.glow}` }}
              >
                {carta.name}
              </motion.h1>
              {carta.card_number && (
                <span 
                  className="shrink-0 px-3 py-1 rounded-full text-xs font-mono bg-bg-surface"
                  style={{ 
                    color: t.border,
                    border: `1px solid ${t.border}44` 
                  }}
                >
                  #{carta.card_number}
                </span>
              )}
            </div>

            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-2"
            >
              <span 
                className="text-sm px-3 py-1.5 rounded-full font-bold text-white flex items-center gap-1.5"
                style={{ 
                  background: t.badge, 
                  border: `1px solid ${t.badgeBorder}`,
                  boxShadow: `0 0 12px ${t.glow}`
                }}
              >
                {t.emoji} {carta.type}
              </span>
              {carta.hp && (
                <div className="flex flex-col gap-1 min-w-[120px]">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase font-black tracking-tighter text-gray-400">Puntos de Vida</span>
                    <span className="text-sm font-black font-mono text-white" style={{ textShadow: `0 0 10px ${t.border}` }}>
                      {carta.hp} HP
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((carta.hp / 250) * 100, 100)}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to right, ${t.border}, ${t.badgeBorder})` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-panel rounded-md px-4 py-3 space-y-2.5 mt-2"
            >
              {carta.rarity && (
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-gray-500 w-14 shrink-0">Rareza</span>
                  <span
                    className="text-sm font-semibold px-2.5 py-0.5 rounded-lg"
                    style={{ background: `${t.border}18`, color: t.border }}
                  >
                    {carta.rarity}
                  </span>
                </div>
              )}
              {carta.set_name && (
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-gray-500 w-14 shrink-0">Set</span>
                  <span className="text-sm text-gray-300">{carta.set_name}</span>
                </div>
              )}
            </motion.div>

            {carta.url && (
              <motion.a
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                href={carta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm mt-2 transition-colors"
                style={{ color: t.border }}
              >
                Ver en TCGPlayer →
              </motion.a>
            )}

            <div className="mt-auto pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={agregarAlCarrito}
                disabled={adding}
                className="w-full py-4 rounded-md font-black text-lg tracking-wide transition-all disabled:opacity-50"
                style={{
                  background: t.border,
                  color: isDarkType ? '#fff' : '#000',
                  boxShadow: `0 4px 20px ${t.glow}`,
                }}
                onMouseEnter={e => { 
                  if (!adding) e.currentTarget.style.boxShadow = `0 8px 30px ${t.glow}`; 
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.boxShadow = `0 4px 20px ${t.glow}`; 
                }}
              >
                {adding ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      ◌
                    </motion.span>
                    Agregando...
                  </span>
                ) : (
                  `🛒 Agregar al carrito — $10`
                )}
              </motion.button>
              <AnimatePresence>
                {msg && (
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className={`text-sm text-center mt-3 font-semibold ${
                      msg.includes('Agregado') ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {msg.includes('Agregado') ? '✓' : '⚠'} {msg}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
}
