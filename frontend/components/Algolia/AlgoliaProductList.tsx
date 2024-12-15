/* "use client";

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
  sku: string;
  tags: string[];
  category: string;
  brand: string;
  variants: {
    color: string;
    price: number;
    discount: number;
    sku: string;
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

const AlgoliaProductList: React.FC = () => {
  // Use the new useSearchResults hook to fetch search results
  const { items } = useHits<AlgoliaProduct>();
  // Handle loading and error states
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((hit) => (
          <AlgoliaProductCard key={hit.objectID} hit={hit} />
        ))}
      </div>
    </div>
  );
};

export default AlgoliaProductList;
 */
/* "use client";

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
  sku: string;
  tags: string[];
  category: string;
  brand: string;
  variants: {
    color: string;
    price: number;
    discount: number;
    sku: string;
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

type AlgoliaProductListProps = {
  searchFilter?: string; // Only searchFilter is required now
};

const AlgoliaProductList: React.FC<AlgoliaProductListProps> = ({ searchFilter }) => {
  // Use the new useSearchResults hook to fetch search results
  const { items } = useHits<AlgoliaProduct>();

  // Helper function to apply the search filter
  const applySearchFilter = (product: AlgoliaProduct) => {
    if (!searchFilter) return true; // If no searchFilter, return true to include all products
  
    // Split the filter into multiple words or phrases (comma-separated)
    const filters = searchFilter.toLowerCase().split(",").map(f => f.trim());
  
    // Check if product matches any of the filter terms in its relevant fields
    return filters.every(filter => {
      const matchesCategory = product.category.toLowerCase().includes(filter);
      const matchesGender = product.gender.toLowerCase().includes(filter);
      const matchesBrand = product.brand.toLowerCase().includes(filter);
      const matchesTags = product.tags.some(tag => tag.toLowerCase().includes(filter));
      const matchesType = product.type.toLowerCase().includes(filter);

      // If any condition is met, the product should be included
      return (
        matchesCategory || matchesGender || matchesBrand || matchesTags || matchesType
      );
    });
  };

  // Handle loading and error states
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items
          .filter(applySearchFilter) // Apply search filter to all products
          .map((product) => (
            <AlgoliaProductCard key={product.objectID} hit={product} />
          ))}
      </div>
    </div>
  );
};

export default AlgoliaProductList;
 */import React from 'react';
import { useHits } from 'react-instantsearch';
import AlgoliaProductCard from './AlgoliaProductCard';
import { CustomConfigure } from './CustomConfigure'; // Import the custom Configure
import { Hit } from 'algoliasearch';

type AlgoliaProduct = Hit<{
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
    discount: number;
    sku: string;
    stockQuantity: number;
    sizes: { size: string; stockQuantity: number }[];
    colorOptionImages: string[];
  }[];
  type: string;
  gender: string;
  material: string;
  releaseDate: string;
  rating: number;
  objectID: string;
}>;

type AlgoliaProductListProps = {
  searchFilter?: string; // The filter prop passed from parent or UI
};

const AlgoliaProductList: React.FC<AlgoliaProductListProps> = ({ searchFilter }) => {
  // Construct the filters dynamically from the searchFilter prop
  const { items } = useHits<AlgoliaProduct>();
  return (
    <div className="p-4">
      <CustomConfigure filters={searchFilter} /> {/* Pass the dynamic filters to CustomConfigure */}
      
      {/* Render the product list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Render filtered products */}
        {items.map((product) => (
          <AlgoliaProductCard key={product.objectID} hit={product} />
        ))}
      </div>
    </div>
  );
};

export default AlgoliaProductList;
