"use client";

import React, { useEffect, useState, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { fetchProducts } from "@/store/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import Loading from "@/app/loading";

const ProductList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error, totalPages, currentPage } = useSelector(
    (state: RootState) => state.product
  );
  const [page, setPage] = useState(1);
  const productsPerPage = 40;

  // Effect to fetch products when the page changes or if not cached
    useEffect(() => {
    // Check if the products for the current page are already cached
    const isProductsCached =
      products.length > 0 && products.length >= productsPerPage * (page - 1);


  }, [dispatch, page, products]); 

  // Handle loading and error states
  if (loading.fetchProducts) return <Loading />; // Display loading state for fetching products
  if (error.fetchProducts) return <div>{error.fetchProducts}</div>; // Display error if occurred

  // Paginate the products for the current page
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handle pagination buttons
  const paginationItems = () => {
    const items: JSX.Element[] = [];

    // Previous arrow
    if (page > 1) {
      items.push(
        <button
          key="prev"
          onClick={() => setPage(page - 1)}
          className="mx-1 text-black px-1 rounded-full"
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>
      );
    }

    // First page
    if (totalPages > 1) {
      items.push(
        <button
          key={1}
          onClick={() => setPage(1)}
          className={`mx-1 px-3 py-1 rounded ${
            page === 1 ? "bg-zinc-500 text-white rounded-full" : "text-black"
          }`}
        >
          1
        </button>
      );
    }

    // Ellipsis if necessary
    if (page > 3) {
      items.push(
        <span key="ellipsis1" className="mx-1">
          ...
        </span>
      );
    }

    // Middle pages
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      items.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`mx-1 px-3 py-1 rounded ${
            page === i ? "bg-zinc-500 text-white rounded-full" : "text-black"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (page < totalPages - 2) {
      items.push(
        <span key="ellipsis2" className="mx-1">
          <Dot />
          <Dot /> <Dot />
        </span>
      );
      items.push(
        <button
          key={totalPages}
          onClick={() => setPage(totalPages)}
          className={`mx-1 px-3 py-1 rounded ${
            page === totalPages
              ? "bg-zinc-500 text-white rounded-full"
              : "text-black"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    // Next arrow
    if (page < totalPages) {
      items.push(
        <button
          key="next"
          onClick={() => setPage(page + 1)}
          className="mx-1 text-black px-1 rounded-full"
          aria-label="Next page"
        >
          <ChevronRight />
        </button>
      );
    }

    return items;
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

      </div>   
      <div className="flex justify-center mt-4 h-8">{paginationItems()}</div>
    </div>
  );
};

export default ProductList;
