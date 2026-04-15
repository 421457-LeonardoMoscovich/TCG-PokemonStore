import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminShell from './components/AdminShell';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Catalogo from './pages/Cartas';
import CartaDetalle from './pages/CartaDetalle';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import ScratchWin from './pages/ScratchWin';
import Pokedex from './pages/Pokedex';
import Recompensas from './pages/Recompensas';
import AdminDashboard from './pages/AdminDashboard';
import AdminCards from './pages/AdminCards';
import AdminUsers from './pages/AdminUsers';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
          <div className="min-h-screen bg-black">
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* Admin Area — Separate from main shop navigation */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminShell>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/cartas" element={<AdminCards />} />
                        <Route path="/usuarios" element={<AdminUsers />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                      </Routes>
                    </AdminShell>
                  </AdminRoute>
                }
              />

              {/* Main Shop Area */}
              <Route
                path="/*"
                element={
                  <>
                    <Navbar />
                    <div className="pt-16">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/catalogo" element={<Catalogo />} />
                        <Route path="/catalogo/:id" element={<Navigate to="/carta/:id" replace />} />
                        <Route path="/carta/:id" element={<CartaDetalle />} />
                        <Route
                          path="/carrito"
                          element={<ProtectedRoute><Carrito /></ProtectedRoute>}
                        />
                        <Route
                          path="/perfil"
                          element={<ProtectedRoute><Perfil /></ProtectedRoute>}
                        />
                        <Route
                          path="/scratch"
                          element={<ProtectedRoute><ScratchWin /></ProtectedRoute>}
                        />
                        <Route
                          path="/pokedex"
                          element={<ProtectedRoute><Pokedex /></ProtectedRoute>}
                        />
                        <Route
                          path="/recompensas"
                          element={<ProtectedRoute><Recompensas /></ProtectedRoute>}
                        />
                        <Route path="/cartas" element={<Navigate to="/catalogo" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  </ErrorBoundary>
);
}

