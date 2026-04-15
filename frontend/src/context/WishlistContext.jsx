import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get('/usuarios/wishlist');
      setWishlist(data?.wishlist || []);
    } catch {
      // If it's a 401, we just clear the wishlist silently
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleWishlist = useCallback(async (cardId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const wasInWishlist = wishlist.includes(cardId);
    setWishlist((current) =>
      wasInWishlist ? current.filter((id) => id !== cardId) : [...current, cardId]
    );

    try {
      const { data } = wasInWishlist
        ? await api.delete(`/usuarios/wishlist/${cardId}`)
        : await api.post(`/usuarios/wishlist/${cardId}`);
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      refreshWishlist();
    }
  }, [refreshWishlist, wishlist]);

  const isInWishlist = useCallback((cardId) => wishlist.includes(cardId), [wishlist]);

  const value = useMemo(() => ({ 
    wishlist, 
    refreshWishlist, 
    toggleWishlist, 
    isInWishlist, 
    loading 
  }), [wishlist, refreshWishlist, toggleWishlist, isInWishlist, loading]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
}
