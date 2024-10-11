import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface Product {
  imageUrl: string;
  brand: string;
  name: string;
  price: string;
}

export const SpringModal = ({
  isOpen,
  setIsOpen,
  product,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product: Product | null;
}) => {
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
            className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-2xl shadow-xl cursor-default relative overflow-hidden flex flex-col md:flex-row items-center"
          >
            <AlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="w-60 h-60 md:w-72 md:h-72 object-cover rounded-lg"
                height={256}
                width={256}
              />
            </div>
            <div className="relative z-10 text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
              <p className="text-lg text-zinc-200 mb-1">{product.brand}</p>
              <p className="text-xl font-semibold mb-4">{product.price}</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    // Handle add to cart action
                    setIsOpen(false);
                  }}
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    // Handle like action
                    setIsOpen(false);
                  }}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Like
                </button>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
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
