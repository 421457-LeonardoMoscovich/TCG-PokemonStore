import { useState, useEffect } from 'react';
import api from '../services/api';

export function useCart() {
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);

  async function refresh() {
    const token = localStorage.getItem('token');
    if (!token) { setCartCount(0); setCart([]); return; }
    try {
      const { data } = await api.get('/compras/carrito');
      setCartCount(data.total_items || 0);
      setCart(data.carrito || []);
    } catch {
      setCartCount(0);
      setCart([]);
    }
  }

  useEffect(() => {
    refresh();
    window.addEventListener('cart-updated', refresh);
    return () => window.removeEventListener('cart-updated', refresh);
  }, []);

  return { cartCount, cart, refreshCart: refresh };
}
