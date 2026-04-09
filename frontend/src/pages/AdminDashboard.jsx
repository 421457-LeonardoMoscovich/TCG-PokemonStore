import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import {
  LayoutDashboard, Users, ShoppingCart, 
  TrendingUp, Activity, Database,
  Layers, Hexagon, Shield
} from 'lucide-react';
import api from '../services/api';

/* ── Color Palette (matches TYPE_STYLES) ── */
const CHART_COLORS = ['#A855F7', '#1E88E5', '#43A047', '#FFEB3B', '#F57C00', '#607D8B', '#90A4AE', '#9E9E9E', '#00ACC1', '#C0CA33', '#8D6E63', '#EC4899'];

/* ── Animated Counter ── */
function AnimCounter({ to, prefix = '', suffix = '' }) {
  const ref = useRef();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ctrl = animate(0, to, {
      duration: 1.5, ease: 'easeOut',
      onUpdate(v) { node.textContent = `${prefix}${Math.round(v).toLocaleString('es-AR')}${suffix}`; },
    });
    return () => ctrl.stop();
  }, [to, prefix, suffix]);
  return <span ref={ref} />;
}

/* ── Custom HUD Tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#121214]/90 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/[0.08] backdrop-blur-3xl min-w-[140px] rounded-xl">
      <div className="flex items-center gap-2 mb-2 pb-1">
        <p className="text-xs text-gray-400 font-semibold">{label}</p>
      </div>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between items-center gap-4">
          <span className="text-[11px] text-gray-500 font-medium capitalize">{p.name}:</span>
          <span className="text-sm font-bold font-mono tracking-tight" style={{ color: p.color || '#fff' }}>
            {typeof p.value === 'number' ? p.value.toLocaleString('es-AR') : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Glass-Tech KPI Card ── */
function KPICard({ icon: Icon, label, value, prefix = '', suffix = '', delay = 0, trend = '+0.0%', variant = 'purple' }) {
  const isBlue = variant === 'blue';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={isBlue ? 'admin-kpi-blue group' : 'admin-kpi group'}
    >
      <div className="flex justify-between items-start mb-5">
        <div className={`p-3 rounded-xl ${isBlue
          ? 'bg-blue-500/10 border border-blue-500/20'
          : 'bg-purple-500/10 border border-purple-500/20'}`}
        >
          <Icon className={`w-5 h-5 ${isBlue ? 'text-blue-400' : 'text-purple-400'}`} />
        </div>
        <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <TrendingUp className="w-2.5 h-2.5" /> {trend}
        </span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
      <h3 className="text-5xl font-black text-white font-mono tracking-tight leading-none">
        <AnimCounter to={value || 0} prefix={prefix} suffix={suffix} />
      </h3>
    </motion.div>
  );
}

