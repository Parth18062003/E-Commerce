"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { addInventory } from "@/store/inventorySlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";

const schema = z.object({
  productId: z
    .string({ required_error: "Product ID is required" })
    .min(1, "Product ID must be at least 1 character"),
  variantSku: z
    .string({ required_error: "Variant SKU is required" })
    .min(1, "Variant SKU must be at least 1 character"),
  color: z
    .string({ required_error: "Color is required" })
    .min(1, "Color must be at least 1 character"),
  sizeStock: z
    .array(
      z.object({
        size: z
          .string({ required_error: "Size is required" })
          .min(1, "Size must be at least 1 character"),
        quantity: z.coerce
          .number({ required_error: "Quantity is required" })
          .min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one size-stock pair is required"),
});

type FormData = z.infer<typeof schema>;

interface CreateInventoryDialogProps {
  onClose: () => void;
}

export const CreateInventoryDialog: React.FC<CreateInventoryDialogProps> = ({
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: "",
      variantSku: "",
      color: "",
      sizeStock: [{ size: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizeStock",
  });

  const onSubmit = handleSubmit(async (data) => {
    const { productId, variantSku, color, sizeStock } = data;

    try {
      await dispatch(
        addInventory({
          productId,
          variantSku,
          inventoryRequest: {
            color,
            sizeStock: Object.fromEntries(
              sizeStock.map(({ size, quantity }) => [size, quantity])
            ),
          },
        })
      );
      toast.success(`Inventory for product ${productId} added successfully`);
      onClose();
      reset();
    } catch (error) {
      toast.error(`Failed to add inventory: ${error}`);
      console.error("Failed to add inventory:", error);
    }
  });

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add New Inventory</DialogTitle>
          <DialogDescription>
            Enter the details for the new inventory item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productId" className="text-right">
                Product ID
              </Label>
              <Input
                id="productId"
                type="text"
                placeholder="Enter Product ID"
                className="col-span-3"
                {...register("productId")}
              />
              {errors.productId && (
                <p className="text-red-500 col-span-4 text-right">
                  {errors.productId.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="variantSku" className="text-right">
                Variant SKU
              </Label>
              <Input
                id="variantSku"
                type="text"
                placeholder="Enter Variant SKU"
                className="col-span-3"
                {...register("variantSku")}
              />
              {errors.variantSku && (
                <p className="text-red-500 col-span-4 text-right">
                  {errors.variantSku.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Input
                id="color"
                type="text"
                placeholder="Enter Color"
                className="col-span-3"
                {...register("color")}
              />
              {errors.color && (
                <p className="text-red-500 col-span-4 text-right">
                  {errors.color.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-right">Size-Stock Pairs</Label>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-4 items-center gap-4 mb-2"
                >
                  <Controller
                    name={`sizeStock.${index}.size`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        id={`size-${index}`}
                        type="text"
                        placeholder="Size"
                        className="col-span-2"
                        {...field}
                      />
                    )}
                  />
                  {errors.sizeStock?.[index]?.size && (
                    <p className="text-red-500 col-span-4 text-right">
                      {errors.sizeStock?.[index]?.size?.message}
                    </p>
                  )}
                  <Controller
                    name={`sizeStock.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        placeholder="Quantity"
                        className="col-span-2"
                        {...field}
                      />
                    )}
                  />
                  {errors.sizeStock?.[index]?.quantity && (
                    <p className="text-red-500 col-span-4 text-right">
                      {errors.sizeStock?.[index]?.quantity?.message}
                    </p>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ size: "", quantity: 1 })}
              >
                Add Size-Stock Pair
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Inventory</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
