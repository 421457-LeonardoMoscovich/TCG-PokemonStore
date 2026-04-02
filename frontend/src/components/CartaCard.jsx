import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Flame, Droplets, Leaf, Zap, Brain,
  HandMetal, Moon, Cog, Rabbit, Star,
  Plus, Check, Heart, X
} from 'lucide-react';
import api from '../services/api';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

const TYPE = {
  Fire:      { border: 'var(--color-type-fire)',     glow: 'rgba(229,57,53,0.8)',    badge: '#7f1d1d', badgeBorder: '#ef4444', Icon: Flame,     iconColor: 'var(--color-type-fire)' },
  Water:     { border: 'var(--color-type-water)',    glow: 'rgba(30,136,229,0.8)',   badge: '#1e3a5f', badgeBorder: '#3b82f6', Icon: Droplets,  iconColor: 'var(--color-type-water)' },
  Grass:     { border: 'var(--color-type-grass)',    glow: 'rgba(67,160,71,0.8)',    badge: '#14532d', badgeBorder: '#22c55e', Icon: Leaf,      iconColor: 'var(--color-type-grass)' },
  Lightning: { border: 'var(--color-type-electric)', glow: 'rgba(255,235,59,0.8)',   badge: '#713f12', badgeBorder: '#eab308', Icon: Zap,       iconColor: 'var(--color-type-electric)' },
  Psychic:   { border: 'var(--color-type-psychic)',  glow: 'rgba(233,30,99,0.8)',    badge: '#4a1772', badgeBorder: '#a855f7', Icon: Brain,     iconColor: 'var(--color-type-psychic)' },
  Fighting:  { border: 'var(--color-type-fighting)', glow: 'rgba(245,124,0,0.8)',    badge: '#7c2d12', badgeBorder: '#f97316', Icon: HandMetal, iconColor: 'var(--color-type-fighting)' },
  Darkness:  { border: 'var(--color-type-darkness)', glow: 'rgba(96,125,139,0.8)',   badge: '#1f2937', badgeBorder: '#6b7280', Icon: Moon,      iconColor: 'var(--color-type-darkness)' },
  Metal:     { border: 'var(--color-type-metal)',    glow: 'rgba(144,164,174,0.8)',  badge: '#1e293b', badgeBorder: '#94a3b8', Icon: Cog,       iconColor: 'var(--color-type-metal)' },
  Dragon:    { border: 'var(--color-type-dragon)',   glow: 'rgba(124,77,255,0.8)',   badge: '#312e81', badgeBorder: '#6366f1', Icon: Rabbit,    iconColor: 'var(--color-type-dragon)' },
  Colorless: { border: 'var(--color-type-colorless)',glow: 'rgba(158,158,158,0.5)',  badge: '#374151', badgeBorder: '#9ca3af', Icon: Star,      iconColor: 'var(--color-type-colorless)' },
};
const DEFAULT_TYPE = TYPE.Colorless;

