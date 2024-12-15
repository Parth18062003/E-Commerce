"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  Download,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "../utils/exportInventory";
import { AppDispatch, RootState } from "@/store/store"; 
import { fetchInventoryItems } from "@/store/inventorySlice";

interface InventoryHeaderProps {
  onSearch: (term: string) => void;
}

export function InventoryHeader({ onSearch }: InventoryHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.inventory
  );
  const params = useParams();
  const productIdFromUrl = params.productId as string;
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Handle search term changes and dispatch filter updates
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value); 
  };

  // Export inventory data to CSV
  const handleExport = () => {
    exportToCSV(items, `inventory-export-${productIdFromUrl}.csv`);
  };

  // Refresh inventory by fetching items
  const handleRefresh = () => {
    if (productIdFromUrl) {
      dispatch(fetchInventoryItems(productIdFromUrl));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by SKU, Product ID, or Color..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 text-zinc-800"
        />
      </div>
      <div className="flex gap-2 text-zinc-600">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading.fetch} // Disable refresh button while data is being fetched
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
