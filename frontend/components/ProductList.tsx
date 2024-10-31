"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ui/product-card';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';
import { fetchProducts } from '@/store/productSlice';
import { AppDispatch, RootState } from '@/store/store';
import Loading from '@/app/loading';

const ProductList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error, totalPages } = useSelector((state: RootState) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 40;
  
  useEffect(() => {
    // Check if products for the current page are already cached
    const isProductsCached = products.length > 0 && products.length >= productsPerPage * (currentPage - 1);
  
    if (!isProductsCached) {
      dispatch(fetchProducts(currentPage - 1));
    }
  }, [dispatch, currentPage, products, productsPerPage]);  
  

  // Handle loading and error states
  if (loading) return <><Loading /></>;
  if (error) return <div>{error}</div>;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginationItems = () => {
    const items: JSX.Element[] = [];

    // Previous arrow
    if (currentPage > 1) {
      items.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
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
          onClick={() => setCurrentPage(1)}
          className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-zinc-500 text-white rounded-full' : 'text-black'}`}
        >
          1
        </button>
      );
    }

    // Ellipsis if necessary
    if (currentPage > 3) {
      items.push(<span key="ellipsis1" className="mx-1">...</span>);
    }

    // Middle pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 px-3 py-1 rounded ${currentPage === i ? 'bg-zinc-500 text-white rounded-full' : 'text-black'}`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (currentPage < totalPages - 2) {
      items.push(<span key="ellipsis2" className="mx-1"><Dot /><Dot /> <Dot /></span>);
      items.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`mx-1 px-3 py-1 rounded ${currentPage === totalPages ? 'bg-zinc-500 text-white rounded-full' : 'text-black'}`}
        >
          {totalPages}
        </button>
      );
    }

    // Next arrow
    if (currentPage < totalPages) {
      items.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
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
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-4 h-8">
        {paginationItems()}
      </div>
    </div>
  );
};

export default ProductList;
