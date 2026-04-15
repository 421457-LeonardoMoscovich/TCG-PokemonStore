import { useState, useRef, memo, useCallback } from 'react';
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

function CartaCard({ carta, onAddedToCart, showWishlist = true }) {
  // 1. Hooks always at the top
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);
  const shineOppacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.7]);
  const shineGradientPos = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "200%"]);

  // 2. Computed values
  const t = TYPE[carta?.type] || DEFAULT_TYPE;
  const TypeIcon = t.Icon;
  const isFavorite = isInWishlist(carta?._id);
  const cardInCart = cart?.find(item => item.cardId === carta?._id);

  // 3. Handlers
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    
    // ONLY update state if it actually changes!
    setHovered(prev => prev ? prev : true);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleAdd = useCallback(async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!localStorage.getItem('token')) { window.location.href = '/login'; return; }
    if (!carta?._id || adding) return;
    setAdding(true);
    try {
      await api.post('/compras/carrito', { cardId: carta._id, quantity: 1 });
      setAdded(true);
      onAddedToCart?.();
      window.dispatchEvent(new CustomEvent('cart-updated'));
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error('Add error:', err);
    } finally {
      setAdding(false);
    }
  }, [carta?._id, adding, onAddedToCart]);

  const handleRemove = useCallback(async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!carta?._id || adding) return;
    setAdding(true);
    try {
      await api.delete(`/compras/carrito/${carta._id}`);
      onAddedToCart?.();
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err) {
      console.error('Remove error:', err);
    } finally {
      setAdding(false);
    }
  }, [carta?._id, adding, onAddedToCart]);

  const handleWishlist = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (carta?._id) toggleWishlist(carta._id);
  }, [carta?._id, toggleWishlist]);

  const handleCardClick = useCallback(() => {
    if (carta?._id) navigate(`/carta/${carta._id}`);
  }, [navigate, carta?._id]);

  // 4. Balanced Render Plan (No early returns)
  const content = !carta ? (
    <div className="w-full aspect-[1/1.4] bg-white/5 animate-pulse rounded-lg border border-white/10" />
  ) : (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        rotateX, rotateY,
        transformStyle: "preserve-3d",
        boxShadow: hovered
          ? `0 25px 50px -12px ${t.glow}, 0 0 20px -2px ${t.glow}`
          : '0 4px 15px rgba(0,0,0,0.6)',
        borderColor: hovered ? t.border : 'rgba(255,255,255,0.06)',
      }}
      animate={{ scale: hovered ? 1.05 : 1, y: hovered ? -8 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative flex flex-col rounded-lg overflow-hidden select-none bg-bg-surface border-2 h-full cursor-pointer"
    >
      {/* Foil Shine */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge"
        style={{
          opacity: shineOppacity,
          background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, ${t.glow} 45%, transparent 50%)`,
          backgroundPosition: shineGradientPos,
          backgroundSize: "200% 200%",
        }}
      />

      {/* Wishlist */}
      {showWishlist && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1, opacity: hovered || isFavorite ? 1 : 0.82 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-40 p-3 rounded-full border border-white/10 ${isFavorite ? 'bg-red-600' : 'bg-black/60 backdrop-blur-md'}`}
        >
          <Heart className="w-4 h-4 text-white" fill={isFavorite ? '#fff' : 'none'} />
        </motion.button>
      )}

      {/* Content */}
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex-1 flex flex-col">
        <div className="aspect-[3/4] w-full relative overflow-hidden bg-bg-elevated p-2 pb-0">
          <div className="w-full h-full relative rounded-t-xl overflow-hidden border border-white/10">
            {carta.image ? (
              <motion.img
                src={carta.image}
                alt={carta.name}
                className="w-full h-full object-cover"
                animate={{ scale: hovered ? 1.08 : 1 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/50">
                <TypeIcon className="w-16 h-16 opacity-20" style={{ color: t.iconColor }} />
              </div>
            )}
            
            <AnimatePresence>
              {cardInCart && !carta.isCollected && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-green-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-white bg-green-600/80 px-2 py-0.5 rounded">Carrito</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3 bg-bg-elevated/90 backdrop-blur-xl border-t border-white/10 shrink-0">
          <p className="font-extrabold text-white text-[15px] truncate">{carta.name}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-md font-black text-white"
              style={{ background: t.badge, border: `1px solid ${t.badgeBorder}`, boxShadow: `0 0 10px ${t.glow}` }}
            >
              <TypeIcon className="w-3 h-3" style={{ color: t.iconColor }} />
              {carta.type}
            </span>
            <div className="flex items-center gap-2">
               {carta.price && <span className="text-[12px] font-black text-green-400 font-mono">${carta.price}</span>}
               {carta.hp && <span className="text-[13px] font-black text-white font-mono">HP {carta.hp}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Overlay */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: hovered ? 0 : '100%', opacity: hovered ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 z-40 p-3"
      >
        {carta.isCollected ? (
          <div className="w-full py-3 text-[10px] font-black uppercase rounded-md flex items-center justify-center gap-3 bg-gray-800/90 text-gray-400 border border-gray-700 backdrop-blur-md">
            <Check className="w-4 h-4 text-green-500" /> Colección
          </div>
        ) : cardInCart ? (
          <button onClick={handleRemove} className="w-full py-3 text-[10px] font-black uppercase rounded-md flex items-center justify-center gap-3 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 backdrop-blur-md">
             {adding ? '...' : <><X className="w-4 h-4" /> Quitar</>}
          </button>
        ) : (
          <button onClick={handleAdd} className={`w-full py-3 text-xs font-black uppercase rounded-md flex items-center justify-center gap-3 border shadow-xl backdrop-blur-md ${added ? 'bg-green-500/95 text-white border-green-400' : 'bg-[#FFEB3B]/95 text-black border-[#F57C00]'}`}>
            {added ? 'Listo' : adding ? '...' : <><Plus className="w-4 h-4" /> Añadir</>}
          </button>
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="perspective-1000 w-full h-full">
      {content}
    </div>
  );
}

export default memo(CartaCard);
