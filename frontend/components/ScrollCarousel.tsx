"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

// Define the ProductType
type ProductType = {
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

type HorizontalScrollCarouselProps = {
  products: ProductType[]; // Accept products as props
};

export const HorizontalScrollCarousel = ({
  products,
}: HorizontalScrollCarouselProps) => {
  // Scroll reference
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Filter featured products
  const featuredProducts = products.filter((product) => product.featured === false).slice(0, 7);
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  if (products.length === 0) {
    return <div>No products available.</div>;
  }
  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {featuredProducts.map((product) => (
            <Card product={product} key={product.id} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ product }: { product: ProductType }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  return (
    <div className="group relative h-[450px] w-[450px] overflow-hidden rounded-2xl shadow-xl">
      {/* Images for the selected color variant */}
      <div className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110">
        <Image
          src={selectedVariant.colorOptionImages[0]} // Display the first image for the selected variant
          alt={product.name}
          width={512}
          height={512}
          loading="lazy"
          className="rounded-2xl object-cover"
        />
      </div>

      {/* Product info */}
      <div className="relative inset-0 translate-y-10 z-10 grid place-content-center">
        <p className="p-8 text-2xl font-black uppercase text-zinc-700 text-center italic">
          {product.name}
        </p>
      </div>
    </div>
  );
};
