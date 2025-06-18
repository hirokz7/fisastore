import { create } from "zustand";
import { Order, OrderItem } from "../shared/types";

interface OrderStore {
  order: Partial<Order>;
  items: OrderItem[];
  setOrder: (order: Partial<Order>) => void;
  setItems: (items: OrderItem[]) => void;
  addItem: (item: OrderItem) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: OrderItem) => void;
  clearOrder: () => void;
  calculateTotal: () => number;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  order: {},
  items: [],
  setOrder: (order) => set({ order }),
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),
  updateItem: (index, item) =>
    set((state) => ({
      items: state.items.map((i, idx) => (idx === index ? item : i)),
    })),
  clearOrder: () => set({ order: {}, items: [] }),
  calculateTotal: () => {
    const { items } = get();
    return items.reduce(
      (total, item) => total + item.quantity * item.unit_price,
      0
    );
  },
}));
