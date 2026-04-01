import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Catalogo from './pages/Cartas';
import CartaDetalle from './pages/CartaDetalle';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import ScratchWin from './pages/ScratchWin';
import Pokedex from './pages/Pokedex';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/login" element={<Login />} />
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
                    <Route path="/cartas" element={<Navigate to="/catalogo" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
