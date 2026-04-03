import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Flame, Droplets, Leaf, Zap, Brain, 
  HandMetal, Moon, Cog, Rabbit, Star,
  ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Shield, Truck, Award, Headphones,
  Package, CreditCard, RotateCcw, Globe, Lock
} from 'lucide-react';
import api from '../services/api';

const TYPES = [
  { value: 'Fire', label: 'Fire', Icon: Flame, color: '#E53935', gradient: 'from-red-600/20' },
  { value: 'Water', label: 'Water', Icon: Droplets, color: '#1E88E5', gradient: 'from-blue-600/20' },
  { value: 'Grass', label: 'Grass', Icon: Leaf, color: '#43A047', gradient: 'from-green-600/20' },
  { value: 'Lightning', label: 'Lightning', Icon: Zap, color: '#FFEB3B', gradient: 'from-yellow-500/20' },
  { value: 'Psychic', label: 'Psychic', Icon: Brain, color: '#E91E63', gradient: 'from-pink-600/20' },
  { value: 'Fighting', label: 'Fighting', Icon: HandMetal, color: '#F57C00', gradient: 'from-orange-600/20' },
  { value: 'Darkness', label: 'Darkness', Icon: Moon, color: '#607D8B', gradient: 'from-slate-600/20' },
  { value: 'Metal', label: 'Metal', Icon: Cog, color: '#90A4AE', gradient: 'from-zinc-600/20' },
  { value: 'Dragon', label: 'Dragon', Icon: Rabbit, color: '#7C4DFF', gradient: 'from-purple-600/20' },
  { value: 'Colorless', label: 'Colorless', Icon: Star, color: '#9E9E9E', gradient: 'from-gray-600/20' },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Autenticidad Garantizada',
    description: 'Cada carta viene con certificado de autenticidad y verificación completa.',
    stat: '100%'
  },
  {
    icon: Award,
    title: 'Curación Experta',
    description: 'Nuestros especialistas seleccionan cada carta por su calidad excepcional.',
    stat: '5000+'
  },
  {
    icon: Truck,
    title: 'Envío Premium',
    description: 'Shipping asegurado con Climate-controlled delivery a tu puerta.',
    stat: '48h'
  },
  {
    icon: Headphones,
    title: 'Soporte de por Vida',
    description: 'Servicio post-venta dedicado y guía de cuidado para siempre.',
    stat: '24/7'
  }
];

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 25
};

const POKEMON_SPRITES = [
  { id: 25, speed: 12, size: 60, yOffset: '75%', direction: 1, delay: 0 },
  { id: 1, speed: 18, size: 55, yOffset: '80%', direction: -1, delay: 2 },
  { id: 4, speed: 15, size: 58, yOffset: '78%', direction: 1, delay: 5 },
  { id: 7, speed: 16, size: 55, yOffset: '82%', direction: -1, delay: 7 },
  { id: 94, speed: 25, size: 70, yOffset: '65%', direction: 1, delay: 10 },
  { id: 133, speed: 14, size: 50, yOffset: '85%', direction: -1, delay: 12 },
];

