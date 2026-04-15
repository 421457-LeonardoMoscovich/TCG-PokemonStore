import { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';
import {
  Mail,
  Wallet,
  Calendar,
  Package,
  TrendingUp,
  ShoppingBag,
  ChevronDown,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  Target,
  BookOpen,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Boxes,
  Fingerprint,
  Cpu,
  Crown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

/* ─────────────────────────────────────────────
   Animated Counter
───────────────────────────────────────────── */
function AnimatedCounter({ from = 0, to, duration = 2, prefix = '', suffix = '' }) {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate(value) {
        node.textContent = `${prefix}${Math.round(value).toLocaleString('es-AR')}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [from, to, duration, prefix, suffix]);

  return <span ref={nodeRef} />;
}

/* ─────────────────────────────────────────────
   Pixel Background
───────────────────────────────────────────── */
function PixelArtBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden top-16">
      <motion.div
        initial={{ x: '-10vw' }}
        animate={{ x: '110vw' }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 2 }}
        className="absolute bottom-[2%] left-0 opacity-20 mix-blend-screen z-0"
        style={{ transform: 'scale(1.5)' }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif"
          alt="Pikachu"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>

      <motion.div
        initial={{ x: '110vw' }}
        animate={{ x: '-10vw' }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear', delay: 5 }}
        className="absolute bottom-[4%] left-0 opacity-15 mix-blend-screen z-0"
        style={{ transform: 'scaleX(-1) scale(1.4)' }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif"
          alt="Bulbasaur"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>

      <motion.div
        initial={{ x: '-15vw', y: 0 }}
        animate={{ x: '110vw', y: [0, 20, 0] }}
        transition={{
          x: { duration: 55, repeat: Infinity, ease: 'linear', delay: 15 },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-[45%] left-0 opacity-[0.12] mix-blend-screen z-0"
        style={{ transform: 'scale(1.8)' }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif"
          alt="Gengar"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>

      <motion.div
        initial={{ x: '110vw', y: 0 }}
        animate={{ x: '-15vw', y: [0, -30, 10, -10, 0] }}
        transition={{
          x: { duration: 30, repeat: Infinity, ease: 'linear', delay: 10 },
          y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-[35%] left-0 opacity-20 mix-blend-screen z-0"
        style={{ transform: 'scaleX(-1) scale(1.3)' }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif"
          alt="Mew"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>

      <motion.div
        initial={{ x: '110vw', y: 0 }}
        animate={{ x: '-20vw', y: [-15, 15, -15] }}
        transition={{
          x: { duration: 28, repeat: Infinity, ease: 'linear', delay: 2 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-[12%] right-0 opacity-15 mix-blend-screen z-0"
        style={{ transform: 'scaleX(-1) scale(1.8)' }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif"
          alt="Charizard"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>

      <motion.div
        initial={{ x: '-20vw', y: 0 }}
        animate={{ x: '110vw', y: [-5, 5, -5] }}
        transition={{
          x: { duration: 18, repeat: Infinity, ease: 'linear', delay: 8 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-[20%] left-0 opacity-10 mix-blend-screen z-0"
        style={{ transform: 'scale(1.5)' }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/18.gif"
          alt="Pidgeot"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>

      <motion.div
        initial={{ x: '-30vw', y: 0 }}
        animate={{ x: '110vw', y: [0, -20, 0] }}
        transition={{
          x: { duration: 80, repeat: Infinity, ease: 'linear', delay: 0 },
          y: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-[5%] left-0 opacity-[0.08] mix-blend-screen z-0"
        style={{ transform: 'scale(2.5)' }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/249.gif"
          alt="Lugia"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main
───────────────────────────────────────────── */
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

  if (!perfil) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#06070b' }}
      >
        <div className="relative flex flex-col items-center justify-center">
          <div
            className="animate-spin"
            style={{
              width: '86px',
              height: '86px',
              border: '2px solid rgba(255,255,255,0.08)',
              borderTopColor: '#FFEB3B',
              boxShadow: '0 0 20px rgba(255,235,59,0.18)',
            }}
          />
          <p
            style={{
              fontFamily: 'monospace',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#FFEB3B',
              marginTop: '24px',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            CARGANDO_SISTEMA
          </p>
        </div>
      </div>
    );
  }

  const totalGastado = historial.reduce((sum, c) => sum + (c.totalPrice || 0), 0);
  const totalCartas = historial.reduce(
    (sum, c) => sum + Object.values(c.items || {}).reduce((a, b) => a + b, 0),
    0
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: 'calc(100vh - 76px)',
        background: '#050608',
        color: 'white',
      }}
    >
      <PixelArtBackground />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -left-[10%] blur-[140px] mix-blend-screen"
          style={{
            width: '60vw',
            height: '60vw',
            background: 'radial-gradient(circle, rgba(124,77,255,0.4) 0%, transparent 70%)',
          }}
        />

        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-[20%] -right-[10%] blur-[140px] mix-blend-color-dodge"
          style={{
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, rgba(255,235,59,0.3) 0%, transparent 70%)',
          }}
        />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div
        className="relative z-10 w-full mx-auto"
        style={{
          maxWidth: '1600px',
          paddingLeft: '28px',
          paddingRight: '28px',
          paddingTop: '42px',
          paddingBottom: '28px',
        }}
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '18px',
            marginBottom: '30px',
            paddingBottom: '18px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #7C4DFF, #D8B4FE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '6px 6px 0 rgba(124,77,255,0.35)',
            }}
          >
            <ShieldCheck className="w-9 h-9 text-black" />
          </div>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 5.2rem)',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: 0.95,
                textTransform: 'uppercase',
                margin: 0,
                color: '#fff',
              }}
            >
              Centro de{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #C084FC, #FFEB3B)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Comando
              </span>
            </h1>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                alignItems: 'center',
                marginTop: '10px',
              }}
            >
              <p
                style={{
                  color: 'rgba(255,255,255,0.62)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                SYS.REG // Telemetría del Inventario
              </p>

              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '999px',
                  background: '#FFEB3B',
                  boxShadow: '0 0 12px rgba(255,235,59,0.9)',
                }}
              />

              <p
                style={{
                  color: 'rgba(255,255,255,0.36)',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: 0,
                  fontWeight: 800,
                }}
              >
                Tactical Profile Matrix
              </p>
            </div>
          </div>
        </motion.header>

        {/* Main layout */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12"
          style={{
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left column */}
          <div
            className="lg:col-span-4"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
            }}
          >
            <TrainerCard
              perfil={perfil}
              username={username}
              setUsername={setUsername}
              onSave={guardarPerfil}
              saving={saving}
              msg={msg}
            />

            <div
              className="grid grid-cols-2"
              style={{
                gap: '14px',
              }}
            >
              <StatCard
                label="Aprobación"
                icon={<ShieldCheck strokeWidth={3} className="w-5 h-5" />}
                color="#7C4DFF"
                delay={0.1}
              >
                Lv. <AnimatedCounter to={Math.max(1, Math.floor(totalCartas / 10))} />
              </StatCard>

              <StatCard
                label="Patrimonio Neto"
                icon={<TrendingUp strokeWidth={3} className="w-5 h-5" />}
                color="#FFEB3B"
                delay={0.2}
              >
                $<AnimatedCounter to={perfil.balance || 0} />
              </StatCard>

              <StatCard
                label="Cartas Obtenidas"
                icon={<Target strokeWidth={3} className="w-5 h-5" />}
                color="#00BCD4"
                delay={0.3}
              >
                <AnimatedCounter to={totalCartas} />
              </StatCard>

              <StatCard
                label="Valor Adquirido"
                icon={<Zap strokeWidth={3} className="w-5 h-5" />}
                color="#F57C00"
                delay={0.4}
              >
                $<AnimatedCounter to={totalGastado} />
              </StatCard>
            </div>

            {/* Pokédex */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="relative overflow-hidden"
              style={{
                padding: '18px',
                border: '2px solid rgba(124,77,255,0.28)',
                background: 'rgba(10,12,18,0.82)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '6px 6px 0 rgba(124,77,255,0.14)',
              }}
            >
              <div className="absolute top-0 left-0 w-3 h-3 border-r-2 border-b-2 border-[#7C4DFF]/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-l-2 border-b-2 border-[#7C4DFF]/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-r-2 border-t-2 border-[#7C4DFF]/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-l-2 border-t-2 border-[#7C4DFF]/50" />

              <div
                className="absolute -top-20 -right-20 blur-[60px] pointer-events-none"
                style={{
                  width: '180px',
                  height: '180px',
                  background: 'rgba(124,77,255,0.12)',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '14px',
                  borderBottom: '1px solid rgba(255,255,255,0.10)',
                  paddingBottom: '12px',
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    background: 'rgba(124,77,255,0.15)',
                    border: '2px solid rgba(124,77,255,0.35)',
                  }}
                >
                  <BookOpen className="w-5 h-5 text-[#7C4DFF]" />
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 900,
                      color: '#fff',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Tu Pokédex
                  </h3>
                  <p
                    style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: 'rgba(255,255,255,0.42)',
                      marginTop: '4px',
                      marginBottom: 0,
                    }}
                  >
                    {coleccionCards.length} CARTA{coleccionCards.length !== 1 ? 'S' : ''} CAPTURADA
                    {coleccionCards.length !== 1 ? 'S' : ''}
                  </p>
                </div>
              </div>

              {coleccionCards.length === 0 ? (
                <div
                  className="flex flex-col items-center text-center"
                  style={{ padding: '26px 0 18px 0' }}
                >
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      border: '2px dashed rgba(255,255,255,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <BookOpen className="w-8 h-8 text-gray-600" />
                  </div>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.48)',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      margin: 0,
                    }}
                  >
                    Sin cartas aún. Explorá el catálogo.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="flex items-center"
                    style={{
                      gap: '10px',
                      marginBottom: '14px',
                    }}
                  >
                    <button
                      onClick={() =>
                        setCarouselIndex((prev) => (prev - 1 + coleccionCards.length) % coleccionCards.length)
                      }
                      style={{
                        width: '34px',
                        height: '34px',
                        border: '1px solid rgba(255,255,255,0.20)',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.66)',
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div
                      className="flex-1 flex items-center justify-center"
                      style={{
                        gap: '12px',
                        minHeight: '172px',
                      }}
                    >
                      {coleccionCards.length > 1 && (
                        <div
                          className="hidden sm:block relative overflow-hidden"
                          style={{
                            width: '72px',
                            height: '104px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.10)',
                            opacity: 0.5,
                          }}
                        >
                          <AnimatePresence mode="popLayout">
                            <motion.img
                              key={`prev-${(carouselIndex - 1 + coleccionCards.length) % coleccionCards.length}`}
                              src={coleccionCards[(carouselIndex - 1 + coleccionCards.length) % coleccionCards.length]?.image}
                              alt={coleccionCards[(carouselIndex - 1 + coleccionCards.length) % coleccionCards.length]?.name}
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 12 }}
                              transition={{ duration: 0.28 }}
                            />
                          </AnimatePresence>
                        </div>
                      )}

                      <div
                        className="relative overflow-hidden"
                        style={{
                          width: '116px',
                          height: '160px',
                          borderRadius: '10px',
                          border: '2px solid rgba(124,77,255,0.50)',
                          boxShadow: '0 0 20px rgba(124,77,255,0.30)',
                        }}
                      >
                        <AnimatePresence mode="popLayout">
                          <motion.img
                            key={`main-${carouselIndex}`}
                            src={coleccionCards[carouselIndex]?.image}
                            alt={coleccionCards[carouselIndex]?.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.28 }}
                          />
                        </AnimatePresence>

                        <div
                          className="absolute inset-x-0 bottom-0"
                          style={{
                            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.92))',
                            padding: '8px 6px',
                            zIndex: 10,
                          }}
                        >
                          <p
                            style={{
                              fontSize: '9px',
                              fontWeight: 900,
                              color: '#fff',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              margin: 0,
                            }}
                          >
                            {coleccionCards[carouselIndex]?.name}
                          </p>
                        </div>
                      </div>

                      {coleccionCards.length > 2 && (
                        <div
                          className="hidden sm:block relative overflow-hidden"
                          style={{
                            width: '72px',
                            height: '104px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.10)',
                            opacity: 0.5,
                          }}
                        >
                          <AnimatePresence mode="popLayout">
                            <motion.img
                              key={`next-${(carouselIndex + 1) % coleccionCards.length}`}
                              src={coleccionCards[(carouselIndex + 1) % coleccionCards.length]?.image}
                              alt={coleccionCards[(carouselIndex + 1) % coleccionCards.length]?.name}
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -12 }}
                              transition={{ duration: 0.28 }}
                            />
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setCarouselIndex((prev) => (prev + 1) % coleccionCards.length)}
                      style={{
                        width: '34px',
                        height: '34px',
                        border: '1px solid rgba(255,255,255,0.20)',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.66)',
                      }}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to="/pokedex"
                    className="w-full flex items-center justify-center gap-2"
                    style={{
                      padding: '11px 14px',
                      background: 'rgba(124,77,255,0.15)',
                      border: '1px solid rgba(124,77,255,0.40)',
                      color: '#7C4DFF',
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      boxShadow: '2px 2px 0 rgba(124,77,255,0.20)',
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Ir a la Pokédex
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-8 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden flex flex-col"
              style={{
                minHeight: '760px',
                padding: '18px',
                border: '2px solid rgba(255,255,255,0.10)',
                background: 'rgba(10,12,18,0.82)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '8px 8px 0 rgba(0,0,0,0.6)',
              }}
            >
              <div
                className="absolute -top-32 -right-32 blur-[80px] pointer-events-none"
                style={{
                  width: '260px',
                  height: '260px',
                  background: 'rgba(255,235,59,0.10)',
                }}
              />

              <div
                className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between"
                style={{
                  gap: '14px',
                  marginBottom: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.10)',
                  paddingBottom: '14px',
                  flexShrink: 0,
                }}
              >
                <div className="flex items-center gap-14">
                  <div
                    style={{
                      padding: '10px',
                      background: 'rgba(255,235,59,0.10)',
                      border: '2px solid rgba(255,235,59,0.34)',
                    }}
                  >
                    <Boxes className="w-6 h-6 text-[#FFEB3B]" />
                  </div>

                  <div>
                    <h2
                      style={{
                        fontSize: 'clamp(2rem, 2.8vw, 3.2rem)',
                        fontWeight: 900,
                        color: '#fff',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      La Bóveda
                    </h2>

                    <p
                      style={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.20em',
                        color: 'rgba(255,255,255,0.38)',
                        marginTop: '6px',
                        marginBottom: 0,
                      }}
                    >
                      REG / MANIFIESTO_TRANSACCIONES
                    </p>
                  </div>
                </div>

                {historial.length > 0 && (
                  <div
                    style={{
                      padding: '8px 12px',
                      border: '2px solid rgba(255,255,255,0.20)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#d1d5db',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      boxShadow: '2px 2px 0 rgba(255,255,255,0.10)',
                    }}
                  >
                    {historial.length} REGISTROS
                  </div>
                )}
              </div>

              {historial.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center text-center"
                  style={{
                    flex: 1,
                    padding: '40px 20px',
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="relative"
                    style={{ marginBottom: '18px' }}
                  >
                    <div
                      style={{
                        width: '128px',
                        height: '128px',
                        border: '2px dotted rgba(255,255,255,0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '96px',
                          height: '96px',
                          border: '1px solid rgba(255,235,59,0.28)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255,235,59,0.05)',
                        }}
                      >
                        <ShoppingBag className="w-10 h-10 text-primary/40" />
                      </div>
                    </div>
                  </motion.div>

                  <p
                    style={{
                      fontSize: '24px',
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      color: '#fff',
                      letterSpacing: '0.10em',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Cámara Vacía
                  </p>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.44)',
                      marginTop: '10px',
                      maxWidth: '400px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                  >
                    No entries found in databank. Awaiting fresh catalog acquisitions.
                  </p>
                </div>
              ) : (
                <div
                  className="relative z-10 flex-1 overflow-y-auto"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingBottom: '18px',
                  }}
                >
                  <style>{`.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {historial.map((compra, idx) => {
                      const isOpen = expandedId === compra._id;
                      const itemCount = Object.values(compra.items || {}).reduce((a, b) => a + b, 0);
                      const isCompleted = compra.status === 'completed';

                      return (
                        <motion.div
                          key={compra._id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 + idx * 0.04 }}
                          className="overflow-hidden"
                          style={{
                            border: isOpen
                              ? '2px solid rgba(255,235,59,0.45)'
                              : '1px solid rgba(255,255,255,0.10)',
                            background: isOpen
                              ? 'rgba(20,18,8,0.55)'
                              : 'rgba(255,255,255,0.02)',
                            boxShadow: isOpen ? '4px 4px 0 rgba(255,235,59,0.16)' : 'none',
                            transition: 'all 180ms ease',
                          }}
                        >
                          <div
                            className="group cursor-pointer select-none relative"
                            style={{
                              padding: '12px 14px',
                            }}
                            onClick={() => setExpandedId(isOpen ? null : compra._id)}
                          >
                            <div
                              className="absolute left-0 top-0 bottom-0"
                              style={{
                                width: '5px',
                                background: isCompleted ? '#FFEB3B' : '#f59e0b',
                              }}
                            />

                            <div
                              className="grid grid-cols-1 sm:grid-cols-[170px_1fr_180px]"
                              style={{
                                gap: '14px',
                                alignItems: 'center',
                                paddingLeft: '10px',
                              }}
                            >
                              {/* Left */}
                              <div
                                className="flex items-center"
                                style={{ gap: '12px' }}
                              >
                                <div
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    border: `1px solid ${isCompleted ? 'rgba(255,235,59,0.40)' : 'rgba(245,158,11,0.40)'}`,
                                    background: isCompleted
                                      ? 'rgba(255,235,59,0.10)'
                                      : 'rgba(245,158,11,0.10)',
                                    color: isCompleted ? '#FFEB3B' : '#f59e0b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'monospace',
                                    fontWeight: 900,
                                    fontSize: '26px',
                                  }}
                                >
                                  {historial.length - idx}
                                </div>

                                <div>
                                  <p
                                    style={{
                                      fontSize: '10px',
                                      fontFamily: 'monospace',
                                      fontWeight: 800,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.14em',
                                      color: 'rgba(255,255,255,0.42)',
                                      margin: 0,
                                    }}
                                  >
                                    {new Date(compra.purchasedAt).toLocaleDateString('es-AR', {
                                      month: 'short',
                                      day: '2-digit',
                                    })}
                                  </p>

                                  <p
                                    className="flex items-center"
                                    style={{
                                      gap: '6px',
                                      color: '#e5e7eb',
                                      fontFamily: 'monospace',
                                      fontSize: '14px',
                                      fontWeight: 700,
                                      marginTop: '4px',
                                      marginBottom: 0,
                                    }}
                                  >
                                    <Clock className="w-3.5 h-3.5 opacity-50" />
                                    {new Date(compra.purchasedAt).toLocaleTimeString('es-AR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>

                              {/* Middle */}
                              <div>
                                <span
                                  className="inline-flex items-center"
                                  style={{
                                    gap: '6px',
                                    padding: '6px 10px',
                                    fontSize: '11px',
                                    fontFamily: 'monospace',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.10)',
                                    color: '#d1d5db',
                                  }}
                                >
                                  <Package className="w-3.5 h-3.5" />
                                  {itemCount} Unidad{itemCount !== 1 ? 'es' : ''}
                                </span>
                              </div>

                              {/* Right */}
                              <div
                                className="flex items-center justify-between sm:justify-end"
                                style={{ gap: '16px' }}
                              >
                                <div style={{ textAlign: 'right' }}>
                                  <p
                                    style={{
                                      fontSize: '18px',
                                      fontFamily: 'monospace',
                                      fontWeight: 900,
                                      color: '#fff',
                                      letterSpacing: '-0.04em',
                                      margin: 0,
                                    }}
                                  >
                                    ${compra.totalPrice?.toLocaleString('es-AR')}
                                  </p>
                                </div>

                                <div
                                  className="flex items-center"
                                  style={{
                                    gap: '6px',
                                    padding: '6px 10px',
                                    border: `1px solid ${
                                      isCompleted
                                        ? 'rgba(34,197,94,0.32)'
                                        : 'rgba(245,158,11,0.32)'
                                    }`,
                                    background: isCompleted
                                      ? 'rgba(34,197,94,0.06)'
                                      : 'rgba(245,158,11,0.06)',
                                    color: isCompleted ? '#4ade80' : '#fbbf24',
                                    fontSize: '10px',
                                    fontFamily: 'monospace',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.12em',
                                  }}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-3 h-3" />
                                  ) : (
                                    <Clock className="w-3 h-3" />
                                  )}
                                  {isCompleted ? 'OK' : 'PND'}
                                </div>

                                <ChevronDown
                                  className={`transition-transform duration-300 ${
                                    isOpen ? 'rotate-180 text-primary' : 'text-gray-500'
                                  }`}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.24, ease: 'easeOut' }}
                                style={{
                                  borderTop: '1px solid rgba(255,255,255,0.08)',
                                  background: 'rgba(0,0,0,0.28)',
                                }}
                              >
                                <div
                                  style={{
                                    padding: '14px',
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: '10px',
                                      fontFamily: 'monospace',
                                      fontWeight: 900,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.24em',
                                      color: 'rgba(255,255,255,0.34)',
                                      marginBottom: '12px',
                                      marginLeft: '2px',
                                    }}
                                  >
                                    {'> DETALLE_MANIFIESTO'}
                                  </p>

                                  <div
                                    className="grid grid-cols-1 md:grid-cols-2"
                                    style={{ gap: '10px' }}
                                  >
                                    {Object.entries(compra.items || {}).map(([cardId, qty], i) => (
                                      <motion.div
                                        key={cardId}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.04 + i * 0.03 }}
                                        className="flex items-center"
                                        style={{
                                          gap: '10px',
                                          padding: '10px',
                                          border: '1px solid rgba(255,255,255,0.08)',
                                          background: 'rgba(255,255,255,0.02)',
                                          boxShadow: '2px 2px 0 rgba(0,0,0,0.25)',
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: '32px',
                                            height: '42px',
                                            border: '1px solid rgba(255,255,255,0.20)',
                                            background: 'rgba(124,77,255,0.10)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: '12px',
                                              filter: 'grayscale(1)',
                                            }}
                                          >
                                            🃏
                                          </span>
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <p
                                            style={{
                                              fontSize: '10px',
                                              color: 'rgba(255,255,255,0.42)',
                                              fontFamily: 'monospace',
                                              textTransform: 'uppercase',
                                              letterSpacing: '0.08em',
                                              margin: 0,
                                              whiteSpace: 'nowrap',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                            }}
                                          >
                                            ID: {cardId}
                                          </p>
                                        </div>

                                        <div
                                          style={{
                                            padding: '6px 10px',
                                            border: '1px solid rgba(255,235,59,0.20)',
                                            background: 'rgba(255,235,59,0.10)',
                                            color: '#FFEB3B',
                                            fontSize: '13px',
                                            fontFamily: 'monospace',
                                            fontWeight: 900,
                                            flexShrink: 0,
                                          }}
                                        >
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
                  </div>

                  <div
                    className="absolute opacity-50 mix-blend-screen select-none pointer-events-none"
                    style={{ bottom: '40px', right: '38px', zIndex: 20 }}
                  >
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

/* ─────────────────────────────────────────────
   Trainer Card
───────────────────────────────────────────── */
function TrainerCard({ perfil, username, setUsername, onSave, saving, msg }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  const shineOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.55]);
  const shineGradientPos = useTransform(mouseXSpring, [-0.5, 0.5], ['-100%', '200%']);

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const initial =
    perfil.username?.[0]?.toUpperCase() || perfil.email?.[0]?.toUpperCase() || '?';

  return (
    <div style={{ perspective: '1200px', width: '100%' }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          width: '100%',
          padding: '22px',
          background: 'rgba(10,12,18,0.88)',
          border: '2px solid rgba(255,235,59,0.30)',
          boxShadow: '6px 6px 0 rgba(255,235,59,0.14)',
        }}
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-r-2 border-b-2 border-primary/50" />
        <div className="absolute top-0 right-0 w-3 h-3 border-l-2 border-b-2 border-primary/50" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-r-2 border-t-2 border-primary/50" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-l-2 border-t-2 border-primary/50" />

        <motion.div
          className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge"
          style={{
            opacity: shineOpacity,
            background:
              'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.5) 25%, rgba(255,235,59,0.8) 45%, transparent 50%)',
            backgroundPosition: shineGradientPos,
            backgroundSize: '200% 200%',
          }}
        />

        <div
          className="relative z-20 w-full flex flex-col items-center"
          style={{
            transform: 'translateZ(38px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="w-full flex flex-col items-center text-center"
            style={{ marginBottom: '18px' }}
          >
            <h3
              style={{
                color: '#FFEB3B',
                fontFamily: 'monospace',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.35em',
                fontSize: '10px',
                marginBottom: '8px',
                background: 'rgba(255,235,59,0.10)',
                padding: '6px 12px',
                border: '1px solid rgba(255,235,59,0.30)',
                boxShadow: '2px 2px 0 rgba(255,235,59,0.20)',
              }}
            >
              LICENCIA / CLASE-X
            </h3>

            <div
              style={{
                height: '1px',
                width: '140px',
                background: 'rgba(255,235,59,0.20)',
              }}
            />
          </div>

          <div
            className="flex flex-col items-center"
            style={{ marginBottom: '18px' }}
          >
            <div
              className="relative z-10 overflow-hidden"
              style={{
                width: '110px',
                height: '110px',
                border: '2px solid rgba(255,235,59,0.60)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '52px',
                fontFamily: 'monospace',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FFEB3B, #F57C00)',
                color: '#000',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.8)',
              }}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40 animate-pulse pointer-events-none" />
              {initial}
            </div>

            <div
              style={{
                marginTop: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,235,59,0.50)',
                color: '#FFEB3B',
                padding: '5px 10px',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                boxShadow: '2px 2px 0 rgba(255,235,59,0.18)',
              }}
            >
              RANGO_MAX
            </div>
          </div>

          <div
            className="relative overflow-hidden w-full"
            style={{
              background: 'rgba(0,0,0,0.42)',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              textAlign: 'center',
              boxShadow: 'inset 0 0 18px rgba(0,0,0,0.35)',
            }}
          >
            <div
              className="absolute right-2 top-2 grid grid-cols-2 gap-0.5 opacity-20"
            >
              <div className="w-1 h-1 bg-white" />
              <div className="w-1 h-1 bg-white" />
              <div className="w-1 h-1 bg-white" />
              <div className="w-1 h-1 bg-white" />
            </div>

            <div>
              <p
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#FFEB3B',
                  marginBottom: '6px',
                }}
              >
                Callsign
              </p>
              <h2
                style={{
                  fontSize: '28px',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  color: '#fff',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {perfil.username || 'TRAINER_01'}
              </h2>
            </div>

            <div>
              <p
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#FFEB3B',
                  marginBottom: '6px',
                }}
              >
                Link
              </p>

              <p
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#d1d5db',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '6px 8px',
                  border: '1px solid rgba(255,255,255,0.10)',
                  margin: 0,
                }}
              >
                {perfil.email}
              </p>
            </div>

            <div
              className="flex items-center justify-center"
              style={{
                gap: '8px',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                background: 'rgba(255,235,59,0.10)',
                color: '#FFEB3B',
                padding: '8px 10px',
                border: '1px solid rgba(255,235,59,0.30)',
                margin: '0 auto',
                width: 'fit-content',
              }}
            >
              <Calendar className="w-3 h-3" />
              ACTIVO_DESDE:
              {new Date(perfil.createdAt).toLocaleDateString('es-AR', {
                year: '2-digit',
                month: '2-digit',
              })}
            </div>
          </div>

          <div
            style={{
              width: '100%',
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px dashed rgba(255,255,255,0.20)',
              transform: 'translateZ(20px)',
            }}
          >
            <p
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
                fontWeight: 900,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.36)',
                marginBottom: '8px',
                textAlign: 'left',
              }}
            >
              {'> INIT_UPDATE_PROTOCOL'}
            </p>

            <form
              onSubmit={onSave}
              className="flex"
              style={{
                gap: '8px',
                position: 'relative',
              }}
            >
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="NUEVO_CALLSIGN..."
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  width: '100%',
                  background: 'rgba(0,0,0,0.60)',
                  border: '1px solid rgba(255,255,255,0.24)',
                  color: '#fff',
                  outline: 'none',
                  boxShadow: 'inset 0 0 14px rgba(0,0,0,0.35)',
                }}
              />

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#FFD54F' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving || !username || username === perfil.username}
                className="flex items-center justify-center shrink-0"
                style={{
                  padding: '12px 16px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  background: '#FFEB3B',
                  color: '#000',
                  border: '1px solid transparent',
                  boxShadow: '2px 2px 0 rgba(255,255,255,0.20)',
                  opacity: saving || !username || username === perfil.username ? 0.3 : 1,
                }}
              >
                {saving ? (
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping delay-100" />
                  </div>
                ) : (
                  <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                  style={{ marginTop: '10px' }}
                >
                  <p
                    className="flex items-center"
                    style={{
                      gap: '8px',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      padding: '8px 10px',
                      border: msg.includes('sincronizada') || msg.includes('sincronizada.')
                        ? '1px solid rgba(34,197,94,0.40)'
                        : '1px solid rgba(239,68,68,0.40)',
                      background:
                        msg.includes('sincronizada') || msg.includes('sincronizada.')
                          ? 'rgba(34,197,94,0.18)'
                          : 'rgba(239,68,68,0.18)',
                      color:
                        msg.includes('sincronizada') || msg.includes('sincronizada.')
                          ? '#4ade80'
                          : '#f87171',
                      boxShadow: '2px 2px 0 rgba(0,0,0,0.35)',
                      margin: 0,
                    }}
                  >
                    {msg.includes('sincronizada') || msg.includes('sincronizada.') ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
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

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */
function StatCard({ label, children, icon, color, delay }) {
  return (
    <motion.div
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 220 }}
      whileHover={{ scale: 1.02, y: -2, borderColor: color }}
      className="relative overflow-hidden group cursor-default"
      style={{
        border: '2px solid rgba(255,255,255,0.14)',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'rgba(10,12,18,0.82)',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
        minHeight: '136px',
        transition: 'all 180ms ease',
      }}
    >
      <div
        className="absolute transition-opacity duration-300 group-hover:opacity-40"
        style={{
          top: '-48px',
          right: '-48px',
          width: '110px',
          height: '110px',
          filter: 'blur(24px)',
          opacity: 0.2,
          background: color,
        }}
      />

      <div
        className="absolute top-0 right-0 z-20"
        style={{
          width: '14px',
          height: '14px',
          borderLeft: '1px solid #000',
          borderBottom: '1px solid #000',
          background: '#000',
          transform: 'translate(50%,-50%) rotate(45deg)',
        }}
      />

      <div
        className="flex items-center justify-between relative z-10"
        style={{ marginBottom: '14px' }}
      >
        <div
          style={{
            padding: '8px 10px',
            border: `1px solid ${color}40`,
            background: 'rgba(0,0,0,0.60)',
            color,
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.25)',
          }}
        >
          {icon}
        </div>

        <div
          className="flex"
          style={{
            gap: '6px',
            opacity: 0.6,
          }}
        >
          <motion.div
            style={{ width: '6px', height: '18px', background: 'rgba(255,255,255,0.20)' }}
            animate={{ backgroundColor: ['rgba(255,255,255,0.2)', color, 'rgba(255,255,255,0.2)'] }}
            transition={{ repeat: Infinity, duration: 1.2, delay }}
          />
          <motion.div
            style={{ width: '6px', height: '18px', background: 'rgba(255,255,255,0.20)' }}
            animate={{ backgroundColor: ['rgba(255,255,255,0.2)', color, 'rgba(255,255,255,0.2)'] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: delay + 0.3 }}
          />
        </div>
      </div>

      <div className="relative z-10" style={{ marginTop: '6px' }}>
        <p
          style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.42)',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            fontWeight: 900,
            marginBottom: '8px',
          }}
        >
          {label}
        </p>

        <p
          className="flex items-baseline"
          style={{
            gap: '4px',
            fontSize: 'clamp(2rem, 2vw, 2.4rem)',
            fontFamily: 'monospace',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.05em',
            textShadow: `2px 2px 0 ${color}30`,
            margin: 0,
          }}
        >
          {children}
        </p>
      </div>
    </motion.div>
  );
}