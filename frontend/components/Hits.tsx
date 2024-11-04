"use client";

import React from "react";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { Highlight } from "react-instantsearch";
import Image from "next/image";

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
    <article className="bg-white relative border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group z-50 my-2">
      <div className="flex gap-4 p-4">
        <div className="flex-shrink-0 w-32 h-32 relative overflow-hidden rounded-md transition-transform transform group-hover:scale-105">
          <Image
            src={hit.colorOptionImages[hit.colorOptions[0]][0]}
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
                  <span className="text-xl font-bold text-red-600">${finalPrice}</span>
                  <span className="text-sm text-gray-500 line-through">${(hit.price).toFixed(2)}</span>
                  <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
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
      {/* Optional: Add a badge for new arrivals */}
{/*       {hit.discount > 20 && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          New Arrival
        </div>
      )} */}
    </article>
  );
}

export default Hit;
