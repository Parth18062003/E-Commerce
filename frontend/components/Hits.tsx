"use client";

import React, { useState } from "react";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { Highlight } from "react-instantsearch";
import Image from "next/image";
import Link from "next/link";

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    description: string;
    price: number;
    discount: number;
    sku: string;
    tags: string[];
    category: string;
    brand: string;
    variants: {
      color: string;
      price: number;
      salePrice: number;
      stockQuantity: number;
      sizes: {
        size: string;
        stockQuantity: number;
        sku: string;
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
};

const Hit = ({ hit }: HitProps) => {
  // Safe check for variants to prevent undefined errors
  const variants = Array.isArray(hit.variants) ? hit.variants : [];
  const initialColor = variants.length > 0 ? variants[0].color : ""; // Set initial color to first variant
  const initialImage = initialColor
      ? variants.find((variant) => variant.color === initialColor)?.colorOptionImages[0] || ""
      : "";

  const [mainImage, setMainImage] = useState(initialImage);
  const [selectedColor, setSelectedColor] = useState(initialColor || ""); // Default to the first color

  // Get the selected variant based on the selected color
  const selectedVariant = variants.find((variant) => variant.color === selectedColor);

  // Calculate the final price (with discount applied if present)
  const finalPrice = selectedVariant?.salePrice
      ? selectedVariant.salePrice.toFixed(2)
      : selectedVariant?.price ? selectedVariant.price.toFixed(2) : "0.00";

  return (
      <article className="bg-white relative border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group z-50 my-2">
        <Link href={`/products/${hit.name}/${hit.objectID}/${hit.sku}`}>
          <div className="flex gap-4 p-4">
            <div className="flex-shrink-0 w-32 h-32 relative overflow-hidden rounded-md transition-transform transform group-hover:scale-105">
              <Image
                  src={mainImage || "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/7d12fa05-39c6-4d40-8c81-f5ccb5694fae/U+NIKE+ESC+CMPTNL+TRCK+JKT.png"} // Fallback image if mainImage is empty
                  alt={hit.name}
                  width={256}
                  height={256}
                  className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                <Highlight hit={hit} attribute="name" />
              </h2>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {hit.discount > 0 ? (
                      <>
                        <span className="text-xl font-bold text-indigo-600">${finalPrice}</span>
                        <span className="text-sm text-gray-500 line-through">${(hit?.price)}</span>
                        <span className="text-xs font-medium bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                      {hit.discount}% OFF
                    </span>
                      </>
                  ) : (
                      <span className="text-xl font-bold text-zinc-900">${(hit.price)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{hit.brand}</span>
                  <span>•</span>
                  <span className="text-gray-500">{hit.category}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </article>
  );
};

export default Hit;

/* "use client";

import React from "react";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { Highlight } from "react-instantsearch";
import Image from "next/image";
import Link from "next/link";

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    description: string;
    price: number;
    discount: number;
    brand: string;
    category: string;
    colorOptions: string[];
    colorOptionImages: { [key: string]: string[] };
  }>;
};

function Hit({ hit }: HitProps) {
  const finalPrice = hit.discount
    ? (hit.price - hit.price * (hit.discount / 100)).toFixed(2)
    : (hit.price).toFixed(2);

  return (
    <article className="bg-white relative border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group z-50 my-2 flex-shrink-0 w-[300px] md:w-[350px]">
      <Link href={`/products/${hit.name}/${hit.objectID}`}>
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 w-full h-48 relative overflow-hidden rounded-t-lg transition-transform transform group-hover:scale-105">
            <Image
              src={hit.colorOptionImages[hit.colorOptions[0]][0]}
              alt={hit.name}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex-grow p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              <Highlight hit={hit} attribute="name" />
            </h2>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {hit.discount > 0 ? (
                  <>
                    <span className="text-xl font-bold text-indigo-600">${finalPrice}</span>
                    <span className="text-sm text-gray-500 line-through">${(hit.price).toFixed(2)}</span>
                    <span className="text-xs font-medium bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                      {hit.discount}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-gray-900">${(hit.price).toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{hit.brand}</span>
                <span>•</span>
                <span className="text-gray-500">{hit.category}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default Hit;
 */