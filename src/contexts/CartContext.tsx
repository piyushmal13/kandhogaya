import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string; // unique ID for the cart item (usually productId + plan)
  productId: string;
  name: string;
  plan: string;
  price: number;
  image_url?: string;
  download_url?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Load cart from local storage on mount or user change
  useEffect(() => {
    const savedCart = localStorage.getItem(`ifx_cart_${user?.id || 'guest'}`);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    } else {
      setItems([]);
    }
  }, [user]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(`ifx_cart_${user?.id || 'guest'}`, JSON.stringify(items));
  }, [items, user]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      // Prevent exact duplicates
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
