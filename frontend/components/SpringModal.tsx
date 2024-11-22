import { AnimatePresence, motion } from "framer-motion";
import {AlertCircle, Heart, ShoppingCart} from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt?: string | string[];
  updatedAt?: string | string[];
  discount: number;
  dimensions: string;
  weight: string;
  colorOptions: string[];
  productURL: string;
  material: string;
  releaseDate: string;
  gender: string;
  type: string;
  manufacturer?: string | null;
  featured?: boolean; // Add featured flag here
  variants: {
    color: string;
    price: number;
    discount: number;
    stockQuantity: number;
    sizes: { size: string; stockQuantity: number }[];
    colorOptionImages: string[];
    sku: string;
  }[];
};

export const SpringModal = ({
  isOpen,
  setIsOpen,
  product,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product: Product | null;
}) => {

  const getProductImages = (product: Product): { mainImage: string } => {
    const firstVariant = product.variants[0];
    const images = firstVariant.colorOptionImages || [];
    return {
      mainImage: images[0] || '',
    };
  };

  const { mainImage } = product ? getProductImages(product) : { mainImage: '' };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-zinc-200 to-zinc-100 text-black p-6 rounded-lg w-full max-w-2xl shadow-xl cursor-default relative overflow-hidden flex flex-col md:flex-row items-center"
          >
            <AlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
              <Image
                src={mainImage}
                alt={product.name}
                className="w-60 h-60 md:w-72 md:h-72 object-cover rounded-lg"
                height={256}
                width={256}
              />
            </div>
            <div className="relative z-10 text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
              <p className="text-lg text-zinc-700 mb-1">{product.brand}</p>
              <p className="text-xl font-semibold mb-4">${product.price}</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    // Handle add to cart action
                    setIsOpen(false);
                  }}
                  className="bg-zinc-600 hover:opacity-90 transition-opacity text-zinc-200 font-semibold w-full py-2 rounded"
                >
                  <span className="flex justify-center items-center gap-2">Add to Cart <ShoppingCart /></span>
                </button>
                <button
                  onClick={() => {
                    // Handle like action
                    setIsOpen(false);
                  }}
                  className="bg-black/30 hover:bg-black/50 transition-colors text-zinc-200 font-semibold w-full py-2 rounded"
                >
                  <span className="flex justify-center items-center gap-2">Like <Heart /></span>
                </button>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 bg-black/20 hover:bg-black/40 transition-colors text-white font-semibold w-full py-2 rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
