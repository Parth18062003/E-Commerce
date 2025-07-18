"use client";

import React, { useState, useEffect } from "react";
import {
  Configure,
  Hits,
  SearchBox,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { usePathname } from "next/navigation";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import GlobalSearchModal from "./GlobalSearchModal";

const ProductSearch = () => {
  const { results } = useInstantSearch();
  const { query } = useSearchBox();
  const { isSearchModalOpen, closeSearchModal } = useGlobalSearch();
  const pathname = usePathname();

  return (
    <>
      {/* Global Search Modal - only show when not on products page */}
      {pathname !== "/products" && (
        <GlobalSearchModal 
          isOpen={isSearchModalOpen} 
          onClose={closeSearchModal}
        />
      )}
    </>
  );
};

export default ProductSearch;