export default function CartaCard({ carta, onAddedToCart, showWishlist = true }) {
  if (!carta) return null;
  const t = TYPE[carta.type] || DEFAULT_TYPE;
  const TypeIcon = t.Icon;
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const { cart, refreshCart } = useCart();
  const cardInCart = cart.find(item => item.cardId === carta._id);

  /* ── 3D Tilt Logic via Framer Motion ── */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth the raw mouse values
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  // Map mouse [-0.5, 0.5] to rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  // Foil diagonal highlight mappings
  const shineOppacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.7]);
  const shineGradientPos = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "200%"]);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(carta._id);

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
    setHovered(true);
  }

  function handleMouseLeave() {
    setHovered(false);
    x.set(0);
    y.set(0);
  }

  async function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem('token')) { window.location.href = '/login'; return; }
    setAdding(true);
    try {
      await api.post('/compras/carrito', { cardId: carta._id, quantity: 1 });
      setAdded(true);
      onAddedToCart?.();
      window.dispatchEvent(new CustomEvent('cart-updated'));
      setTimeout(() => setAdded(false), 1800);
    } catch {
      // silence
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem('token')) return;
    setAdding(true);
    try {
      await api.delete(`/compras/carrito/${carta._id}`);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch {
      // silence
    } finally {
      setAdding(false);
    }
  }

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(carta._id);
  }

  function handleCardClick() {
    navigate(`/carta/${carta._id}`);
  }

  return (
    <div style={{ perspective: '1200px' }} className="w-full h-full relative z-10 hover:z-50 cursor-pointer" onClick={handleCardClick}>
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
          className="relative flex flex-col rounded-2xl overflow-hidden select-none bg-bg-surface border-2 transition-colors duration-300 h-full"
        >

          {/* Foil Shine Layer (Holographic effect over the whole card) */}
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge"
            style={{
              opacity: shineOppacity,
              background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, ${t.glow} 45%, transparent 50%)`,
              backgroundPosition: shineGradientPos,
              backgroundSize: "200% 200%",
            }}
          />

          {/* Wishlist Button */}
          {showWishlist && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: hovered || isFavorite ? 1 : 0 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`absolute top-3 right-3 z-40 p-2 rounded-full border border-white/10 ${isFavorite ? 'bg-red-600' : 'bg-black/60 backdrop-blur-md'}`}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart className="w-4 h-4 text-white" fill={isFavorite ? '#fff' : 'none'} />
            </motion.button>
          )}

          {/* Content Wrapper inside 3D space */}
          <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex-1 flex flex-col">
            
            {/* Image Area */}
            <div className="aspect-[3/4] w-full relative overflow-hidden bg-bg-elevated p-1.5 pb-0">
              <div className="w-full h-full relative rounded-t-xl overflow-hidden border border-white/10">
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
                
                {/* Green Overlay if in cart */}
                <AnimatePresence>
                  {cardInCart && !carta.isCollected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 bg-green-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2"
                    >
                      <motion.div 
                        initial={{ scale: 0.5 }} 
                        animate={{ scale: 1 }} 
                        className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40"
                      >
                        <Check className="w-6 h-6 text-white" strokeWidth={3} />
                      </motion.div>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white bg-green-600/80 px-2 py-0.5 rounded shadow-lg">
                        Agregado al carrito
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Info Area */}
            <div className="p-3.5 flex flex-col gap-2 bg-bg-elevated/90 backdrop-blur-xl border-t border-white/10 shrink-0">
              <p className="font-extrabold text-white text-[15px] leading-snug truncate" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                {carta.name}
              </p>
              
              <div className="flex items-center justify-between gap-1 mt-1">
                <span
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-black text-white shrink-0"
                  style={{ background: t.badge, border: `1px solid ${t.badgeBorder}`, boxShadow: `0 0 10px ${t.glow}` }}
                >
                  <TypeIcon className="w-3 h-3" style={{ color: t.iconColor }} />
                  {carta.type}
                </span>

                <div className="flex flex-col items-end shrink-0 leading-none">
                  <div className="flex items-center gap-2 mb-1">
                    {carta.price && (
                      <span className="text-[12px] font-black text-green-400 font-mono bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                        ${carta.price}
                      </span>
                    )}
                    {carta.hp ? (
                      <span className="flex items-center gap-1 text-[13px] font-black text-white font-mono" style={{ textShadow: "0 0 10px rgba(255,0,0,0.8)" }}>
                        HP {carta.hp}
                      </span>
                    ) : null}
                  </div>
                  {carta.rarity && (
                    <span className="text-[9px] uppercase tracking-widest text-[#94a3b8] mt-1 truncate max-w-[80px]">
                      {carta.rarity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Añadir al Carrito (Overlay) */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: hovered ? 0 : '100%', opacity: hovered ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 z-40 p-2"
          >
            {carta.isCollected ? (
              <div className="w-full py-3 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl flex items-center justify-center gap-2 bg-gray-800/90 text-gray-400 border border-gray-700 backdrop-blur-md cursor-not-allowed">
                <Check className="w-4 h-4 text-green-500" />
                En tu Colección
              </div>
            ) : cardInCart ? (
              <motion.button
                onClick={handleRemove}
                disabled={adding}
                className="w-full py-3 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl flex items-center justify-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 backdrop-blur-md transition-all sm:text-xs"
                whileTap={{ scale: 0.96 }}
              >
                {adding ? '...' : (
                  <>
                    <X className="w-4 h-4" />
                    Quitar del carrito
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                onClick={handleAdd}
                disabled={adding}
                className={`w-full py-3 text-xs font-black tracking-[0.2em] uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl backdrop-blur-md border ${added ? 'bg-green-500/90 text-white border-green-400' : 'bg-[#FFEB3B]/90 text-black border-[#F57C00]'}`}
                whileTap={{ scale: 0.96 }}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Listo
                  </>
                ) : adding ? (
                  '...'
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Añadir al carrito
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
          
        </motion.div>
    </div>
  );
}
