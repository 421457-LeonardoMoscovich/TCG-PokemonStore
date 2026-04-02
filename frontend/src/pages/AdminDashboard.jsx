import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';
import {
  LayoutDashboard, CreditCard, Users, ShoppingCart, DollarSign,
  Heart, TrendingUp, Package, ChevronRight, Shield
} from 'lucide-react';
import api from '../services/api';

/* ── Color Palette (matches TYPE_STYLES) ── */
const TYPE_COLORS = {
  Fire: '#E53935', Water: '#1E88E5', Grass: '#43A047', Lightning: '#FFEB3B',
  Psychic: '#E91E63', Fighting: '#F57C00', Darkness: '#607D8B',
  Metal: '#90A4AE', Dragon: '#7C4DFF', Colorless: '#9E9E9E',
};
const CHART_COLORS = ['#E53935', '#1E88E5', '#43A047', '#FFEB3B', '#E91E63', '#F57C00', '#607D8B', '#7C4DFF', '#90A4AE', '#9E9E9E', '#FF6F00', '#00ACC1'];

/* ── Animated Counter ── */
function AnimCounter({ to, prefix = '', suffix = '' }) {
  const ref = useRef();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ctrl = animate(0, to, {
      duration: 1.8, ease: 'easeOut',
      onUpdate(v) { node.textContent = `${prefix}${Math.round(v).toLocaleString('es-AR')}${suffix}`; },
    });
    return () => ctrl.stop();
  }, [to, prefix, suffix]);
  return <span ref={ref}>0</span>;
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color || '#fff' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('es-AR') : p.value}
        </p>
      ))}
    </div>
  );
}

