import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Layers,
  Users,
  LogOut,
  Hexagon,
  Bell,
  Search,
  Menu
} from 'lucide-react';

export default function AdminShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white flex overflow-hidden font-sans">
      {/* Background effect */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(168, 85, 247, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(30, 136, 229, 0.03), transparent 25%)',
        backgroundAttachment: 'fixed'
      }}></div>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 h-screen admin-sidebar flex flex-col transition-all duration-300 z-50 w-72 ${!isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 p-[2px]">
              <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
            <div>
              <h1 className="font-black text-sm tracking-wider">POKÉMON</h1>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Command Center</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          <div className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Menu</div>

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                isActive(item.path)
                  ? 'bg-purple-600/15 text-white border-l-3 border-purple-600'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10">
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Admin OS</p>
              <p className="text-[11px] text-gray-500 truncate">Click to Logout</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ${!isSidebarOpen ? 'ml-0' : 'ml-0'}`}>

        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-transparent z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black tracking-tight">{getPageTitle()}</h2>
            <div className="h-6 w-px bg-gradient-to-b from-purple-600 to-blue-600"></div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-300">LIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition w-64" />
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg transition">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="max-w-[1600px] mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
