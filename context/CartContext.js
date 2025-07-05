// context/CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const index = prevItems.findIndex((item) => item._id === product._id);
      if (index !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[index].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const updated = prevItems
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      return updated;
    });
  };

  const getItemQuantity = (productId) => {
    const found = cartItems.find((item) => item._id === productId);
    return found ? found.quantity : 0;
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getItemQuantity,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
