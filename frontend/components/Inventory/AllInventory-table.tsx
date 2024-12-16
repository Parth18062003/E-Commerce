"use client";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setSort, fetchAllInventory } from "@/store/inventorySlice";
import { InventoryItem } from "./types";
import { StockEditDialog } from "./stock-edit-dialog";
import { StockReduceDialog } from "./reduce-stock-dialog";
import { AddStockDialog } from "./add-stock-dialog";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface InventoryTableProps {
  searchTerm: string;
}

export function AllInventoryTable({ searchTerm }: InventoryTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items, filter, sort, pagination, loading } = useSelector((state: RootState) => state.inventory);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [reduceItem, setReduceItem] = useState<InventoryItem | null>(null);
  const [addSizeItem, setAddSizeItem] = useState<InventoryItem | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    dispatch(fetchAllInventory({ page: 0, pageSize: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (pagination.totalPages <= pagination.page + 1) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [pagination]);

  const handleSort = (key: keyof InventoryItem | "variant.color" | "updatedAt" | "sizeStock.size") => {
    const direction = sort.key === key && sort.direction === "asc" ? "desc" : "asc";
    dispatch(setSort({ key, direction }));
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
      loading.fetch ||
      !hasMore
    ) {
      return;
    }
    dispatch(fetchAllInventory({ page: pagination.page + 1, pageSize: 10 }));
  }, [dispatch, loading.fetch, hasMore, pagination]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const filteredItems = items.flatMap((item) => {
    const { sku, color } = filter;
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (
      (!sku || item.variantSku.toLowerCase().includes(sku.toLowerCase())) &&
      (!color || item.variant.color.toLowerCase().includes(color.toLowerCase())) &&
      (item.variantSku.toLowerCase().includes(lowerSearchTerm) ||
        item.productId.toLowerCase().includes(lowerSearchTerm) ||
        item.variant.color.toLowerCase().includes(lowerSearchTerm))
    ) {
      return item.variant.sizeStock.map((sizeStock) => ({
        ...item,
        size: sizeStock.size,
        stockQuantity: sizeStock.stockQuantity,
      }));
    }
    return [];
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const { key, direction } = sort;
    const modifier = direction === "asc" ? 1 : -1;
    if (key === "updatedAt") {
      return a.updatedAt.localeCompare(b.updatedAt) * modifier;
    }
    if (key === "variant.color") {
      return a.variant.color.localeCompare(b.variant.color) * modifier;
    }
    if (key === "sizeStock.size") {
      const sizeA = parseFloat(a.size); // Convert size to number
      const sizeB = parseFloat(b.size); // Convert size to number
      return (sizeA - sizeB) * modifier;
    }
    // Fallback to direct property comparison
    if (a[key as keyof InventoryItem] > b[key as keyof InventoryItem]) return modifier;
    if (a[key as keyof InventoryItem] < b[key as keyof InventoryItem]) return -modifier;
    return 0;
  });

  return (
    <>
      {items.length === 0 ? (
        <div className="text-black text-3xl flex justify-center items-center">
          😞 No Inventory Found.
        </div>
      ) : (
        <div className="rounded-md border text-zinc-600">
          <div className="mb-4 flex float-right gap-x-4">
          </div>
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead>Sr. No.</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("variantSku")}>
                  SKU
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("productId")}>
                  ProductID
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("variant.color")}>
                  Color
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("size")}>
                  Size
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("stockQuantity")}>
                  Total Stock
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("reservedStock")}>
                  Reserved
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("availableStock")}>
                  Available
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("updatedAt")}>
                  Last Updated
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item, index) => (
                <TableRow key={`${item.variantSku}-${item.size}`}>
                    <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.variantSku}</TableCell>
                  <TableCell onClick={() => (router.push(`/dashboard/admin/inventory/${item.productId}`))}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>{item.productId}</TooltipTrigger>
                            <TooltipContent>View Inventory for product {item.variantSku}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    </TableCell>
                  <TableCell>{item.variant.color}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell className="text-right">{item.stockQuantity}</TableCell>
                  <TableCell className="text-right">{item.reservedStock}</TableCell>
                  <TableCell className="text-right">{item.stockQuantity - item.reservedStock}</TableCell>
                  <TableCell className="text-right">
                    {format(new Date(item.updatedAt), "dd-MM-yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell className="text-right space-x-4">
                    <Button variant="outline" size="sm" onClick={() => setEditItem(item)}>
                      Edit Stock
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setReduceItem(item)}>
                      Reduce Stock
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/admin/inventory/${item.productId}`)}>  
                      View Inventory
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
            </TableBody>
          </Table>
          {loading.fetch && <div>Loading more...</div>}
          {!hasMore && <div className="text-center text-2xl my-4">No more items to load.</div>}
          <AddStockDialog item={addSizeItem} onClose={() => setAddSizeItem(null)} />
          <StockEditDialog item={editItem} onClose={() => setEditItem(null)} />
          <StockReduceDialog item={reduceItem} onClose={() => setReduceItem(null)} />
        </div>
      )}
    </>
  );
}