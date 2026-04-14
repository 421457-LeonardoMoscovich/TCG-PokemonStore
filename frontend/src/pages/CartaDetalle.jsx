import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const TYPE_STYLES = {
  Fire:      { border: 'var(--color-type-fire)',     glow: 'rgba(229,57,53,0.4)',   badge: '#7f1d1d', badgeBorder: '#ef4444', emoji: 'ðŸ”¥', gradient: 'from-red-900/30 to-transparent' },
  Water:     { border: 'var(--color-type-water)',    glow: 'rgba(30,136,229,0.4)',  badge: '#1e3a5f', badgeBorder: '#3b82f6', emoji: 'ðŸ’§', gradient: 'from-blue-900/30 to-transparent' },
  Grass:     { border: 'var(--color-type-grass)',    glow: 'rgba(67,160,71,0.4)',   badge: '#14532d', badgeBorder: '#22c55e', emoji: 'ðŸŒ¿', gradient: 'from-green-900/30 to-transparent' },
  Electric:  { border: 'var(--color-type-electric)', glow: 'rgba(255,235,59,0.4)',  badge: '#713f12', badgeBorder: '#eab308', emoji: 'âš¡', gradient: 'from-yellow-900/30 to-transparent' },
  Psychic:   { border: 'var(--color-type-psychic)',  glow: 'rgba(233,30,99,0.4)',   badge: '#4a1772', badgeBorder: '#a855f7', emoji: 'ðŸ”®', gradient: 'from-pink-900/30 to-transparent' },
  Fighting:  { border: 'var(--color-type-fighting)', glow: 'rgba(245,124,0,0.4)',   badge: '#7c2d12', badgeBorder: '#f97316', emoji: 'ðŸ¥Š', gradient: 'from-orange-900/30 to-transparent' },
  Darkness:  { border: 'var(--color-type-darkness)', glow: 'rgba(96,125,139,0.3)',  badge: '#1f2937', badgeBorder: '#6b7280', emoji: 'ðŸŒ‘', gradient: 'from-slate-900/30 to-transparent' },
  Metal:     { border: 'var(--color-type-metal)',    glow: 'rgba(144,164,174,0.3)', badge: '#1e293b', badgeBorder: '#94a3b8', emoji: 'âš™ï¸', gradient: 'from-zinc-900/30 to-transparent' },
  Dragon:    { border: 'var(--color-type-dragon)',   glow: 'rgba(124,77,255,0.4)',  badge: '#312e81', badgeBorder: '#6366f1', emoji: 'ðŸ‰', gradient: 'from-indigo-900/30 to-transparent' },
  Colorless: { border: 'var(--color-type-colorless)',glow: 'rgba(158,158,158,0.2)', badge: '#374151', badgeBorder: '#9ca3af', emoji: 'â­', gradient: 'from-gray-900/30 to-transparent' },
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
    if (!token) {
      navigate('/login');
      return;
    }

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

  if (loading) {
    return (
      <div
        className="w-full mx-auto"
        style={{
          maxWidth: '1500px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '32px',
          paddingBottom: '48px',
        }}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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
  }

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
        background: `radial-gradient(circle at 50% -20%, ${t.glow.replace('0.4', '0.15')}, #060814 78%)`,
        paddingBottom: '56px',
      }}
    >
      <div
        className="w-full mx-auto"
        style={{
          maxWidth: '1520px',
          paddingLeft: '28px',
          paddingRight: '28px',
          paddingTop: '22px',
        }}
      >
        <motion.button
          onClick={() => navigate(-1)}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors group"
          style={{
            marginBottom: '18px',
            paddingLeft: '2px',
          }}
        >
          <span className="group-hover:-translate-x-1 transition-transform">â†</span>
          Volver
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden bg-bg-elevated"
          style={{
            borderRadius: '18px',
            border: `1px solid ${t.border}33`,
            boxShadow: `0 0 60px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
            padding: '0',
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} pointer-events-none`} />

          <div
            className="relative flex flex-col lg:flex-row"
            style={{
              gap: '42px',
              paddingTop: '22px',
              paddingRight: '28px',
              paddingBottom: '28px',
              paddingLeft: '28px',
              alignItems: 'flex-start',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-full lg:w-80 shrink-0 perspective-1000"
              onMouseMove={handleMouseMove}
              style={{
                maxWidth: '360px',
                marginTop: '2px',
              }}
            >
              <motion.div
                className="relative overflow-hidden preserve-3d"
                style={{
                  borderRadius: '16px',
                  boxShadow: `0 25px 60px ${t.glow}, 0 0 0 1px ${t.border}22`,
                  rotateY: (mousePos.x - 0.5) * 12,
                  rotateX: (mousePos.y - 0.5) * -12,
                }}
              >
                {carta.image ? (
                  <img
                    src={carta.image}
                    alt={carta.name}
                    className="w-full aspect-[3/4] object-cover"
                    style={{
                      display: 'block',
                    }}
                  />
                ) : (
                  <div
                    className="w-full aspect-[3/4] flex items-center justify-center text-7xl bg-bg-surface opacity-30"
                    style={{ borderRadius: '16px' }}
                  >
                    {t.emoji}
                  </div>
                )}

                <motion.div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                  style={{
                    background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                  }}
                />

                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-20 mix-blend-color-dodge z-20"
                  style={{
                    background: `linear-gradient(${135 + mousePos.x * 45}deg, #ff0000, #00ff00, #0000ff, #ff00ff)`,
                    backgroundSize: '200% 200%',
                    backgroundPosition: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col flex-1"
              style={{
                minWidth: 0,
                gap: '18px',
                paddingTop: '2px',
              }}
            >
              <div
                className="flex items-start justify-between gap-4"
                style={{
                  marginBottom: '2px',
                }}
              >
                <motion.h1
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white tracking-tight"
                  style={{
                    fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
                    lineHeight: '1',
                    fontWeight: 900,
                    textShadow: `0 0 28px ${t.glow}`,
                    margin: 0,
                  }}
                >
                  {carta.name}
                </motion.h1>

                {carta.card_number && (
                  <span
                    className="shrink-0 font-mono bg-bg-surface"
                    style={{
                      color: t.border,
                      border: `1px solid ${t.border}33`,
                      borderRadius: '999px',
                      padding: '7px 12px',
                      fontSize: '12px',
                      lineHeight: 1,
                      marginTop: '4px',
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
                className="flex flex-wrap items-center"
                style={{
                  gap: '14px',
                  marginBottom: '2px',
                }}
              >
                <span
                  className="font-bold text-white flex items-center"
                  style={{
                    background: t.badge,
                    border: `1px solid ${t.badgeBorder}`,
                    boxShadow: `0 0 12px ${t.glow}`,
                    borderRadius: '999px',
                    padding: '10px 16px',
                    fontSize: '15px',
                    gap: '8px',
                    minHeight: '42px',
                  }}
                >
                  <span>{t.emoji}</span>
                  <span>{carta.type}</span>
                </span>

                {carta.hp && (
                  <div
                    className="flex flex-col"
                    style={{
                      gap: '6px',
                      minWidth: '170px',
                      paddingTop: '2px',
                    }}
                  >
                    <div
                      className="flex justify-between items-end"
                      style={{ gap: '14px' }}
                    >
                      <span
                        className="uppercase font-black tracking-tighter text-gray-400"
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Puntos de vida
                      </span>

                      <span
                        className="font-black font-mono text-white"
                        style={{
                          fontSize: '20px',
                          lineHeight: 1,
                          textShadow: `0 0 10px ${t.border}`,
                        }}
                      >
                        {carta.hp} HP
                      </span>
                    </div>

                    <div
                      className="w-full overflow-hidden"
                      style={{
                        height: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '999px',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((carta.hp / 250) * 100, 100)}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          borderRadius: '999px',
                          background: `linear-gradient(to right, ${t.border}, ${t.badgeBorder})`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-panel"
                style={{
                  borderRadius: '14px',
                  paddingTop: '16px',
                  paddingRight: '18px',
                  paddingBottom: '16px',
                  paddingLeft: '18px',
                  marginTop: '6px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {carta.rarity && (
                  <div
                    className="flex items-center"
                    style={{
                      gap: '16px',
                      minHeight: '24px',
                    }}
                  >
                    <span
                      className="uppercase tracking-wider text-gray-500 shrink-0"
                      style={{
                        width: '62px',
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Rareza
                    </span>

                    <span
                      className="font-semibold"
                      style={{
                        background: `${t.border}18`,
                        color: t.border,
                        borderRadius: '10px',
                        padding: '6px 10px',
                        fontSize: '14px',
                        lineHeight: 1,
                      }}
                    >
                      {carta.rarity}
                    </span>
                  </div>
                )}

                {carta.set_name && (
                  <div
                    className="flex items-center"
                    style={{
                      gap: '16px',
                      minHeight: '24px',
                    }}
                  >
                    <span
                      className="uppercase tracking-wider text-gray-500 shrink-0"
                      style={{
                        width: '62px',
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Set
                    </span>

                    <span
                      className="text-gray-300"
                      style={{
                        fontSize: '16px',
                        lineHeight: 1.35,
                      }}
                    >
                      {carta.set_name}
                    </span>
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
                  className="inline-flex items-center transition-colors"
                  style={{
                    color: t.border,
                    fontSize: '15px',
                    fontWeight: 500,
                    marginTop: '2px',
                    width: 'fit-content',
                  }}
                >
                  Ver en TCGPlayer â†’
                </motion.a>
              )}

              <div
                className="mt-auto"
                style={{
                  paddingTop: '10px',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={agregarAlCarrito}
                  disabled={adding || carta.isCollected}
                  className="w-full font-black transition-all disabled:opacity-50"
                  style={{
                    background: t.border,
                    color: isDarkType ? '#fff' : '#000',
                    boxShadow: `0 4px 20px ${t.glow}`,
                    borderRadius: '12px',
                    minHeight: '56px',
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    paddingLeft: '18px',
                    paddingRight: '18px',
                    fontSize: '18px',
                    letterSpacing: '0.01em',
                    marginTop: '2px',
                  }}
                  onMouseEnter={(e) => {
                    if (!adding && !carta.isCollected) e.currentTarget.style.boxShadow = `0 8px 30px ${t.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 20px ${t.glow}`;
                  }}
                >
                  {carta.isCollected ? (
                    'Ya estÃ¡ en tu colecciÃ³n'
                  ) : adding ? (
                    <span
                      className="flex items-center justify-center"
                      style={{ gap: '10px' }}
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        â—Œ
                      </motion.span>
                      Agregando...
                    </span>
                  ) : (
                    `Agregar al carrito - $${carta.price ?? 10}`
                  )}
                </motion.button>

                <AnimatePresence>
                  {msg && (
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className={`text-center font-semibold ${
                        msg.includes('Agregado') ? 'text-green-400' : 'text-red-400'
                      }`}
                      style={{
                        fontSize: '14px',
                        marginTop: '12px',
                      }}
                    >
                      {msg.includes('Agregado') ? 'âœ“' : 'âš '} {msg}
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
