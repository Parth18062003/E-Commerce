// src/components/inventory/add-size-dialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { addStock } from "@/store/inventorySlice";
import { InventoryItem } from "./types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";

const schema = z.object({
  size: z.string({ required_error: "Size is required" }).min(1, "Size must be at least 1 character"),
  quantity: z.coerce.number({ required_error: "Quantity is required" }).min(1, "Quantity must be at least 1"),
});

type FormData = z.infer<typeof schema>;

interface AddStockDialogProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export const AddStockDialog: React.FC<AddStockDialogProps> = ({ item, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      size: "",
      quantity: 1,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (item) {
      const { productId, variantSku } = item;
      const { size, quantity } = data;

      try {
        await dispatch(addStock({ productId, variantSku, size, quantity }));
        toast.success(`Stock for size ${size} added successfully`);
        onClose();
      } catch (error) {
        toast.error("Failed to add stock");
        console.error("Failed to add size:", error);
      }
    }
  });

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Size</DialogTitle>
          <DialogDescription>
            Enter the size and quantity you want to add for this variant.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Size
              </Label>
              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <Input
                    id="size"
                    type="text"
                    placeholder="Enter size"
                    className="col-span-3"
                    {...field}
                  />
                )}
              />
              {errors.size && <p className="text-red-500 col-span-4 text-right">{errors.size.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    className="col-span-3"
                    {...field}
                  />
                )}
              />
              {errors.quantity && <p className="text-red-500 col-span-4 text-right">{errors.quantity.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Size</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};