const VideoScene = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none">
      {/* 1. Blurred Ambient Video Background (Ambilight Effect) */}
      <video
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-3xl scale-125 saturate-150 mix-blend-screen"
        src="/pixel-landscape.mp4"
      />
      
      {/* 2. Cyber-Deck Video Frame (The "Portal") */}
      <div className="relative w-full max-w-5xl aspect-[16/9] mx-4 md:mx-12 rounded-lg overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(124,77,255,0.2),_inset_0_0_30px_rgba(255,235,59,0.05)] bg-black/50 z-10">
        
        {/* Crisp Centered Inner Video */}
        <video
          autoPlay loop muted playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-screen"
          style={{ imageRendering: 'pixelated', scale: '1.35', transformOrigin: 'center center' }}
          poster="/pixel-landscape.png"
        >
          <source src="/pixel-landscape.mp4" type="video/mp4" />
        </video>

        {/* Cyber-Retro Overlays */}
        {/* CRT Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] mix-blend-overlay pointer-events-none" />
        
        {/* Holographic Inner Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] pointer-events-none" />
        
        {/* Cyberpunk Screen Borders (Top & Bottom Glowing Lines) */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFD600]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#7C4DFF]/40 to-transparent" />
      </div>

      {/* 3. Section Gradient Merging (Fading out the extreme edges) */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-transparent to-bg-base opacity-90 z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/95 to-transparent z-20 pointer-events-none shadow-[inset_0_-100px_100px_rgba(0,0,0,0.8)]" />
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [featuredCards, setFeaturedCards] = useState([]);
  const [heroCards, setHeroCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, heroRes] = await Promise.all([
          api.get('/cartas', { params: { limit: 20, hp_min: '150' } }),
          api.get('/cartas', { params: { limit: 50, hp_min: '150' } })
        ]);
        setFeaturedCards(featuredRes.data.cartas || []);
        
        const cards = heroRes.data.cartas || [];
        if (cards.length >= 3) {
          const shuffled = [...cards].sort(() => 0.5 - Math.random());
          setHeroCards(shuffled.slice(0, 3));
        } else if (cards.length > 0) {
          setHeroCards(cards);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-bg-base">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay gradient over video */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/95" />

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen py-24 gap-12 px-6">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Trading Card Game
            </span>
          </motion.div>

          {/* 3D Cards — center of page */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="flex items-end justify-center gap-6"
            style={{ perspective: '1400px' }}
          >
            {/* Glow behind cards */}
            <div className="relative flex items-end justify-center gap-6">
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.65, 0.4] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute inset-[-60px] rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,235,59,0.35) 0%, transparent 65%)' }}
              />

              {/* Sparkle particles */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                  style={{
                    background: '#FFEB3B',
                    left: `${8 + Math.random() * 84}%`,
                    top: `${8 + Math.random() * 84}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 60 - 30],
                    y: [0, Math.random() * 60 - 30],
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5 + Math.random() * 2,
                    delay: Math.random() * 3,
                  }}
                />
              ))}

              {/* Cards: small | LARGE | small */}
              {heroCards.length > 0 ? (
                heroCards.map((card, index) => {
                  const isCenter = index === 1;
                  const w = isCenter ? 240 : 168;
                  const h = isCenter ? 336 : 235;
                  const tiltDir = index === 0 ? 1 : -1;
                  return (
                    <motion.div
                      key={card._id}
                      animate={{
                        y: [0, isCenter ? -22 : -11, 0],
                        rotate: isCenter ? 0 : tiltDir * 4,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 5 + index * 1.2,
                        ease: 'easeInOut',
                        delay: index * 0.4,
                      }}
                      style={{
                        zIndex: isCenter ? 3 : 1,
                        width: w,
                        height: h,
                        perspective: '1000px',
                      }}
                      className="relative shrink-0"
                    >
                      <motion.div
                        whileHover={{
                          rotateY: isCenter ? 18 : tiltDir * 14,
                          rotateX: -8,
                          scale: 1.07,
                          z: 60,
                        }}
                        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                        className="relative w-full h-full rounded-lg overflow-hidden"
                        style={{
                          transformStyle: 'preserve-3d',
                          background: '#0d0d0d',
                          border: isCenter ? '2px solid rgba(255,235,59,0.45)' : '2px solid rgba(255,235,59,0.18)',
                          boxShadow: isCenter
                            ? '0 35px 70px -10px rgba(0,0,0,0.95), 0 0 60px rgba(255,235,59,0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
                            : '0 20px 45px -8px rgba(0,0,0,0.8), 0 0 25px rgba(255,235,59,0.1)',
                        }}
                      >
                        {/* Card image */}
                        {card.image ? (
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: '#0a0a0a' }}>
                            <Sparkles className="w-12 h-12" style={{ color: '#FFEB3B', opacity: 0.4 }} />
                          </div>
                        )}

                        {/* Holographic shine sweep on hover */}
                        <motion.div
                          initial={{ opacity: 0, x: '-100%' }}
                          whileHover={{ opacity: 1, x: '120%' }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'linear-gradient(105deg, transparent 20%, rgba(255,235,59,0.35) 50%, transparent 80%)',
                            mixBlendMode: 'screen',
                          }}
                        />

                        {/* Info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent">
                          <p className="font-bold text-white text-xs truncate">{card.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(255,235,59,0.15)', color: '#FFEB3B' }}>
                              {card.type}
                            </span>
                            {card.price && <span className="text-green-400 text-[10px] font-bold ml-1">${card.price}</span>}
                            <span className="text-gray-400 text-[10px] ml-auto">HP {card.hp}</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })
              ) : (
                [0, 1, 2].map(i => (
                  <div key={i} className="rounded-lg animate-pulse shrink-0" style={{
                    background: '#111111',
                    border: '2px solid #1a1a1a',
                    width: i === 1 ? 240 : 168,
                    height: i === 1 ? 336 : 235,
                  }} />
                ))
              )}
            </div>
          </motion.div>

          {/* Title + subtitle + buttons below cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-center max-w-2xl"
          >
            <h1 className="text-4xl lg:text-6xl font-black mb-4 leading-tight">
              <span className="text-white">Cartas que </span>
              <span className="text-gradient-primary">Definen Leyendas</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Colección premium de cartas Pokémon. Desde clásicos hasta Rare Holos y ediciones exclusivas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/catalogo')}
                className="flex items-center gap-3 px-8 py-4 rounded-md font-black text-base uppercase tracking-widest bg-gradient-to-br from-[#FFEB3B] via-[#FFD600] to-[#F57C00] text-black shadow-[0_0_20px_rgba(255,235,59,0.3)] hover:shadow-[0_0_30px_rgba(255,235,59,0.5)] transition-shadow"
              >
                Explorar Catálogo
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 px-8 py-4 rounded-md font-black text-base uppercase tracking-widest border-2 border-white/20 text-white hover:bg-white/5 transition-colors"
              >
                Ver Destacados
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.2, repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-7 h-7 text-gray-500" />
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-32 bg-bg-surface">
        <div className="w-full px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-2 block text-primary">
              Colección
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Explora por <span className="text-primary">Tipo</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 md:gap-4">
            {TYPES.map(({ value, label, Icon, color, gradient }, i) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/catalogo?type=${value}`)}
                className="flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-md relative overflow-hidden group bg-bg-elevated border border-white/5 transition-colors hover:border-white/10"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" 
                  style={{ background: color }} 
                />
                <div className="relative w-10 h-10 rounded-lg flex items-center justify-center pointer-events-none" style={{ background: `${color}33` }}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
                </div>
                <span className="relative text-sm md:text-base font-bold text-gray-300 group-hover:text-white transition-colors">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cards Section - Continuous Marquee */}
      <section id="featured" className="py-24 md:py-32 bg-bg-base overflow-hidden">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-2 block text-primary">
              Destacados
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Cartas <span className="text-primary">Premium</span>
            </h2>
          </motion.div>

          {/* Marquee Container — CSS mask for smooth edge fade */}
          <div className="marquee-fade">{/* mask applied via CSS class */}

            {loading ? (
              <div className="flex gap-4 px-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="w-44 md:w-52 aspect-[3/4] rounded-md animate-pulse shrink-0 bg-bg-elevated" />
                ))}
              </div>
            ) : featuredCards.length > 0 ? (
              <div className="flex animate-marquee hover:[animation-play-state:paused] w-max" style={{ perspective: '1000px', willChange: 'transform' }}>
                {[...featuredCards, ...featuredCards].map((carta, i) => (
                  <div key={`${carta._id}-${i}`} className="flex-shrink-0 px-3">
                    <Link
                      to={`/carta/${carta._id}`}
                      className="block w-44 md:w-52 rounded-lg overflow-hidden bg-bg-elevated border border-white/5 transition-colors hover:border-white/10 group"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-bg-surface relative">
                        {carta.image ? (
                          <img src={carta.image} alt={carta.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-12 h-12 opacity-20 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-white text-sm truncate">{carta.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span 
                            className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-primary/10 text-primary"
                          >
                            {carta.type}
                          </span>
                          {carta.price && <span className="text-green-400 text-[10px] font-bold">${carta.price}</span>}
                          <span className="text-gray-400 text-[10px]">HP {carta.hp}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No hay cartas disponibles
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Features Section - Bento Grid */}
      <section className="bg-bg-surface relative overflow-hidden mt-[150px] md:mt-[250px] py-24 md:py-32 border-t border-white/5 flex flex-col justify-center items-center">
        <div className="w-full px-4 md:px-8 max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 w-full"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 block text-primary">
              ¿Por qué elegirnos?
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              La Diferencia <span className="text-primary">Premium</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Diseñamos cada detalle en nuestra bóveda climática para asegurar la preservación absoluta de tu inversión.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 justify-items-center">
            
            {/* Bento Item 1 - Large Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="w-full md:col-span-2 md:row-span-2 relative p-8 md:p-12 rounded-md group glass-card border border-white/5 overflow-hidden flex flex-col justify-between h-full min-h-[350px]"
              style={{ background: 'linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,1) 100%)' }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-md flex items-center justify-center mb-8 border border-primary/20 bg-primary/10 transition-colors">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Autenticidad Garantizada</h3>
                <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                  Cada carta TCG atraviesa un escáner molecular y viene sellada criptográficamente con certificado digital de autenticidad.
                </p>
              </div>
              <div className="relative z-10 mt-12">
                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">100%</span>
                <span className="block text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">Verificación Segura</span>
              </div>
            </motion.div>

            {/* Bento Item 2 - Tall Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full md:col-span-1 md:row-span-1 relative p-6 md:p-8 rounded-md group glass-card border border-purple-500/10 group-hover:border-purple-500/20 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
              style={{ background: 'rgba(15,15,15,0.8)' }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-md flex items-center justify-center mb-6 bg-white/5 text-purple-400 group-hover:bg-purple-500/10 group-hover:text-purple-300 transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Curación Experta</h3>
                <p className="text-sm text-gray-400">
                  Especialistas grado PSA seleccionan cada unidad evaluando centering, bordes y foil.
                </p>
              </div>
              <div className="relative z-10 mt-10">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">5000+</span>
                <span className="block text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">Cartas Curadas</span>
              </div>
            </motion.div>

            {/* Bento Item 3 - Standard Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="w-full md:col-span-1 md:row-span-1 relative p-6 md:p-8 rounded-md group glass-card border border-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
              style={{ background: 'rgba(15,15,15,0.8)' }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-md flex items-center justify-center mb-6 bg-white/5 text-blue-400 group-hover:bg-blue-500/10 group-hover:text-blue-300 transition-colors">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Envío Blindado</h3>
                <p className="text-sm text-gray-400">
                  Logística internacional Climate-Controlled asegurando la integridad estructural de extremo a extremo.
                </p>
              </div>
              <div className="relative z-10 mt-10">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">48<span className="text-xl text-gray-500 ml-1">HS</span></span>
                <span className="block text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">Entrega Garantizada</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-white/5 bg-bg-base" style={{ paddingTop: '35px', paddingBottom: '35px' }}>
        <div className="w-full px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Package, label: 'Envío gratis', sub: 'En pedidos +$100' },
              { icon: Lock, label: 'Pago seguro', sub: '100% protegido' },
              { icon: RotateCcw, label: '30 días', sub: 'Devolución fácil' },
              { icon: Globe, label: 'Cobertura', sub: 'Nacional e internacional' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 justify-center md:justify-start group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-bg-elevated border border-white/5 group-hover:border-primary/30 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{label}</div>
                  <div className="text-gray-500 text-xs">{sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Video Section with Framed Portal */}
      <section className="relative overflow-hidden bg-bg-base border-t border-white/5" style={{ minHeight: '80vh' }}>
        <VideoScene />
        <div className="w-full px-6 md:px-12 relative z-10 flex flex-col items-center justify-center min-h-[80vh] pointer-events-none" />
      </section>

      {/* Retro Animated Pokemon Marquee Spacer */}
      <div className="h-[40px] bg-black overflow-hidden relative flex items-center w-full">
        {/* Track holding 200vw translates -100vw for a pixel-perfect infinite loop */}
        <div className="flex w-[200vw] animate-marquee opacity-80 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          
          {/* Loop Set 1 (100vw) */}
          <div className="flex w-[100vw] justify-around items-center shrink-0 px-4">
            {[25, 1, 4, 7, 133, 94, 143, 149, 150, 249, 448, 384].map((id, i) => (
              <div key={`set1-${id}-${i}`} className="flex justify-center items-center">
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`} 
                  alt={`Animated Pokemon ${id}`}
                  className="h-[40px] w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            ))}
          </div>

          {/* Loop Set 2 (Exact visual copy of Set 1 to mask the restart frame) */}
          <div className="flex w-[100vw] justify-around items-center shrink-0 px-4">
            {[25, 1, 4, 7, 133, 94, 143, 149, 150, 249, 448, 384].map((id, i) => (
              <div key={`set2-${id}-${i}`} className="flex justify-center items-center">
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`} 
                  alt={`Animated Pokemon ${id}`}
                  className="h-[40px] w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Premium Footer - Refined Luxury Aesthetic */}
      <footer className="relative mt-20 pt-24 pb-8 border-t border-white/5 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #050508, #000000)' }}>
        {/* Subtle Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="w-full px-[8vw] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12 mb-16 mt-8 justify-center">
            
            {/* Brand & Newsletter Column */}
            <div className="lg:col-span-4 flex flex-col items-start pr-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-md flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,235,59,0.1)]" style={{ background: 'linear-gradient(135deg, rgba(255,235,59,0.15) 0%, rgba(245,124,0,0.15) 100%)' }}>
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <span className="font-black text-3xl tracking-tighter">
                  <span className="text-white drop-shadow-sm">TCG </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#F57C00]">VAULT</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed max-w-xs font-medium opacity-80">
                La bóveda definitiva para coleccionistas de élite. Preservación, comercio y exhibición de clase mundial.
              </p>
              
              <div className="w-full max-w-sm relative group mb-12">
                <input 
                  type="email" 
                  placeholder="Únete al VIP Newsletter..." 
                  className="w-full bg-white/5 border border-white/10 rounded-md pl-5 pr-32 py-4 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-bold"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-[linear-gradient(135deg,#FFEB3B,#F57C00)] text-[#0a0a0a] font-black text-[10px] uppercase tracking-[0.2em] rounded-md shadow-[0_0_15px_rgba(255,235,59,0.1)] hover:shadow-[0_0_25px_rgba(255,235,59,0.4)] transition-all">
                  Unirse
                </button>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-2" />
            
            {/* Links Columns */}
            <div className="lg:col-span-2">
              <h4 className="font-black text-white/40 mb-8 text-[10px] uppercase tracking-[0.3em]">Mercado</h4>
              <ul className="flex flex-col gap-y-5">
                {['Explorar Todo', 'Últimos Drops', 'Cartas Graduadas', 'Cajas Selladas'].map(t => (
                  <li key={t}>
                    <Link to="/catalogo" className="text-[13px] font-semibold text-gray-500 hover:text-primary transition-all flex items-center gap-3 group/link">
                      <ChevronRight className="w-3 h-3 text-transparent group-hover/link:text-primary transition-colors group-hover/link:translate-x-1" />
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className="font-black text-white/40 mb-8 text-[10px] uppercase tracking-[0.3em]">Legal</h4>
              <ul className="flex flex-col gap-y-5 mb-12">
                {['Centro de Ayuda', 'Políticas', 'Privacidad', 'Términos'].map(s => (
                  <li key={s} className="text-[13px] font-semibold text-gray-500 hover:text-primary transition-all cursor-pointer flex items-center gap-3 group/link">
                    <ChevronRight className="w-3 h-3 text-transparent group-hover/link:text-primary transition-colors group-hover/link:translate-x-1" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials Column */}
            <div className="lg:col-span-2 flex items-center mt-8 lg:mt-0">
              <div className="flex gap-4">
                {['TW', 'IG', 'DC'].map((label) => (
                  <div key={label} className="w-10 h-10 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-1 bg-white/5 border border-white/10 hover:border-primary/50 text-gray-500 hover:text-white">
                    <span className="text-[10px] font-black">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-gray-700 text-[10px] font-bold tracking-[0.4em] uppercase">
              © {new Date().getFullYear()} TCG VAULT INC.
            </div>
            <div className="flex items-center gap-10">
              <span className="flex items-center gap-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest opacity-60">
                <Lock className="w-4 h-4" /> Encriptado
              </span>
              <span className="flex items-center gap-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest opacity-60">
                <Globe className="w-4 h-4" /> Global
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
