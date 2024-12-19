"use client";

import AllProducts from '@/components/ManageProduct/AllProductDashboardList'
import { ProductHeader } from '@/components/ManageProduct/product-header';
import React, { useState } from 'react'

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <div>
      <ProductHeader onSearch={setSearchTerm} />
      <AllProducts searchTerm={searchTerm} /></div>
  )
}

export default ProductsPage