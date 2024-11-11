"use client";

import React, { useState } from "react";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { Highlight } from "react-instantsearch";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export type ProductCardProps = {
  hit: AlgoliaHit<{
    name: string;
    description: string;
    price: number;
    discount: number;
    brand: string;
    category: string;
    colorOptions: string[];
    colorOptionImages: { [key: string]: string[] };
    tags: string[]; // Added tags field
    sizes: string[]; // Added sizes field
    sku: string; // Added sku field
    objectID: string; // Ensure objectID is included
  }>;
};

const AlgoliaProductCard: React.FC<ProductCardProps> = ({ hit }) => {
  // Get the initial color and the corresponding initial image URL
  const initialColor = hit.colorOptions.length > 0 ? hit.colorOptions[0] : null;
  const initialImage =
    initialColor && initialColor in hit.colorOptionImages
      ? hit.colorOptionImages[initialColor][0] || ""
      : "";

  const [mainImage, setMainImage] = useState(initialImage);
  const [isHovered, setIsHovered] = useState(false);

  // Final price after discount if any
  const finalPrice = hit.discount
    ? (hit.price - hit.price * (hit.discount / 100)).toFixed(2)
    : hit.price.toFixed(2);

  return (
    <Link href={`/products/${hit.name}/${hit.objectID}`}>
      <Card
        className="max-w-3xl shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="overflow-hidden p-0">
          <div className="relative w-full h-96">
            <Image
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 rounded-t-xl"
              src={mainImage || "/placeholder-image-url.jpg"} // Placeholder image if mainImage is empty
              alt={hit.name}
              height={512}
              width={512}
              priority
            />
          </div>
        </CardHeader>
        <CardContent className="h-32">
          {isHovered && hit.colorOptions.length > 0 && (
            <div className="my-2 flex space-x-2 overflow-hidden">
              {hit.colorOptions.map((color) => (
                <div
                  key={color} // Use color name as key
                  className="relative w-12 h-12 rounded-full cursor-pointer overflow-hidden border-2 border-gray-300"
                  onMouseEnter={() => {
                    const images = hit.colorOptionImages[color];
                    if (images && images.length > 0) {
                      setMainImage(images[0]); // Set the first image of the selected color
                    }
                  }}
                  onMouseLeave={() => {
                    setMainImage(initialImage); // Reset to initial image
                  }}
                >
                  <Image
                    src={
                      hit.colorOptionImages[color]?.[0] ||
                      "/placeholder-image-url.jpg"
                    }
                    alt={color}
                    className="object-cover"
                    width={256}
                    height={256}
                  />
                </div>
              ))}
            </div>
          )}
          <h2
            className={`font-bold text-lg mb-2 ${
              hit.colorOptions.length ? "mt-1" : ""
            }`}
          >
            <Highlight hit={hit} attribute="name" />
          </h2>
          <p className="text-gray-700">{hit.brand}</p>
          <p className="line-clamp-1 text-gray-700">{hit.description}</p>
          {!isHovered && (
            <>
              <p className="text-gray-700">
                {hit.discount && hit.discount > 0 ? (
                  <>
                    <span>${finalPrice}</span>
                    <span className="mx-2 text-red-500 line-through">
                      ${hit.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>${finalPrice}</span>
                )}
              </p>
              <p className="text-gray-700">
                {hit.colorOptions && hit.colorOptions.length > 0 && (
                  <span>{hit.colorOptions.join(", ")}</span>
                )}
              </p>
            </>
          )}
        </CardContent>
        <CardFooter>{/* Optional footer content can go here */}</CardFooter>
      </Card>
    </Link>
  );
};

export default AlgoliaProductCard;
