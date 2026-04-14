import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Flame,
  Droplets,
  Leaf,
  Zap,
  Brain,
  HandMetal,
  Moon,
  Cog,
  Rabbit,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Heart,
  LibraryBig,
} from 'lucide-react';

import api from '../services/api';
import CartaCard from '../components/CartaCard';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

/* ──────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────── */

const TYPES = [
  { value: '', label: 'Todos', Icon: Sparkles, color: '#FFEB3B' },
  { value: 'Fire', label: 'Fire', Icon: Flame, color: '#E53935' },
  { value: 'Water', label: 'Water', Icon: Droplets, color: '#1E88E5' },
  { value: 'Grass', label: 'Grass', Icon: Leaf, color: '#43A047' },
  { value: 'Lightning', label: 'Lightning', Icon: Zap, color: '#FFEB3B' },
  { value: 'Psychic', label: 'Psychic', Icon: Brain, color: '#E91E63' },
  { value: 'Fighting', label: 'Fighting', Icon: HandMetal, color: '#F57C00' },
  { value: 'Darkness', label: 'Darkness', Icon: Moon, color: '#607D8B' },
  { value: 'Metal', label: 'Metal', Icon: Cog, color: '#90A4AE' },
  { value: 'Dragon', label: 'Dragon', Icon: Rabbit, color: '#7C4DFF' },
  { value: 'Colorless', label: 'Colorless', Icon: Star, color: '#9E9E9E' },
];

const RARITIES = [
  { value: '', label: 'Cualquiera' },
  { value: '◊', label: 'Común (◊)' },
  { value: '◊◊', label: 'Poco Común (◊◊)' },
  { value: '◊◊◊', label: 'Rara (◊◊◊)' },
  { value: '◊◊◊◊', label: 'Súper Rara (◊◊◊◊)' },
  { value: '☆', label: 'Rare Holo (☆)' },
  { value: '☆☆', label: 'Double Rare (☆☆)' },
  { value: '☆☆☆', label: 'Triple Rare (☆☆☆)' },
  { value: 'Crown Rare', label: 'Crown Rare' },
];

const HP_OPTIONS = [
  { label: 'Cualquiera', value: '' },
  { label: '≥ 60', value: '60' },
  { label: '≥ 100', value: '100' },
  { label: '≥ 150', value: '150' },
  { label: '≥ 200', value: '200' },
];

const LIMIT = 20;

const spring = { type: 'spring', stiffness: 320, damping: 26 };
const springFast = { type: 'spring', stiffness: 500, damping: 30 };

/* ──────────────────────────────────────────────────────────
   MAIN
────────────────────────────────────────────────────────── */

