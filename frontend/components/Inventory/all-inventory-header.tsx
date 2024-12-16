"use client";

import { useState } from "react";
import { Search, Download, RefreshCw, PackagePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "../utils/exportInventory";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllInventory } from "@/store/inventorySlice";
import { CreateInventoryDialog } from "./create-inventory-dialog";

interface InventoryHeaderProps {
  onSearch: (term: string) => void;
}

export function AllInventoryHeader({ onSearch }: InventoryHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.inventory
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddInventoryDialogOpen, setIsAddInventoryDialogOpen] =
    useState<boolean>(false);

  // Handle search term changes and dispatch filter updates
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  // Export inventory data to CSV
  const handleExport = () => {
    exportToCSV(
      items,
      `inventory-export-${new Date().toLocaleString("en-ca")}.csv`
    );
  };

  // Refresh inventory by fetching items
  const handleRefresh = () => {
    dispatch(fetchAllInventory({ page: 0, pageSize: 10 }));
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

        <Button onClick={() => setIsAddInventoryDialogOpen(true)}>
        <PackagePlus className="h-4 w-4 mr-2" />
          New Inventory
        </Button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {isAddInventoryDialogOpen && (
        <CreateInventoryDialog
          onClose={() => setIsAddInventoryDialogOpen(false)}
        />
      )}
    </div>
  );
}
