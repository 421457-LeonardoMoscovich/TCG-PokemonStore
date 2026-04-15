import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, animate } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import {
  Users, ShoppingCart,
  TrendingUp, Activity, Database,
  Layers, Hexagon, Shield
} from 'lucide-react';
import api from '../services/api';

/* ── Color Palette ── */
const CHART_COLORS = [
  '#A855F7', '#1E88E5', '#43A047', '#FFEB3B',
  '#F57C00', '#607D8B', '#90A4AE', '#9E9E9E',
  '#00ACC1', '#C0CA33', '#8D6E63', '#EC4899'
];

/* ── Animated Counter ── */
function AnimCounter({ to, prefix = '', suffix = '' }) {
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const ctrl = animate(0, to, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate(v) {
        node.textContent = `${prefix}${Math.round(v).toLocaleString('es-AR')}${suffix}`;
      },
    });

    return () => ctrl.stop();
  }, [to, prefix, suffix]);

  return <span ref={ref} />;
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const title = label || payload[0]?.payload?.name || payload[0]?.name || 'Detalle';

  return (
    <div
      className="backdrop-blur-3xl"
      style={{
        background: 'rgba(12, 14, 20, 0.92)',
        padding: '14px 16px',
        minWidth: '160px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 18px 48px rgba(0,0,0,0.55), 0 0 20px rgba(168,85,247,0.10)',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div
        className="flex items-center gap-2"
        style={{
          marginBottom: '10px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 700,
            margin: 0,
          }}
        >
          {title}
        </p>
      </div>

      {payload.map((p, i) => (
        <div
          key={i}
          className="flex justify-between items-center"
          style={{ gap: '18px', marginTop: i === 0 ? 0 : '6px' }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {p.name === 'value' ? 'Cantidad' : p.name}:
          </span>

          <span
            style={{
              fontSize: '14px',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '-0.02em',
              color: p.color || '#fff',
            }}
          >
            {typeof p.value === 'number' ? p.value.toLocaleString('es-AR') : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Gaming KPI Card ── */
function KPICard({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  delay = 0,
  trend = '+0.0%',
  variant = 'purple',
}) {
  const isBlue = variant === 'blue';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden"
      style={{
        borderRadius: '24px',
        padding: '24px 24px 22px 24px',
        minHeight: '188px',
        background: isBlue
          ? 'linear-gradient(180deg, rgba(10,22,40,0.94) 0%, rgba(8,12,20,0.98) 100%)'
          : 'linear-gradient(180deg, rgba(24,12,40,0.94) 0%, rgba(10,10,18,0.98) 100%)',
        border: isBlue
          ? '1px solid rgba(30,136,229,0.26)'
          : '1px solid rgba(168,85,247,0.26)',
        boxShadow: isBlue
          ? '0 12px 36px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 26px rgba(30,136,229,0.10)'
          : '0 12px 36px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 26px rgba(168,85,247,0.10)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isBlue
            ? 'radial-gradient(circle at top right, rgba(30,136,229,0.12), transparent 35%)'
            : 'radial-gradient(circle at top right, rgba(168,85,247,0.14), transparent 35%)',
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '1px',
          background: isBlue
            ? 'linear-gradient(90deg, transparent, rgba(30,136,229,0.55), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(168,85,247,0.55), transparent)',
        }}
      />

      <div className="relative z-10">
        <div
          className="flex justify-between items-start"
          style={{ marginBottom: '22px' }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: isBlue
                ? 'linear-gradient(135deg, rgba(30,136,229,0.18), rgba(30,136,229,0.06))'
                : 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(168,85,247,0.06))',
              border: isBlue
                ? '1px solid rgba(30,136,229,0.20)'
                : '1px solid rgba(168,85,247,0.20)',
              boxShadow: isBlue
                ? '0 0 18px rgba(30,136,229,0.14)'
                : '0 0 18px rgba(168,85,247,0.14)',
            }}
          >
            <Icon
              style={{
                width: '22px',
                height: '22px',
                color: isBlue ? '#4EA7FF' : '#C084FC',
              }}
            />
          </div>

          <span
            className="flex items-center gap-1"
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#34D399',
              background: 'rgba(16,185,129,0.10)',
              padding: '6px 10px',
              borderRadius: '999px',
              border: '1px solid rgba(16,185,129,0.18)',
              boxShadow: '0 0 14px rgba(16,185,129,0.10)',
            }}
          >
            <TrendingUp style={{ width: '12px', height: '12px' }} />
            {trend}
          </span>
        </div>

        <p
          style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            marginBottom: '12px',
            color: 'rgba(255,255,255,0.34)',
          }}
        >
          {label}
        </p>

        <h3
          style={{
            fontSize: 'clamp(3rem, 3.8vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1,
            color: '#fff',
            fontFamily: 'monospace',
            letterSpacing: '-0.05em',
            textShadow: isBlue
              ? '0 0 16px rgba(30,136,229,0.10)'
              : '0 0 16px rgba(168,85,247,0.10)',
          }}
        >
          <AnimCounter to={value || 0} prefix={prefix} suffix={suffix} />
        </h3>
      </div>
    </motion.div>
  );
}

/* ── Gaming Section ── */
function HUDSection({ title, subtitle, children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden flex flex-col ${className}`}
      style={{
        borderRadius: '28px',
        padding: '26px 26px 24px 26px',
        background: 'linear-gradient(180deg, rgba(10,12,20,0.96) 0%, rgba(7,8,14,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.03)',
        minHeight: '100%',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(168,85,247,0.05), transparent 28%), radial-gradient(circle at left bottom, rgba(30,136,229,0.04), transparent 30%)',
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.25), transparent)',
        }}
      />

      <div
        className="relative z-10 shrink-0 flex justify-between items-start"
        style={{
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            {title}
          </h3>

          {subtitle && (
            <p
              style={{
                fontSize: '13px',
                marginTop: '8px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.34)',
                marginBottom: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </motion.div>
  );
}

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

  const filteredTypes = useMemo(
    () => stats?.cartasPorTipo?.filter((t) => !hiddenTypes.has(t.name)) || [],
    [stats, hiddenTypes]
  );

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
      <div
        className="h-full flex flex-col items-center justify-center"
        style={{ gap: '22px', minHeight: '60vh' }}
      >
        <div
          className="relative animate-spin"
          style={{
            width: '52px',
            height: '52px',
            color: '#A855F7',
            filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.35))',
          }}
        >
          <Hexagon className="w-full h-full" />
        </div>
        <p
          className="uppercase animate-pulse"
          style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.40)',
          }}
        >
          Initializing Data...
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div
        className="min-h-full flex items-center justify-center"
        style={{
          color: '#ef4444',
          fontWeight: 700,
          fontSize: '22px',
        }}
      >
        Critical: Dashboard Initialization Failed
      </div>
    );
  }

  const { kpis, cartasPorTipo, revenueByType, discountSuggestions, comprasRecientes } = stats;

  return (
    <div
      className="w-full text-white"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        paddingTop: '4px',
        paddingBottom: '54px',
      }}
    >
      {/* KPI Matrix */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        style={{
          gap: '18px',
          marginBottom: '4px',
        }}
      >
        <KPICard
          icon={Database}
          label="Total Vault Value"
          value={kpis.valorTotal}
          prefix="$"
          delay={0.05}
          trend="+12.5%"
        />
        <KPICard
          icon={Layers}
          label="Total Cards"
          value={kpis.totalCartas}
          delay={0.1}
          trend="+4.1%"
          variant="blue"
        />
        <KPICard
          icon={Users}
          label="Active Users"
          value={kpis.totalUsuarios}
          delay={0.15}
          trend="+8.2%"
        />
        <KPICard
          icon={ShoppingCart}
          label="Net Orders"
          value={kpis.totalCompras}
          delay={0.2}
          trend="+2.4%"
          variant="blue"
        />
      </div>

      {/* Primary Analytics Matrix */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3"
        style={{
          gap: '22px',
          alignItems: 'stretch',
        }}
      >
        <HUDSection
          title="Revenue Analytics"
          subtitle="Transaction volume across card types"
          className="lg:col-span-2"
          delay={0.2}
        >
          <div
            className="w-full"
            style={{
              height: '360px',
              paddingTop: '4px',
              paddingBottom: '2px',
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByType} margin={{ top: 12, right: 12, left: -16, bottom: 4 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#1E88E5" stopOpacity={0.45} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickFormatter={(val) => `$${val}`}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />

                <Bar
                  dataKey="value"
                  name="Revenue"
                  radius={[10, 10, 0, 0]}
                  fill="url(#barGrad)"
                  maxBarSize={42}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </HUDSection>

        <HUDSection
          title="Entity Distribution"
          subtitle="By element type"
          delay={0.3}
        >
          <div
            className="flex-1 relative flex items-center justify-center"
            style={{
              minHeight: '280px',
              paddingTop: '8px',
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="84%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="rgba(20, 20, 26, 0.95)"
                  strokeWidth={3}
                  animationDuration={1000}
                >
                  {filteredTypes.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        CHART_COLORS[
                          cartasPorTipo.findIndex((t) => t.name === entry.name) % CHART_COLORS.length
                        ]
                      }
                      className="cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  allowEscapeViewBox={{ x: true, y: true }}
                  position={{ x: 12, y: 12 }}
                  wrapperStyle={{
                    zIndex: 60,
                    pointerEvents: 'none',
                    outline: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
              <div
                style={{
                  width: '112px',
                  height: '112px',
                  borderRadius: '999px',
                  background: 'rgba(8,10,16,0.88)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 0 18px rgba(168,85,247,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.38)',
                    letterSpacing: '0.12em',
                  }}
                >
                  Types
                </span>
                <span
                  style={{
                    fontSize: '42px',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: '#fff',
                    fontFamily: 'monospace',
                    letterSpacing: '-0.04em',
                    marginTop: '6px',
                  }}
                >
                  {cartasPorTipo.length}
                </span>
              </div>
            </div>
          </div>

          <div
            className="flex flex-wrap justify-center"
            style={{
              gap: '8px',
              marginTop: '14px',
              paddingTop: '6px',
            }}
          >
            {cartasPorTipo.map((t, i) => {
              const hidden = hiddenTypes.has(t.name);

              return (
                <button
                  key={i}
                  onClick={() => toggleHidden(hiddenTypes, setHiddenTypes, t.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '7px 11px',
                    borderRadius: '999px',
                    transition: 'all 150ms ease',
                    color: hidden ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.78)',
                    background: hidden ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
                    border: hidden
                      ? '1px solid rgba(255,255,255,0.04)'
                      : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: hidden ? 'none' : '0 0 10px rgba(255,255,255,0.02)',
                  }}
                >
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '999px',
                      background: CHART_COLORS[i % CHART_COLORS.length],
                      boxShadow: `0 0 8px ${CHART_COLORS[i % CHART_COLORS.length]}55`,
                    }}
                  />
                  {t.name}
                </button>
              );
            })}
          </div>
        </HUDSection>
      </div>

      {/* Secondary Data Matrix */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{
          gap: '22px',
          alignItems: 'stretch',
        }}
      >
        <HUDSection
          title="Recent Transactions"
          subtitle="Latest completed orders"
          delay={0.4}
        >
          <div
            className="w-full h-full overflow-y-auto"
            style={{
              paddingRight: '4px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.12) transparent',
              minHeight: '420px',
              maxHeight: '520px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                paddingBottom: '6px',
              }}
            >
              {comprasRecientes.map((c) => (
                <div
                  key={c._id}
                  className="group flex items-center justify-between"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '18px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 160ms ease',
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex items-center" style={{ gap: '14px', minWidth: 0 }}>
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                        boxShadow: '0 0 18px rgba(124,58,237,0.24)',
                      }}
                    >
                      <Activity className="w-5 h-5 text-white" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="truncate"
                        style={{
                          fontWeight: 700,
                          color: '#fff',
                          fontSize: '16px',
                          margin: 0,
                        }}
                      >
                        {c.userId?.email || 'Anonymous Transact'}
                      </p>

                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.42)',
                          fontFamily: 'monospace',
                          marginTop: '5px',
                          marginBottom: 0,
                        }}
                      >
                        #{c._id.slice(-8).toUpperCase()} •{' '}
                        {Array.isArray(c.items)
                          ? c.items.length
                          : Object.values(c.items || {}).reduce((a, b) => a + b, 0)}{' '}
                        Items
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0" style={{ marginLeft: '14px' }}>
                    <p
                      style={{
                        fontWeight: 900,
                        color: '#fff',
                        fontFamily: 'monospace',
                        fontSize: '17px',
                        margin: 0,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      ${c.totalPrice?.toFixed(2)}
                    </p>

                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#34D399',
                        background: 'rgba(16,185,129,0.12)',
                        border: '1px solid rgba(16,185,129,0.22)',
                        padding: '4px 8px',
                        borderRadius: '999px',
                        boxShadow: '0 0 12px rgba(16,185,129,0.10)',
                      }}
                    >
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </HUDSection>

        <HUDSection
          title="AI Advisory: Smart Deals"
          subtitle="Discounts suggested by data patterns"
          delay={0.5}
        >
          <div
            className="w-full h-full overflow-y-auto"
            style={{
              paddingRight: '4px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.12) transparent',
              minHeight: '420px',
              maxHeight: '520px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingBottom: '6px',
              }}
            >
              {discountSuggestions?.map((sugg) => (
                <div
                  key={sugg._id}
                  className="group"
                  style={{
                    padding: '14px',
                    borderRadius: '18px',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div
                    className="flex flex-col xl:flex-row items-start xl:items-center"
                    style={{ gap: '14px' }}
                  >
                    <div
                      className="shrink-0 relative overflow-hidden"
                      style={{
                        width: '56px',
                        height: '76px',
                        borderRadius: '8px',
                        background: '#050505',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
                      }}
                    >
                      <img
                        src={sugg.image}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{
                          transition: 'transform 500ms ease',
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate"
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#fff',
                          margin: 0,
                        }}
                      >
                        {sugg.name}
                      </p>

                      <div
                        className="flex flex-wrap items-center"
                        style={{
                          gap: '8px',
                          marginTop: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            textDecoration: 'line-through',
                            color: 'rgba(255,255,255,0.35)',
                          }}
                        >
                          ${sugg.currentPrice}
                        </span>

                        <span
                          style={{
                            fontSize: '18px',
                            fontWeight: 800,
                            fontFamily: 'monospace',
                            color: '#34D399',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          ${(sugg.currentPrice * sugg.suggestedDiscount).toFixed(2)}
                        </span>

                        <div
                          style={{
                            padding: '4px 8px',
                            borderRadius: '999px',
                            background: 'rgba(168,85,247,0.12)',
                            border: '1px solid rgba(168,85,247,0.24)',
                            color: '#C084FC',
                            fontSize: '10px',
                            fontWeight: 800,
                          }}
                        >
                          -{Math.round((1 - sugg.suggestedDiscount) * 100)}%
                        </div>
                      </div>

                      <p
                        className="flex items-center"
                        style={{
                          gap: '6px',
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.40)',
                          marginTop: '10px',
                          marginBottom: 0,
                          fontStyle: 'italic',
                        }}
                      >
                        <TrendingUp style={{ width: '13px', height: '13px' }} />
                        {sugg.reason}
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        const newPrice = Math.max(5, sugg.currentPrice * sugg.suggestedDiscount);
                        await api.put(`/admin/cartas/${sugg._id}`, { price: newPrice });
                        window.location.reload();
                      }}
                      style={{
                        width: '100%',
                        maxWidth: '150px',
                        padding: '11px 14px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(30,136,229,0.14))',
                        border: '1px solid rgba(168,85,247,0.22)',
                        color: '#D8B4FE',
                        fontSize: '13px',
                        fontWeight: 800,
                        transition: 'all 150ms ease',
                        boxShadow: '0 0 16px rgba(168,85,247,0.08)',
                      }}
                    >
                      Apply Boost
                    </button>
                  </div>
                </div>
              ))}

              {(!discountSuggestions || discountSuggestions.length === 0) && (
                <div
                  className="h-full flex flex-col items-center justify-center text-center"
                  style={{
                    minHeight: '320px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      marginBottom: '14px',
                    }}
                  >
                    <Shield className="w-8 h-8 text-white/10" />
                  </div>

                  <p
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.62)',
                      margin: 0,
                    }}
                  >
                    Market equilibrium achieved.
                  </p>

                  <p
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.28)',
                      marginTop: '8px',
                      marginBottom: 0,
                    }}
                  >
                    No AI advisories at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </HUDSection>
      </div>
    </div>
  );
}
