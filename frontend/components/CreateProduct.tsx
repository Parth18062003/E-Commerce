"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  PlusCircle,
  MinusCircle,
  Image as ImageIcon,
  X,
  XCircle,
} from "lucide-react";
import { createProduct } from "@/store/productSlice";
import UploadProductImage from "./UploadProductImage";
import { AppDispatch } from "@/store/store";
import Notification from "./ui/notification";

interface SizeVariant {
  size: string;
  stockQuantity: number;
}

interface Variant {
  color: string;
  price: number;
  discount: number;
  sku: string;
  stockQuantity: number;
  sizes: SizeVariant[];
  colorOptionImages: string[];
}

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
  discount: number;
  dimensions: string;
  weight: string;
  colorOptions: string[];
  isActive: boolean;
  isFeatured: boolean;
  productURL: string;
  material: string;
  releaseDate: string;
  gender: string;
  type: string;
  variants: Variant[];
}

type NotificationType = {
  id: number;
  text: string;
  type: "info" | "success" | "error";
};

interface ProductFormProps {
  existingProduct?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ existingProduct }) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialProductState: Product = {
    name: "",
    description: "",
    price: 0,
    category: "",
    brand: "",
    sku: "",
    tags: [],
    rating: 0,
    reviewCount: 0,
    discount: 0,
    dimensions: "",
    weight: "",
    colorOptions: [],
    isActive: true,
    isFeatured: false,
    productURL: "",
    material: "",
    releaseDate: "",
    gender: "",
    type: "",
    variants: [],
  };

  const [product, setProduct] = useState<Product>(
    existingProduct || initialProductState
  );
  const [currentTag, setCurrentTag] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !product.tags.includes(currentTag.trim())) {
      setProduct((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleAddColorOption = () => {
    if (
      currentColor.trim() &&
      !product.colorOptions.includes(currentColor.trim())
    ) {
      setProduct((prev) => ({
        ...prev,
        colorOptions: [...prev.colorOptions, currentColor.trim()],
        variants: [
          ...prev.variants,
          {
            color: currentColor.trim(),
            price: product.price,
            discount: product.discount,
            sku: `${product.sku.trim()}-${(prev.variants.length + 1)
              .toString()
              .padStart(3, "0")
              .trim()}`,
            stockQuantity: 0,
            sizes: [],
            colorOptionImages: [],
          },
        ],
      }));
      setCurrentColor("");
    }
  };

  const handleRemoveColorOption = (color: string) => {
    // Filter out the color option from the colorOptions array
    const updatedColorOptions = product.colorOptions.filter(
      (existingColor) => existingColor !== color
    );

    // Filter out the corresponding variant for the color option
    const updatedVariants = product.variants.filter(
      (variant) => variant.color !== color
    );

    // Update the state with the new color options and variants
    setProduct((prev) => ({
      ...prev,
      colorOptions: updatedColorOptions,
      variants: updatedVariants,
    }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: any
  ) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

/*   const handleAddSize = (variantIndex: number) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].sizes.push({ size: "", stockQuantity: 0 });
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleRemoveSize = (variantIndex: number, sizeIndex: number) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].sizes.splice(sizeIndex, 1); // Remove the size at the specified index
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  }; */
  const handleAddSize = (variantIndex: number) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].sizes.push({ size: "", stockQuantity: 0 });
  
    // Recalculate the stock quantity
    const newStockQuantity = updatedVariants[variantIndex].sizes.reduce((sum, size) => sum + size.stockQuantity, 0);
    updatedVariants[variantIndex].stockQuantity = newStockQuantity;
  
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };
  
  const handleRemoveSize = (variantIndex: number, sizeIndex: number) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].sizes.splice(sizeIndex, 1);
  
    // Recalculate the stock quantity after removal
    const newStockQuantity = updatedVariants[variantIndex].sizes.reduce((sum, size) => sum + size.stockQuantity, 0);
    updatedVariants[variantIndex].stockQuantity = newStockQuantity;
  
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };
  
  const handleSizeChange = <T extends keyof SizeVariant>(
    variantIndex: number,
    sizeIndex: number,
    field: T,
    value: SizeVariant[T]
  ) => {
    const updatedVariants = [...product.variants];
    /* updatedVariants[variantIndex].sizes[sizeIndex][field] = value;
    setProduct((prev) => ({ ...prev, variants: updatedVariants })); */
    const updatedSize = {
      ...updatedVariants[variantIndex].sizes[sizeIndex],
      [field]: value
    };
    
    // Update the size in the variant
    updatedVariants[variantIndex].sizes[sizeIndex] = updatedSize;
  
    // Recalculate the stock quantity of the variant
    const newStockQuantity = updatedVariants[variantIndex].sizes.reduce((sum, size) => sum + size.stockQuantity, 0);
    updatedVariants[variantIndex].stockQuantity = newStockQuantity;
  
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(product);
    try {
      dispatch(createProduct(product));
      addNotification("Product created successfully", "success");
      resetData();
    } catch (error: any) {
      addNotification(error, "error");
    }
  };

  const resetData = () => {
    setProduct(initialProductState);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddTag(); // Add tag
    }
  };

  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddColorOption(); // Add color option
    }
  };

  const addNotification = (
    text: string,
    type: "info" | "success" | "error"
  ) => {
    setNotifications((prev) => [{ id: Math.random(), text, type }, ...prev]);
  };

  const removeNotif = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {existingProduct ? "Edit Product" : "Create New Product"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={product.sku}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Base Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={product.brand}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={product.category}
                  onValueChange={(value) =>
                    setProduct((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  name="type"
                  value={product.type}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={product.gender}
                  onValueChange={(value) =>
                    setProduct((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mens">Mens</SelectItem>
                    <SelectItem value="womens">Womens</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  name="material"
                  value={product.material}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  value={product.dimensions}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  value={product.weight}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  value={product.releaseDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={handleTagKeyDown}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        setProduct((prev) => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== index),
                        }));
                      }}
                      className="text-destructive hover:text-destructive/80"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Options and Variants */}
            <div>
              <Label>Color Options</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  placeholder="Add a color"
                  onKeyDown={handleColorKeyDown}
                />
                <Button
                  type="button"
                  onClick={handleAddColorOption}
                  variant="outline"
                >
                  Add Color
                </Button>
              </div>
            </div>

            {/* Variants */}
            {product.variants.map((variant, variantIndex) => (
              <Card key={variantIndex}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">{variant.color}</h3>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveColorOption(variant.color)}
                      >
                        <X className="w-8 h-8" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Variant Price</Label>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(
                              variantIndex,
                              "price",
                              Number(e.target.value)
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Discount (%)</Label>
                        <Input
                          type="number"
                          value={variant.discount}
                          onChange={(e) =>
                            handleVariantChange(
                              variantIndex,
                              "discount",
                              Number(e.target.value)
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input 
                    name="stockQuantity"
                    type="number"
                    value={variant.stockQuantity}
                    onChange={(e) => handleVariantChange(variantIndex, "stockQuantity", Number(e.target.value))}
                    className="mt-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSize(variantIndex)}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Size
                    </Button>
                    {/* Sizes */}
                    <div className="space-y-2">
                      {variant.sizes.map((size, sizeIndex) => (
                        <div
                          key={sizeIndex}
                          className="flex items-center gap-4"
                        >
                          <div className="flex-1">
                            <Label>Size</Label>
                            <Input
                              value={size.size}
                              onChange={(e) =>
                                handleSizeChange(
                                  variantIndex,
                                  sizeIndex,
                                  "size",
                                  e.target.value
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Stock Quantity</Label>
                            <Input
                              type="number"
                              value={size.stockQuantity}
                              onChange={(e) =>
                                handleSizeChange(
                                  variantIndex,
                                  sizeIndex,
                                  "stockQuantity",
                                  Number(e.target.value)
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRemoveSize(variantIndex, sizeIndex)
                            }
                            className="w-auto mt-6"
                          >
                            <MinusCircle className="w-4 h-4" />
                            Remove Size
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <Label>Color Option Images</Label>
                      <UploadProductImage
                        color={variant.color}
                        variantIndex={variantIndex}
                        initialImages={variant.colorOptionImages}
                        onImagesUpload={(
                          variantIndex: number,
                          urls: string[]
                        ) =>
                          handleVariantChange(
                            variantIndex,
                            "colorOptionImages",
                            urls
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Status Toggles */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={product.isActive}
                  onCheckedChange={(checked) =>
                    setProduct((prev) => ({ ...prev, isActive: checked }))
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={product.isFeatured}
                  onCheckedChange={(checked) =>
                    setProduct((prev) => ({ ...prev, isFeatured: checked }))
                  }
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </div>

            {/* Product URL */}
            <div>
              <Label htmlFor="productURL">Product URL</Label>
              <Input
                id="productURL"
                name="productURL"
                value={product.productURL}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setProduct(existingProduct || initialProductState)
                }
              >
                Reset
              </Button>
              <Button type="submit" className="bg-primary">
                {existingProduct ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          id={notif.id}
          text={notif.text}
          type={notif.type}
          removeNotif={removeNotif}
        />
      ))}
    </>
  );
};

export default ProductForm;
