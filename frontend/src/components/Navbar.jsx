import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Sparkles, Heart, X,
  User, ShoppingBag, ChevronRight, Menu, LogOut, Ticket, BookOpen, Shield, Coins,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

export default function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { cartCount, cart, refreshCart } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = Boolean(user);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    setCartOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    if (cartOpen && isLoggedIn) {
      setCartLoading(true);
      refreshCart().finally(() => setCartLoading(false));
    }
  }, [cartOpen, isLoggedIn, refreshCart]);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`);
    else navigate('/catalogo');
    setSearchOpen(false);
  }

  const cartItems = cart || [];
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1) * (item.price || 0),
    0
  );

  return (
    <>
      <nav
        className="sticky top-0 z-50 glass border-b border-white/5"
        style={{
          minHeight: '64px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="w-full max-w-[1920px] mx-auto"
          style={{
            paddingLeft: '28px',
            paddingRight: '28px',
            paddingTop: '0',
            paddingBottom: '0',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              minHeight: '64px',
              columnGap: '24px',
            }}
          >
            {/* LEFT */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                minWidth: 0,
              }}
            >
              <Link
                to="/"
                className="group select-none"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                }}
              >
                <motion.div
                  whileHover={{ rotate: 20, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles className="text-primary" style={{ width: '20px', height: '20px' }} />
                </motion.div>

                <span
                  className="font-black tracking-tight"
                  style={{
                    fontSize: '16px',
                    lineHeight: '1',
                    display: 'inline-flex',
                    alignItems: 'baseline',
                    gap: '3px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span className="text-primary">Pokémon</span>
                  <span className="text-white">TCG</span>
                </span>
              </Link>
            </div>

            {/* CENTER DESKTOP */}
            <div
              className="hidden md:flex"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                minWidth: 0,
              }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/catalogo"
                  className="text-gray-400 hover:text-white transition-colors"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '44px',
                    paddingLeft: '6px',
                    paddingRight: '6px',
                    fontSize: '15px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                  }}
                >
                  Catálogo
                </Link>
              </motion.div>

              <div
                className="bg-white/10"
                style={{
                  width: '1px',
                  height: '24px',
                  flexShrink: 0,
                }}
              />

              <form onSubmit={handleSearch}>
                <div
                  className="relative"
                  style={{
                    width: '390px',
                    maxWidth: '40vw',
                  }}
                >
                  <Search
                    className="absolute text-gray-500 pointer-events-none"
                    style={{
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '18px',
                      height: '18px',
                    }}
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar cartas..."
                    className="w-full text-white placeholder-gray-500 outline-none bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-primary/5"
                    style={{
                      height: '46px',
                      borderRadius: '999px',
                      paddingLeft: '42px',
                      paddingRight: '18px',
                      fontSize: '15px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
                    }}
                  />
                </div>
              </form>
            </div>

            {/* RIGHT */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                minWidth: 0,
                gap: '6px',
              }}
            >
              {/* Mobile search */}
              <NavIconBtn
                onClick={() => setSearchOpen((v) => !v)}
                className="md:hidden"
                title="Buscar"
              >
                <Search style={{ width: '18px', height: '18px' }} />
              </NavIconBtn>

              {/* Desktop actions */}
              <div
                className="hidden md:flex"
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '4px',
                }}
              >
                <NavIconBtn
                  as={Link}
                  to="/catalogo?favoritos=true"
                  title="Mis favoritos"
                  badge={wishlistCount}
                  badgeColor="#E53935"
                >
                  <Heart style={{ width: '18px', height: '18px' }} />
                </NavIconBtn>

                <NavIconBtn
                  onClick={() => setCartOpen(true)}
                  title="Mi carrito"
                  badge={cartCount}
                  badgeColor="#E53935"
                  badgeTextColor="#fff"
                >
                  <ShoppingCart style={{ width: '18px', height: '18px' }} />
                </NavIconBtn>

                {user && (
  <NavIconBtn as={Link} to="/pokedex" title="Mi Pokédex">
    <BookOpen
      style={{
        width: '18px',
        height: '18px',
        position: 'relative',
        top: '1px',
      }}
    />
  </NavIconBtn>
)}

{user && (
  <NavIconBtn as={Link} to="/recompensas" title="Recompensas">
    <Coins
      className="text-yellow-400"
      style={{
        width: '18px',
        height: '18px',
        position: 'relative',
        top: '1px',
      }}
    />
  </NavIconBtn>
)}

                {user && (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      marginLeft: '8px',
                      marginRight: '6px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Link
                      to="/scratch"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        minHeight: '40px',
                        paddingLeft: '14px',
                        paddingRight: '14px',
                        borderRadius: '999px',
                        fontSize: '13px',
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: '#0a0a0a',
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #FFEB3B, #F57C00)',
                        boxShadow: '0 0 15px rgba(255,235,59,0.24)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Ticket style={{ width: '16px', height: '16px' }} />
                      Raspar
                    </Link>
                  </motion.div>
                )}

                {user ? (
                  <div
                    className="relative"
                    ref={profileRef}
                    style={{
                      marginLeft: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setProfileOpen((v) => !v)}
                      title="Mi perfil"
                      className={`font-black uppercase transition-all bg-primary text-black ${
                        profileOpen ? 'ring-primary/50' : 'ring-transparent'
                      }`}
                      style={{
                        width: '42px',
                        height: '42px',
                        minWidth: '42px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        lineHeight: '1',
                        boxShadow: profileOpen
                          ? '0 0 0 2px rgba(255,235,59,0.4)'
                          : '0 0 0 2px transparent',
                      }}
                    >
                      {user.username?.[0]?.toUpperCase() || '?'}
                    </motion.button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                          className="absolute right-0 glass-dropdown overflow-hidden z-50"
                          style={{
                            top: '52px',
                            width: '228px',
                            borderRadius: '16px',
                          }}
                        >
                          <div
                            className="border-b border-white/10"
                            style={{
                              padding: '14px 16px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                              }}
                            >
                              <div
                                className="bg-primary text-black"
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  minWidth: '36px',
                                  borderRadius: '999px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '13px',
                                  fontWeight: 900,
                                }}
                              >
                                {user.username?.[0]?.toUpperCase() || '?'}
                              </div>

                              <div style={{ minWidth: 0 }}>
                                <p
                                  className="text-white font-bold truncate"
                                  style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    lineHeight: '1.2',
                                  }}
                                >
                                  {user.username || 'Trainer'}
                                </p>
                                <p
                                  className="text-gray-500 truncate"
                                  style={{
                                    margin: '3px 0 0 0',
                                    fontSize: '11px',
                                    lineHeight: '1.2',
                                  }}
                                >
                                  {user.email || ''}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div style={{ padding: '8px 0' }}>
                            <DropdownItem
                              icon={<User style={{ width: '15px', height: '15px' }} />}
                              label="Mi Perfil"
                              onClick={() => {
                                setProfileOpen(false);
                                navigate('/perfil');
                              }}
                            />
                            <DropdownItem
                              icon={<ShoppingCart style={{ width: '15px', height: '15px' }} />}
                              label="Mi Carrito"
                              badge={cartCount}
                              onClick={() => {
                                setProfileOpen(false);
                                setCartOpen(true);
                              }}
                            />
                            <DropdownItem
                              icon={<Coins style={{ width: '15px', height: '15px' }} />}
                              label="Recompensas"
                              onClick={() => {
                                setProfileOpen(false);
                                navigate('/recompensas');
                              }}
                            />
                          </div>

                          {user.role === 'admin' && (
                            <div
                              className="border-t border-white/5"
                              style={{ padding: '8px 0' }}
                            >
                              <DropdownItem
                                icon={<Shield style={{ width: '15px', height: '15px' }} />}
                                label="Admin Panel"
                                onClick={() => {
                                  setProfileOpen(false);
                                  navigate('/admin');
                                }}
                              />
                            </div>
                          )}

                          <div
                            className="border-t border-white/5"
                            style={{ padding: '8px 0' }}
                          >
                            <DropdownItem
                              icon={<LogOut style={{ width: '15px', height: '15px' }} />}
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
                    style={{
                      marginLeft: '8px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Link
                      to="/login"
                      className="bg-primary text-black"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        minHeight: '40px',
                        paddingLeft: '14px',
                        paddingRight: '16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <User style={{ width: '15px', height: '15px' }} />
                      Ingresar
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Mobile hamburger */}
              <NavIconBtn
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden"
                title="Menú"
              >
                {mobileMenuOpen ? (
                  <X style={{ width: '18px', height: '18px' }} />
                ) : (
                  <Menu style={{ width: '18px', height: '18px' }} />
                )}
              </NavIconBtn>
            </div>
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
              className="md:hidden overflow-hidden"
              style={{
                paddingLeft: '18px',
                paddingRight: '18px',
                paddingBottom: '14px',
              }}
            >
              <div className="relative">
                <Search
                  className="absolute text-gray-500 pointer-events-none"
                  style={{
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                  }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar cartas..."
                  autoFocus
                  className="w-full text-white placeholder-gray-500 outline-none bg-white/[6%] border border-primary/30"
                  style={{
                    height: '46px',
                    borderRadius: '14px',
                    paddingLeft: '42px',
                    paddingRight: '16px',
                    fontSize: '15px',
                  }}
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
              <div
                style={{
                  paddingLeft: '14px',
                  paddingRight: '14px',
                  paddingTop: '12px',
                  paddingBottom: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <MobileNavLink
                  to="/catalogo"
                  icon={<Sparkles style={{ width: '16px', height: '16px' }} />}
                  label="Catálogo"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <MobileNavLink
                  to="/catalogo?favoritos=true"
                  icon={<Heart style={{ width: '16px', height: '16px' }} />}
                  label="Favoritos"
                  badge={wishlistCount}
                  onClick={() => setMobileMenuOpen(false)}
                />

                <button
                  className="text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCartOpen(true);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    textAlign: 'left',
                  }}
                >
                  <ShoppingCart style={{ width: '16px', height: '16px' }} />
                  <span style={{ flex: 1 }}>Mi Carrito</span>
                  {cartCount > 0 && (
                    <span
                      style={{
                        background: '#E53935',
                        color: '#fff',
                        borderRadius: '999px',
                        padding: '3px 7px',
                        fontSize: '11px',
                        fontWeight: 900,
                        lineHeight: '1',
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </button>

                {user ? (
                  <>
                    <MobileNavLink
                      to="/scratch"
                      icon={<Ticket style={{ width: '16px', height: '16px' }} />}
                      label="Raspa y Gana"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      to="/pokedex"
                      icon={<BookOpen style={{ width: '16px', height: '16px' }} />}
                      label="Mi Pokédex"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      to="/recompensas"
                      icon={<Coins style={{ width: '16px', height: '16px' }} />}
                      label="Recompensas"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      to="/perfil"
                      icon={<User style={{ width: '16px', height: '16px' }} />}
                      label="Mi Perfil"
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <button
                      className="text-red-400 hover:bg-red-400/[8%] transition-all"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        textAlign: 'left',
                      }}
                    >
                      <LogOut style={{ width: '16px', height: '16px' }} />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="bg-primary text-black"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    <User style={{ width: '16px', height: '16px' }} />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-[60] cart-backdrop"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 z-[61] flex h-full flex-col border-l border-white/10 bg-gradient-to-b from-bg-elevated to-bg-surface shadow-2xl"
              style={{
                width: '100%',
                maxWidth: '420px',
              }}
            >
              <div
                className="shrink-0 border-b border-white/[7%]"
                style={{
                  paddingTop: '18px',
                  paddingBottom: '18px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                }}
              >
                <div className="flex items-start justify-between" style={{ gap: '16px' }}>
                  <div className="flex items-center" style={{ gap: '14px' }}>
                    <div
                      className="flex items-center justify-center rounded-xl bg-primary/12 ring-1 ring-white/5"
                      style={{
                        width: '42px',
                        height: '42px',
                        minWidth: '42px',
                      }}
                    >
                      <ShoppingCart
                        className="text-primary"
                        style={{ width: '20px', height: '20px' }}
                      />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h2
                        className="font-bold text-white"
                        style={{
                          fontSize: '18px',
                          lineHeight: '1',
                          margin: 0,
                        }}
                      >
                        Mi Carrito
                      </h2>

                      {cartCount > 0 && (
                        <p
                          className="text-gray-400"
                          style={{
                            fontSize: '14px',
                            lineHeight: '1',
                            marginTop: '4px',
                            marginBottom: 0,
                          }}
                        >
                          {cartCount} {cartCount === 1 ? 'carta' : 'cartas'}
                        </p>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.08, rotate: 90 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    onClick={() => setCartOpen(false)}
                    className="flex shrink-0 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                    title="Cerrar"
                    style={{
                      width: '42px',
                      height: '42px',
                      minWidth: '42px',
                    }}
                  >
                    <X style={{ width: '20px', height: '20px' }} />
                  </motion.button>
                </div>
              </div>

              <div
                className="min-h-0 flex-1 overflow-y-auto"
                style={{
                  paddingTop: '20px',
                  paddingBottom: '20px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                }}
              >
                {cartLoading ? (
                  <div className="flex h-full flex-col items-center justify-center" style={{ gap: '16px' }}>
                    <div
                      className="animate-spin rounded-full border-2 border-primary/25 border-t-primary"
                      style={{ width: '32px', height: '32px' }}
                    />
                    <p className="text-sm text-gray-400">Cargando carrito...</p>
                  </div>
                ) : !user ? (
                  <div style={{ paddingTop: '32px', paddingBottom: '32px' }}>
                    <CartEmptyState
                      icon={<User className="text-gray-600" style={{ width: '40px', height: '40px' }} />}
                      title="Inicia sesión"
                      subtitle="Para acceder a tu carrito guardado"
                      actionLabel="Ingresar"
                      onAction={() => {
                        setCartOpen(false);
                        navigate('/login');
                      }}
                    />
                  </div>
                ) : cartItems.length === 0 ? (
                  <div style={{ paddingTop: '32px', paddingBottom: '32px' }}>
                    <CartEmptyState
                      icon={<ShoppingBag className="text-gray-600" style={{ width: '40px', height: '40px' }} />}
                      title="Tu carrito está vacío"
                      subtitle="Agrega cartas del catálogo para comenzar"
                      actionLabel="Explorar Catálogo"
                      onAction={() => {
                        setCartOpen(false);
                        navigate('/catalogo');
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {cartItems.map((item, i) => (
                      <motion.div
                        key={item.cardId}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: i * 0.05,
                          type: 'spring',
                          stiffness: 320,
                          damping: 26,
                        }}
                        className="border border-white/[7%] bg-white/[4%] transition-colors hover:bg-white/[6%]"
                        style={{
                          borderRadius: '18px',
                          padding: '16px',
                        }}
                      >
                        <div className="flex items-start" style={{ gap: '16px' }}>
                          <div
                            className="shrink-0 overflow-hidden rounded-lg bg-[#161616] ring-1 ring-white/5"
                            style={{
                              width: '74px',
                              height: '104px',
                              minWidth: '74px',
                            }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Sparkles className="text-primary/25" style={{ width: '20px', height: '20px' }} />
                              </div>
                            )}
                          </div>

                          <div
                            className="flex min-w-0 flex-1 flex-col justify-between"
                            style={{
                              minHeight: '104px',
                              paddingTop: '2px',
                              paddingBottom: '2px',
                            }}
                          >
                            <div>
                              <p
                                className="truncate font-semibold text-white"
                                style={{
                                  fontSize: '16px',
                                  lineHeight: '1.2',
                                  margin: 0,
                                }}
                              >
                                {item.name}
                              </p>

                              {item.type && (
                                <span
                                  className="inline-flex rounded-full bg-primary/10 font-bold text-primary"
                                  style={{
                                    marginTop: '10px',
                                    padding: '5px 10px',
                                    fontSize: '11px',
                                    lineHeight: '1',
                                  }}
                                >
                                  {item.type}
                                </span>
                              )}
                            </div>

                            <div
                              className="flex items-end justify-between"
                              style={{
                                marginTop: '16px',
                                gap: '12px',
                              }}
                            >
                              <span
                                className="text-gray-500"
                                style={{
                                  fontSize: '14px',
                                  lineHeight: '1',
                                }}
                              >
                                x{item.quantity || 1}
                              </span>

                              <span
                                className="font-extrabold text-white"
                                style={{
                                  fontSize: '18px',
                                  lineHeight: '1',
                                }}
                              >
                                ${(item.quantity || 1) * (item.price || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {user && cartItems.length > 0 && (
                <div
                  className="shrink-0 border-t border-white/[7%] bg-black/20 backdrop-blur-sm"
                  style={{
                    paddingTop: '18px',
                    paddingBottom: '20px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                  }}
                >
                  <div
                    className="flex items-end justify-between"
                    style={{
                      marginBottom: '16px',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <p
                        className="text-gray-400"
                        style={{
                          fontSize: '14px',
                          margin: 0,
                        }}
                      >
                        Total estimado
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        className="font-black text-white"
                        style={{
                          fontSize: '30px',
                          lineHeight: '1',
                        }}
                      >
                        ${cartTotal}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{
                      scale: 1.01,
                      boxShadow: '0 0 28px rgba(255,235,59,0.22)',
                    }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/carrito');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary font-black text-black"
                    style={{
                      minHeight: '52px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      fontSize: '16px',
                    }}
                  >
                    Ver carrito completo
                    <ChevronRight style={{ width: '18px', height: '18px' }} />
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

function NavIconBtn({
  children,
  onClick,
  as: Tag = 'button',
  to,
  title,
  badge,
  className = '',
}) {
  const inner = (
  <>
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
      }}
    >
      {children}
    </span>

    <AnimatePresence>
      {badge > 0 && (
        <motion.span
          key="badge"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="bg-red-600 text-white"
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-1px',
            minWidth: '17px',
            height: '17px',
            paddingLeft: '4px',
            paddingRight: '4px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: 900,
            lineHeight: '1',
          }}
        >
          {badge > 99 ? '99+' : badge}
        </motion.span>
      )}
    </AnimatePresence>
  </>
);

  const motionProps = {
    whileHover: { scale: 1.08 },
    whileTap: { scale: 0.9 },
    transition: { type: 'spring', stiffness: 450, damping: 16 },
  };

 const sharedStyle = {
  width: '40px',
  height: '40px',
  minWidth: '40px',
  borderRadius: '999px',
  verticalAlign: 'middle',
  color: 'rgb(156 163 175)',
  position: 'relative',
  transition: 'all 0.2s ease',
  textDecoration: 'none',
  padding: 0,
  lineHeight: 1,
  flexShrink: 0,
};
 const baseClass = 'inline-flex items-center justify-center';

  if (Tag === Link) {
    return (
      <motion.div {...motionProps} className={className} style={{ display: 'flex', alignItems: 'center' }}>
        <Link to={to} title={title} className={baseClass} style={sharedStyle}>
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
      className={`${baseClass} ${className}`}
      style={sharedStyle}
    >
      {inner}
    </motion.button>
  );
}

function DropdownItem({ icon, label, badge, danger, onClick }) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: 600,
        textAlign: 'left',
        color: danger ? '#f87171' : '#9ca3af',
        background: 'transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{ color: danger ? '#f87171' : 'var(--color-primary, #d6b2ff)' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span
          style={{
            background: '#dc2626',
            color: '#fff',
            borderRadius: '999px',
            padding: '3px 7px',
            fontSize: '10px',
            fontWeight: 900,
            lineHeight: '1',
          }}
        >
          {badge}
        </span>
      )}
    </motion.button>
  );
}

function MobileNavLink({ to, icon, label, badge, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#9ca3af',
        textDecoration: 'none',
      }}
    >
      <span className="text-primary">{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span
          style={{
            background: '#E53935',
            color: '#fff',
            borderRadius: '999px',
            padding: '3px 7px',
            fontSize: '10px',
            fontWeight: 900,
            lineHeight: '1',
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function CartEmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '16px',
        paddingTop: '40px',
        paddingBottom: '40px',
        minHeight: '100%',
      }}
    >
      <div
        className="bg-white/[4%] border border-white/[7%]"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>

      <div style={{ maxWidth: '220px' }}>
        <p
          className="text-white font-semibold"
          style={{
            fontSize: '15px',
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          className="text-gray-500"
          style={{
            fontSize: '13px',
            lineHeight: '1.5',
            marginTop: '6px',
            marginBottom: 0,
          }}
        >
          {subtitle}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onAction}
        className="bg-primary text-black"
        style={{
          padding: '11px 22px',
          borderRadius: '999px',
          fontSize: '14px',
          fontWeight: 800,
          marginTop: '4px',
        }}
      >
        {actionLabel}
      </motion.button>
    </div>
  );
}
