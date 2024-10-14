"use client";

import React, { useState } from 'react';
import ProductCard from './ui/product-card';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';
import { color } from 'framer-motion';

const baseProducts = [
  {
    name: 'Air Force 1',
    price: 29.99,
    brand: 'Nike',
    color: 'Red',
    description: 'The Nike Air Force 1 is a classic shoe that combines style and performance.',
    imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/c9e10dd1-687f-4b7b-9f66-41f1999d11b7/NIKE+TERRASCOUT+%28GS%29.png',
    colorOptions: [
      { colorName: 'Red', imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png' },
      { colorName: 'Green', imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/6bd4d2d2-81ea-4319-8f2f-472740d2c7e6/W+AIR+FORCE+1%2707.png' },
      { colorName: 'Blue', imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/68408e8f-cb5a-458d-b751-f9de085976f9/M+NIKE+MC+TRAINER+3.png' },
    ],
  },
  {
    name: 'Air Max',
    price: 49.99,
    brand: 'Nike',
    color: 'Black',
    description: 'The Nike Air Max features a modern design and superior comfort.',
    imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/254f2178-2075-4bba-962c-7f9cc6d00a90/M+NIKE+AIR+ZOOM+TR+1.png',
    colorOptions: [
      { colorName: 'Black', imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5c2d5d73-ca65-41bc-b165-908c1ed77774/JORDAN+ONE+TAKE+5+Q54+PF.png' },
      { colorName: 'White', imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8105abbc-ebce-4da7-9cff-1d81f405b72d/NIKE+AIR+MAX+1+SC.png' },
    ],
  },
  {
    name: 'React Infinity',
    price: 59.99,
    brand: 'Nike',
    color: 'White',
    description: 'The Nike React Infinity offers unmatched comfort for all-day wear.',
    imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/bf8c88df-9d9d-44c9-8ef4-ecfe8f4edff1/NIKE+SB+VERTEBRAE+TE.png',
    colorOptions: [], // Ensure color options are defined, even if empty
  }
  // Add more base products here...
];

// Generate an array of unique products
const products = Array.from({ length: 40 }, (_, index) => {
  const baseProduct = baseProducts[index % baseProducts.length]; // Loop through base products
  return {
    id: index + 1,
    name: `${baseProduct.name} ${index + 1}`,
    price: baseProduct.price,
    imageUrl: baseProduct.imageUrl,
    colorOptions: baseProduct.colorOptions,
    brand: baseProduct.brand,
    color: baseProduct.color,
  };
});

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Display 12 products per page

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginationItems = () => {
    const items = [];
    
    // Previous arrow
    if (currentPage > 1) {
      items.push(
        <button key="prev" onClick={() => setCurrentPage(currentPage - 1)} className="mx-1 text-black px-1 rounded-full" aria-label="Previous page">
          <ChevronLeft />
        </button>
      );
    }

    // First page
    if (totalPages > 1) {
      items.push(
        <button key={1} onClick={() => setCurrentPage(1)} className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-zinc-500 text-white rounded-full' : 'text-black'}`}>
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
        <button key={i} onClick={() => setCurrentPage(i)} className={`mx-1 px-3 py-1 rounded ${currentPage === i ? 'bg-zinc-500 text-white rounded-full' : 'text-black'}`}>
          {i} 
        </button>
      );
    }

    // Last page
    if (currentPage < totalPages - 2) {
      items.push(<span key="ellipsis2" className="mx-1"><Dot /><Dot /> <Dot /></span>);
      items.push(
        <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`mx-1 px-3 py-1 rounded ${currentPage === totalPages ? 'bg-zinc-500 text-white rounded-full' : 'text-black'}`}>
          {totalPages}
        </button>
      );
    }

    // Next arrow
    if (currentPage < totalPages) {
      items.push(
        <button key="next" onClick={() => setCurrentPage(currentPage + 1)} className="mx-1 text-black px-1 rounded-full" aria-label="Next page">
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
