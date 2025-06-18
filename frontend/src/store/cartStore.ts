import { create } from "zustand";
import { Product } from "../shared/types";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  cartOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  cartOpen: false,
  addItem: (product) => {
    const existing = get().items.find((item) => item.id === product.id);
    if (existing) {
      set({
        items: get().items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...get().items, { ...product, quantity: 1 }] });
    }
  },
  removeItem: (id) =>
    set({ items: get().items.filter((item) => item.id !== id) }),
  updateQuantity: (id, quantity) =>
    set({
      items: get().items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }),
  clearCart: () => set({ items: [] }),
  setCartOpen: (open) => set({ cartOpen: open }),
  total: () =>
    get().items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    ),
}));
