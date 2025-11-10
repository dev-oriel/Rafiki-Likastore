import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

// 1. Create the Context
const CartContext = createContext();

// 2. Create the Provider (wrapper component)
export const CartProvider = ({ children }) => {
  // 3. State: Load cart from localStorage or start with empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem("rafiki_cart");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  // 4. Save to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("rafiki_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 5. Cart Functions
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item._id === product._id);

    if (existingItem) {
      // If item exists, update its quantity
      updateQuantity(product._id, existingItem.quantity + quantity);
    } else {
      // If new item, add it to the cart
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      // Remove item if quantity goes below 1
      removeFromCart(productId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("rafiki_cart");
  };

  // 6. Calculated Values (Memoized for performance)
  const itemCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  // --- THIS IS THE FIX ---
  const subtotal = useMemo(
    () =>
      cartItems.reduce((acc, item) => {
        // Check if the item is on sale and has a valid discounted price
        const priceToUse =
          item.isOnSale && item.discountedPrice > 0
            ? item.discountedPrice
            : item.price;
        return acc + priceToUse * item.quantity;
      }, 0),
    [cartItems]
  );
  // --- END OF FIX ---

  // 7. Provide all values to children
  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 8. Custom Hook (easy way to use the context)
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
