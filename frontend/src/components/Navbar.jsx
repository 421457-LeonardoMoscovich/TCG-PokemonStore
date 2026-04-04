import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Sparkles, Heart, X,
  User, ShoppingBag, ChevronRight, Menu, LogOut, Settings, Ticket, BookOpen, Shield, Coins,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';


// ─── Main component ───────────────────────────────────────────────

export default function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { cartCount, cart, refreshCart } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const profileRef = useRef(null);

  // Auto-close drawers on route change
  useEffect(() => {
    setCartOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setProfileOpen(false);
    navigate('/login');
  }

  useEffect(() => {
    if (cartOpen && user) {
      setCartLoading(true);
      refreshCart().finally(() => setCartLoading(false));
    }
  }, [cartOpen]);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`);
    else navigate('/catalogo');
    setSearchOpen(false);
  }

  const cartItems = cart || [];
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity || 1) * (item.price || 0), 0);

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="w-full px-4 md:px-8 h-16 flex items-center max-w-[1920px] mx-auto relative">

          {/* ── LEFT: Logo ── */}
          <Link to="/" className="flex items-center gap-2 shrink-0 select-none group">
            <motion.div
              whileHover={{ rotate: 20, scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="font-black text-base tracking-tight">
              <span className="text-primary">Pokémon</span>
              <span className="text-white"> TCG</span>
            </span>
          </Link>

          {/* ── CENTER: Catálogo + Search ── */}
          <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">

            {/* Catálogo — left of search bar */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/catalogo"
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap text-gray-400 hover:text-white hover:bg-white/[7%]"
              >
                Catálogo
              </Link>
            </motion.div>

            {/* Separator */}
            <div className="h-5 w-px shrink-0 bg-white/10" />

            {/* Search */}
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none group-focus-within:text-primary transition-colors" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar cartas..."
                  className="w-56 lg:w-72 rounded-full text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-primary/5 focus:ring-4 focus:ring-primary/10"
                  style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}
                />
              </div>
            </form>
          </div>

          {/* ── RIGHT: Icons ── */}
          <div className="flex items-center gap-1 pr-2 ml-auto" style={{ marginLeft: 'auto' }}>

            {/* Mobile search toggle */}
            <NavIconBtn
              onClick={() => setSearchOpen(v => !v)}
              className="md:hidden"
              title="Buscar"
            >
              <Search className="w-[18px] h-[18px]" />
            </NavIconBtn>

            {/* Desktop icons */}
            <div className="hidden md:flex items-center gap-1">
              {/* Wishlist */}
              <NavIconBtn
                as={Link}
                to="/catalogo?favoritos=true"
                title="Mis favoritos"
                badge={wishlistCount}
                badgeColor="#E53935"
              >
                <Heart className="w-[18px] h-[18px]" />
              </NavIconBtn>

              {/* Cart */}
              <NavIconBtn
                onClick={() => setCartOpen(true)}
                title="Mi carrito"
                badge={cartCount}
                badgeColor="#E53935"
                badgeTextColor="#fff"
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
              </NavIconBtn>

              {/* Pokédex */}
              {user && (
                <NavIconBtn
                  as={Link}
                  to="/pokedex"
                  title="Mi Pokédex"
                >
                  <BookOpen className="w-[18px] h-[18px]" />
                </NavIconBtn>
              )}

              {/* Recompensas */}
              {user && (
                <NavIconBtn
                  as={Link}
                  to="/recompensas"
                  title="Recompensas"
                >
                  <Coins className="w-[18px] h-[18px] text-yellow-400" />
                </NavIconBtn>
              )}

              {/* Scratch & Win */}
              {user && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-1 mr-2">
                  <Link
                    to="/scratch"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[linear-gradient(135deg,#FFEB3B,#F57C00)] text-[#0a0a0a] shadow-[0_0_15px_rgba(255,235,59,0.3)] hover:shadow-[0_0_20px_rgba(255,235,59,0.5)] transition-all"
                  >
                    <Ticket className="w-4 h-4" />
                    Raspar
                  </Link>
                </motion.div>
              )}

              {/* Profile / Login */}
              {user ? (
                <div className="relative ml-1" ref={profileRef}>
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setProfileOpen(v => !v)}
                    title="Mi perfil"
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-xs uppercase select-none transition-all bg-primary text-black ring-2 ${profileOpen ? 'ring-primary/50 shadow-[0_0_0_2px_rgba(255,235,59,0.4)]' : 'ring-transparent'}`}
                  >
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </motion.button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="absolute right-0 top-11 w-52 rounded-lg overflow-hidden z-50 glass-dropdown"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 bg-primary text-black">
                              {user.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-sm font-bold truncate">{user.username || 'Trainer'}</p>
                              <p className="text-gray-600 text-[10px] truncate">{user.email || ''}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-1.5">
                          <DropdownItem
                            icon={<User className="w-3.5 h-3.5" />}
                            label="Mi Perfil"
                            onClick={() => { setProfileOpen(false); navigate('/perfil'); }}
                          />
                          <DropdownItem
                            icon={<ShoppingCart className="w-3.5 h-3.5" />}
                            label="Mi Carrito"
                            badge={cartCount}
                            onClick={() => { setProfileOpen(false); setCartOpen(true); }}
                          />
                          <DropdownItem
                            icon={<Coins className="w-3.5 h-3.5" />}
                            label="Recompensas"
                            onClick={() => { setProfileOpen(false); navigate('/recompensas'); }}
                          />
                        </div>

                        {/* Admin Panel - only for admins */}
                        {user.role === 'admin' && (
                          <div className="py-1.5 border-t border-white/5">
                            <DropdownItem
                              icon={<Shield className="w-3.5 h-3.5" />}
                              label="Admin Panel"
                              onClick={() => { setProfileOpen(false); navigate('/admin'); }}
                            />
                          </div>
                        )}

                        {/* Logout */}
                        <div className="py-1.5 border-t border-white/5">
                          <DropdownItem
                            icon={<LogOut className="w-3.5 h-3.5" />}
                            label="Cerrar sesión"
                            danger
                            onClick={handleLogout}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="ml-2"
                >
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-bold bg-primary text-black"
                  >
                    <User className="w-3.5 h-3.5" />
                    Ingresar
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile hamburger */}
            <NavIconBtn
              onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden ml-1"
              title="Menú"
            >
              {mobileMenuOpen
                ? <X className="w-[18px] h-[18px]" />
                : <Menu className="w-[18px] h-[18px]" />
              }
            </NavIconBtn>
          </div>
        </div>

        {/* Mobile search drawer */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onSubmit={handleSearch}
              className="md:hidden overflow-hidden px-4 pb-3"
            >
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar cartas..."
                  autoFocus
                  className="w-full rounded-md text-sm text-white placeholder-gray-500 outline-none bg-white/[6%] border border-primary/30"
                  style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px' }}
                />
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden overflow-hidden border-t border-white/[6%]"
            >
              <div className="px-4 py-3 space-y-1">
                <MobileNavLink
                  to="/catalogo"
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Catálogo"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <MobileNavLink
                  to="/catalogo?favoritos=true"
                  icon={<Heart className="w-4 h-4" />}
                  label="Favoritos"
                  badge={wishlistCount}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
                  onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="flex-1">Mi Carrito</span>
                  {cartCount > 0 && (
                    <span className="text-xs font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: '#E53935', color: '#fff' }}>
                      {cartCount}
                    </span>
                  )}
                </button>
                {user ? (
                  <>
                    <MobileNavLink
                      to="/scratch"
                      icon={<Ticket className="w-4 h-4" />}
                      label="Raspa y Gana"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      to="/pokedex"
                      icon={<BookOpen className="w-4 h-4" />}
                      label="Mi Pokédex"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      to="/recompensas"
                      icon={<Coins className="w-4 h-4" />}
                      label="Recompensas"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      to="/perfil"
                      icon={<User className="w-4 h-4" />}
                      label="Mi Perfil"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all text-left text-red-400 hover:bg-red-400/[8%]"
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold bg-primary text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Ingresar
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Cart Sidebar ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-[60] cart-backdrop"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-full max-w-[400px] z-[61] flex flex-col bg-gradient-to-b from-bg-elevated to-bg-surface border-l border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-white/[7%]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary/12">
                    <ShoppingCart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-sm leading-tight">Mi Carrito</h2>
                    {cartCount > 0 && (
                      <p className="text-gray-500 text-xs leading-tight">
                        {cartCount} {cartCount === 1 ? 'carta' : 'cartas'}
                      </p>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  onClick={() => setCartOpen(false)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:text-white transition-colors bg-white/5"
                  title="Cerrar"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
                {cartLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-7 h-7 rounded-full border-2 animate-spin border-primary/25 border-t-primary" />
                    <p className="text-gray-500 text-sm">Cargando carrito...</p>
                  </div>
                ) : !user ? (
                  <CartEmptyState
                    icon={<User className="w-9 h-9 text-gray-600" />}
                    title="Inicia sesión"
                    subtitle="Para acceder a tu carrito guardado"
                    actionLabel="Ingresar"
                    onAction={() => { setCartOpen(false); navigate('/login'); }}
                  />
                ) : cartItems.length === 0 ? (
                  <CartEmptyState
                    icon={<ShoppingBag className="w-9 h-9 text-gray-600" />}
                    title="Tu carrito está vacío"
                    subtitle="Agrega cartas del catálogo para comenzar"
                    actionLabel="Explorar Catálogo"
                    onAction={() => { setCartOpen(false); navigate('/catalogo'); }}
                  />
                ) : (
                  <div className="space-y-2.5">
                    {cartItems.map((item, i) => (
                      <motion.div
                        key={item.cardId}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 320, damping: 26 }}
                        className="flex gap-3 p-3 rounded-lg bg-white/[4%] border border-white/[6%]"
                      >
                        {/* Card thumbnail */}
                        <div className="w-[52px] h-[72px] rounded-md overflow-hidden shrink-0 bg-[#161616]">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-primary/25" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <p className="text-white text-sm font-semibold truncate leading-snug">
                              {item.name}
                            </p>
                            {item.type && (
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 leading-tight bg-primary/10 text-primary">
                                {item.type}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-xs">×{item.quantity || 1}</span>
                            <span className="text-white text-sm font-bold">
                              ${(item.quantity || 1) * (item.price || 0)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {user && cartItems.length > 0 && (
                <div className="px-5 pt-4 pb-5 shrink-0 border-t border-white/[7%]">
                  {/* Total row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">Total estimado</span>
                    <div className="text-right">
                      <span className="text-white font-black text-xl">${cartTotal}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.01, boxShadow: '0 0 28px rgba(255,235,59,0.22)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setCartOpen(false); navigate('/carrito'); }}
                    className="w-full py-3.5 rounded-lg font-black text-sm flex items-center justify-center gap-2 bg-primary text-black"
                  >
                    Ver carrito completo
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── NavIconBtn ───────────────────────────────────────────────────

function NavIconBtn({
  children,
  onClick,
  as: Tag = 'button',
  to,
  title,
  badge,
  badgeColor = '#E53935',
  badgeTextColor = '#fff',
  className = '',
}) {
  const inner = (
    <>
      {children}
      <AnimatePresence>
        {badge > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 text-[9px] font-black rounded-full flex items-center justify-center px-1 leading-none text-white bg-red-600"
          >
            {badge > 99 ? '99+' : badge}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.12 },
    whileTap: { scale: 0.86 },
    transition: { type: 'spring', stiffness: 450, damping: 16 }
  };

  const cls = `relative flex items-center justify-center w-10 h-10 rounded-full transition-colors text-gray-400 hover:text-white ${className}`;

  if (Tag === Link) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} title={title} className={cls}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      onClick={onClick}
      title={title}
      className={cls}
    >
      {inner}
    </motion.button>
  );
}

// ─── DropdownItem ─────────────────────────────────────────────────

function DropdownItem({ icon, label, badge, danger, onClick }) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium transition-colors text-left ${danger ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <span className={danger ? 'text-red-400' : 'text-primary'}>{icon}</span>
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-600 text-white">
          {badge}
        </span>
      )}
    </motion.button>
  );
}

// ─── MobileNavLink ────────────────────────────────────────────────

function MobileNavLink({ to, icon, label, badge, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
    >
      <span className="text-primary">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
          style={{ background: '#E53935', color: '#fff' }}>
          {badge}
        </span>
      )}
    </Link>
  );
}

// ─── CartEmptyState ───────────────────────────────────────────────

function CartEmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-10">
      <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-white/[4%] border border-white/[7%]">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-gray-500 text-xs max-w-[200px] mx-auto leading-relaxed">{subtitle}</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onAction}
        className="px-6 py-2.5 rounded-full font-bold text-sm mt-1 bg-primary text-black"
      >
        {actionLabel}
      </motion.button>
    </div>
  );
}
