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

const SIDEBAR_W = 288;
const SPRING = { type: 'spring', damping: 28, stiffness: 280 };

export default function AdminShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

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

  const contentMargin = isDesktop && isSidebarOpen ? SIDEBAR_W : 0;

  return (
    <div
      className="min-h-screen text-white flex overflow-hidden font-sans"
      style={{ background: '#0a0a0f' }}
    >
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(168, 85, 247, 0.07), transparent 35%),
            radial-gradient(circle at 85% 20%, rgba(30, 136, 229, 0.05), transparent 30%),
            linear-gradient(rgba(168, 85, 247, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, auto, 44px 44px, 44px 44px',
        }}
      />

      {/* Sidebar */}
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
              background: 'linear-gradient(180deg, #0f1018 0%, #0a0a0f 100%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '4px 0 40px rgba(0, 0, 0, 0.5), inset -1px 0 0 rgba(168,85,247,0.06)',
              willChange: 'transform',
            }}
          >
            {/* Logo Row */}
            <div
              className="flex items-center shrink-0"
              style={{
                height: '84px',
                paddingLeft: '18px',
                paddingRight: '14px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #A855F7 0%, #1E88E5 100%)',
                    boxShadow: '0 0 16px rgba(168,85,247,0.4)',
                  }}
                >
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>

                <div className="min-w-0" style={{ paddingTop: '2px' }}>
                  <h1
                    className="truncate"
                    style={{
                      fontWeight: 900,
                      fontSize: '13px',
                      letterSpacing: '0.08em',
                      color: '#ffffff',
                      lineHeight: 1.1,
                      margin: 0,
                    }}
                  >
                    POKÉMON
                  </h1>
                  <p
                    className="truncate uppercase"
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: 'rgba(255,255,255,0.28)',
                      marginTop: '4px',
                      marginBottom: 0,
                    }}
                  >
                    Command Center
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
                className="shrink-0 flex items-center justify-center cursor-pointer"
                style={{
                  width: '34px',
                  height: '34px',
                  marginLeft: '10px',
                  borderRadius: '10px',
                  color: 'rgba(255,255,255,0.30)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.30)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Navigation */}
            <nav
              className="flex-1 overflow-y-auto"
              style={{
                paddingTop: '28px',
                paddingBottom: '24px',
                paddingLeft: '14px',
                paddingRight: '14px',
              }}
            >
              <p
                className="font-black uppercase"
                style={{
                  paddingLeft: '14px',
                  marginBottom: '14px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.22)',
                  letterSpacing: '0.12em',
                }}
              >
                Menu
              </p>

              <div
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                  margin: '0 0 18px 0',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {navItems.map((item) => {
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-3 rounded-xl cursor-pointer"
                      style={{
                        paddingTop: '14px',
                        paddingBottom: '14px',
                        paddingLeft: active ? '13px' : '16px',
                        paddingRight: '14px',
                        marginBottom: '6px',
                        ...(active
                          ? {
                              background:
                                'linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(30, 136, 229, 0.08) 100%)',
                              borderLeft: '3px solid #A855F7',
                              boxShadow: '0 0 18px rgba(168,85,247,0.18)',
                              color: 'white',
                            }
                          : {
                              color: 'rgba(255,255,255,0.45)',
                            }),
                        transition:
                          'background 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.82)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = '';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                        }
                      }}
                    >
                      <item.icon
                        className="shrink-0"
                        style={{
                          width: '17px',
                          height: '17px',
                          color: active ? '#C084FC' : 'inherit',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: active ? 700 : 600,
                          letterSpacing: '0.01em',
                          lineHeight: 1,
                        }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Logout Footer */}
            <div
              className="shrink-0"
              style={{
                padding: '18px 14px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                marginTop: '6px',
              }}
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 cursor-pointer"
                style={{
                  paddingTop: '14px',
                  paddingBottom: '14px',
                  paddingLeft: '14px',
                  paddingRight: '14px',
                  borderRadius: '14px',
                  color: 'rgba(255,255,255,0.38)',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                  e.currentTarget.style.color = 'rgba(252,129,129,0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.38)';
                }}
              >
                <div
                  className="shrink-0 flex items-center justify-center font-black text-xs"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #A855F7, #1E88E5)',
                    boxShadow: '0 0 14px rgba(168,85,247,0.22)',
                  }}
                >
                  <span className="text-white">A</span>
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <p
                    className="truncate"
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#fff',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    Admin OS
                  </p>
                  <p
                    className="truncate"
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.25)',
                      marginTop: '4px',
                      marginBottom: 0,
                    }}
                  >
                    Click to Logout
                  </p>
                </div>

                <LogOut className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40"
            style={{
              background: 'rgba(0,0,0,0.6)',
              willChange: 'opacity',
            }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        animate={{ marginLeft: contentMargin }}
        transition={SPRING}
        className="flex-1 flex flex-col min-h-screen relative z-10"
        style={{ willChange: 'margin-left' }}
      >
        {/* Topbar */}
        <header
          className="shrink-0 sticky top-0 z-40"
          style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '24px',
            paddingRight: '28px',
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            className="flex items-center"
            style={{
              gap: '14px',
            }}
          >
            <button
              onClick={() => setIsSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
              className="flex items-center justify-center rounded-xl cursor-pointer shrink-0"
              style={{
                width: '40px',
                height: '40px',
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              <Menu className="w-4 h-4" />
            </button>

            <h2
              style={{
                fontSize: '32px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#fff',
                lineHeight: 1,
                margin: 0,
              }}
            >
              {getPageTitle()}
            </h2>

            <div
              className="hidden sm:flex items-center"
              style={{
                gap: '6px',
                padding: '7px 10px',
                borderRadius: '10px',
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.2)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: '#6EE7B7',
                  letterSpacing: '0.14em',
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          <div
            className="flex items-center"
            style={{
              gap: '10px',
            }}
          >
            <div className="relative hidden md:block">
              <Search
                className="absolute pointer-events-none"
                style={{
                  width: '14px',
                  height: '14px',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.25)',
                }}
              />
              <input
                type="text"
                placeholder="Search..."
                className="outline-none"
                style={{
                  width: '230px',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '11px',
                  paddingBottom: '11px',
                  fontSize: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'white',
                  transition: 'border-color 150ms ease, background 150ms ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(168,85,247,0.45)';
                  e.target.style.background = 'rgba(168,85,247,0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.target.style.background = 'rgba(255,255,255,0.04)';
                }}
              />
            </div>

            <button
              className="flex items-center justify-center rounded-xl cursor-pointer"
              style={{
                width: '40px',
                height: '40px',
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            paddingTop: '34px',
            paddingBottom: '34px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 32, stiffness: 320, mass: 0.8 }}
            style={{
              maxWidth: '1280px',
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '100%',
            }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}