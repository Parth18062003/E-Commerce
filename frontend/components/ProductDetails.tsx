"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "./ui/button";
import { Heart, Ruler, Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Lens } from "./ui/lens";
import ImageModal from "./ImageModal";
import { fetchProductDetails } from "@/store/productSlice";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const productId = params.productId as string;
  
  const { product, loading, error } = useSelector((state: RootState) => state.product);
  
  const [mainImages, setMainImages] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = React.useState<CarouselApi>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product data when component mounts
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  // Set initial color and images when product data loads
  useEffect(() => {
    if (product && product.colorOptions.length > 0) {
      const initialColor = product.colorOptions[0];
      setSelectedColor(initialColor);
      setMainImages(product.colorOptionImages[initialColor]);
    }
  }, [product]);

  // Update images when color changes
  useEffect(() => {
    if (product && selectedColor) {
      setMainImages(product.colorOptionImages[selectedColor]);
    }
  }, [selectedColor, product]);

  // Carousel API effect
  useEffect(() => {
    if (!api) return;
    const updateCurrentIndex = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", updateCurrentIndex);
    return () => {
      api.off("select", updateCurrentIndex);
    };
  }, [api]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-6">No product available.</div>;
  }

  const discountedPrice = product.price - (product.price * (product.discount / 100));

  return (
    <div className="p-6 lg:p-10 flex flex-col lg:flex-row">
      {/* Left Half: Image Carousel */}
      <div className="w-full lg:w-2/3">
        {/* Mobile Carousel */}
        <div className="mb-4 lg:hidden">
          <Carousel className="w-full max-w-xs relative" setApi={setApi}>
            <CarouselContent>
              {mainImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-0">
                        <Image
                          src={image}
                          alt={`${product.name} - ${selectedColor} view ${index + 1}`}
                          className="object-cover h-96 rounded-lg"
                          width={512}
                          height={512}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
              {mainImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 mx-1 rounded-full ${
                    index === currentIndex ? "bg-zinc-500" : "bg-gray-300"
                  }`}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
          </Carousel>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-4 mt-4">
          {mainImages.map((image, index) => (
            <div key={index} className="relative overflow-hidden">
              <Lens>
                <Image
                  src={image}
                  alt={`${product.name} - ${selectedColor} view ${index + 1}`}
                  className="w-full object-cover h-96 rounded-lg cursor-pointer"
                  width={512}
                  height={512}
                  priority
                  onClick={() => openModal(index)}
                />
              </Lens>
            </div>
          ))}
        </div>
      </div>

      {/* Right Half: Product Details */}
      <div className="w-full lg:w-1/3 lg:pl-8 mt-0 lg:mt-5">
        {/* Color Selection */}
        <div className="lg:hidden grid grid-cols-3 gap-2 mt-2">
          {product.colorOptions.map((color) => (
            <div
              key={color}
              className={`flex items-center justify-center cursor-pointer border rounded-lg p-0 ${
                selectedColor === color ? 'border-black' : ''
              }`}
              onClick={() => handleColorChange(color)}
            >
              <Image
                src={product.colorOptionImages[color][0]}
                alt={`${product.name} - ${color}`}
                className="object-cover h-24 rounded-lg"
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-2 text-black">{product.name}</h1>
        <p className="text-lg text-gray-600 mb-4">
          Brand: <span className="font-semibold text-black">{product.brand}</span>
        </p>

        <div className="flex items-center mb-4">
          <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
          <span className="ml-1 text-black">{product.rating}</span>
          <span className="mx-1 text-gray-400">|</span>
          <span className="text-gray-600">{product.reviewCount} reviews</span>
        </div>

        <div className="mb-4">
          {product.discount > 0 ? (
            <div className="flex items-center">
              <p className="text-xl font-bold text-red-600">
                ${discountedPrice.toFixed(2)}
              </p>
              <p className="ml-2 text-lg text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </p>
              <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded">
                {product.discount}% OFF
              </span>
            </div>
          ) : (
            <p className="text-xl font-bold text-black">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>

        {/* Desktop Color Selection */}
        <div className="hidden lg:grid grid-cols-4 my-2 p-0 gap-3">
          {product.colorOptions.map((color) => (
            <div
              key={color}
              className={`flex items-center justify-center cursor-pointer border rounded-lg p-0 ${
                selectedColor === color ? 'border-black' : ''
              }`}
              onClick={() => handleColorChange(color)}
            >
              <Image
                src={product.colorOptionImages[color][0]}
                alt={`${product.name} - ${color}`}
                className="object-cover h-24 w-full rounded-lg"
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>

        {/* Size Selection */}
        <div className="my-4">
          <div className="flex justify-between">
            <label className="block text-sm font-medium mb-1 text-black">
              Size
            </label>
            <Link href="/products/size-guide" className="text-black flex mb-2">
              <Ruler className="mr-1" /> Size Guide
            </Link>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
            {product.sizes.map((size) => (
              <div
                key={size}
                className="flex items-center justify-center cursor-pointer border rounded-lg p-2 hover:bg-gray-200"
              >
                <span className="text-sm text-black">{size}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-4 mb-4">
          <Button className="w-full">Add to Cart</Button>
          <Button variant="outline" className="w-full">
            <Heart className="w-4 h-4 mr-1" /> Favorite
          </Button>
        </div>

        <p className="text-lg text-gray-700">{product.description}</p>

        {/* Additional Details */}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
          <p className="text-sm text-gray-600">Category: {product.category}</p>
          <p className="text-sm text-gray-600">Weight: {product.weight}</p>
          <p className="text-sm text-gray-600">Dimensions: {product.dimensions}</p>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={mainImages}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
};

export default ProductDetails;