/* "use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { Product, fetchProducts, fetchProductsByReleaseDate } from "@/store/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { SpringModal } from "../SpringModal";
import { createSlug } from "@/lib/utils";
import { current } from "@reduxjs/toolkit";

interface ProductCarouselProps {
  initialPage?: number;
  itemsPerPage?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
                                                           initialPage = 0,
                                                         }) => {
  const dispatch = useDispatch<AppDispatch>();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, loading, error } = useSelector(
      (state: RootState) => state.product
  );

  const currentDate = new Date().toLocaleDateString('en-CA');
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProductsByReleaseDate({page: initialPage, size: 5, releaseDate: currentDate}));
    }
  }, [dispatch, initialPage]);

  // Get the first image and hover image for a product's color variant
  const getProductImages = (product: Product): { mainImage: string; hoverImage: string | undefined } => {
    const firstVariant = product.variants[0];
    const images = firstVariant.colorOptionImages || [];
    return {
      mainImage: images[0] || '',
      hoverImage: images[1], // Only use the second image if available
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    const { clientX } = e;
    const { offsetLeft, clientWidth } = carouselRef.current;
    const swipeThreshold = clientWidth / 4;
    const scrollAmount = 10;

    if (clientX < offsetLeft + swipeThreshold) {
      carouselRef.current.scrollLeft -= scrollAmount;
    } else if (clientX > offsetLeft + clientWidth - swipeThreshold) {
      carouselRef.current.scrollLeft += scrollAmount;
    }
  };

  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => {
      if (!carouselRef.current) return;
      const { offsetLeft, clientWidth } = carouselRef.current;
      const mouseX = e.clientX;
      const swipeThreshold = clientWidth / 4;
      const isNearLeftEdge = mouseX < offsetLeft + swipeThreshold;
      const isNearRightEdge = mouseX > offsetLeft + clientWidth - swipeThreshold;

      if (isNearLeftEdge || isNearRightEdge) {
        carouselRef.current.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    const currentRef = carouselRef.current;
    currentRef?.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => {
      currentRef?.removeEventListener("wheel", handleWheelEvent);
    };
  }, []);

  const handleHeartClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsOpen(true);
  };

  // Calculate discounted price
  const getDisplayPrice = (price: number, discount: number) => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount) / 100;
      return (
          <div className="flex flex-col">
          <span className="text-lg font-bold text-indigo-600">
            ${discountedPrice.toFixed(2)}
          </span>
            <span className="text-sm text-zinc-500 line-through">
            ${price.toFixed(2)}
          </span>
          </div>
      );
    }
    return <span className="text-lg font-bold text-zinc-950">${price.toFixed(2)}</span>;
  };

  if (loading.fetchProducts) {
    return (
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
  }

  if (error.fetchProducts) {
    return (
        <div className="w-full h-96 flex items-center justify-center text-red-500">
          {error.fetchProducts}
        </div>
    );
  }

  const renderProductCard = (product: Product) => {
    const { mainImage, hoverImage } = getProductImages(product);
    if (!mainImage) return null; // Skip products without images

    return (
        <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
          <div className="relative cursor-pointer rounded-xl">
            <Card className="p-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link href={`/products/${createSlug(product.name)}/${product.id}/${createSlug(product.sku)}`} passHref>
                <CardContent className="flex flex-col p-0">
                  <div className="relative w-full h-96 overflow-hidden">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 rounded-t-xl"
                        height={512}
                        width={512}
                        loading="lazy"
                    />
                    {hoverImage && (
                        <Image
                            src={hoverImage}
                            alt={`${product.name} hover`}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-t-xl"
                            height={512}
                            width={512}
                            loading="lazy"
                        />
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2 px-3">
                    <span className="text-sm text-zinc-500">{product.brand}</span>
                    <span className="text-xs text-zinc-400">
                    {product.colorOptions.length}{" "}
                      {product.colorOptions.length > 1 ? "colors" : "color"}
                  </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 px-3 gap-8 min-h-12">
                    <h2 className="text-lg text-indigo-500 font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                      {product.name}
                    </h2>
                    {getDisplayPrice(product.price, product.discount)}
                  </div>
                  <p className="text-sm text-zinc-400 px-3 my-3 overflow-hidden overflow-ellipsis line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
              </Link>
              <button
                  className="absolute top-5 right-5 text-zinc-500 hover:text-indigo-500 transition-colors duration-300 z-50"
                  aria-label="Add to favorites"
                  onClick={(e) => handleHeartClick(product, e)}
              >
                <Heart />
              </button>
            </Card>
          </div>
        </CarouselItem>
    );
  };

  return (
      <div>
        <Carousel
            ref={carouselRef}
            className="w-full mx-auto"
            opts={{ loop: true, align: "start" }}
            onMouseMove={handleMouseMove}
        >
          <CarouselContent>{products.map(renderProductCard)}</CarouselContent>
          <div className="block md:hidden text-zinc-500 text-sm text-end">swipe</div>
          <div className="hidden md:block">
            <CarouselPrevious className="text-zinc-600 hover:text-zinc-800 transition-all duration-200 ease-in-out" aria-label="Previous item" />
            <CarouselNext className="text-zinc-600 hover:text-zinc-800 transition-all duration-200 ease-in-out" aria-label="Next item" />
          </div>
        </Carousel>
        <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} product={selectedProduct} />
      </div>
  );
};

export default ProductCarousel; */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { SpringModal } from "../SpringModal";
import { createSlug } from "@/lib/utils";

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