/* ── KPI Card ── */
function KPICard({ icon: Icon, label, value, color, prefix = '', suffix = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 25 }}
      className="relative rounded-2xl p-6 overflow-hidden border border-white/[0.06] backdrop-blur-xl"
      style={{
        background: `linear-gradient(135deg, ${color}12, rgba(255,255,255,0.02))`,
        boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${color}10`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">{label}</span>
        </div>
        <p className="text-3xl font-black text-white tracking-tight">
          <AnimCounter to={value} prefix={prefix} suffix={suffix} />
        </p>
      </div>
    </motion.div>
  );
}

/* ── Section Wrapper ── */
function Section({ title, icon: Icon, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={`rounded-2xl border border-white/[0.06] p-6 backdrop-blur-xl ${className}`}
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' }}
    >
      <div className="flex items-center gap-3 mb-6">
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
    MAIN COMPONENT
═══════════════════════════════════════════ */

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
          <LayoutDashboard className="w-12 h-12 text-[#7C4DFF] opacity-60" />
        </motion.div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-red-400">
        Error al cargar estadísticas
      </div>
    );
  }

  const { kpis, cartasPorTipo, cartasPorRareza, cartasPorSet, ingresosPorMes, topWishlist, usuariosRecientes, comprasRecientes } = stats;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20vh] -left-[10vw] w-[60vw] h-[60vh] rounded-full blur-[180px] bg-[#7C4DFF]/10" />
        <div className="absolute top-[40vh] right-0 w-[40vw] h-[40vh] rounded-full blur-[140px] bg-[#E91E63]/8" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-white/[0.06] pb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C4DFF] to-[#E91E63] flex items-center justify-center shadow-lg shadow-[#7C4DFF]/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Panel de Admin</h1>
              <p className="text-gray-500 text-sm mt-1">Pokémon TCG Vault — Control Center</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/cartas" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7C4DFF]/15 border border-[#7C4DFF]/30 text-[#7C4DFF] font-bold text-sm hover:bg-[#7C4DFF]/25 transition-colors">
              <CreditCard className="w-4 h-4" /> Gestionar Cartas <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/admin/usuarios" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E91E63]/15 border border-[#E91E63]/30 text-[#E91E63] font-bold text-sm hover:bg-[#E91E63]/25 transition-colors">
              <Users className="w-4 h-4" /> Gestionar Usuarios <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <KPICard icon={CreditCard} label="Total Cartas" value={kpis.totalCartas} color="#7C4DFF" delay={0} />
          <KPICard icon={Users} label="Usuarios" value={kpis.totalUsuarios} color="#1E88E5" delay={0.08} />
          <KPICard icon={ShoppingCart} label="Compras" value={kpis.totalCompras} color="#43A047" delay={0.16} />
          <KPICard icon={DollarSign} label="Ingresos" value={kpis.valorTotal} color="#FFEB3B" prefix="$" delay={0.24} />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Cartas por Tipo — Donut */}
          <Section title="Distribución por Tipo" icon={Package}>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cartasPorTipo}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {cartasPorTipo.map((entry, i) => (
                      <Cell key={i} fill={TYPE_COLORS[entry.name] || CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {cartasPorTipo.map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 px-2 py-1 rounded-full border border-white/5 bg-white/[0.02]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_COLORS[t.name] || CHART_COLORS[i] }} />
                  {t.name} ({t.value})
                </span>
              ))}
            </div>
          </Section>

          {/* Cartas por Rareza — Bar */}
          <Section title="Distribución por Rareza" icon={TrendingUp}>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cartasPorRareza} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} width={80} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Cartas" radius={[0, 8, 8, 0]} maxBarSize={28}>
                    {cartasPorRareza.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Ingresos por Mes — Area Chart */}
          <Section title="Ingresos por Mes" icon={DollarSign}>
            {ingresosPorMes.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ingresosPorMes} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="total" name="Ingresos" stroke="#7C4DFF" strokeWidth={2.5} fill="url(#incomeGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
                No hay datos de compras aún
              </div>
            )}
          </Section>

          {/* Top Wishlist — Bar Chart */}
          <Section title="Cartas Más Deseadas (Wishlist)" icon={Heart}>
            {topWishlist.length > 0 ? (
              <div className="space-y-3">
                {topWishlist.map((card, i) => (
                  <motion.div
                    key={card._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-xs font-black text-gray-500 w-6 text-center">#{i + 1}</span>
                    {card.image && (
                      <img src={card.image} alt={card.name} className="w-10 h-14 object-cover rounded-lg border border-white/10" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{card.name || 'Desconocida'}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{card.type} · {card.rarity}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-red-400" fill="currentColor" />
                      <span className="text-sm font-black text-red-400">{card.count}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
                No hay datos de wishlist aún
              </div>
            )}
          </Section>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Sets — Horizontal Bar */}
          <Section title="Top Sets" icon={Package} className="lg:col-span-1">
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cartasPorSet} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 9 }} width={120} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Cartas" radius={[0, 6, 6, 0]} fill="#7C4DFF" maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* Usuarios Recientes */}
          <Section title="Usuarios Recientes" icon={Users} className="lg:col-span-1">
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
              {usuariosRecientes.map((u, i) => (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C4DFF] to-[#E91E63] flex items-center justify-center text-[10px] font-black text-white shrink-0">
                    {(u.username || u.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{u.username || 'Sin nombre'}</p>
                    <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-[#7C4DFF]/20 text-[#7C4DFF] border border-[#7C4DFF]/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                    {u.role || 'user'}
                  </span>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Compras Recientes */}
          <Section title="Compras Recientes" icon={ShoppingCart} className="lg:col-span-1">
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
              {comprasRecientes.length > 0 ? comprasRecientes.map((c, i) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">
                      {Array.isArray(c.items) ? c.items.length : Object.values(c.items || {}).reduce((a, b) => a + b, 0)} {c.type === 'scratch' ? 'Scratch' : 'carta(s)'}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {c.purchasedAt ? new Date(c.purchasedAt).toLocaleDateString('es-AR') : 'Sin fecha'}
                    </p>
                  </div>
                  <span className="text-sm font-black text-green-400">${c.totalPrice || 0}</span>
                </motion.div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-8">Sin compras aún</p>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
