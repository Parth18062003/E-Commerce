"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setSort,
  fetchInventoryItems
} from "@/store/inventorySlice";
import { InventoryItem } from "./types";
import { StockEditDialog } from "./stock-edit-dialog";
import { StockReduceDialog } from "./reduce-stock-dialog";
import { AddStockDialog } from "./add-stock-dialog";

interface InventoryTableProps {
  searchTerm: string;
}

export function InventoryTable({ searchTerm }: InventoryTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, filter, sort, pagination } = useSelector(
    (state: RootState) => state.inventory
  );
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [reduceItem, setReduceItem] = useState<InventoryItem | null>(null);
  const [addSizeItem, setAddSizeItem] = useState<InventoryItem | null>(null); // New state for add size dialog
  const [selectedVariant, setSelectedVariant] = useState<InventoryItem | null>(
    null
  ); // State for selected variant

  const handleSort = (
    key: keyof InventoryItem | "variant.color" | "updatedAt" | "sizeStock.size"
  ) => {
    const direction =
      sort.key === key && sort.direction === "asc" ? "desc" : "asc";
    dispatch(setSort({ key, direction }));
  };


  useEffect(() => {
    if (filter.productId) dispatch(fetchInventoryItems(filter.productId)); // Fetch inventory when `productId` changes
  }, [filter.productId, dispatch]);

  const filteredItems = items.flatMap((item) => {
    const { sku, color } = filter;
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (
      (!sku || item.variantSku.toLowerCase().includes(sku.toLowerCase())) &&
      (!color ||
        item.variant.color.toLowerCase().includes(color.toLowerCase())) &&
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
      return a.size.localeCompare(b.size) * modifier;
    }

    // Fallback to direct property comparison
    if (a[key as keyof InventoryItem] > b[key as keyof InventoryItem])
      return modifier;
    if (a[key as keyof InventoryItem] < b[key as keyof InventoryItem])
      return -modifier;
    return 0;
  });

/*   const paginatedItems = sortedItems.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );
 */
  return (
    <>
      {items.length === 0 ? (
        <div className="text-black text-3xl flex justify-center items-center">
          😞 No Inventory Found.
        </div>
      ) : (
        <div className="rounded-md border text-zinc-600">
          <div className="mb-4 flex float-right gap-x-4">
            <Select
              onValueChange={(value) => {
                const selected = items.find(
                  (item) => item.variantSku === value
                );
                setSelectedVariant(selected || null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Variant SKU" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.variantSku} value={item.variantSku}>
                    {item.variantSku} - {item.variant.color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="default"
              size="sm"
              onClick={() => setAddSizeItem(selectedVariant)}
              disabled={!selectedVariant}
            >
              Add New Size
            </Button>
          </div>
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("variantSku")}
                >
                  SKU
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("productId")}
                >
                  ProductID
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("variant.color")}
                >
                  Color
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("sizeStock.size")}
                >
                  Size
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("stockQuantity")}
                >
                  Total Stock
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("reservedStock")}
                >
                  Reserved
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("availableStock")}
                >
                  Available
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("updatedAt")}
                >
                  Last Updated
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow key={`${item.variantSku}-${item.size}`}>
                  <TableCell className="font-medium">
                    {item.variantSku}
                  </TableCell>
                  <TableCell>{item.productId}</TableCell>
                  <TableCell>{item.variant.color}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell className="text-right">
                    {item.stockQuantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.reservedStock}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.stockQuantity - item.reservedStock}
                  </TableCell>
                  <TableCell className="text-right">
                    {format(new Date(item.updatedAt), "dd-MM-yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell className="text-right space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditItem(item)}
                    >
                      Edit Stock
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReduceItem(item)}
                    >
                      Reduce Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AddStockDialog
            item={addSizeItem}
            onClose={() => setAddSizeItem(null)}
          />
          <StockEditDialog item={editItem} onClose={() => setEditItem(null)} />
          <StockReduceDialog
            item={reduceItem}
            onClose={() => setReduceItem(null)}
          />
        </div>
      )}
    </>
  );
}
