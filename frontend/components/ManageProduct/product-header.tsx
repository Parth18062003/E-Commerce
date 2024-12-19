"use client";

import { useEffect, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProducts } from "@/store/productSlice";

interface ProductHeaderProps {
  onSearch: (term: string) => void;
}

export function ProductHeader({ onSearch }: ProductHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.product);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Handle search term changes and dispatch filter updates
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  // Refresh products by fetching items
  const handleRefresh = () => {
    dispatch(fetchProducts({ page: 0, size: 20 }));
  };

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 20 }));
  }, [dispatch]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by SKU, Product ID, or Name..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 text-zinc-800"
        />
      </div>
      <div className="flex gap-2 text-zinc-600">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading.fetchProducts} // Disable refresh button while data is being fetched
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      {error && <div className="text-red-500 mt-2">{error.fetchProducts}</div>}
    </div>
  );
}