export default function Cartas() {
  const [searchParams] = useSearchParams();
  const { refreshCart } = useCart();
  const { wishlist } = useWishlist();

  const [cartas, setCartas] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filters, setFilters] = useState({
    type: '',
    rarity: '',
    hp_min: '',
    page: 1,
    q: searchParams.get('q') || '',
    favoritos: searchParams.get('favoritos') === 'true',
    collected: '', // '' | 'true' | 'false'
  });

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const favoritos = searchParams.get('favoritos') === 'true';

    setFilters((f) => ({
      ...f,
      q,
      type,
      favoritos,
      page: 1,
    }));
  }, [searchParams]);

  const favIds = useMemo(() => {
    return filters.favoritos ? (wishlist || []).join(',') : null;
  }, [filters.favoritos, wishlist]);

  const fetchCartas = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        limit: LIMIT,
        page: filters.page,
      };

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
  }, [
    filters.page,
    filters.q,
    filters.type,
    filters.rarity,
    filters.hp_min,
    filters.collected,
    filters.favoritos,
    favIds,
  ]);

  useEffect(() => {
    fetchCartas();
  }, [fetchCartas]);

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  }

  function clearFilters() {
    setFilters({
      type: '',
      rarity: '',
      hp_min: '',
      page: 1,
      q: '',
      favoritos: false,
      collected: '',
    });
  }

  const hasFilters =
    filters.type ||
    filters.hp_min ||
    filters.rarity ||
    filters.q ||
    filters.favoritos ||
    filters.collected;

  const activeType = TYPES.find((t) => t.value === filters.type) || TYPES[0];
  const ActiveIcon = activeType.Icon;
  const accentColor = activeType.color;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.rarity) count++;
    if (filters.hp_min) count++;
    if (filters.q) count++;
    if (filters.favoritos) count++;
    if (filters.collected) count++;
    return count;
  }, [filters]);

  const displayedCartas = useMemo(() => {
    return filters.favoritos
      ? cartas.filter((c) => (wishlist || []).includes(c._id))
      : cartas;
  }, [cartas, filters.favoritos, wishlist]);

  return (
    <div className="min-h-screen bg-bg-base text-white relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.45, 0.7, 0.45],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full blur-[160px]"
          style={{
            top: '-18vh',
            left: '-8vw',
            width: '70vw',
            height: '70vh',
            background: `radial-gradient(circle, ${accentColor}22 0%, transparent 68%)`,
          }}
        />

        <motion.div
          animate={{
            opacity: [0.18, 0.35, 0.18],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute rounded-full blur-[140px]"
          style={{
            top: '10vh',
            right: '0vw',
            width: '54vw',
            height: '54vh',
            background: `radial-gradient(circle, ${accentColor}14 0%, transparent 72%)`,
          }}
        />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.025] mix-blend-overlay" />
      </div>

      <div
        className="relative z-10 w-full mx-auto flex flex-col"
        style={{
          maxWidth: '1680px',
          paddingLeft: '32px',
          paddingRight: '32px',
          paddingTop: '36px',
          paddingBottom: '96px',
        }}
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full border-b border-white/[6%]"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            paddingBottom: '24px',
            marginBottom: '26px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ maxWidth: '920px' }}>
              <h1
                className="font-black tracking-tight text-white"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  fontSize: 'clamp(34px, 4.6vw, 72px)',
                  lineHeight: '0.95',
                  margin: 0,
                }}
              >
                <LibraryBig
                  style={{
                    width: 'clamp(32px, 3.2vw, 52px)',
                    height: 'clamp(32px, 3.2vw, 52px)',
                    color: accentColor,
                    filter: `drop-shadow(0 0 10px ${accentColor})`,
                    flexShrink: 0,
                  }}
                />

                <span>
                  Archivo de{' '}
                  <span
                    style={{
                      color: accentColor,
                      textShadow: `0 0 18px ${accentColor}40`,
                    }}
                  >
                    Cartas
                  </span>
                </span>
              </h1>

              <p
                className="text-gray-400"
                style={{
                  marginTop: '14px',
                  marginBottom: 0,
                  maxWidth: '760px',
                  fontSize: '18px',
                  lineHeight: '1.55',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                Navega a través de miles de cartas coleccionables y usa filtros visuales
                más claros para encontrar rápidamente lo que estás buscando.
              </p>
            </div>

            {pagination?.total != null && (
              <div
                className="glass-panel border border-white/10"
                style={{
                  minWidth: '180px',
                  padding: '14px 18px',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  boxShadow: `0 10px 30px ${accentColor}12`,
                }}
              >
                <span
                  className="text-gray-500 uppercase font-black"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.28em',
                    marginBottom: '4px',
                  }}
                >
                  Total encontrado
                </span>

                <span
                  className="text-white font-black tabular-nums"
                  style={{
                    fontSize: '42px',
                    lineHeight: '1',
                    letterSpacing: '-0.04em',
                    textShadow: `0 0 18px ${accentColor}35`,
                  }}
                >
                  {(pagination?.total || 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </motion.header>

        {/* Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: sidebarOpen ? '300px minmax(0, 1fr)' : '0px minmax(0, 1fr)',
            gap: '28px',
            alignItems: 'start',
          }}
        >
          {/* Sidebar */}
          <aside
            className="hidden md:block"
            style={{
              width: sidebarOpen ? '300px' : '0px',
              overflow: 'hidden',
              transition: 'width 0.28s ease',
            }}
          >
            <div
              className="sticky glass-panel"
              style={{
                top: '96px',
                borderRadius: '24px',
                padding: '18px',
                border: `1px solid ${accentColor}20`,
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))',
                boxShadow:
                  '0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div>
                  <p
                    className="text-white font-black uppercase"
                    style={{
                      fontSize: '12px',
                      letterSpacing: '0.22em',
                      margin: 0,
                    }}
                  >
                    Filtros
                  </p>

                  <p
                    className="text-gray-500"
                    style={{
                      fontSize: '12px',
                      marginTop: '6px',
                      marginBottom: 0,
                    }}
                  >
                    Refina la colección visualmente
                  </p>
                </div>

                {activeFilterCount > 0 && (
                  <div
                    style={{
                      minWidth: '28px',
                      height: '28px',
                      borderRadius: '999px',
                      padding: '0 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: accentColor,
                      color: '#000',
                      fontSize: '12px',
                      fontWeight: 900,
                      boxShadow: `0 0 14px ${accentColor}50`,
                    }}
                  >
                    {activeFilterCount}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <SidebarSection label="Elemento" icon={<Sparkles className="w-4 h-4" />}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '12px',
                    }}
                  >
                    {TYPES.map(({ value, label, Icon, color }) => {
                      const active = filters.type === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setFilter('type', value)}
                          type="button"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '11px 12px',
                            borderRadius: '14px',
                            background: active ? `${color}18` : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${
                              active ? `${color}45` : 'rgba(255,255,255,0.05)'
                            }`,
                            color: active ? '#fff' : '#a3acc2',
                            transition: 'all 0.22s ease',
                            boxShadow: active ? `0 0 18px ${color}15` : 'none',
                            textAlign: 'left',
                          }}
                        >
                          <div
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: active ? color : 'rgba(255,255,255,0.04)',
                              flexShrink: 0,
                            }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: active ? '#000' : color }}
                            />
                          </div>

                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: 700,
                              flex: 1,
                              textAlign: 'left',
                            }}
                          >
                            {label}
                          </span>

                          {active && (
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '999px',
                                background: color,
                                boxShadow: `0 0 10px ${color}`,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </SidebarSection>

                <Divider />

                <SidebarSection label="Rareza" icon={<Star className="w-4 h-4" />}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '12px',
                    }}
                  >
                    {RARITIES.map(({ label, value }) => {
                      const active = filters.rarity === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setFilter('rarity', value)}
                          type="button"
                          style={{
                            padding: '9px 12px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 800,
                            background: active
                              ? 'rgba(124,77,255,0.22)'
                              : 'rgba(255,255,255,0.04)',
                            color: active ? '#fff' : '#9ca3af',
                            border: `1px solid ${
                              active ? 'rgba(124,77,255,0.55)' : 'rgba(255,255,255,0.06)'
                            }`,
                            boxShadow: active
                              ? '0 0 16px rgba(124,77,255,0.22)'
                              : 'none',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </SidebarSection>

                <Divider />

                <SidebarSection label="Puntos de salud" icon={<Heart className="w-4 h-4" />}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '12px',
                    }}
                  >
                    {HP_OPTIONS.map(({ label, value }) => {
                      const active = filters.hp_min === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setFilter('hp_min', value)}
                          type="button"
                          style={{
                            padding: '9px 12px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 800,
                            background: active
                              ? 'rgba(255,235,59,0.18)'
                              : 'rgba(255,255,255,0.04)',
                            color: active ? '#fff' : '#9ca3af',
                            border: `1px solid ${
                              active ? 'rgba(255,235,59,0.5)' : 'rgba(255,255,255,0.06)'
                            }`,
                            boxShadow: active
                              ? '0 0 16px rgba(255,235,59,0.18)'
                              : 'none',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </SidebarSection>

                <Divider />

                <SidebarSection label="Colección" icon={<LibraryBig className="w-4 h-4" />}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '12px',
                    }}
                  >
                    {[
                      { label: 'Todas', value: '' },
                      { label: 'Mis Cartas', value: 'true' },
                      { label: 'Faltantes', value: 'false' },
                    ].map((opt) => {
                      const active = filters.collected === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setFilter('collected', opt.value)}
                          type="button"
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '11px 12px',
                            borderRadius: '14px',
                            fontSize: '13px',
                            fontWeight: 800,
                            background: active
                              ? 'rgba(79,70,229,0.20)'
                              : 'rgba(255,255,255,0.03)',
                            color: active ? '#fff' : '#a3acc2',
                            border: `1px solid ${
                              active ? 'rgba(79,70,229,0.45)' : 'rgba(255,255,255,0.05)'
                            }`,
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </SidebarSection>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    type="button"
                    style={{
                      marginTop: '4px',
                      width: '100%',
                      height: '44px',
                      borderRadius: '14px',
                      border: '1px solid rgba(239,68,68,0.35)',
                      background: 'rgba(239,68,68,0.08)',
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: 900,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Resetear filtros
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex flex-col">
            {/* Toolbar */}
            <div
              style={{
                minHeight: '54px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '22px',
              }}
            >
              <motion.button
                onClick={() => setSidebarOpen((o) => !o)}
                className="hidden md:flex items-center justify-center"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: sidebarOpen ? `${accentColor}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${
                    sidebarOpen ? `${accentColor}40` : 'rgba(255,255,255,0.08)'
                  }`,
                  color: sidebarOpen ? accentColor : '#9ca3af',
                  boxShadow: sidebarOpen ? `0 0 16px ${accentColor}18` : 'none',
                }}
                title="Alternar panel lateral"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={spring}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </motion.button>

              <AnimatePresence mode="popLayout">
                {filters.type && (
                  <NeonChip
                    key="type-chip"
                    color={activeType.color}
                    icon={<ActiveIcon className="w-3.5 h-3.5" />}
                    label={activeType.label}
                    onRemove={() => setFilter('type', '')}
                  />
                )}

                {filters.rarity && (
                  <NeonChip
                    key="rarity-chip"
                    color="#7C4DFF"
                    icon={<Star className="w-3.5 h-3.5" />}
                    label={filters.rarity}
                    onRemove={() => setFilter('rarity', '')}
                  />
                )}

                {filters.hp_min && (
                  <NeonChip
                    key="hp-chip"
                    color="#E53935"
                    icon={<Heart className="w-3.5 h-3.5" />}
                    label={`≥ ${filters.hp_min} HP`}
                    onRemove={() => setFilter('hp_min', '')}
                  />
                )}

                {filters.q && (
                  <NeonChip
                    key="q-chip"
                    color="#FFEB3B"
                    icon={<Search className="w-3.5 h-3.5" />}
                    label={`"${filters.q}"`}
                    onRemove={() => setFilter('q', '')}
                  />
                )}

                {filters.favoritos && (
                  <NeonChip
                    key="fav-chip"
                    color="#E53935"
                    icon={<Heart className="w-3.5 h-3.5" />}
                    label="Favoritos"
                    onRemove={() => setFilter('favoritos', false)}
                  />
                )}

                {filters.collected && (
                  <NeonChip
                    key="collected-chip"
                    color="#4F46E5"
                    icon={<LibraryBig className="w-3.5 h-3.5" />}
                    label={filters.collected === 'true' ? 'Mis Cartas' : 'Faltantes'}
                    onRemove={() => setFilter('collected', '')}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Grid */}
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    style={{ gap: '24px' }}
                  >
                    {Array.from({ length: LIMIT }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.03, ...spring }}
                        className="rounded-[20px] aspect-[1/1.4] relative overflow-hidden bg-bg-surface border border-white/6"
                        style={{
                          boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
                        }}
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
                    className="flex flex-col items-center justify-center gap-8 h-full"
                    style={{ paddingTop: '120px', paddingBottom: '120px' }}
                  >
                    <div className="relative">
                      <div
                        className="absolute inset-[-60px] rounded-full pointer-events-none"
                        style={{
                          background: `radial-gradient(circle, ${accentColor}30 0%, transparent 60%)`,
                        }}
                      />

                      <motion.div
                        animate={{ y: [0, -15, 0], rotateX: [0, 10, 0], rotateY: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                        className="relative z-10"
                        style={{ perspective: '1000px' }}
                      >
                        <div
                          className="rounded-2xl flex items-center justify-center backdrop-blur-xl"
                          style={{
                            width: '120px',
                            height: '120px',
                            background: `linear-gradient(135deg, ${accentColor}15, rgba(255,255,255,0.05))`,
                            border: `1px solid ${accentColor}40`,
                            boxShadow: `0 30px 60px rgba(0,0,0,0.6), inset 0 0 20px ${accentColor}20`,
                          }}
                        >
                          <Search
                            className="w-12 h-12"
                            style={{
                              color: accentColor,
                              filter: `drop-shadow(0 0 10px ${accentColor}80)`,
                            }}
                          />
                        </div>
                      </motion.div>
                    </div>

                    <div className="text-center space-y-3 relative z-10">
                      <p
                        className="font-black text-3xl text-white tracking-tight"
                        style={{ textShadow: `0 4px 20px ${accentColor}50` }}
                      >
                        Vacío Interestelar
                      </p>

                      <p className="text-lg text-gray-400 max-w-sm mx-auto font-medium">
                        Tu radar no ha detectado ninguna carta con esta firma de energía.
                      </p>
                    </div>

                    <motion.button
                      onClick={clearFilters}
                      className="mt-4 rounded-full text-sm font-black flex items-center gap-3 uppercase tracking-[0.2em] relative z-10 border"
                      style={{
                        padding: '14px 26px',
                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                        borderColor: `${accentColor}ff`,
                        color: '#000',
                        boxShadow: `0 10px 30px ${accentColor}40`,
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: `0 15px 40px ${accentColor}70`,
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={spring}
                    >
                      <X className="w-5 h-5" />
                      Purgar filtros
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`cards-${filters.page}-${filters.type}-${filters.rarity}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    style={{ gap: '24px' }}
                  >
                    {displayedCartas.map((carta, i) => (
                      <motion.div
                        key={carta._id}
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: i * 0.035,
                          type: 'spring',
                          stiffness: 200,
                          damping: 20,
                        }}
                      >
                        <CartaCard carta={carta} onAddedToCart={refreshCart} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {!loading && pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex justify-center relative z-20"
                style={{ marginTop: '42px' }}
              >
                <div
                  className="glass-panel inline-flex items-center border border-white/10"
                  style={{
                    padding: '8px 10px',
                    borderRadius: '999px',
                    gap: '6px',
                    boxShadow: `0 16px 40px rgba(0,0,0,0.45), 0 0 18px ${accentColor}10`,
                  }}
                >
                  <motion.button
                    disabled={filters.page <= 1}
                    onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                    className="flex items-center justify-center rounded-full disabled:opacity-20 transition-colors"
                    style={{ width: '42px', height: '42px' }}
                    whileHover={filters.page > 1 ? { scale: 1.05, background: 'rgba(255,255,255,0.08)' } : {}}
                    whileTap={filters.page > 1 ? { scale: 0.95 } : {}}
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </motion.button>

                  <div className="flex items-center gap-1 px-1">
                    {buildPageRange(filters.page, pagination.pages).map((item, i) =>
                      item === '…' ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="text-center text-sm font-bold text-gray-500"
                          style={{ width: '34px' }}
                        >
                          ⋯
                        </span>
                      ) : (
                        <motion.button
                          key={item}
                          onClick={() => setFilters((f) => ({ ...f, page: item }))}
                          className={`rounded-full text-[15px] font-black tracking-tighter transition-all duration-300 ${
                            filters.page === item
                              ? 'text-black'
                              : 'text-gray-400 hover:text-white hover:bg-white/8'
                          }`}
                          style={{
                            width: '42px',
                            height: '42px',
                            ...(filters.page === item
                              ? {
                                  background: accentColor,
                                  boxShadow: `0 0 18px ${accentColor}55, inset 0 0 8px rgba(255,255,255,0.8)`,
                                }
                              : {}),
                          }}
                          whileHover={filters.page !== item ? { scale: 1.08 } : {}}
                          whileTap={{ scale: 0.92 }}
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
                    className="flex items-center justify-center rounded-full disabled:opacity-20 transition-colors"
                    style={{ width: '42px', height: '42px' }}
                    whileHover={
                      filters.page < pagination.pages
                        ? { scale: 1.05, background: 'rgba(255,255,255,0.08)' }
                        : {}
                    }
                    whileTap={filters.page < pagination.pages ? { scale: 0.95 } : {}}
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
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

/* ──────────────────────────────────────────────────────────
   SUBCOMPONENTS
────────────────────────────────────────────────────────── */

function SidebarSection({ label, icon, children }) {
  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '2px',
        }}
      >
        <span
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
            color: '#8b94a9',
            flexShrink: 0,
          }}
        >
          {icon}
        </span>

        <p
          style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: '#8b94a9',
          }}
        >
          {label}
        </p>
      </div>

      {children}
    </section>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />;
}

function NeonChip({ color, icon, label, onRemove }) {
  return (
    <motion.span
      layout
      initial={{ scale: 0, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="flex items-center gap-2 rounded-full cursor-default select-none backdrop-blur-md"
      style={{
        padding: '10px 14px',
        background: `${color}15`,
        color: '#fff',
        border: `1px solid ${color}40`,
        boxShadow: `0 4px 15px ${color}20, inset 0 0 10px ${color}12`,
      }}
    >
      <span style={{ color, filter: `drop-shadow(0 0 5px ${color})` }}>{icon}</span>

      <span
        className="truncate"
        style={{
          maxWidth: '130px',
          fontSize: '12px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>

      <button
        onClick={onRemove}
        type="button"
        className="rounded-full transition-all text-white/50 hover:text-white hover:bg-white/15"
        style={{
          marginLeft: '2px',
          padding: '4px',
        }}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.span>
  );
}

function buildPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, 2, current - 1, current, current + 1, total - 1, total]);
  const arr = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (i > 0 && arr[i] - arr[i - 1] > 1) result.push('…');
    result.push(arr[i]);
  }

  return result;
}