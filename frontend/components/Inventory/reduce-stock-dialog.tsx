"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { reduceStock } from "@/store/inventorySlice"; // Action to reduce stock
import { AppDispatch } from "@/store/store";
import { InventoryItem } from "./types";

const stockSchema = z.object({
  reduceQuantity: z.number().min(0, "Quantity to reduce cannot be negative"),
});

type FormData = z.infer<typeof stockSchema>;

interface StockReduceDialogProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export function StockReduceDialog({ item, onClose }: StockReduceDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      reduceQuantity: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!item) return;

    // Ensure reduce quantity is not greater than available stock
    if (data.reduceQuantity > item.stockQuantity) {
      alert("Cannot reduce more than the available stock.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(reduceStock({
        productId: item.productId,
        variantSku: item.variantSku,
        color: item.variant.color,
        size: item.size,
        quantity: data.reduceQuantity,
      })).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to reduce stock:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-800">
        <DialogHeader>
          <DialogTitle>Reduce Stock - {item.variantSku}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-zinc-50">
          <div className="grid gap-4">
            <div>
              <Label>SKU</Label>
              <Input value={item.variantSku} disabled />
            </div>
            <div>
              <Label>ProductID</Label>
              <Input value={item.productId} disabled />
            </div>
            <div>
              <Label>Color</Label>
              <Input value={item.variant.color} disabled />
            </div>
            <div>
              <Label>Size</Label>
              <Input value={item.size} disabled />
            </div>
            <div>
              <Label>Reduce Quantity</Label>
              <Input
                type="number"
                {...register("reduceQuantity", { valueAsNumber: true })}
                min={0}
                max={item.stockQuantity}
              />
              {errors.reduceQuantity && (
                <p className="text-sm text-red-500 mt-1">{errors.reduceQuantity.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Reduce Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
