import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  ShoppingCart,
  ShieldCheck,
  Fingerprint,
  RefreshCcw,
  ArrowRight,
  ArrowUpRight,
  Battery,
  Activity,
  Trash2,
  Minus,
  Plus,
  Sparkles,
  LogIn,
  Package,
  X,
} from 'lucide-react';
import api from '../services/api';

const TYPE_BADGE = {
  Fire: { border: '#ef4444', text: '#ef4444', glow: 'rgba(239, 68, 68, 0.25)' },
  Water: { border: '#3b82f6', text: '#3b82f6', glow: 'rgba(59, 130, 246, 0.25)' },
  Grass: { border: '#22c55e', text: '#22c55e', glow: 'rgba(34, 197, 94, 0.25)' },
  Lightning: { border: '#eab308', text: '#eab308', glow: 'rgba(234, 179, 8, 0.25)' },
  Psychic: { border: '#a855f7', text: '#a855f7', glow: 'rgba(168, 85, 247, 0.25)' },
  Fighting: { border: '#f97316', text: '#f97316', glow: 'rgba(249, 115, 22, 0.25)' },
  Darkness: { border: '#6b7280', text: '#9ca3af', glow: 'rgba(107, 114, 128, 0.25)' },
  Metal: { border: '#94a3b8', text: '#cbd5e1', glow: 'rgba(148, 163, 184, 0.25)' },
  Dragon: { border: '#6366f1', text: '#818cf8', glow: 'rgba(99, 102, 241, 0.25)' },
  Colorless: { border: '#9ca3af', text: '#e5e7eb', glow: 'rgba(156, 163, 175, 0.25)' },
};

