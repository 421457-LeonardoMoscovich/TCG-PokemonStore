import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Flame, Droplets, Leaf, Zap, Brain,
  HandMetal, Moon, Cog, Rabbit, Star,
  Search, SlidersHorizontal, X, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TYPE = {
  Fire:      { border: '#E53935', glow: 'rgba(229,57,53,0.8)',  badge: '#7f1d1d', badgeBorder: '#ef4444', Icon: Flame,     iconColor: '#E53935' },
  Water:     { border: '#1E88E5', glow: 'rgba(30,136,229,0.8)', badge: '#1e3a5f', badgeBorder: '#3b82f6', Icon: Droplets,  iconColor: '#1E88E5' },
  Grass:     { border: '#43A047', glow: 'rgba(67,160,71,0.8)',  badge: '#14532d', badgeBorder: '#22c55e', Icon: Leaf,      iconColor: '#43A047' },
  Electric:  { border: '#FFEB3B', glow: 'rgba(255,235,59,0.8)', badge: '#713f12', badgeBorder: '#eab308', Icon: Zap,       iconColor: '#FFEB3B' },
  Psychic:   { border: '#E91E63', glow: 'rgba(233,30,99,0.8)',  badge: '#4a1772', badgeBorder: '#a855f7', Icon: Brain,     iconColor: '#E91E63' },
  Fighting:  { border: '#F57C00', glow: 'rgba(245,124,0,0.8)',  badge: '#7c2d12', badgeBorder: '#f97316', Icon: HandMetal, iconColor: '#F57C00' },
  Darkness:  { border: '#607D8B', glow: 'rgba(96,125,139,0.8)', badge: '#1f2937', badgeBorder: '#6b7280', Icon: Moon,      iconColor: '#607D8B' },
  Metal:     { border: '#90A4AE', glow: 'rgba(144,164,174,0.8)', badge: '#1e293b', badgeBorder: '#94a3b8', Icon: Cog,       iconColor: '#90A4AE' },
  Dragon:    { border: '#7C4DFF', glow: 'rgba(124,77,255,0.8)', badge: '#312e81', badgeBorder: '#6366f1', Icon: Rabbit,    iconColor: '#7C4DFF' },
  Colorless: { border: '#9E9E9E', glow: 'rgba(158,158,158,0.5)', badge: '#374151', badgeBorder: '#9ca3af', Icon: Star,      iconColor: '#9E9E9E' },
};
const DEFAULT_TYPE = TYPE.Colorless;

