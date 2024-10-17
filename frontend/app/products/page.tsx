import React from "react";
import FilterAndSort from "@/components/FilterAndSort";
import ProductList from "@/components/ProductList";

const ProductPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex">
      <FilterAndSort />
    </div>
  );
};

export default ProductPage;
