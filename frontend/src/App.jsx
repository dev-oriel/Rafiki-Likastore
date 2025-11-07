import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { useCart } from "./context/CartContext"; // 1. Import useCart
import CartPreview from "./components/cart/CartPreview"; // 2. Import CartPreview
import { AnimatePresence } from "framer-motion"; // 3. Import AnimatePresence

const App = () => {
  const { itemCount } = useCart(); // 4. Get the total item count
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const prevCountRef = useRef(itemCount); // 5. Keep track of the *previous* count

  // 6. This effect runs every time the itemCount changes
  useEffect(() => {
    // Only show popup if items were ADDED (not removed)
    if (itemCount > prevCountRef.current) {
      setIsPreviewOpen(true);

      // Set a timer to close the preview after 3 seconds
      const timer = setTimeout(() => {
        setIsPreviewOpen(false);
      }, 3000);

      // Clean up the timer
      return () => clearTimeout(timer);
    }

    // 7. Always update the "previous count" ref to the new count
    prevCountRef.current = itemCount;
  }, [itemCount]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />

      {/* 8. Conditionally render the preview with an animation wrapper */}
      <AnimatePresence>
        {isPreviewOpen && (
          <CartPreview onClose={() => setIsPreviewOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
