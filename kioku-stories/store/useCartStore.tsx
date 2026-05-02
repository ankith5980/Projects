import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  items: [],
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (newItem) => set((state) => {
    const existingItem = state.items.find(item => item.id === newItem.id);
    if (existingItem) {
      if (existingItem.quantity >= 9) {
        return {};
      }

      return {
        items: state.items.map(item =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { items: [...state.items, { ...newItem, quantity: 1 }] };
  }),
  decrementItem: (id) => set((state) => {
    const targetItem = state.items.find(item => item.id === id);

    if (!targetItem || targetItem.quantity <= 1) {
      return {
        items: state.items.filter(item => item.id !== id)
      };
    }

    return {
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
    };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
}));