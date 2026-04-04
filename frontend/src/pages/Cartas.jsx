import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, Flame, Droplets, Leaf, Zap,
  Brain, HandMetal, Moon, Cog, Rabbit, Star,
  X, ChevronLeft, ChevronRight, SlidersHorizontal, Heart, LibraryBig
} from 'lucide-react';
import api from '../services/api';
import CartaCard from '../components/CartaCard';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

/* ─── Data ──────────────────────────────────────────────── */

const TYPES = [
  { value: '',          label: 'Todos',     Icon: Sparkles,  color: '#FFEB3B' },
  { value: 'Fire',      label: 'Fire',      Icon: Flame,     color: '#E53935' },
  { value: 'Water',     label: 'Water',     Icon: Droplets,  color: '#1E88E5' },
  { value: 'Grass',     label: 'Grass',     Icon: Leaf,      color: '#43A047' },
  { value: 'Lightning', label: 'Lightning', Icon: Zap,       color: '#FFEB3B' },
  { value: 'Psychic',   label: 'Psychic',   Icon: Brain,     color: '#E91E63' },
  { value: 'Fighting',  label: 'Fighting',  Icon: HandMetal, color: '#F57C00' },
  { value: 'Darkness',  label: 'Darkness',  Icon: Moon,      color: '#607D8B' },
  { value: 'Metal',     label: 'Metal',     Icon: Cog,       color: '#90A4AE' },
  { value: 'Dragon',    label: 'Dragon',    Icon: Rabbit,    color: '#7C4DFF' },
  { value: 'Colorless', label: 'Colorless', Icon: Star,      color: '#9E9E9E' },
];

const RARITIES = [
  { value: '',              label: 'Cualquiera' },
  { value: '◊',             label: 'Común (◊)' },
  { value: '◊◊',            label: 'Poco Común (◊◊)' },
  { value: '◊◊◊',           label: 'Rara (◊◊◊)' },
  { value: '◊◊◊◊',          label: 'Súper Rara (◊◊◊◊)' },
  { value: '☆',             label: 'Rare Holo (☆)' },
  { value: '☆☆',            label: 'Double Rare (☆☆)' },
  { value: '☆☆☆',           label: 'Triple Rare (☆☆☆)' },
  { value: 'Crown Rare',    label: 'Crown Rare' },
];

const HP_OPTIONS = [
  { label: 'Cualquiera', value: '' },
  { label: '≥ 60',       value: '60' },
  { label: '≥ 100',      value: '100' },
  { label: '≥ 150',      value: '150' },
  { label: '≥ 200',      value: '200' },
];

const LIMIT = 20;

const spring = { type: 'spring', stiffness: 320, damping: 26 };
const springFast = { type: 'spring', stiffness: 500, damping: 30 };

/* ─── Main Component ────────────────────────────────────── */

