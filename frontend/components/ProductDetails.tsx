"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button"; // Assuming you have a button component
import { Heart, Ruler } from "lucide-react"; // Icon for favorite
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Lens } from "./ui/lens";
import ImageModal from "./ImageModal";

type Product = {
  images: string[]; // Array of images for this color
  color?: string; // Color of the product
};

type ProductDetailsProps = {
  products: Product[]; // Array of product objects with URLs and optional color
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ products = [] }) => {
  const sizes: string[] = [
    "2",
    "2.5",
    "3",
    "4",
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ]; // Define available sizes

  const [mainImages, setMainImages] = useState<string[]>([]); // Set initial main images
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0); // Track selected color
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = React.useState<CarouselApi>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };
  

  useEffect(() => {
    if (products.length > 0) {
      setMainImages(products[selectedColorIndex].images); // Set images for the initially selected color
    }
  }, [products, selectedColorIndex]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCurrentIndex = () => {
      setCurrentIndex(api.selectedScrollSnap()); // Update current index on slide change
    };

    // Set the initial index
    setCurrentIndex(api.selectedScrollSnap());

    // Listen for the "select" event
    api.on("select", updateCurrentIndex);

    return () => {
      api.off("select", updateCurrentIndex); // Clean up the event listener
    };
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    setSelectedColorIndex(index);
    setMainImages(products[index].images); // Update main images based on selected color
  };

  // If no products are available, render a fallback UI
  if (products.length === 0) {
    return <div className="p-6">No products available.</div>;
  }

  return (
    <div className="p-6 lg:p-10 flex flex-col lg:flex-row">
      {/* Left Half: Image Carousel */}
      <div className="w-full lg:w-2/3">
        {/* Carousel for mobile view */}
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
                          alt={`Product Image ${index + 1}`}
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

            {/* Circle Pagination */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
              {mainImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 mx-1 rounded-full ${
                    index === currentIndex ? "bg-zinc-500" : "bg-gray-300"
                  }`}
                  onClick={() => {
                    setCurrentIndex(index);
                    api?.scrollTo(index);
                  }}
                />
              ))}
            </div>
          </Carousel>
        </div>

        {/* All images displayed in a grid for Desktop */}
        <div className="hidden lg:grid grid-cols-2 gap-4 mt-4">
          {mainImages.map((image, index) => (
            <div key={index} className="relative overflow-hidden">
              <Lens>
              <Image
                src={image}
                alt={`Product Image ${index + 1}`}
                className="w-full object-cover h-96 rounded-lg cursor-pointer"
                width={512}
                height={512}
                onClick={() => openModal(index)}
              />
              </Lens>
            </div>
          ))}
        </div>
      </div>

      {/* Right Half: Product Details */}
      <div className="w-full lg:w-1/3 lg:pl-8 mt-0 lg:mt-5">
        {/* Thumbnails for mobile view */}
        <div className="lg:hidden grid grid-cols-3 gap-2 mt-2">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-center cursor-pointer border rounded-lg p-0"
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={product.images[0]} // Show the first image of the color as thumbnail
                alt={`Color Thumbnail ${index + 1}`}
                className="object-cover h-24 rounded-lg"
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-2 text-black">Product Name</h1>
        <p className="text-lg text-gray-600 mb-4">
          Brand: <span className="font-semibold text-black">Brand Name</span>
        </p>
        <p className="text-xl font-bold mb-4 text-black">$99.99</p>

        {/* Thumbnails for Desktop view */}
        <div className="hidden lg:grid grid-cols-4 my-2 p-0 gap-3">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-center cursor-pointer border rounded-lg p-0 m-0" // Set margin to 0
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={product.images[0]} // Show the first image of the color as thumbnail
                alt={`Color Thumbnail ${index + 1}`}
                className="object-cover h-24 w-full rounded-lg" // Added w-full to make the image fill the div
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>

        <div className="my-4">
          <div className="flex justify-between">
          <label
            htmlFor="size"
            className="block text-sm font-medium mb-1 text-black"
          >
            Size
          </label>
          <Link href="/products/size-guide" className="text-black flex mb-2"><span><Ruler aria-label="Size guide"/></span> Size Guide</Link>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
            {sizes.map((size) => (
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
          <Button className="w-full bg-gray-200 hover:bg-gray-300">
            <Heart className="w-4 h-4 mr-1" /> Favorite
          </Button>
        </div>

        <p className="text-lg text-gray-700">
          This is a detailed description of the product. It provides information
          about features, materials, and other relevant details that help the
          customer make an informed decision.
        </p>
      </div>

            {/* Modal */}
            <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={mainImages} // Pass all images to the modal
        initialIndex={selectedImageIndex}
      />
    </div>
  );
};

export default ProductDetails;
