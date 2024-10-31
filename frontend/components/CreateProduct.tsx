"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { createProduct } from "@/store/productSlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import Notification from "./ui/notification";
import { AppDispatch } from "@/store/store";
import { productSchema } from "@/schema/schema";
import UploadProductImage from "./UploadProductImage";

type CreateProductData = z.infer<typeof productSchema>;

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [notifications, setNotifications] = useState<
    { id: number; text: string; type: "info" | "success" | "error" }[]
  >([]);
  const [creating, setCreating] = useState(false);
  const [colorImages, setColorImages] = useState<{ [color: string]: string[] }>(
    {}
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProductData>({
    resolver: zodResolver(productSchema),
  });

  const colorOptionsInput = watch("colorOptions") as
    | string
    | string[]
    | undefined;

  const colorOptions: string[] =
    typeof colorOptionsInput === "string"
      ? colorOptionsInput.split(",").map((color) => color.trim())
      : Array.isArray(colorOptionsInput)
      ? colorOptionsInput
      : [];

  const onSubmit: SubmitHandler<CreateProductData> = async (data) => {
    // Check if all colors have images uploaded
    const missingImages = colorOptions.filter(
      (color) => !colorImages[color] || colorImages[color].length === 0
    );

    if (missingImages.length > 0) {
      addNotification(
        `Please upload images for the following colors: ${missingImages.join(
          ", "
        )}`,
        "error"
      );
      return;
    }

    setCreating(true);
    // Ensure the correct data types are sent to the backend
    const processedData = {
      ...data,
      price: parseFloat(data.price as unknown as string), // Ensure price is a number
      discount: parseFloat(data.discount as unknown as string), // Ensure discount is a number
      stockQuantity: parseInt(data.stockQuantity as unknown as string, 10), // Ensure stockQuantity is an integer
      colorOptionImages: colorImages, // Color-specific images for each color option
    };

    try {
      await dispatch(createProduct(processedData)).unwrap();
      reset();
      setColorImages({}); // Reset color images after successful creation
      setCreating(false);
      addNotification("Product created successfully!", "success");
    } catch (error) {
      reset();
      setCreating(false);
      addNotification("Failed to create product", "error");
    }
  };

  // Handle color-specific image uploads
  const handleImagesUpload = (color: string, urls: string[]) => {
    setColorImages((prev) => ({ ...prev, [color]: urls }));
  };

  // Manage notifications display
  const addNotification = (
    text: string,
    type: "info" | "success" | "error"
  ) => {
    setNotifications((prev) => [{ id: Math.random(), text, type }, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Form Input Fields */}
            <Input {...register("name")} placeholder="Product Name" />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}

            <Input {...register("description")} placeholder="Description" />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}

            <Input type="number" {...register("price")} placeholder="Price" />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}

            <Input {...register("category")} placeholder="Category" />
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}

            <Input {...register("brand")} placeholder="Brand" />
            {errors.brand && (
              <p className="text-red-500">{errors.brand.message}</p>
            )}

            <Input
              type="number"
              {...register("stockQuantity")}
              placeholder="Stock Quantity"
            />
            {errors.stockQuantity && (
              <p className="text-red-500">{errors.stockQuantity.message}</p>
            )}

            <Input {...register("sku")} placeholder="SKU" />
            {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}

            <Input {...register("tags")} placeholder="Tags (comma-separated)" />
            {errors.tags && (
              <p className="text-red-500">{errors.tags.message}</p>
            )}

            <Input
              type="number"
              {...register("discount")}
              placeholder="Discount"
            />
            {errors.discount && (
              <p className="text-red-500">{errors.discount.message}</p>
            )}

            <Input
              {...register("dimensions")}
              placeholder="Dimensions (e.g., 28x19x8)"
            />
            {errors.dimensions && (
              <p className="text-red-500">{errors.dimensions.message}</p>
            )}

            <Input
              {...register("weight")}
              placeholder="Weight (e.g., 0.83 kg)"
            />
            {errors.weight && (
              <p className="text-red-500">{errors.weight.message}</p>
            )}

            <Input
              {...register("colorOptions")}
              placeholder="Color Options (comma-separated)"
            />
            {errors.colorOptions && (
              <p className="text-red-500">{errors.colorOptions.message}</p>
            )}

            <Input
              {...register("sizes")}
              placeholder="Sizes (comma-separated)"
            />
            {errors.sizes && (
              <p className="text-red-500">{errors.sizes.message}</p>
            )}

            {/* Dynamic Color Option Image Uploads */}
            {colorOptions.map((color: string) => (
              <div key={color}>
                <UploadProductImage
                  color={color}
                  onImagesUpload={handleImagesUpload}
                  initialImages={colorImages[color] || []}
                />
                <span>{color}</span>
              </div>
            ))}

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-950 text-white px-6 font-medium shadow-lg transition active:scale-95"
            >
              {creating ? "Creating..." : "Create Product"}
            </button>
          </form>
        </CardContent>
        <CardFooter />
      </Card>

      {/* Notification Display */}
      <div className="fixed top-2 right-2 z-50 pointer-events-none">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            id={notif.id}
            text={notif.text}
            type={notif.type}
            removeNotif={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateProduct;
