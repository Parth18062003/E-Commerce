"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "../ui/button";
import { addItemToCart } from "@/store/cartSlice";
import { SizeVariant, Variant } from "@/store/productSlice";
import { Ruler } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CartAddedDialog from "./CartAddedDialog";

interface AddToCartButtonProps {
  productId: string;
  variant: Variant;
  sizes: SizeVariant[];
  selectedSize: string;
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  mainImage: string;
  productName: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  variant,
  sizes,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  mainImage,
  productName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isAdding, setIsAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { loading } = useSelector((state: RootState) => state.cart);
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const userId = reduxUser?.id || "user-id";

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!variant || !selectedSize || quantity <= 0) {
      setSizeError(true);
      return; // Exit early if there's an error
    }
    
    setSizeError(false); // Clear error state if everything is valid
    setIsAdding(true); // Now that it's valid, set isAdding to true
    
    dispatch(addItemToCart({ userId: userId, request: { product_id: productId, variant_sku: variant.sku, size: selectedSize, quantity } }))
      .unwrap()
      .then(() => {
        toast.success("Item added to cart successfully!");
        setIsAdding(false);
        setDialogOpen(true);
      })
      .catch((error) => {
        console.error("Failed to add item to cart:", error);
        toast.error("Failed to add item to cart.");
        setIsAdding(false);
      });
  };
  
  return (
    <>
      <div className="flex justify-between">
        <label className="block text-sm font-medium my-3 text-black">Available Sizes</label>
        <Link href="/products/size-guide" className="text-black flex mb-2">
          <Ruler className="mr-1" /> Size Guide
        </Link>
      </div>
      
      {sizeError && <p className="text-red-500 text-sm">Please select a size.</p>}
      <div className={`grid grid-cols-4 lg:grid-cols-5 gap-2 mb-3 ${sizeError ? 'border border-red-500 p-1 rounded-xl' : ''}`}>
        {sizes.map((size, index) => (
          <div
            key={`${variant.color}-size-${size.size}-${index}`}
            className={`flex items-center justify-center cursor-pointer border rounded-lg p-2 hover:bg-zinc-200 ${selectedSize === size.size ? "bg-zinc-300" : ""}`}
            onClick={() => handleSizeChange(size.size)}
          >
            <span className="text-sm text-black">{size.size}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-4 mb-4">
        <Button className="w-full" onClick={handleAddToCart} disabled={loading.add || isAdding}>
          {loading.add || isAdding ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
      <CartAddedDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mainImage={mainImage}
        productName={productName}
        size={selectedSize}
        price={variant?.price}
      />
    </>
  );
};

export default AddToCartButton;
