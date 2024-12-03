"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  fetchProductDetails,
  Product,
  updateProduct,
} from "@/store/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { UpdateProductSchema } from "@/schema/schema";
import ProductImageUpdate from "./ProductImageUpdate";
import { z } from "zod";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";

// EditProduct Component
const EditProduct: React.FC = () => {
  const params = useParams();
  const productId = params.productId as string;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
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
          toast.success("Product Edited successfully");
        } else {
          setOriginalProduct(cachedProduct);
          setEditedProduct(cachedProduct);
        }

        setShowConfirmDialog(false);
      } catch (error) {
        // Handle error
        console.error("Failed to load product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [dispatch, productId, cachedProduct]);

  const handleFieldChange = (
    name: keyof Product,
    value: string | number | string[] | boolean
  ) => {
    if (!editedProduct) return;
    setEditedProduct((prev) => ({ ...prev!, [name]: value }));
  };

  const handleVariantFieldChange = (name: string, value: string | number) => {
    if (!editedProduct) return;
    const updatedVariants = [...editedProduct.variants];
    updatedVariants[selectedVariantIndex] = {
      ...updatedVariants[selectedVariantIndex],
      [name]: value,
    };
    setEditedProduct((prev) => ({ ...prev!, variants: updatedVariants }));
  };

  const handleImageClick = (color: string, index: number, url: string) => {
    setSelectedImage({ color, index, url });
  };

  // Update image for the specific variant (not global)
  const handleImageUpdate = (
    newUrl: string,
    variantIndex: number,
    index: number
  ) => {
    if (!editedProduct) return;

    // Create a copy of the variants array
    const updatedVariants = [...editedProduct.variants];

    // Create a copy of the specific variant object
    const updatedVariant = { ...updatedVariants[variantIndex] };

    // Create a new colorOptionImages array with the updated image URL
    updatedVariant.colorOptionImages = updatedVariant.colorOptionImages.map(
      (url, i) => (i === index ? newUrl : url)
    );

    // Now update the variant in the array
    updatedVariants[variantIndex] = updatedVariant;

    // Set the updated variants array back to the edited product
    setEditedProduct((prev) => ({ ...prev!, variants: updatedVariants }));
  };

  const handleSave = async () => {
    if (!editedProduct) return;
    try {
      setSaving(true);
      console.log("OriginalProduct:", originalProduct);
      console.log("Updating product in database");
      console.log("EditedProduct:", editedProduct);

      // Update the product in the backend
      await dispatch(updateProduct(editedProduct)).unwrap();

      // After successful update, set originalProduct to the new editedProduct
      setOriginalProduct(editedProduct);

      toast.success("Product updated successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      } else {
        toast.error("Failed to update product");
      }
    } finally {
      setSaving(false);
    }
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
            onClick={() => setShowConfirmDialog(true)}
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
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.description}
                </p>
              )}
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
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  type="number"
                  value={editedProduct.discount}
                  onChange={(e) =>
                    handleFieldChange("discount", Number(e.target.value))
                  }
                  className={formErrors.discount ? "border-red-500" : ""}
                />
                {formErrors.discount && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.discount}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={editedProduct?.category || ""} // Ensure default value is an empty string if undefined
                  onChange={(e) =>
                    handleFieldChange("category", e.target.value)
                  }
                  className="block w-full mt-2 p-2 border"
                >
                  <option value="clothing">Clothing</option>
                  <option value="shoes">Footwear</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              {/* Gender Field */}
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={editedProduct.gender || ""} // Ensure default value is an empty string if undefined
                  onChange={(e) => handleFieldChange("gender", e.target.value)}
                  className="block w-full mt-2 p-2 border"
                >
                  <option value="mens">Mens</option>
                  <option value="womens">Womens</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              {/* Material Field */}
              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={editedProduct.material}
                  onChange={(e) =>
                    handleFieldChange("material", e.target.value)
                  }
                  className="block w-full mt-2 p-2 border"
                />
              </div>

              {/* Tags Field */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={editedProduct.tags.join(", ")}
                  onChange={(e) => {
                    // Split tags by comma, trim spaces, and remove empty strings
                    const tags = e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0); // Remove empty entries
                    handleFieldChange("tags", tags);
                  }}
                  className="block w-full mt-2 p-2 border"
                  placeholder="Enter tags separated by commas"
                />
              </div>

              {/* Brand Field */}
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={editedProduct.brand}
                  onChange={(e) => handleFieldChange("brand", e.target.value)}
                  className="block w-full mt-2 p-2 border"
                />
              </div>

              {/* SKU Field */}
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={editedProduct.sku}
                  onChange={(e) => handleFieldChange("sku", e.target.value)}
                  className="block w-full mt-2 p-2 border"
                />
              </div>

              {/* Dimension Field */}
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={editedProduct.dimensions}
                  onChange={(e) =>
                    handleFieldChange("dimensions", e.target.value)
                  }
                  className="block w-full mt-2 p-2 border"
                />
              </div>

              {/* Weight Field */}
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={editedProduct.weight}
                  onChange={(e) => handleFieldChange("weight", e.target.value)}
                  className="block w-full mt-2 p-2 border"
                />
              </div>

              {/* Release Date Field */}
              <div>
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input
                  id="releaseDate"
                  type="text"
                  value={editedProduct.releaseDate} // Convert to YYYY-MM-DD format for input
                  onChange={(e) =>
                    handleFieldChange("releaseDate", e.target.value)
                  } // Convert to DD-MM-YY when changing
                  className="block w-full mt-2 p-2 border"
                  placeholder="YYYY-MM-DD"
                />
              </div>

              {/* Product URL Field */}
              <div>
                <Label htmlFor="productURL">Product URL</Label>
                <Input
                  id="productURL"
                  value={editedProduct.productURL}
                  onChange={(e) =>
                    handleFieldChange("productURL", e.target.value)
                  }
                  className="block w-full mt-2 p-2 border"
                />
              </div>

              {/* Featured Field */}
              <div>
                <Label htmlFor="isFeatured">Is Featured</Label>
                <select
                  id="isFeatured"
                  value={editedProduct.featured ? "true" : "false"} // Convert boolean to string
                  onChange={
                    (e) =>
                      handleFieldChange("featured", e.target.value === "true") // Convert string back to boolean
                  }
                  className="block w-full mt-2 p-2 border"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Variant Selector */}
          <div>
            <Label htmlFor="variant">Select Variant</Label>
            <select
              id="variant"
              value={selectedVariantIndex}
              onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
              className="block w-full mt-2 p-2 border"
            >
              {editedProduct.variants.map((variant, index) => (
                <option key={index} value={index}>
                  {variant.color}
                </option>
              ))}
            </select>
          </div>

          {/* Variant Details */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Variant Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="variant-price">Variant Price</Label>
                <Input
                  id="variant-price"
                  type="number"
                  value={
                    editedProduct.variants[selectedVariantIndex]?.price || 0
                  }
                  onChange={(e) =>
                    handleVariantFieldChange("price", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <Label htmlFor="variant-discount">Variant Discount</Label>
                <Input
                  id="variant-discount"
                  type="number"
                  value={
                    editedProduct.variants[selectedVariantIndex]?.discount || 0
                  }
                  onChange={(e) =>
                    handleVariantFieldChange("discount", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <Label htmlFor="variant-quantity">Stock Quantity</Label>
                <Input
                  id="variant-quantity"
                  type="number"
                  value={
                    editedProduct.variants[selectedVariantIndex]
                      ?.stockQuantity || 0
                  }
                  onChange={(e) =>
                    handleVariantFieldChange(
                      "stockQuantity",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="variant-sku">Variant SKU</Label>
                <Input
                  id="variant-sku"
                  type="text"
                  value={editedProduct.variants[selectedVariantIndex]?.sku || 0}
                  onChange={(e) =>
                    handleVariantFieldChange(
                      "variantSKU",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>
            {/* Size Selector */}
            {editedProduct.variants[selectedVariantIndex]?.sizes.length > 0 && (
              <div className="w-1/2 my-4">
                <Table className="table-auto border border-zinc-300">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4 py-2 text-left">
                        Size
                      </TableHead>
                      <TableHead className="px-4 py-2 text-left">
                        Quantity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedProduct.variants[selectedVariantIndex]?.sizes?.map(
                      (size, index) => (
                        <TableRow key={index}>
                          <TableCell className="px-4 py-2">
                            <Input
                              type="text"
                              value={size.size}
                              onChange={(e) =>
                                handleVariantFieldChange("size", e.target.value)
                              }
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            <Input
                              type="number"
                              value={size.stockQuantity}
                              onChange={(e) =>
                                handleVariantFieldChange(
                                  "stockQuantity",
                                  Number(e.target.value)
                                )
                              }
                              className="w-20"
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Product Image */}
          {/* Product Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Display images for the selected variant only */}
              {editedProduct.variants[
                selectedVariantIndex
              ]?.colorOptionImages.map((url, index) => (
                <Dialog
                  key={`${editedProduct.variants[selectedVariantIndex]?.color}-${index}`}
                >
                  <DialogTrigger asChild>
                    <div
                      className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 p-2 cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() =>
                        handleImageClick(
                          editedProduct.variants[selectedVariantIndex]?.color!,
                          index,
                          url
                        )
                      }
                    >
                      {url ? (
                        <Image
                          src={url}
                          alt={`${
                            editedProduct.variants[selectedVariantIndex]?.color
                          } product ${index + 1}`}
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
                    <DialogDescription>
                      Upload image to be updated
                    </DialogDescription>
                    <ProductImageUpdate
                      currentImages={
                        editedProduct.variants[selectedVariantIndex]
                          ?.colorOptionImages || []
                      }
                      onImageUpdate={(newUrl) => {
                        handleImageUpdate(newUrl, selectedVariantIndex, index);
                        setSelectedImage(null); // Reset selected image after update
                      }}
                      onCancel={() => setSelectedImage(null)}
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
          {/* Confirm Save Dialog */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogTrigger />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Save</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to save these changes?
              </DialogDescription>
              <div className="flex justify-end space-x-4">
                <Button onClick={() => setShowConfirmDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-green-500">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
