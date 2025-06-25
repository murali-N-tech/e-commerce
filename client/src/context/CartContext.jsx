// client/src/context/CartContext.jsx

import React, { createContext, useState, useEffect } from "react";

// Create the CartContext
const CartContext = createContext();

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("cartItems");
      // Ensure localCart is a string before parsing
      return localCart && typeof localCart === "string"
        ? JSON.parse(localCart)
        : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      // If parsing fails, return an empty array to prevent app crash
      return [];
    }
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Find if the product already exists in the cart by its unique _id
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        // If it exists, update its quantity
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If not, add the new product with quantity 1.
        // Ensure only necessary properties are stored to avoid circular references or excessive data.
        return [
          ...prevItems,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId); // If quantity goes to 0 or less, remove the item
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider };
export default CartContext;
