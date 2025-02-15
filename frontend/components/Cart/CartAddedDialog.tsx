"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { CheckCircle } from "lucide-react"; // Import an icon for visual feedback

interface CartAddedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mainImage: string;
  productName: string;
  size: string;
  price?: number;
}

const CartAddedDialog: React.FC<CartAddedDialogProps> = ({ isOpen, onClose, mainImage, productName, size, price }) => {
  const [showDialog, setShowDialog] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShowDialog(true);
      const timer = setTimeout(() => {
        setShowDialog(false);
        onClose(); // Close dialog after 2 seconds
      }, 2000); // Reduced to 2 seconds for better UX

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={showDialog} onOpenChange={onClose}>
      <DialogContent className="top-40 right-0 w-full max-w-lg bg-white shadow-lg rounded-lg p-4 border border-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-green-600">
            <CheckCircle className="h-5 w-5 text-green-600" /> {/* Success icon */}
            Item Added to Cart
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-zinc-600">Add item to Cart</DialogDescription>
        <div className="flex items-center gap-4 mt-4 flex-col sm:flex-row">
          <div className="relative w-32 h-32 shrink-0">
            <Image
              src={mainImage}
              alt={productName}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 80px) 80px, 80px"
            />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <span className="text-zinc-800 text-xl font-medium">{productName}</span>
            <span className="text-md text-zinc-600">Size: {size}</span>
            <span className="text-lg text-zinc-800">Price: ${price?.toFixed(2)}</span>
            <span className="text-sm text-zinc-400">Price inclusive of all taxes</span>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-sm text-zinc-600 hover:text-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartAddedDialog;
