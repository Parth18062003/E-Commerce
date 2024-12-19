"use client";

import React, { useState } from "react";
import { FilterOptions, FilterProducts } from "./Filter";
import { X } from "lucide-react";
import AlgoliaProductList from "./Algolia/AlgoliaProductList";
import CustomSortBy from "./Algolia/CustomSortBy";
import CustomPagination from "./Algolia/CustomPagination";
import CustomHitsPerPage from "./Algolia/CustomHitsPerPage";
import CustomCurrentRefinements from "./Algolia/CustomCurrentRefinements";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Configure } from "react-instantsearch";

const FilterAndSort = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const sortOptions = [
    { label: "Featured", value: "products" },
    { label: "Newest", value: "instant_search_newest" },
    { label: "Price [Low - High]", value: "instant_search_price_asc" },
    { label: "Price [High - Low]", value: "instant_search_price_desc" },
  ];

  const toggleFilterSidebar = () => {
    setIsFilterVisible((prev) => !prev);
  };

  const handleOverlayClick = () => {
    if (isFilterVisible) {
      setIsFilterVisible(false);
    }
  };

  // Extract filter type (e.g., "brand", "gender") from the URL path
  const filterType = params.filter as string;
  // Extract the value of the filter (e.g., "Nike", "mens") from the query string
  const filterValue = searchParams.get(filterType);

  // Ensure filterValue is a string (handle if it's an array)
  const filterValueString = Array.isArray(filterValue)
    ? filterValue[0]
    : filterValue;

  // Combine filter type and value for the searchFilter prop
  const searchFilter =
    filterType && filterValueString ? `${filterType}:${filterValueString}` : "";

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
          onClick={handleOverlayClick}
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
          <button className="text-black" onClick={toggleFilterSidebar}>
            <X aria-label="Close Filters" />
          </button>
        </div>
        <div className="p-4">
          <FilterOptions />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        <div className="flex justify-end items-center text-black mx-6 gap-4 mt-5">
          <div className="flex items-center gap-4">
            <Configure hitsPerPage={9} />
            <CustomCurrentRefinements />
            <FilterProducts toggleFilterSidebar={toggleFilterSidebar} />
            <CustomSortBy items={sortOptions} />
            <CustomHitsPerPage
              items={[
                { label: "36 products per page", value: 36, default: true },
                { label: "54 products per page", value: 72 },
              ]}
            />
          </div>
        </div>

        {/* Product List */}
        <div className="w-full mt-5">
          <AlgoliaProductList searchFilter={searchFilter} />
          {/* <ProductList /> */}
        </div>
        <CustomPagination />
      </div>
    </div>
  );
};

export default FilterAndSort;
