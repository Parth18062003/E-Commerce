"use client";

import React, { useState, useEffect } from "react";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { Configure, Highlight } from "react-instantsearch";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { createSlug } from "@/lib/utils";

// ProductCardProps updated to accept only searchFilter as a prop
export type ProductCardProps = {
  hit: AlgoliaHit<{
    name: string;
    description: string;
    price: number | null;
    discount: number | null;
    sku: string;
    tags: string[];
    category: string;
    brand: string;
    variants: {
      color: string;
      price: number;
      sku: string;
      discount: number;
      stockQuantity: number;
      sizes: {
        size: string;
        stockQuantity: number;
      }[];
      colorOptionImages: string[];
    }[];
    type: string;
    gender: string;
    material: string;
    releaseDate: string;
    rating: number;
    objectID: string;
  }>;
  searchFilter?: string; // Accept a search filter as a prop
};

const AlgoliaProductCard: React.FC<ProductCardProps> = ({ hit, searchFilter }) => {
  // Early return if searchFilter doesn't match any part of the product
  if (searchFilter) {
    const lowercasedFilter = searchFilter.toLowerCase();
    const matchSearch = 
      hit.gender.toLowerCase().includes(lowercasedFilter) ||
      hit.type.toLowerCase().includes(lowercasedFilter) ||
      hit.category.toLowerCase().includes(lowercasedFilter) ||
      hit.tags.some(tag => tag.toLowerCase().includes(lowercasedFilter)) ||
      hit.brand.toLowerCase().includes(lowercasedFilter);

    if (!matchSearch) {
      return null; // Return nothing if no match
    }
  }

  // Safe check for variants to prevent undefined errors
  const variants = Array.isArray(hit.variants) ? hit.variants : [];

  // Get the initial color and the corresponding initial image URL
  const initialColor = variants.length > 0 ? variants[0].color : "";
  const initialImage = initialColor
    ? variants.find((variant) => variant.color === initialColor)
        ?.colorOptionImages[0] || ""
    : "";

  const [mainImage, setMainImage] = useState(initialImage);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(initialColor || ""); // Default to the first color

  // Get selected variant for the selected color
  const selectedVariant = variants.find(
    (variant) => variant.color === selectedColor
  );

  // Calculate the final price (with discount applied if present)
  const finalPrice = selectedVariant?.price
    ? selectedVariant.discount
      ? (
          selectedVariant.price - 
          selectedVariant.price * (selectedVariant.discount / 100)
        ).toFixed(2)
      : selectedVariant.price.toFixed(2)
    : "0.00";

  return (
    <>
      <Link href={`/products/${createSlug(hit.name)}/${hit.objectID}/${createSlug(hit.sku)}`}>
        <Card
          className="max-w-3xl shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardHeader className="overflow-hidden p-0">
            <div className="relative w-full h-96">
              <Image
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 rounded-t-xl"
                src={mainImage || "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/7d12fa05-39c6-4d40-8c81-f5ccb5694fae/U+NIKE+ESC+CMPTNL+TRCK+JKT.png"}
                alt={hit.name}
                height={512}
                width={512}
                priority
              />
            </div>
          </CardHeader>
          <CardContent className="h-32">
            {isHovered && (
              <div className="my-2 flex space-x-2 overflow-hidden">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="relative w-12 h-12 rounded-full cursor-pointer overflow-hidden border-2 border-gray-300"
                    onMouseEnter={() => {
                      if (
                        variant.colorOptionImages &&
                        variant.colorOptionImages.length > 0
                      ) {
                        setMainImage(variant.colorOptionImages[0]);
                      }
                    }}
                    onMouseLeave={() => {
                      setMainImage(initialImage || "/placeholder-image-url.jpg");
                    }}
                  >
                    <Image
                      src={variant.colorOptionImages[0] || mainImage}
                      alt={variant.color}
                      className="object-cover"
                      width={256}
                      height={256}
                    />
                  </div>
                ))}
              </div>
            )}
            <h2 className="font-bold text-lg mb-2 mt-1">
              <Highlight hit={hit} attribute="name" />
            </h2>
            <p className="text-gray-700">{hit.brand}</p>
            <p className="line-clamp-1 text-gray-700">{hit.description}</p>
            {!isHovered && (
              <>
                <p className="text-gray-700">
                  {selectedVariant?.price ? (
                    <>
                      {selectedVariant.discount > 0 ? (
                        <>
                          <span className="text-indigo-500 text-lg font-semibold">
                            ${finalPrice}
                          </span>
                          <span className="mx-2 text-zinc-600 line-through">
                            ${selectedVariant.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-indigo-500 text-lg font-semibold">
                          ${finalPrice}
                        </span>
                      )}
                    </>
                  ) : (
                    <span>${finalPrice}</span>
                  )}
                </p>
                <p className="text-zinc-700">
                  {variants && variants.length > 0 && (
                    <span>
                      {variants.map((variant) => variant.color).join(", ")}
                    </span>
                  )}
                </p>
              </>
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </Link>
    </>
  );
};

export default AlgoliaProductCard;
