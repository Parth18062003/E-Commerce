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
import { updateStock } from "@/store/inventorySlice";
import { AppDispatch } from "@/store/store";
import { InventoryItem } from "./types";

const stockSchema = z.object({
    stockQuantity: z.number().min(0, "Stock quantity cannot be negative"),
});

type FormData = z.infer<typeof stockSchema>;

interface StockEditDialogProps {
    item: InventoryItem | null;
    onClose: () => void;
}

export function StockEditDialog({ item, onClose }: StockEditDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(stockSchema),
        defaultValues: {
            stockQuantity: item?.stockQuantity || 0,
        },
    });

    const onSubmit = async (data: FormData) => {
        if (!item) return;
        setLoading(true);
        try {
            await dispatch(updateStock({
                productId: item.productId,
                variantSku: item.variantSku,
                size: item.size,
                quantity: data.stockQuantity,
            })).unwrap();
            onClose();
        } catch (error) {
            console.error("Failed to update stock:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!item) return null;

    return (
        <Dialog open={!!item} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-800">
                <DialogHeader>
                    <DialogTitle>Add Stock - {item.variantSku}</DialogTitle>
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
                            <Label>Stock Quantity</Label>
                            <Input type="number" {...register("stockQuantity", { valueAsNumber: true })} />
                            {errors.stockQuantity && (
                                <p className="text-sm text-red-500 mt-1">{errors.stockQuantity.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}