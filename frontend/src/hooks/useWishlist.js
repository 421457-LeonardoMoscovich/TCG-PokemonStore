import { useWishlistContext } from '../context/WishlistContext';

export function useWishlist() {
  const context = useWishlistContext();
  return {
    ...context,
    addToWishlist: (id) => context.toggleWishlist(id),
    removeFromWishlist: (id) => context.toggleWishlist(id)
  };
}
