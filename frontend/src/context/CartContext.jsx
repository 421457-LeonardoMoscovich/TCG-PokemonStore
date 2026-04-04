import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get('/compras/carrito');
      setCartCount(data?.total_items || 0);
      setCart(data?.carrito || []);
    } catch (err) {
      // If it's a 401, we just clear the cart silently
      setCartCount(0);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
    
    // Listen for global cart updates
    const handleUpdate = () => refreshCart();
    window.addEventListener('cart-updated', handleUpdate);
    
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, [refreshCart]);

  const value = useMemo(() => ({ 
    cartCount, 
    cart, 
    refreshCart, 
    loading 
  }), [cartCount, cart, refreshCart, loading]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
