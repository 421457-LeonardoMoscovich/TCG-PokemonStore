import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const STORAGE_KEY = 'wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  const syncWishlist = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await api.get('/usuarios/wishlist');
        setWishlist(data.wishlist || []);
        setWishlistCount(data.wishlist?.length || 0);
      } catch (err) {
        // If 401, it will be handled by interceptor, but we catch it just in case
        console.error('Error al sincronizar wishlist:', err);
      }
    } else {
      // Fallback a localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setWishlist(parsed);
          setWishlistCount(parsed.length);
        } catch {
          setWishlist([]);
          setWishlistCount(0);
        }
      } else {
        setWishlist([]);
        setWishlistCount(0);
      }
    }
  }, []);

  useEffect(() => {
    // Escuchar cambios para mantener estado global en tabs/componentes
    const handleSync = () => syncWishlist();
    window.addEventListener('wishlist-updated', handleSync);
    
    // Carga inicial
    syncWishlist();

    return () => {
      window.removeEventListener('wishlist-updated', handleSync);
    };
  }, [syncWishlist]);

  const addToWishlist = useCallback(async (cardId) => {
    if (wishlist.includes(cardId)) return;
    
    // State optimista
    const newWishlist = [...wishlist, cardId];
    setWishlist(newWishlist);
    setWishlistCount(newWishlist.length);
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post(`/usuarios/wishlist/${cardId}`);
        window.dispatchEvent(new CustomEvent('wishlist-updated'));
      } catch (err) {
        // Revertir optimismo
        syncWishlist();
      }
    } else {
      // Redirigir a login si queremos forzar que usen backend
      window.location.href = '/login';
    }
  }, [wishlist, syncWishlist]);

  const removeFromWishlist = useCallback(async (cardId) => {
    if (!wishlist.includes(cardId)) return;
    
    // State optimista
    const newWishlist = wishlist.filter(id => id !== cardId);
    setWishlist(newWishlist);
    setWishlistCount(newWishlist.length);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.delete(`/usuarios/wishlist/${cardId}`);
        window.dispatchEvent(new CustomEvent('wishlist-updated'));
      } catch (err) {
        // Revertir optimismo
        syncWishlist();
      }
    } else {
      window.location.href = '/login';
    }
  }, [wishlist, syncWishlist]);

  const toggleWishlist = useCallback((cardId) => {
    if (wishlist.includes(cardId)) {
      removeFromWishlist(cardId);
    } else {
      addToWishlist(cardId);
    }
  }, [wishlist, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((cardId) => {
    return wishlist.includes(cardId);
  }, [wishlist]);

  return {
    wishlist,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
  };
}
