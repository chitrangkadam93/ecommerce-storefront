import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, saveCart } from '../utils/helpers';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    const storedCart = getCart();
    if (storedCart) {
      setCartItems(storedCart);
    }
    setCartLoading(false);
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      let updatedItems;
      
      if (existingItem) {
        updatedItems = prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...prevItems, { ...product, quantity }];
      }
      
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    console.log("Inside clearing cart");
    setCartItems([]);
    saveCart([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      cartLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount: cartItems.reduce((count, item) => count + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);