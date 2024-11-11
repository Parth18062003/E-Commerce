"use client";

import React from "react";
import { useHits } from "react-instantsearch";
import AlgoliaProductCard from "./AlgoliaProductCard";
import { Hit } from "algoliasearch";

// Define the structure of the product
type AlgoliaProduct = Hit<{
  name: string;
  description: string;
  price: number;
  discount: number;
  brand: string;
  category: string;
  colorOptions: string[];
  colorOptionImages: {
    [key: string]: string[];
  };
  tags: string[];
  sizes: string[];
  sku: string;
  objectID: string;
}>;

const AlgoliaProductList: React.FC = () => {
  // Use the new useSearchResults hook to fetch search results
  const { items } = useHits<AlgoliaProduct>();
  // Handle loading and error states
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Map over the hits and render a product card for each */}
        {items.map((hit) => (
          <AlgoliaProductCard key={hit.objectID} hit={hit} />
        ))}
      </div>
    </div>
  );
};

export default AlgoliaProductList;
