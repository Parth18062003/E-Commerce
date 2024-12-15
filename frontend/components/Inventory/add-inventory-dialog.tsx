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
import { addInventory } from "@/store/inventorySlice";
import { AppDispatch } from "@/store/store";
import { InventoryItem } from "./types";

// Define the schema for adding stock with sizes and quantities
const addInventorySchema = z.object({
    sizeStock: z.record(z.string(), z.number().min(1, "Quantity must be greater than 0")),
});

type FormData = z.infer<typeof addInventorySchema>;

interface AddInventoryDialogProps {
    item: InventoryItem | null;
    onClose: () => void;
}

export function AddInventoryDialog({ item, onClose }: AddInventoryDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);

    // Initialize form with a structure where each size will have its quantity
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(addInventorySchema),
        defaultValues: {
            sizeStock: item?.variant.sizeStock.reduce((acc, { size }) => {
                acc[size] = 0; // Default quantity to 0 for each size
                return acc;
            }, {} as Record<string, number>),
        },
    });

    const onSubmit = async (data: FormData) => {
        if (!item) return;
        setLoading(true);

        // Prepare the request object to match the backend structure
        const inventoryRequest = {
            color: item.variant.color,
            sizeStock: data.sizeStock,  // Send the sizeStock as an object
        };

        try {
            await dispatch(addInventory({
                productId: item.productId,
                variantSku: item.variantSku,
                inventoryRequest,
            })).unwrap();
            onClose();
        } catch (error) {
            console.error("Failed to add inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!item) return null;

    return (
        <Dialog open={!!item} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-800">
                <DialogHeader>
                    <DialogTitle>Add Inventory for {item.variantSku}</DialogTitle>
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

                        {/* Iterate over available sizes extracted from sizeStock */}
                        {item.variant.sizeStock.map(({ size }) => (
                            <div key={size}>
                                <Label>Size {size}</Label>
                                <Input
                                    type="number"
                                    {...register(`sizeStock.${size}`, { valueAsNumber: true })}
                                    placeholder={`Enter quantity for size ${size}`}
                                />
                                {errors.sizeStock?.[size] && (
                                    <p className="text-sm text-red-500 mt-1">{errors.sizeStock[size]?.message}</p>
                                )}
                            </div>
                        ))}
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
