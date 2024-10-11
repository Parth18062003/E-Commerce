import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
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
            className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <AlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto mb-4 rounded-lg"
              />
              <h3 className="text-2xl font-bold text-center mb-2">{product.name}</h3>
              <p className="text-center text-lg text-zinc-200 mb-1">{product.brand}</p>
              <p className="text-center text-xl font-semibold mb-4">{product.price}</p>
              <div className="flex gap-2">
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
