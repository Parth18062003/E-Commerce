// EditProduct.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchProductDetails, updateProduct } from "@/store/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import Notification from "./ui/notification";
import ProductImageUpdate from "./ProductImageUpdate";

// types.ts
export type NotificationType = {
  id: number;
  text: string;
  type: "info" | "success" | "error";
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stockQuantity: number;
  category: string;
  brand: string;
  sku: string;
  tags?: string[];
  dimensions: string;
  weight: string;
  colorOptions?: string[];
  sizes?: string[];
  colorOptionImages: {
    [color: string]: string[];
  };
};

const EditProduct: React.FC = () => {
  const params = useParams();
  const productId = params.productId as string;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    color: string;
    index: number;
    url: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const cachedProduct = useSelector(
    (state: RootState) => state.product.cache[productId]
  );
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!cachedProduct) {
          const product = await dispatch(
            fetchProductDetails(productId)
          ).unwrap();
          setOriginalProduct(product);
          setEditedProduct(product);
        } else {
          setOriginalProduct(cachedProduct);
          setEditedProduct(cachedProduct);
        }
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [dispatch, productId, cachedProduct]);

  const validateField = (name: keyof Product, value: any): string => {
    switch (name) {
      case "price":
      case "discount":
      case "stockQuantity":
        if (isNaN(Number(value)) || Number(value) < 0) {
          return "Must be a valid positive number";
        }
        break;
      case "name":
      case "sku":
        if (!value.trim()) {
          return "This field is required";
        }
        break;
    }
    return "";
  };

  const validateForm = (): boolean => {
    if (!editedProduct) return false;

    const errors: { [key: string]: string } = {};
    let isValid = true;

    // Validate required fields
    const requiredFields: (keyof Product)[] = ["name", "price", "sku"];
    requiredFields.forEach((field) => {
      const error = validateField(field, editedProduct[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleFieldChange = (
    name: keyof Product,
    value: string | number | string[]
  ) => {
    if (!editedProduct) return;

    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));

    setEditedProduct((prev) => ({ ...prev!, [name]: value }));
  };

  const handleArrayFieldChange = (name: keyof Product, value: string) => {
    if (!editedProduct) return;
    const arrayValue = value.split(",").map((item) => item.trim());
    handleFieldChange(name, arrayValue);
  };

  const handleImageClick = (color: string, index: number, url: string) => {
    setSelectedImage({ color, index, url });
  };

  const handleImageUpdate = (newUrl: string) => {
    if (!selectedImage || !editedProduct) return;

    const updatedImages = {
      ...editedProduct.colorOptionImages,
      [selectedImage.color]: editedProduct.colorOptionImages[
        selectedImage.color
      ].map((url, i) => (i === selectedImage.index ? newUrl : url)),
    };

    setEditedProduct((prev) => ({
      ...prev!,
      colorOptionImages: updatedImages,
    }));
    setSelectedImage(null);
  };

  const handleSave = async () => {
    if (!editedProduct || !validateForm()) return;

    try {
      setSaving(true);
      await dispatch(updateProduct(editedProduct)).unwrap();
      setOriginalProduct(editedProduct);
      addNotification("Product updated successfully!", "success");
    } catch (error) {
      addNotification("Failed to update product", "error");
    } finally {
      setSaving(false);
    }
  };

  const addNotification = (
    text: string,
    type: "info" | "success" | "error"
  ) => {
    setNotifications((prev) => [{ id: Math.random(), text, type }, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const hasChanges = (): boolean => {
    return JSON.stringify(originalProduct) !== JSON.stringify(editedProduct);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!editedProduct) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Button
          onClick={() => router.push("/dashboard/admin/product")}
          className="mt-4"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
          <Button
            onClick={() => setShowConfirmDialog(true)} // Open dialog on button click
            disabled={saving || !hasChanges()}
            className="ml-4"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={editedProduct.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedProduct.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={editedProduct.price}
                  onChange={(e) =>
                    handleFieldChange("price", Number(e.target.value))
                  }
                  className={formErrors.price ? "border-red-500" : ""}
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={editedProduct.discount}
                  onChange={(e) =>
                    handleFieldChange("discount", Number(e.target.value))
                  }
                  className={formErrors.discount ? "border-red-500" : ""}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={editedProduct.tags?.join(", ") || ""}
                onChange={(e) => handleArrayFieldChange("tags", e.target.value)}
              />
            </div>
          </div>

          {/* Product Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(editedProduct.colorOptionImages).map(
                ([color, images]) => (
                  <div key={color} className="space-y-2">
                    <Label>{color}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {images.map((url, index) => (
                        <Dialog key={`${color}-${index}`}>
                          <DialogTrigger asChild>
                            <div
                              className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 p-2 cursor-pointer hover:border-gray-400 transition-colors"
                              onClick={() =>
                                handleImageClick(color, index, url)
                              }
                            >
                              {url ? (
                                <Image
                                  src={url}
                                  alt={`${color} product ${index + 1}`}
                                  width={512}
                                  height={512}
                                  className="object-cover rounded-lg"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <p className="text-sm text-gray-500">
                                    Click to add image
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Image</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>Upload image to be updated</DialogDescription>
                            <ProductImageUpdate 
                                defaultImageUrl={selectedImage?.url || ""}
                                onImageUpdate={(newUrl) => {
                                  handleImageUpdate(newUrl);
                                  setSelectedImage(null); // Reset selected image after update
                                }}
                                onCancel={() => setSelectedImage(null)}
                            />
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Notifications
        notifications={notifications}
        removeNotification={removeNotification}
      />

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes?
            </DialogDescription>
          </DialogHeader>
          <DialogActions
            handleCancel={() => setShowConfirmDialog(false)}
            handleConfirm={() => {
              setShowConfirmDialog(false);
              handleSave();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface NotificationsProps {
  notifications: NotificationType[];
  removeNotification: (id: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  removeNotification,
}) => (
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
);
interface DialogActionsProps {
  handleCancel: () => void;
  handleConfirm: () => void;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  handleCancel,
  handleConfirm,
}) => (
  <div className="flex justify-end mt-4 space-x-3">
    <button
      className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-800 px-6 font-medium text-zinc-200 shadow-lg shadow-zinc-500/20 transition active:scale-95"
      onClick={handleCancel} // Call handleCancel directly
    >
      Cancel
    </button>
    <button
      className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-200 px-6 font-medium text-zinc-800 shadow-lg shadow-zinc-100/20 transition active:scale-95"
      onClick={handleConfirm} // Call handleConfirm directly
    >
      Save
    </button>
  </div>
);

export default EditProduct;