interface ProductCarouselProps {
  products: ProductType[]; // Accept an array of products as a prop
  initialPage?: number;
  itemsPerPage?: number;
  filter?: keyof ProductType; // Optional filter key (e.g., "gender", "category")
  filterValue?: string; // The value to filter by (e.g., "Men", "Women", etc.)
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  initialPage = 0,
  filter,
  filterValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  // Filter products based on the provided filter and filterValue
  const filteredProducts = filter && filterValue
    ? products.filter(product => product[filter] === filterValue)
    : products;

  // Get the first image and hover image for a product's color variant
  const getProductImages = (product: ProductType): { mainImage: string; hoverImage: string | undefined } => {
    const firstVariant = product.variants[0];
    const images = firstVariant.colorOptionImages || [];
    return {
      mainImage: images[0] || '/fallback-image.jpg', // Use a fallback image if none exists
      hoverImage: images[1], // Only use the second image if available
    };
  };

  const handleHeartClick = (product: ProductType, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const getDisplayPrice = (price: number, discount: number) => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount) / 100;
      return (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-indigo-600">
            ${discountedPrice.toFixed(2)}
          </span>
          <span className="text-sm text-zinc-500 line-through">
            ${price.toFixed(2)}
          </span>
        </div>
      );
    }
    return <span className="text-lg font-bold text-zinc-950">${price.toFixed(2)}</span>;
  };

  const renderProductCard = (product: ProductType) => {
    const { mainImage, hoverImage } = getProductImages(product);
    if (!mainImage) return null; // Skip products without images

    return (
      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
        <div className="relative cursor-pointer rounded-xl">
          <Card className="p-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link href={`/products/${createSlug(product.name)}/${product.id}/${createSlug(product.sku)}`} passHref>
              <CardContent className="flex flex-col p-0">
                <div className="relative w-full h-96 overflow-hidden">
                  {/* Main image */}
                  <Image
                    src={mainImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 rounded-t-xl"
                    height={512}
                    width={512}
                    loading="lazy"
                  />
                  {/* Hover image (only if available) */}
                  {hoverImage && (
                    <Image
                      src={hoverImage}
                      alt={`${product.name} hover`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-t-xl"
                      height={512}
                      width={512}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex justify-between items-center mt-2 px-3">
                  <span className="text-sm text-zinc-500">{product.brand}</span>
                  <span className="text-xs text-zinc-400">
                    {product.colorOptions.length}{" "}
                    {product.colorOptions.length > 1 ? "colors" : "color"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1 px-3 gap-8 min-h-12">
                  <h2 className="text-lg text-indigo-500 font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    {product.name}
                  </h2>
                  {getDisplayPrice(product.price, product.discount)}
                </div>
                <p className="text-sm text-zinc-400 px-3 my-3 overflow-hidden overflow-ellipsis line-clamp-2">
                  {product.description}
                </p>
              </CardContent>
            </Link>
            <button
              className="absolute top-5 right-5 text-zinc-500 hover:text-indigo-500 transition-colors duration-300 z-50"
              aria-label="Add to favorites"
              onClick={(e) => handleHeartClick(product, e)}
            >
              <Heart />
            </button>
          </Card>
        </div>
      </CarouselItem>
    );
  };

  return (
    <div>
      <Carousel className="w-full mx-auto" opts={{ loop: true, align: "start" }}>
        <CarouselContent>
          {filteredProducts.map(renderProductCard)}
        </CarouselContent>
        <div className="block md:hidden text-zinc-500 text-sm text-end">swipe</div>
        <div className="hidden md:block">
          <CarouselPrevious className="text-zinc-600 hover:text-zinc-800 transition-all duration-200 ease-in-out" aria-label="Previous item" />
          <CarouselNext className="text-zinc-600 hover:text-zinc-800 transition-all duration-200 ease-in-out" aria-label="Next item" />
        </div>
      </Carousel>
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} product={selectedProduct} />
    </div>
  );
};

export default ProductCarousel;
