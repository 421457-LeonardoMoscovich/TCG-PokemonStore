import { useCartContext } from '../context/CartContext';

export function useCart() {
  return useCartContext();
}
