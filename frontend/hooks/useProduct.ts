/* "use client";

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/store/store';
import { fetchProducts } from '@/store/productSlice';

export const useProduct = (page: number, size: number) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get the current product state from Redux
  const { products, loading, error, productsCache, totalPages, currentPage } = useSelector(
    (state: RootState) => state.product
  );

  const currentDate = new Date().toLocaleDateString('en-CA');
  // Cache key to store/fetch products based on the page and size
  const cacheKey = `products_page_${page}`;

  useEffect(() => {
    // Check if the data is already cached for the given page
    if (!productsCache[cacheKey]) {
      // If not cached, fetch products
      dispatch(fetchProducts({ page, size }));
    }
  }, [dispatch, page, size, productsCache, cacheKey]);

  // Return the products, loading state, error, and pagination information
  return {
    products: productsCache[cacheKey] || [], // Return cached products or empty array
    loading,
    error,
    totalPages,
    currentPage
  };
};
 */
// hooks/useProduct.tsx
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/store/store';
import { fetchProducts } from '@/store/productSlice';

export const useProduct = (page: number, size: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, productsCache, totalPages, currentPage } = useSelector(
    (state: RootState) => state.product
  );

  const cacheKey = `products_page_${page}`;

  useEffect(() => {
    // Only fetch client-side
    if (typeof window !== 'undefined' && !productsCache[cacheKey]) {
      dispatch(fetchProducts({ page, size }));
    }
  }, [dispatch, page, size, productsCache, cacheKey]);

  return {
    products: productsCache[cacheKey] || [],
    loading,
    error,
    totalPages,
    currentPage,
  };
};
