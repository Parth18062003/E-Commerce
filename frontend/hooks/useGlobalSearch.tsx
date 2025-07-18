"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalSearchContextType {
  isSearchModalOpen: boolean;
  searchQuery: string;
  openSearchModal: (query?: string) => void;
  closeSearchModal: () => void;
  setSearchQuery: (query: string) => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(
  undefined
);

export const GlobalSearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openSearchModal = (query = "") => {
    setSearchQuery(query);
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery("");
  };

  const value = {
    isSearchModalOpen,
    searchQuery,
    openSearchModal,
    closeSearchModal,
    setSearchQuery,
  };

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
    </GlobalSearchContext.Provider>
  );
};

export const useGlobalSearch = () => {
  const context = useContext(GlobalSearchContext);
  if (context === undefined) {
    throw new Error("useGlobalSearch must be used within a GlobalSearchProvider");
  }
  return context;
};
