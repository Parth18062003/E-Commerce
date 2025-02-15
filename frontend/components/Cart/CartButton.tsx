/* "use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ShoppingBag } from "lucide-react";

const CartButton: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
  
  // Safely calculate the item count by checking if cart and items exist
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="relative">
      <ShoppingBag className="w-6 h-6" /> 
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-500 rounded-full">
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartButton;
 */
"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ShoppingBag } from "lucide-react";

const CartButton: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
  
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Safely calculate item count on cart update
    const count = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    setItemCount(count); // Update local state
  }, [cart]); // Re-run effect when cart changes

  return (
    <div className="relative">
      <ShoppingBag className="w-6 h-6" /> {/* Shopping Bag Icon */}
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-500 rounded-full">
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartButton;
