"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { SpringModal } from "./SpringModal";

interface Product {
  id: string;
  imageUrl: string;
  hoverImageUrl: string; // New property for hover image
  brand: string;
  name: string;
  price: string;
  description: string;
}

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Handle mouse move for swipe-like behavior
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (carouselRef.current) {
      const { clientX } = e;
      const { offsetLeft, clientWidth } = carouselRef.current;

      // Calculate swipe direction based on mouse position
      const swipeThreshold = clientWidth / 4; // Adjust sensitivity here
      if (clientX < offsetLeft + swipeThreshold) {
        carouselRef.current.scrollLeft -= 10; // Scroll left
      } else if (clientX > offsetLeft + clientWidth - swipeThreshold) {
        carouselRef.current.scrollLeft += 10; // Scroll right
      }
    }
  };

  // Use effect to add a wheel event listener with passive set to false
  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += e.deltaY; // Adjust scroll speed if needed
      }
      e.preventDefault(); // Prevent default scroll behavior
    };

    const currentRef = carouselRef.current;

    currentRef?.addEventListener("wheel", handleWheelEvent, { passive: false });

    return () => {
      currentRef?.removeEventListener("wheel", handleWheelEvent);
    };
  }, []);

  const handleHeartClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from propagating to the card link
    setSelectedProduct(product);
    setIsOpen(true);
  };

  return (
    <div>
      <Carousel
        ref={carouselRef}
        className="w-full mx-auto"
        opts={{
          loop: true,
          align: "start",
        }}
        onMouseMove={handleMouseMove} // Keep this
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <div className="relative cursor-pointer rounded-xl">
                <Card className="p-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Link href={`/products/${product.id}`} passHref>
                    <CardContent className="flex flex-col p-0">
                      <div className="relative w-full h-96 overflow-hidden">
                        {/* Main image */}
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 rounded-t-xl"
                          height={512}
                          width={512}
                          loading="lazy"
                        />
                        {/* Hover image */}
                        <Image
                          src={product.hoverImageUrl}
                          alt={`${product.name} hover`}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-t-xl"
                          height={512}
                          width={512}
                          loading="lazy"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 px-3">
                        <span className="text-sm text-zinc-500">
                          {product.brand}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1 px-3 gap-8">
                        <h2 className="text-lg text-indigo-500 font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                          {product.name}
                        </h2>
                        <span className="text-lg font-bold text-zinc-950">
                          {product.price}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 px-3 my-3 overflow-hidden overflow-ellipsis line-clamp-2">
                        {product.description}
                      </p>
                    </CardContent>
                  </Link>
                  <button
                    className="absolute bottom-20 right-2 text-zinc-500 hover:text-indigo-500 transition-colors duration-300 z-50"
                    aria-label="Add to favorites"
                    onClick={(e) => handleHeartClick(product, e)} // Handle heart click
                  >
                    <Heart />
                  </button>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="block md:hidden text-zinc-500 text-sm text-end">swipe</div>
        <div className="hidden md:block">
          <CarouselPrevious
            className="text-zinc-600 hover:text-zinc-800 transition-all duration-200 ease-in-out"
            aria-label="Previous item"
          />
          <CarouselNext
            className="text-zinc-600 hover:text-zinc-800 transition-all duration-200 ease-in-out"
            aria-label="Next item"
          />
        </div>
      </Carousel>

      {/* Render the modal here */}
      <SpringModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductCarousel;