/* ── HUD Section ── */
function HUDSection({ title, subtitle, children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`admin-section flex flex-col ${className}`}
    >
      <div className="mb-7 shrink-0 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs mt-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0 relative">
        {children}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
    MAIN COMPONENT
/* ═══════════════════════════════════════════ */

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [hiddenTypes, setHiddenTypes] = useState(new Set());
  const toggleHidden = (set, setter, item) => {
    const next = new Set(set);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setter(next);
  };

  const filteredTypes = useMemo(() => stats?.cartasPorTipo?.filter(t => !hiddenTypes.has(t.name)) || [], [stats, hiddenTypes]);

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

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 relative animate-spin">
          <Hexagon className="w-full h-full text-primary" />
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest animate-pulse">Initializing Data...</p>
    </div>
  );

  if (!stats) return <div className="text-red-500 min-h-full flex items-center justify-center font-semibold text-xl">Critical: Dashboard Initialization Failed</div>;

  const { kpis, cartasPorTipo, revenueByType, discountSuggestions, comprasRecientes } = stats;

  return (
    <div className="space-y-10 pb-16 w-full text-white">

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard icon={Database} label="Total Vault Value" value={kpis.valorTotal} prefix="$" delay={0.05} trend="+12.5%" />
        <KPICard icon={Layers} label="Total Cards" value={kpis.totalCartas} delay={0.1} trend="+4.1%" variant="blue" />
        <KPICard icon={Users} label="Active Users" value={kpis.totalUsuarios} delay={0.15} trend="+8.2%" />
        <KPICard icon={ShoppingCart} label="Net Orders" value={kpis.totalCompras} delay={0.2} trend="+2.4%" variant="blue" />
      </div>

      {/* Primary Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Sales by Type — Tactical Bar Chart */}
        <HUDSection title="Revenue Analytics" subtitle="Transaction volume across card types" className="lg:col-span-2" delay={0.2}>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByType} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickFormatter={val => `$${val}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar
                  dataKey="value"
                  name="Revenue"
                  radius={[8, 8, 0, 0]}
                  fill="url(#barGrad)"
                  maxBarSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </HUDSection>

        {/* Distribución por Tipo — Modernized Donut */}
        <HUDSection title="Entity Distribution" subtitle="By element type" delay={0.3}>
          <div className="flex-1 relative flex items-center justify-center min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredTypes}
                  cx="50%" cy="50%"
                  innerRadius="65%" outerRadius="85%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="rgba(30, 30, 35, 0.8)"
                  strokeWidth={2}
                  animationDuration={1000}
                >
                  {filteredTypes.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[cartasPorTipo.findIndex(t => t.name === entry.name) % CHART_COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Info HUD */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Types</span>
              <span className="text-2xl font-black text-white font-mono">{cartasPorTipo.length}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {cartasPorTipo.map((t, i) => (
              <button
                key={i}
                onClick={() => toggleHidden(hiddenTypes, setHiddenTypes, t.name)}
                className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all ${hiddenTypes.has(t.name) ? 'opacity-30 bg-white/[0.02]' : 'text-gray-300 bg-white/[0.08] hover:bg-white/[0.12]'}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {t.name}
              </button>
            ))}
          </div>
        </HUDSection>

      </div>

      {/* Secondary Data Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Digital Ledger Trace — Transaction Hub */}
        <HUDSection title="Recent Transactions" subtitle="Latest completed orders" delay={0.4}>
          <div className="w-full h-full overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
            <div className="space-y-3 pb-4">
            {comprasRecientes.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-transparent rounded-xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                          <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{c.userId?.email || 'Anonymous Transact'}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">#{c._id.slice(-8).toUpperCase()} • {Array.isArray(c.items) ? c.items.length : Object.values(c.items || {}).reduce((a, b) => a + b, 0)} Items</p>
                      </div>
                  </div>
                  <div className="text-right shrink-0">
                      <p className="font-black text-white font-mono">${c.totalPrice?.toFixed(2)}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">Completed</span>
                  </div>
              </div>
            ))}
            </div>
          </div>
        </HUDSection>

        {/* Smart Deals — High Tech Advisory */}
        <HUDSection title="AI Advisory: Smart Deals" subtitle="Discounts suggested by data patterns" delay={0.5}>
            <div className="absolute inset-0 w-full h-full overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              <div className="space-y-3 pb-4">
              {discountSuggestions?.map((sugg, i) => (
                <div key={sugg._id} className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col xl:flex-row gap-4 items-start xl:items-center group">
                  <div className="w-12 h-16 shrink-0 bg-[#050505] rounded-[4px] border border-white/[0.06] overflow-hidden relative shadow-inner">
                    <img src={sugg.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{sugg.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono line-through text-gray-500">${sugg.currentPrice}</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">${(sugg.currentPrice * sugg.suggestedDiscount).toFixed(2)}</span>
                        <div className="px-1.5 py-0.5 rounded-[4px] bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">-{Math.round((1 - sugg.suggestedDiscount) * 100)}%</div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3" /> {sugg.reason}
                      </p>
                  </div>
                  <button 
                    onClick={async () => {
                      const newPrice = Math.max(5, sugg.currentPrice * sugg.suggestedDiscount);
                      await api.put(`/admin/cartas/${sugg._id}`, { price: newPrice });
                      window.location.reload();
                    }}
                    className="w-full xl:w-auto px-4 py-2 text-sm font-semibold rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black transition-all text-center"
                  >
                    Apply
                  </button>
                </div>
              ))}
              {(!discountSuggestions || discountSuggestions.length === 0) && (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Shield className="w-8 h-8 text-white/10 mb-3" />
                  <p className="text-sm font-medium text-gray-500">Market equilibrium achieved.</p>
                  <p className="text-xs text-gray-600 mt-1">No AI advisories at this time.</p>
                </div>
              )}
              </div>
            </div>
        </HUDSection>

      </div>
    </div>
  );
}
