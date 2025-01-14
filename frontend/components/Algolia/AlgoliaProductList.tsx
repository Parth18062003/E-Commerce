"use client";

import React from "react";
import { ClearRefinements, useHits } from "react-instantsearch";
import AlgoliaProductCard from "./AlgoliaProductCard";
import { CustomConfigure } from "./CustomConfigure"; // Import the custom Configure
import { Hit } from "algoliasearch";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "../ui/button";

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

const AlgoliaProductList: React.FC<AlgoliaProductListProps> = ({
  searchFilter,
}) => {
  // Construct the filters dynamically from the searchFilter prop
  const { items } = useHits<AlgoliaProduct>();
  return (
    <div className="p-4">
      <CustomConfigure filters={searchFilter} />{" "}
      {/* Pass the dynamic filters to CustomConfigure */}
      {/* Render the product list */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-8"
        >
          <div className="max-w-md mx-auto">
            <Image
              src="https://images.unsplash.com/photo-1525785967371-87ba44b3e6cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNhZCUyMGNhdHxlbnwwfHwwfHx8Mg%3D%3D" // Add a relevant illustration
              alt="No products found"
              width={512}
              height={512}
              className="w-full h-full object-cover rounded-lg mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-zinc-700 mb-2">
              No Products Found
            </h3>
            <p className="text-muted-foreground">
              We couldn't find any products matching your search. Try adjusting
              your filters or keywords.
            </p>
            <ClearRefinements
              className="my-4"
              translations={{
                resetButtonText: "Clear Filters",
              }}
            />
          </div>
        </motion.div>
      )}
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
