"use client";

import React, { useState } from "react";
import { DropdownSort } from "./DropdownSort";
import { FilterOptions, FilterProducts } from "./Filter";
import ProductList from "./ProductList";
import { X } from "lucide-react";

const FilterAndSort = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false); // State to manage filter visibility

  const toggleFilterSidebar = () => {
    setIsFilterVisible((prev) => !prev); // Toggle visibility
  };

  // Close the sidebar when clicking outside on desktop
  const handleOverlayClick = () => {
    if (isFilterVisible) {
      setIsFilterVisible(false);
    }
  };

  return (
    <div className="flex w-full relative">
      {/* Sidebar for Desktop */}
      <aside
        className={`text-black min-h-screen w-1/3 border-r border-zinc-500 shadow-xl transition-transform duration-300 hidden ${
          isFilterVisible ? "lg:block" : "hidden"
        }`}
      >
        <div className="p-4">
          <h2 className="font-bold">Filters</h2>
          <FilterOptions />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isFilterVisible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
          onClick={handleOverlayClick} // Close sidebar when clicking outside
        />
      )}

      {/* Mobile Filter Sidebar */}
      <aside
        className={`fixed bg-white z-20 w-full text-black min-h-screen border-r border-zinc-500 shadow-xl transition-transform duration-300 lg:hidden ${
          isFilterVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold">Filters</h2>
          <button
            className="text-black font-bold"
            onClick={toggleFilterSidebar}
          >
            <X aria-label="Close Filters"/>
          </button>
        </div>
        <div className="p-4">
          <FilterOptions />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Top Bar for DropdownSort and FilterProducts */}
        <div className="flex justify-end text-black mx-6 gap-12 mt-5">
          <DropdownSort />
          <div className="flex items-center">
            <FilterProducts toggleFilterSidebar={toggleFilterSidebar} />
          </div>
        </div>

        {/* Product List */}
        <div className="w-full mt-5">
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default FilterAndSort;
