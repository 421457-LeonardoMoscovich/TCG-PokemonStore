import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Layers,
  Users,
  LogOut,
  Bell,
  Search,
  Menu,
  ChevronLeft,
  Zap
} from 'lucide-react';

const SIDEBAR_W = 288; // px — matches w-72
const SPRING = { type: 'spring', damping: 28, stiffness: 280 };

export default function AdminShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // Track md breakpoint so we only push content on desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Inventory', path: '/admin/cartas', icon: Layers },
    { label: 'Users', path: '/admin/usuarios', icon: Users },
  ];

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  }

  const isActive = (path) => location.pathname === path;

  const getPageTitle = () => {
    const path = location.pathname.replace('/admin/', '').replace('/admin', '');
    return path === '' || path === '/' ? 'DASHBOARD' : path.toUpperCase();
  };

  // Margin only shifts on desktop; mobile sidebar overlays
  const contentMargin = isDesktop && isSidebarOpen ? SIDEBAR_W : 0;

  return (
    <div className="min-h-screen text-white flex overflow-hidden font-sans" style={{ background: '#0a0a0f' }}>

      {/* ── Background Grid + Glow ── */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `
          radial-gradient(circle at 15% 50%, rgba(168, 85, 247, 0.07), transparent 35%),
          radial-gradient(circle at 85% 20%, rgba(30, 136, 229, 0.05), transparent 30%),
          linear-gradient(rgba(168, 85, 247, 0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168, 85, 247, 0.025) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, auto, 44px 44px, 44px 44px',
      }} />

      {/* ── Sidebar ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -SIDEBAR_W }}
            animate={{ x: 0 }}
            exit={{ x: -SIDEBAR_W }}
            transition={SPRING}
            className="fixed left-0 top-0 h-screen flex flex-col z-50"
            style={{
              width: SIDEBAR_W,
              background: 'linear-gradient(180deg, #0e0e16 0%, #0a0a0f 100%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '4px 0 40px rgba(0, 0, 0, 0.5), inset -1px 0 0 rgba(168,85,247,0.06)',
              willChange: 'transform',
            }}
          >
            {/* Logo Row */}
            <div className="h-20 flex items-center px-5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #A855F7 0%, #1E88E5 100%)',
                  boxShadow: '0 0 16px rgba(168,85,247,0.4)',
                }}>
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h1 className="font-black text-sm tracking-wider text-white truncate">POKÉMON</h1>
                  <p className="text-[10px] font-semibold uppercase tracking-widest truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>Command Center</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg cursor-pointer ml-2"
                style={{
                  color: 'rgba(255,255,255,0.25)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
              <p className="px-4 text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.18)' }}>Menu</p>
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                    style={{
                      ...(active ? {
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(30, 136, 229, 0.07) 100%)',
                        borderLeft: '2px solid #A855F7',
                        paddingLeft: 'calc(1rem - 2px)',
                        color: 'white',
                      } : { color: 'rgba(255,255,255,0.4)' }),
                      transition: 'background 150ms ease, color 150ms ease',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; } }}
                  >
                    <item.icon className="w-4 h-4 shrink-0" style={{ color: active ? '#A855F7' : 'inherit' }} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Footer */}
            <div className="p-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
                style={{
                  color: 'rgba(255,255,255,0.35)',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'rgba(252,129,129,0.9)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
              >
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-black text-xs" style={{ background: 'linear-gradient(135deg, #A855F7, #1E88E5)' }}>
                  <span className="text-white">A</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-bold text-white truncate">Admin OS</p>
                  <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>Click to Logout</p>
                </div>
                <LogOut className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', willChange: 'opacity' }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Main Content — margin synced to sidebar spring ── */}
      <motion.div
        animate={{ marginLeft: contentMargin }}
        transition={SPRING}
        className="flex-1 flex flex-col min-h-screen relative z-10"
        style={{ willChange: 'margin-left' }}
      >
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-6 md:px-8 shrink-0 sticky top-0 z-40"
          style={{
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(v => !v)}
              aria-label="Toggle sidebar"
              className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer shrink-0"
              style={{
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <Menu className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-black tracking-tight text-white">{getPageTitle()}</h2>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-300 tracking-widest">LIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none w-56"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'white',
                  transition: 'border-color 150ms ease, background 150ms ease',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.45)'; e.target.style.background = 'rgba(168,85,247,0.05)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
              />
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer"
              style={{
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto py-10 px-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 32, stiffness: 320, mass: 0.8 }}
            style={{ maxWidth: '960px', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