/* ── Individual Card with 3D tilt ── */
function PokedexCard({ carta, index }) {
  const navigate = useNavigate();
  const t = TYPE[carta.type] || DEFAULT_TYPE;
  const TypeIcon = t.Icon;
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const shineOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.6]);
  const shineGradientPos = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "200%"]);

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    setHovered(true);
  }

  function handleMouseLeave() {
    setHovered(false);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.6), type: 'spring', stiffness: 200, damping: 25 }}
      style={{ perspective: '1200px' }}
      className="w-full h-full relative z-10 hover:z-50 cursor-pointer"
      onClick={() => navigate(`/carta/${carta._id}`)}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: hovered
            ? `0 25px 50px -12px ${t.glow}, 0 0 20px -2px ${t.glow}`
            : '0 4px 15px rgba(0,0,0,0.6)',
          borderColor: hovered ? t.border : 'rgba(255,255,255,0.06)',
        }}
        animate={{ scale: hovered ? 1.05 : 1, y: hovered ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative flex flex-col rounded-md overflow-hidden select-none bg-[#111] border-2 transition-colors duration-300 h-full"
      >
        {/* Foil Shine */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge"
          style={{
            opacity: shineOpacity,
            background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, ${t.glow} 45%, transparent 50%)`,
            backgroundPosition: shineGradientPos,
            backgroundSize: "200% 200%",
          }}
        />

        {/* Image */}
        <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex-1 flex flex-col">
          <div className="aspect-[3/4] w-full relative overflow-hidden bg-black/50 p-1.5 pb-0">
            <div className="w-full h-full relative rounded-t-md overflow-hidden border border-white/10">
              {carta.image ? (
                <motion.img
                  src={carta.image}
                  alt={carta.name}
                  className="w-full h-full object-cover origin-center"
                  animate={{ scale: hovered ? 1.08 : 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/50">
                  <TypeIcon className="w-16 h-16 opacity-20" style={{ color: t.iconColor }} />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 flex flex-col gap-1.5 bg-[#111]/90 backdrop-blur-xl border-t border-white/10 shrink-0">
            <p className="font-extrabold text-white text-sm leading-snug truncate">{carta.name}</p>
            <div className="flex items-center justify-between gap-1">
              <span
                className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md font-black text-white shrink-0"
                style={{ background: t.badge, border: `1px solid ${t.badgeBorder}`, boxShadow: `0 0 8px ${t.glow}` }}
              >
                <TypeIcon className="w-2.5 h-2.5" style={{ color: t.iconColor }} />
                {carta.type}
              </span>
              <div className="flex flex-col items-end leading-none">
                {carta.hp && (
                  <span className="text-[11px] font-black text-white font-mono">HP {carta.hp}</span>
                )}
                {carta.rarity && (
                  <span className="text-[8px] uppercase tracking-widest text-gray-500 mt-0.5 truncate max-w-[70px]">{carta.rarity}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Pokédex Page ── */
export default function Pokedex() {
  const [coleccion, setColeccion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchColeccion() {
      try {
        const res = await api.get('/usuarios/coleccion');
        setColeccion(res.data.coleccion || []);
      } catch (err) {
        console.error('Error al obtener colección:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchColeccion();
  }, []);

  // Filter logic
  const filteredCards = coleccion.filter(carta => {
    const matchName = !searchQuery || carta.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !filterType || carta.type === filterType;
    return matchName && matchType;
  });

  // Get unique types from collection
  const availableTypes = [...new Set(coleccion.map(c => c.type))].sort();

  // Type counts
  const typeCounts = {};
  coleccion.forEach(c => {
    typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="font-mono tracking-[0.4em] uppercase text-primary animate-pulse text-sm">
            CARGANDO_POKÉDEX
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] blur-[140px] mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.25) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] blur-[140px] mix-blend-color-dodge"
          style={{ background: 'radial-gradient(circle, rgba(255,235,59,0.15) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-8 pb-20">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b-2 border-white/[8%] pb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#7C4DFF] to-primary flex items-center justify-center shrink-0 shadow-[4px_4px_0_rgba(124,77,255,0.5)] border border-white/20">
              <BookOpen className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
                Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#F57C00]">Pokédex</span>
              </h1>
              <p className="text-gray-400 text-sm font-mono tracking-wide mt-1 uppercase">
                {coleccion.length} carta{coleccion.length !== 1 ? 's' : ''} capturada{coleccion.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Search + Filter Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none group-focus-within:text-primary transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en colección..."
                className="w-56 lg:w-72 text-sm text-white placeholder-gray-500 outline-none transition-all bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-primary/5 focus:ring-4 focus:ring-primary/10 rounded-md"
                style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`p-2.5 border transition-all rounded-md ${showFilters ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* Filter Chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden mb-8"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-white/[3%] border border-white/10 rounded-md">
                <button
                  onClick={() => setFilterType('')}
                  className={`text-xs uppercase tracking-widest font-black px-3 py-1.5 rounded-md border transition-all ${!filterType ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                >
                  Todas ({coleccion.length})
                </button>
                {availableTypes.map(type => {
                  const t = TYPE[type] || DEFAULT_TYPE;
                  return (
                    <button
                      key={type}
                      onClick={() => setFilterType(type === filterType ? '' : type)}
                      className={`text-xs uppercase tracking-widest font-black px-3 py-1.5 rounded-md border transition-all ${filterType === type ? 'text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                      style={filterType === type ? { background: `${t.badge}`, borderColor: t.border } : {}}
                    >
                      {type} ({typeCounts[type] || 0})
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {coleccion.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-32 h-32 border-2 border-dashed border-white/20 flex items-center justify-center mb-8">
              <BookOpen className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Pokédex Vacía</h2>
            <p className="text-gray-400 font-mono text-sm max-w-md">
              Todavía no tenés cartas en tu colección. ¡Comprá en el catálogo o probá suerte en Raspa y Gana!
            </p>
          </motion.div>
        ) : filteredCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Search className="w-10 h-10 text-gray-600 mb-4" />
            <p className="text-gray-400 font-mono text-sm">
              No se encontraron cartas para "{searchQuery}" {filterType && `(tipo: ${filterType})`}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFilterType(''); }}
              className="mt-4 text-primary text-sm font-bold uppercase tracking-widest hover:underline"
            >
              Limpiar filtros
            </button>
          </motion.div>
        ) : (
          /* Card Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredCards.map((carta, i) => (
              <PokedexCard key={carta._id} carta={carta} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