function AnimatedCounter({ from = 0, to, duration = 0.5, prefix = '', suffix = '' }) {
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

function CheckoutModal({ carrito, subtotal, totalItems, onConfirm, onClose, confirming }) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className="w-full max-w-3xl relative overflow-hidden border border-white/10"
          style={{
            borderRadius: '24px',
            background:
              'linear-gradient(180deg, rgba(10,10,14,0.96) 0%, rgba(6,6,10,0.98) 100%)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at top right, rgba(168,85,247,0.12) 0%, transparent 38%)',
            }}
          />

          <div className="relative z-10" style={{ padding: '28px' }}>
            <div
              className="flex items-start justify-between gap-4"
              style={{
                marginBottom: '24px',
                paddingBottom: '18px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center border border-purple-500/30 bg-purple-500/10"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '18px',
                    boxShadow: '0 0 20px rgba(168,85,247,0.12)',
                  }}
                >
                  <Fingerprint className="w-7 h-7 text-purple-400" />
                </div>

                <div>
                  <h2
                    className="text-white font-black"
                    style={{
                      margin: 0,
                      fontSize: '26px',
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Confirmar compra
                  </h2>
                  <p
                    className="text-gray-400"
                    style={{
                      marginTop: '8px',
                      marginBottom: 0,
                      fontSize: '14px',
                      lineHeight: '1.5',
                    }}
                  >
                    Revisá el resumen antes de autorizar la operación.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                disabled={confirming}
                type="button"
                className="text-gray-500 hover:text-white transition-colors"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div
                className="border border-white/8 bg-white/[0.02]"
                style={{
                  borderRadius: '18px',
                  padding: '18px',
                  minHeight: '290px',
                }}
              >
                <p
                  className="text-gray-500 uppercase font-black"
                  style={{
                    margin: 0,
                    marginBottom: '14px',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                  }}
                >
                  Productos
                </p>

                <div
                  className="space-y-3 overflow-y-auto pr-1"
                  style={{
                    maxHeight: '250px',
                    scrollbarWidth: 'thin',
                  }}
                >
                  {carrito.map((item) => (
                    <div
                      key={item.cardId}
                      className="flex items-center gap-3 border border-white/6 bg-black/20"
                      style={{
                        borderRadius: '14px',
                        padding: '10px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '58px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.12)',
                          background: 'rgba(255,255,255,0.04)',
                          flexShrink: 0,
                        }}
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-white/5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="text-white font-bold truncate"
                          style={{
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-gray-500 truncate"
                          style={{
                            marginTop: '4px',
                            marginBottom: 0,
                            fontSize: '12px',
                          }}
                        >
                          {item.type || 'Colorless'} · x{item.quantity}
                        </p>
                      </div>

                      <div
                        className="text-white font-black"
                        style={{
                          fontSize: '14px',
                          flexShrink: 0,
                        }}
                      >
                        ${((item.price || 0) * parseInt(item.quantity)).toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="border border-purple-500/20 bg-purple-500/[0.04]"
                style={{
                  borderRadius: '18px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    className="text-purple-300 uppercase font-black"
                    style={{
                      margin: 0,
                      marginBottom: '16px',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                    }}
                  >
                    Resumen final
                  </p>

                  <div className="space-y-4">
                    <div
                      className="flex items-end justify-between"
                      style={{
                        paddingBottom: '12px',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <span className="text-gray-400" style={{ fontSize: '14px' }}>
                        Unidades
                      </span>
                      <span className="text-white font-black" style={{ fontSize: '20px' }}>
                        {totalItems}
                      </span>
                    </div>

                    <div
                      className="flex items-end justify-between"
                      style={{
                        paddingBottom: '12px',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <span className="text-gray-400" style={{ fontSize: '14px' }}>
                        Productos distintos
                      </span>
                      <span className="text-white font-black" style={{ fontSize: '20px' }}>
                        {carrito.length}
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <span className="text-gray-300 font-semibold" style={{ fontSize: '15px' }}>
                        Total
                      </span>
                      <span
                        className="text-white font-black"
                        style={{
                          fontSize: '40px',
                          lineHeight: 1,
                          letterSpacing: '-0.04em',
                          textShadow: '0 0 16px rgba(168,85,247,0.22)',
                        }}
                      >
                        ${subtotal.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '28px' }}>
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={onConfirm}
                    disabled={confirming}
                    className="w-full text-white font-black transition-all disabled:opacity-60"
                    style={{
                      height: '52px',
                      borderRadius: '16px',
                      border: '1px solid rgba(168,85,247,0.45)',
                      background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)',
                      boxShadow: '0 14px 30px rgba(168,85,247,0.22)',
                      fontSize: '13px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {confirming ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                        Procesando...
                      </span>
                    ) : (
                      'Autorizar compra'
                    )}
                  </motion.button>

                  <button
                    onClick={onClose}
                    disabled={confirming}
                    type="button"
                    className="w-full text-gray-400 hover:text-white transition-colors"
                    style={{
                      marginTop: '10px',
                      height: '44px',
                      borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.02)',
                      fontSize: '12px',
                      fontWeight: 800,
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function CargoRow({ item, idx, onRemove, onChangeQty }) {
  const badge = TYPE_BADGE[item.type] || TYPE_BADGE.Colorless;
  const lineTotal = parseInt(item.quantity) * (item.price || 0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-10deg', '10deg']);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: idx * 0.035, type: 'spring', stiffness: 220, damping: 22 }}
      className="relative overflow-hidden border border-white/8 bg-white/[0.02] group"
      style={{
        borderRadius: '22px',
        boxShadow: '0 12px 28px rgba(0,0,0,0.22)',
      }}
    >
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: '3px',
          background: badge.border,
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${badge.glow}, transparent 30%)`,
        }}
      />
      <div
        className="flex flex-col lg:flex-row lg:items-center"
        style={{
          gap: '16px',
          padding: '18px',
          paddingLeft: '22px',
        }}
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 600,
            }}
            className="shrink-0 overflow-hidden border border-white/12"
            style={{
              width: '82px',
              height: '112px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-xl">?</div>
            )}
          </motion.div>

          <div className="min-w-0 flex-1">
            <h3
              className="text-white font-black truncate"
              style={{
                margin: 0,
                fontSize: '20px',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
              }}
            >
              {item.name}
            </h3>

            <div
              className="flex items-center gap-2 flex-wrap"
              style={{ marginTop: '10px' }}
            >
              <span
                style={{
                  padding: '6px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  border: `1px solid ${badge.border}`,
                  color: badge.text,
                  background: `${badge.border}15`,
                }}
              >
                {item.type}
              </span>

              <span
                className="text-gray-500"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                ID: {item.cardId.slice(0, 8)}
              </span>
            </div>

            <div
              className="text-gray-400"
              style={{
                marginTop: '12px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Precio unitario: ${(item.price || 0).toLocaleString('es-AR')}
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6"
          style={{
            minWidth: 'fit-content',
          }}
        >
          <div
            className="flex items-center border border-white/10 bg-black/25"
            style={{
              height: '46px',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => onChangeQty(item.cardId, -1)}
              className="flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              style={{
                width: '46px',
                height: '46px',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Minus className="w-4 h-4" />
            </motion.button>

            <div
              className="flex items-center justify-center"
              style={{
                width: '52px',
                height: '46px',
              }}
            >
              <motion.span
                key={item.quantity}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-white font-black"
                style={{ fontSize: '15px' }}
              >
                {item.quantity}
              </motion.span>
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => onChangeQty(item.cardId, 1)}
              className="flex items-center justify-center text-purple-400 hover:text-white transition-colors"
              style={{
                width: '46px',
                height: '46px',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <div
            className="text-right"
            style={{
              minWidth: '108px',
            }}
          >
            <span
              className="text-gray-500 uppercase"
              style={{
                display: 'block',
                fontSize: '10px',
                letterSpacing: '0.12em',
                marginBottom: '4px',
                fontWeight: 800,
              }}
            >
              Total
            </span>

            <div
              className="text-white font-black"
              style={{
                fontSize: '22px',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              <AnimatedCounter prefix="$" to={lineTotal} duration={0.3} />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(item.cardId)}
            type="button"
            className="text-red-400 hover:text-white transition-colors"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              border: '1px solid rgba(239,68,68,0.35)',
              background: 'rgba(239,68,68,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyCartState({ successMsg }) {
  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(168,85,247,0.12) 0%, transparent 35%), radial-gradient(circle at bottom left, rgba(217,70,239,0.08) 0%, transparent 32%)',
        }}
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-[620px] px-6"
      >
        <div
          className="border border-white/8 bg-white/[0.02] text-center"
          style={{
            borderRadius: '28px',
            padding: '40px 28px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="mx-auto flex items-center justify-center border border-purple-500/20 bg-purple-500/8"
            style={{
              width: '92px',
              height: '92px',
              borderRadius: '26px',
              marginBottom: '24px',
              boxShadow: '0 0 30px rgba(168,85,247,0.10)',
            }}
          >
            <ShoppingCart className="w-10 h-10 text-purple-400" />
          </div>

          <h2
            className="text-white font-black"
            style={{
              margin: 0,
              fontSize: '38px',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            Tu carrito está vacío
          </h2>

          <p
            className="text-gray-400"
            style={{
              marginTop: '14px',
              marginBottom: 0,
              fontSize: '16px',
              lineHeight: '1.6',
              maxWidth: '460px',
              marginInline: 'auto',
            }}
          >
            Todavía no agregaste cartas. Explorá el catálogo y empezá a armar tu selección.
          </p>

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '22px',
                marginInline: 'auto',
                maxWidth: '500px',
                borderRadius: '16px',
                padding: '14px 16px',
                border: successMsg.includes('ERROR')
                  ? '1px solid rgba(239,68,68,0.30)'
                  : '1px solid rgba(34,197,94,0.30)',
                background: successMsg.includes('ERROR')
                  ? 'rgba(239,68,68,0.08)'
                  : 'rgba(34,197,94,0.08)',
                color: successMsg.includes('ERROR') ? '#f87171' : '#4ade80',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              {successMsg}
            </motion.div>
          )}

          <div
            className="flex flex-col sm:flex-row justify-center"
            style={{
              gap: '12px',
              marginTop: '28px',
            }}
          >
            <Link
              to="/cartas"
              className="inline-flex items-center justify-center gap-2 text-white font-black"
              style={{
                height: '50px',
                paddingInline: '22px',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)',
                boxShadow: '0 16px 32px rgba(168,85,247,0.20)',
                fontSize: '13px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles className="w-4 h-4" />
              Ir al catálogo
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center text-gray-300 hover:text-white"
              style={{
                height: '50px',
                paddingInline: '22px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(255,255,255,0.03)',
                fontSize: '13px',
                fontWeight: 800,
              }}
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LoginRequiredState() {
  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(168,85,247,0.12) 0%, transparent 35%), radial-gradient(circle at bottom left, rgba(217,70,239,0.08) 0%, transparent 30%)',
        }}
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-[520px] px-6"
      >
        <div
          className="border border-white/8 bg-white/[0.02] text-center"
          style={{
            borderRadius: '28px',
            padding: '36px 28px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
          }}
        >
          <div
            className="mx-auto flex items-center justify-center border border-purple-500/20 bg-purple-500/8"
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              marginBottom: '22px',
            }}
          >
            <LogIn className="w-9 h-9 text-purple-300" />
          </div>

          <h2
            className="text-white font-black"
            style={{
              margin: 0,
              fontSize: '34px',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            Iniciá sesión
          </h2>

          <p
            className="text-gray-400"
            style={{
              marginTop: '12px',
              marginBottom: 0,
              fontSize: '16px',
              lineHeight: '1.6',
              maxWidth: '360px',
              marginInline: 'auto',
            }}
          >
            Para acceder a tu carrito guardado y continuar con la compra.
          </p>

          <div
            className="flex flex-col sm:flex-row justify-center"
            style={{
              gap: '12px',
              marginTop: '26px',
            }}
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-white font-black"
              style={{
                height: '48px',
                paddingInline: '22px',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #d8b4fe 0%, #c084fc 100%)',
                color: '#14091d',
                fontSize: '13px',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                boxShadow: '0 14px 28px rgba(192,132,252,0.18)',
              }}
            >
              <LogIn className="w-4 h-4" />
              Ingresar
            </Link>

            <Link
              to="/cartas"
              className="inline-flex items-center justify-center text-gray-300 hover:text-white"
              style={{
                height: '48px',
                paddingInline: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(255,255,255,0.03)',
                fontSize: '13px',
                fontWeight: 800,
              }}
            >
              Seguir explorando
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [authError, setAuthError] = useState(false);
  const [prevSubtotal, setPrevSubtotal] = useState(0);

  useEffect(() => {
    fetchCarrito();
  }, []);

  async function fetchCarrito() {
    setLoading(true);
    setAuthError(false);

    try {
      const { data } = await api.get('/compras/carrito');
      setCarrito(data.carrito || []);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        setAuthError(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(cardId) {
    setCarrito((c) => c.filter((i) => i.cardId !== cardId));
    try {
      await api.delete(`/compras/carrito/${cardId}`);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch {
      fetchCarrito();
    }
  }

  async function changeQty(cardId, delta) {
    const item = carrito.find((i) => i.cardId === cardId);
    if (!item) return;

    const next = parseInt(item.quantity) + delta;
    if (next <= 0) {
      removeItem(cardId);
      return;
    }

    const currentSub = carrito.reduce(
      (sum, i) => sum + parseInt(i.quantity) * (i.price || 0),
      0
    );
    setPrevSubtotal(currentSub);

    setCarrito((c) =>
      c.map((i) => (i.cardId === cardId ? { ...i, quantity: next } : i))
    );

    try {
      await api.post('/compras/carrito', { cardId, quantity: next });
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch {
      fetchCarrito();
    }
  }

  async function vaciarCarrito() {
    try {
      await api.delete('/compras/carrito');
      setCarrito([]);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err) {
      console.error(err);
      fetchCarrito();
    }
  }

  async function confirmarCompra() {
    setCompleting(true);
    try {
      const { data } = await api.post('/compras/completar');
      setCarrito([]);
      setShowModal(false);
      setSuccessMsg(`Compra completada. Total: $${data.totalPrice}`);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err) {
      setShowModal(false);
      setSuccessMsg(err.response?.data?.error || 'No se pudo completar la compra.');
    } finally {
      setCompleting(false);
    }
  }

  const totalItems = carrito.reduce((sum, i) => sum + parseInt(i.quantity), 0);
  const subtotal = carrito.reduce(
    (sum, i) => sum + parseInt(i.quantity) * (i.price || 0),
    0
  );

  const typeBreakdown = carrito.reduce((acc, item) => {
    const t = item.type || 'Colorless';
    acc[t] = (acc[t] || 0) + parseInt(item.quantity);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div
            className="rounded-full border-2 border-purple-400 border-t-transparent"
            style={{
              width: '58px',
              height: '58px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p
            className="text-purple-300"
            style={{
              marginTop: '18px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Cargando carrito...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (authError) {
    return <LoginRequiredState />;
  }

  if (carrito.length === 0) {
    return <EmptyCartState successMsg={successMsg} />;
  }

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(168,85,247,0.14) 0%, transparent 34%), radial-gradient(circle at bottom left, rgba(217,70,239,0.08) 0%, transparent 28%)',
        }}
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      {showModal && (
        <CheckoutModal
          carrito={carrito}
          subtotal={subtotal}
          totalItems={totalItems}
          onConfirm={confirmarCompra}
          onClose={() => !completing && setShowModal(false)}
          confirming={completing}
        />
      )}

      <div
        className="relative z-10 w-full mx-auto"
        style={{
          maxWidth: '1680px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '38px',
          paddingBottom: '90px',
        }}
      >
        <div
          className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_390px]"
          style={{
            gap: '28px',
            alignItems: 'start',
          }}
        >
          <div className="min-w-0">
            <header
              className="border-b border-white/8"
              style={{
                paddingBottom: '22px',
                marginBottom: '24px',
              }}
            >
              <div
                className="flex flex-col md:flex-row md:items-end md:justify-between"
                style={{ gap: '18px' }}
              >
                <div>
                  <div
                    className="flex items-center gap-3"
                    style={{ marginBottom: '10px' }}
                  >
                    <div
                      className="flex items-center justify-center border border-purple-500/20 bg-purple-500/10"
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                      }}
                    >
                      <ShoppingCart className="w-5 h-5 text-purple-300" />
                    </div>

                    <span
                      className="text-purple-300 uppercase font-black"
                      style={{
                        fontSize: '12px',
                        letterSpacing: '0.18em',
                      }}
                    >
                      Mi carrito
                    </span>
                  </div>

                  <h1
                    className="text-white font-black"
                    style={{
                      margin: 0,
                      fontSize: 'clamp(34px, 5vw, 58px)',
                      lineHeight: '0.95',
                      letterSpacing: '-0.05em',
                    }}
                  >
                    Resumen de compra
                  </h1>

                  <p
                    className="text-gray-400"
                    style={{
                      marginTop: '12px',
                      marginBottom: 0,
                      fontSize: '16px',
                      lineHeight: '1.6',
                      maxWidth: '760px',
                    }}
                  >
                    Revisá tus cartas, ajustá cantidades y completá la operación cuando
                    estés listo.
                  </p>
                </div>

                <div
                  className="flex flex-wrap"
                  style={{ gap: '10px' }}
                >
                  <Link
                    to="/cartas"
                    className="inline-flex items-center justify-center gap-2 text-gray-200 hover:text-white"
                    style={{
                      height: '46px',
                      paddingInline: '18px',
                      borderRadius: '15px',
                      border: '1px solid rgba(255,255,255,0.10)',
                      background: 'rgba(255,255,255,0.03)',
                      fontSize: '12px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.10em',
                    }}
                  >
                    <Package className="w-4 h-4" />
                    Seguir comprando
                  </Link>

                  <button
                    onClick={vaciarCarrito}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 text-red-400 hover:text-white"
                    style={{
                      height: '46px',
                      paddingInline: '18px',
                      borderRadius: '15px',
                      border: '1px solid rgba(239,68,68,0.30)',
                      background: 'rgba(239,68,68,0.08)',
                      fontSize: '12px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.10em',
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Vaciar carrito
                  </button>
                </div>
              </div>
            </header>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {carrito.map((item, idx) => (
                  <CargoRow
                    key={item.cardId}
                    item={item}
                    idx={idx}
                    onRemove={removeItem}
                    onChangeQty={changeQty}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="xl:sticky xl:top-[92px]">
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-white/8 bg-white/[0.03] overflow-hidden"
              style={{
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.28)',
              }}
            >
              <div
                className="relative"
                style={{
                  padding: '22px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  background:
                    'radial-gradient(circle at top right, rgba(168,85,247,0.12) 0%, transparent 46%)',
                }}
              >
                <div
                  className="flex items-center gap-3"
                  style={{ marginBottom: '14px' }}
                >
                  <div
                    className="flex items-center justify-center border border-purple-500/25 bg-purple-500/10"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                    }}
                  >
                    <Battery className="w-5 h-5 text-purple-300" />
                  </div>

                  <div>
                    <p
                      className="text-gray-400 uppercase font-black"
                      style={{
                        margin: 0,
                        fontSize: '11px',
                        letterSpacing: '0.16em',
                      }}
                    >
                      Resumen
                    </p>
                    <p
                      className="text-white font-black"
                      style={{
                        marginTop: '4px',
                        marginBottom: 0,
                        fontSize: '22px',
                        lineHeight: 1,
                      }}
                    >
                      Total actual
                    </p>
                  </div>
                </div>

                <div
                  className="text-white font-black"
                  style={{
                    fontSize: '48px',
                    lineHeight: 1,
                    letterSpacing: '-0.05em',
                    textShadow: '0 0 18px rgba(168,85,247,0.16)',
                  }}
                >
                  <AnimatedCounter prefix="$" from={prevSubtotal} to={subtotal} duration={0.55} />
                </div>
              </div>

              <div style={{ padding: '22px' }}>
                <div
                  className="grid grid-cols-2"
                  style={{
                    gap: '10px',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    className="border border-white/6 bg-black/20"
                    style={{
                      borderRadius: '16px',
                      padding: '14px',
                    }}
                  >
                    <span
                      className="text-gray-500 uppercase"
                      style={{
                        display: 'block',
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        marginBottom: '6px',
                        fontWeight: 800,
                      }}
                    >
                      Productos
                    </span>
                    <span className="text-white font-black" style={{ fontSize: '28px', lineHeight: 1 }}>
                      {carrito.length}
                    </span>
                  </div>

                  <div
                    className="border border-white/6 bg-black/20"
                    style={{
                      borderRadius: '16px',
                      padding: '14px',
                    }}
                  >
                    <span
                      className="text-gray-500 uppercase"
                      style={{
                        display: 'block',
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        marginBottom: '6px',
                        fontWeight: 800,
                      }}
                    >
                      Unidades
                    </span>
                    <span className="text-purple-300 font-black" style={{ fontSize: '28px', lineHeight: 1 }}>
                      {totalItems}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div
                    className="flex justify-between text-[11px] font-semibold text-gray-400"
                    style={{ marginBottom: '8px' }}
                  >
                    <span>Composición por tipo</span>
                    <span>{Object.keys(typeBreakdown).length} tipo(s)</span>
                  </div>

                  <div
                    className="flex overflow-hidden border border-white/8 bg-black/25"
                    style={{
                      height: '10px',
                      borderRadius: '999px',
                    }}
                  >
                    {Object.entries(typeBreakdown).map(([type, count]) => {
                      const badge = TYPE_BADGE[type] || TYPE_BADGE.Colorless;
                      const pct = (count / totalItems) * 100;
                      return (
                        <motion.div
                          key={type}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.65, ease: 'easeOut' }}
                          style={{ background: badge.border }}
                          title={`${type}: ${count}`}
                        />
                      );
                    })}
                  </div>

                  <div
                    className="flex flex-wrap"
                    style={{
                      gap: '8px',
                      marginTop: '12px',
                    }}
                  >
                    {Object.entries(typeBreakdown).map(([type, count]) => {
                      const badge = TYPE_BADGE[type] || TYPE_BADGE.Colorless;
                      return (
                        <span
                          key={type}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            color: badge.text,
                          }}
                        >
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '999px',
                              background: badge.border,
                              boxShadow: `0 0 8px ${badge.border}`,
                            }}
                          />
                          {type}
                          <span className="text-gray-500">({count})</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="border border-white/6 bg-black/20"
                  style={{
                    borderRadius: '18px',
                    padding: '16px',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: '10px' }}
                  >
                    <span className="text-gray-400" style={{ fontSize: '13px', fontWeight: 600 }}>
                      Subtotal
                    </span>
                    <span className="text-white font-bold" style={{ fontSize: '16px' }}>
                      ${subtotal.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: '10px' }}
                  >
                    <span className="text-gray-400" style={{ fontSize: '13px', fontWeight: 600 }}>
                      Envío
                    </span>
                    <span className="text-gray-500 font-semibold" style={{ fontSize: '14px' }}>
                      A calcular
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between"
                    style={{
                      paddingTop: '10px',
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span className="text-white font-semibold" style={{ fontSize: '14px' }}>
                      Total estimado
                    </span>
                    <span className="text-white font-black" style={{ fontSize: '22px' }}>
                      ${subtotal.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setShowModal(true)}
                  className="w-full text-white font-black"
                  style={{
                    height: '54px',
                    borderRadius: '17px',
                    border: '1px solid rgba(168,85,247,0.40)',
                    background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)',
                    boxShadow: '0 16px 32px rgba(168,85,247,0.18)',
                    fontSize: '13px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  Finalizar compra
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>

                <Link
                  to="/cartas"
                  className="w-full flex items-center justify-center gap-2 text-gray-300 hover:text-white"
                  style={{
                    marginTop: '10px',
                    height: '46px',
                    borderRadius: '15px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    fontSize: '12px',
                    fontWeight: 800,
                  }}
                >
                  Seguir explorando
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  );
}