export default function Cartas() {
  const [searchParams] = useSearchParams();
  const { refreshCart } = useCart();
  const { wishlist } = useWishlist();
  const [cartas, setCartas] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    type: '', rarity: '', hp_min: '', page: 1,
    q: searchParams.get('q') || '',
    favoritos: searchParams.get('favoritos') === 'true',
    collected: '', // '' | 'true' | 'false'
  });

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const favoritos = searchParams.get('favoritos') === 'true';
    setFilters((f) => ({ ...f, q, type, favoritos, page: 1 }));
  }, [searchParams]);

  const favIds = useMemo(() => {
    return filters.favoritos ? (wishlist || []).join(',') : null;
  }, [filters.favoritos, wishlist]);

  const fetchCartas = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, page: filters.page };
      if (filters.type) params.type = filters.type;
      if (filters.rarity) params.rarity = filters.rarity;
      if (filters.hp_min) params.hp_min = filters.hp_min;
      if (filters.q) params.name = filters.q;
      if (filters.collected) params.collected = filters.collected;
      
      if (filters.favoritos) {
        if (!favIds) {
          setCartas([]);
          setPagination({ total: 0, page: 1, limit: LIMIT, pages: 0 });
          setLoading(false);
          return;
        }
        params.ids = favIds;
      }

      const { data } = await api.get('/cartas', { params });
      setCartas(data?.cartas || []);
      setPagination(data?.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.q, filters.type, filters.rarity, filters.hp_min, filters.collected, filters.favoritos, favIds]);

  useEffect(() => { fetchCartas(); }, [fetchCartas]);

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  }

  function clearFilters() {
    setFilters({ type: '', rarity: '', hp_min: '', page: 1, q: '', favoritos: false, collected: '' });
  }

  const hasFilters = filters.type || filters.hp_min || filters.rarity || filters.q || filters.favoritos || filters.collected;
  const activeType = TYPES.find((t) => t.value === filters.type) || TYPES[0];
  const ActiveIcon = activeType.Icon;

  /* Accent color tracking the selected layout */
  const accentColor = activeType.color;

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filters.type) c++;
    if (filters.rarity) c++;
    if (filters.hp_min) c++;
    if (filters.q) c++;
    if (filters.favoritos) c++;
    if (filters.collected) c++;
    return c;
  }, [filters]);

  const displayedCartas = useMemo(() => {
    return filters.favoritos
      ? cartas.filter((c) => (wishlist || []).includes(c._id))
      : cartas;
  }, [cartas, filters.favoritos, wishlist]);

  return (
    <div className="min-h-screen bg-bg-base text-white relative overflow-hidden">
      
      {/* ═══════════════════════════════════════════
          GIANT AMBIENT LIGHT LAYER (WOW Effect)
      ═══════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-start justify-center">
        <motion.div
          animate={{
            backgroundColor: `${accentColor}10`, // Very subtle tint
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[30vh] -left-[10vw] w-[80vw] h-[80vh] rounded-full blur-[160px] mix-blend-screen"
          style={{ background: `radial-gradient(circle, ${accentColor}40 0%, transparent 65%)` }}
        />
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[20vh] right-[5vw] w-[60vw] h-[60vh] rounded-full blur-[140px] mix-blend-color-dodge"
          style={{ background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)` }}
        />
        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 pt-16 pb-24 flex flex-col gap-0 max-w-[2000px] mx-auto">

        {/* ═══════════════════════════════════════════
            HERO HEADER
        ═══════════════════════════════════════════ */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/[6%] pb-8"
        >
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight flex items-center gap-4 text-white drop-shadow-2xl">
              <LibraryBig className="w-10 h-10 md:w-14 md:h-14" style={{ color: accentColor, filter: `drop-shadow(0 0 15px ${accentColor})` }} />
              Archivo de <span style={{ color: accentColor, textShadow: `0 0 30px ${accentColor}60` }}>Cartas</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl font-medium tracking-wide">
              Navega a través de miles de cartas coleccionables. Utiliza el poder de los elementos para filtrar la galería holográfica.
            </p>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            {pagination?.total != null && (
              <div className="glass-panel px-6 py-3 rounded-lg flex flex-col items-end border border-white/10" style={{ boxShadow: `0 10px 30px ${accentColor}15` }}>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-500 mb-1">Total Encontrado</span>
                <span className="text-2xl font-black text-white tabular-nums tracking-tighter" style={{ textShadow: `0 0 20px ${accentColor}80` }}>
                  {(pagination?.total || 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </motion.header>

        <div className="flex gap-8">
          {/* ═══════════════════════════════════════════
              HOLOGRAPHIC SIDEBAR
          ═══════════════════════════════════════════ */}
          <aside className="catalog-sidebar hidden md:block" data-open={sidebarOpen}>
            <div
              className="w-[280px] sticky top-24 rounded-[32px] p-6 glass-panel"
              style={{
                borderColor: `${accentColor}30`,
                boxShadow: `0 0 40px ${accentColor}08, inset 0 0 20px ${accentColor}05, 0 25px 50px rgba(0,0,0,0.6)`,
                transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
              }}
            >
              <SidebarSection label="Elemento" icon={<Sparkles className="w-4 h-4" />}>
                <div className="flex flex-col gap-1.5 mt-4">
                  {TYPES.map(({ value, label, Icon, color }) => {
                    const active = filters.type === value;
                    return (
                      <motion.button
                        key={value}
                        onClick={() => setFilter('type', value)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-bold text-left relative overflow-hidden group transition-all"
                        style={{
                          background: active ? `${color}25` : 'transparent',
                          color: active ? '#fff' : '#8892b0',
                          border: `1px solid ${active ? color + '50' : 'transparent'}`,
                          boxShadow: active ? `0 0 20px ${color}20` : 'none',
                        }}
                        whileHover={{ x: 6, background: active ? `${color}35` : 'rgba(255,255,255,0.03)' }}
                        whileTap={{ scale: 0.96 }}
                        transition={spring}
                      >
                        <div 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${active ? '' : 'bg-black/30 group-hover:bg-black/50'}`}
                          style={{ background: active ? color : undefined }}
                        >
                          <Icon className="w-4 h-4" style={{ color: active ? '#000' : color }} />
                        </div>
                        <span className="relative z-10 truncate">{label}</span>
                        {active && (
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={springFast}
                            className="ml-auto w-2 h-2 rounded-full relative z-10 shrink-0"
                            style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </SidebarSection>

              <div className="sidebar-divider my-6" />

              <SidebarSection label="Rareza" icon={<Star className="w-4 h-4" />}>
                <div className="flex flex-wrap gap-2 mt-4">
                  {RARITIES.map(({ label, value }) => {
                    const active = filters.rarity === value;
                    return (
                      <motion.button
                        key={value}
                        onClick={() => setFilter('rarity', value)}
                        className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-300"
                        style={{
                          background: active ? '#7C4DFF' : 'rgba(255,255,255,0.04)',
                          color: active ? '#fff' : '#9ca3af',
                          border: `1px solid ${active ? '#7C4DFF' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: active ? '0 0 20px rgba(124,77,255,0.4)' : 'none',
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={spring}
                      >
                        {label}
                      </motion.button>
                    );
                  })}
                </div>
              </SidebarSection>

              <div className="sidebar-divider my-6" />

              <SidebarSection label="Puntos de Salud" icon={<Heart className="w-4 h-4" />}>
                <div className="flex flex-wrap gap-2 mt-4">
                  {HP_OPTIONS.map(({ label, value }) => {
                    const active = filters.hp_min === value;
                    return (
                      <motion.button
                        key={value}
                        onClick={() => setFilter('hp_min', value)}
                        className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-300"
                        style={{
                          background: active ? '#FFEB3B' : 'rgba(255,255,255,0.04)',
                          color: active ? '#000' : '#9ca3af',
                          border: `1px solid ${active ? '#FFEB3B' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: active ? '0 0 20px rgba(255,235,59,0.4)' : 'none',
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={spring}
                      >
                        {label}
                      </motion.button>
                    );
                  })}
                </div>
              </SidebarSection>

              <div className="sidebar-divider my-6" />

               <SidebarSection label="Colección" icon={<LibraryBig className="w-4 h-4" />}>
                <div className="flex flex-col gap-2 mt-4">
                  {[
                    { label: 'Todas', value: '' },
                    { label: 'Mis Cartas', value: 'true' },
                    { label: 'Faltantes', value: 'false' },
                  ].map((opt) => {
                    const active = filters.collected === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        onClick={() => setFilter('collected', opt.value)}
                        className={`px-4 py-2.5 rounded-md text-xs font-bold transition-all text-left border ${
                          active ? 'bg-indigo-500/20 border-indigo-500/50 text-white' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {opt.label}
                      </motion.button>
                    );
                  })}
                </div>
              </SidebarSection>
              
              <AnimatePresence>
                {hasFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/5"
                  >
                    <motion.button
                      onClick={clearFilters}
                      className="w-full py-3.5 rounded-md text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors overflow-hidden"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
                      whileTap={{ scale: 0.97 }}
                      transition={spring}
                    >
                      <X className="w-4 h-4" />
                      Resetear Filtros
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* ═══════════════════════════════════════════
              MAIN CONTENT AREA
          ═══════════════════════════════════════════ */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* ── Active Filters Toolbar ── */}
            <div className="flex items-center gap-3 mb-8 h-12">
              <motion.button
                onClick={() => setSidebarOpen((o) => !o)}
                className="hidden md:flex items-center justify-center w-12 h-12 rounded-[14px] relative backdrop-blur-md"
                style={{
                  background: sidebarOpen ? `${accentColor}15` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${sidebarOpen ? accentColor + '50' : 'rgba(255,255,255,0.1)'}`,
                  color: sidebarOpen ? accentColor : '#9ca3af',
                  transition: 'all 0.3s ease',
                  boxShadow: sidebarOpen ? `0 0 20px ${accentColor}20` : 'none',
                }}
                title="Alternar Panel Lateral"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <AnimatePresence>
                  {activeFilterCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={springFast}
                      className="absolute -top-2 -right-2 min-w-[22px] h-[22px] rounded-full text-[11px] font-black flex items-center justify-center px-1 border-2 border-bg-base"
                      style={{ background: accentColor, color: '#000', boxShadow: `0 0 10px ${accentColor}` }}
                    >
                      {activeFilterCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <AnimatePresence mode="popLayout">
                {filters.type && (
                  <NeonChip key="type-chip" color={activeType.color} icon={<ActiveIcon className="w-3.5 h-3.5" />} label={activeType.label} onRemove={() => setFilter('type', '')} />
                )}
                {filters.rarity && (
                  <NeonChip key="rarity-chip" color="#7C4DFF" icon={<Star className="w-3.5 h-3.5" />} label={filters.rarity} onRemove={() => setFilter('rarity', '')} />
                )}
                {filters.hp_min && (
                  <NeonChip key="hp-chip" color="#E53935" icon={<Heart className="w-3.5 h-3.5" />} label={`≥ ${filters.hp_min} HP`} onRemove={() => setFilter('hp_min', '')} />
                )}
                {filters.q && (
                  <NeonChip key="q-chip" color="#FFEB3B" icon={<Search className="w-3.5 h-3.5" />} label={`"${filters.q}"`} onRemove={() => setFilter('q', '')} />
                )}
                {filters.favoritos && (
                  <NeonChip key="fav-chip" color="#E53935" icon={<Heart className="w-3.5 h-3.5" />} label="Favoritos" onRemove={() => setFilter('favoritos', false)} />
                )}
                {filters.collected && (
                  <NeonChip key="collected-chip" color="#4F46E5" icon={<LibraryBig className="w-3.5 h-3.5" />} label={filters.collected === 'true' ? 'Mis Cartas' : 'Faltantes'} onRemove={() => setFilter('collected', '')} />
                )}
              </AnimatePresence>
            </div>

            {/* ── Card Grid ── */}
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                  >
                    {Array.from({ length: LIMIT }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.03, ...spring }}
                        className="rounded-[20px] aspect-[1/1.4] relative overflow-hidden bg-bg-surface border-2 border-white/5"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[4%] to-transparent animate-shimmer" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-10 h-10 text-white/[3%]" />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                ) : displayedCartas.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex flex-col items-center justify-center py-40 gap-8 h-full"
                  >
                    <div className="relative">
                      <div className="absolute inset-[-60px] rounded-full energy-orb pointer-events-none mix-blend-screen"
                        style={{ background: `radial-gradient(circle, ${accentColor}30 0%, transparent 60%)` }}
                      />
                      <motion.div
                        animate={{ y: [0, -15, 0], rotateX: [0, 10, 0], rotateY: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                        className="relative z-10"
                        style={{ perspective: '1000px' }}
                      >
                        <div className="w-32 h-32 rounded-md flex items-center justify-center backdrop-blur-xl"
                          style={{
                            background: `linear-gradient(135deg, ${accentColor}15, rgba(255,255,255,0.05))`,
                            border: `1px solid ${accentColor}40`,
                            boxShadow: `0 30px 60px rgba(0,0,0,0.6), inset 0 0 20px ${accentColor}20`,
                          }}
                        >
                          <Search className="w-14 h-14" style={{ color: accentColor, filter: `drop-shadow(0 0 10px ${accentColor}80)` }} />
                        </div>
                      </motion.div>
                    </div>

                    <div className="text-center space-y-3 relative z-10">
                      <p className="font-black text-3xl text-white tracking-tight" style={{ textShadow: `0 4px 20px ${accentColor}50` }}>Vacío Interestelar</p>
                      <p className="text-lg text-gray-400 max-w-sm mx-auto font-medium">
                        Tu radar no ha detectado ninguna carta con esta firma de energía.
                      </p>
                    </div>

                    <motion.button
                      onClick={clearFilters}
                      className="px-8 py-4 mt-4 rounded-full text-sm font-black flex items-center gap-3 uppercase tracking-[0.2em] relative z-10 border"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                        borderColor: `${accentColor}ff`,
                        color: '#000',
                        boxShadow: `0 10px 30px ${accentColor}40`,
                      }}
                      whileHover={{ scale: 1.05, boxShadow: `0 15px 40px ${accentColor}70` }}
                      whileTap={{ scale: 0.95 }}
                      transition={spring}
                    >
                      <X className="w-5 h-5" />
                      Purgar Filtros
                    </motion.button>
                  </motion.div>

                ) : (
                  <motion.div
                    key={`cards-${filters.page}-${filters.type}-${filters.rarity}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                  >
                    {displayedCartas.map((carta, i) => (
                      <motion.div
                        key={carta._id}
                        initial={{ opacity: 0, y: 40, scale: 0.85, rotateY: 30 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                        transition={{ delay: i * 0.04, type: 'spring', stiffness: 200, damping: 20 }}
                      >
                        <CartaCard carta={carta} onAddedToCart={refreshCart} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Pagination ── */}
            {!loading && pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-16 mb-8 relative z-20"
              >
                <div className="glass-panel p-2 rounded-full inline-flex items-center gap-2 border border-white/10" style={{ boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${accentColor}10` }}>
                  <motion.button
                    disabled={filters.page <= 1}
                    onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                    className="flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-20 transition-colors"
                    whileHover={filters.page > 1 ? { scale: 1.05, background: 'rgba(255,255,255,0.1)' } : {}}
                    whileTap={filters.page > 1 ? { scale: 0.95 } : {}}
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </motion.button>

                  <div className="flex items-center gap-1.5 px-3">
                    {buildPageRange(filters.page, pagination.pages).map((item, i) =>
                      item === '…' ? (
                        <span key={`ellipsis-${i}`} className="w-8 text-center text-sm font-bold text-gray-500">⋯</span>
                      ) : (
                        <motion.button
                          key={item}
                          onClick={() => setFilters((f) => ({ ...f, page: item }))}
                          className={`w-11 h-11 rounded-full text-[15px] font-black tracking-tighter transition-all duration-300 ${
                            filters.page === item ? 'text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                          style={filters.page === item ? { background: accentColor, boxShadow: `0 0 20px ${accentColor}60, inset 0 0 10px white` } : {}}
                          whileHover={filters.page !== item ? { scale: 1.1 } : {}}
                          whileTap={{ scale: 0.9 }}
                          transition={springFast}
                        >
                          {item}
                        </motion.button>
                      )
                    )}
                  </div>

                  <motion.button
                    disabled={filters.page >= pagination.pages}
                    onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                    className="flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-20 transition-colors"
                    whileHover={filters.page < pagination.pages ? { scale: 1.05, background: 'rgba(255,255,255,0.1)' } : {}}
                    whileTap={filters.page < pagination.pages ? { scale: 0.95 } : {}}
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════ */

function SidebarSection({ label, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-gray-500 bg-white/5 p-1.5 rounded-md">{icon}</span>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

function NeonChip({ color, icon, label, onRemove }) {
  return (
    <motion.span
      layout
      initial={{ scale: 0, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="filter-chip-neon flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider cursor-default select-none shadow-lg backdrop-blur-md"
      style={{
        background: `${color}15`,
        color: '#fff',
        border: `1px solid ${color}40`,
        boxShadow: `0 4px 15px ${color}20, inset 0 0 10px ${color}15`,
      }}
    >
      <span style={{ color: color, filter: `drop-shadow(0 0 5px ${color})` }}>{icon}</span>
      <span className="truncate max-w-[120px] pt-0.5">{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 rounded-full p-1 transition-all text-white/50 hover:text-white hover:bg-white/20"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.span>
  );
}

function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, current - 1, current, current + 1, total - 1, total]);
  const arr = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (i > 0 && arr[i] - arr[i - 1] > 1) result.push('…');
    result.push(arr[i]);
  }
  return result;
}
