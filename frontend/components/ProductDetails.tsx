/*
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "./ui/button";
import { Ruler } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Lens } from "./ui/lens";
import ImageModal from "./ImageModal";
import { fetchProductDetails } from "@/store/productSlice";
import Loading from "@/app/loading";
import WishListButton from "./WishListButton";
import { StarRating } from "./StarRating";
import ProductReviewsList from "./ProductReviewsList";
import { fetchRatingsByProduct } from "@/store/ratingSlice";
import GetProductRating from "./GetProductRating";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const productId = params.productId as string;

  const { product, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  const { ratings, cache } = useSelector((state: RootState) => state.rating);
  const [mainImages, setMainImages] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      // Fetch product data only if product is not in the state
      if (!product || product.id !== productId) {
        dispatch(fetchProductDetails(productId));
      } else {
        // Set the selected color and main images if product is already in the store
        const initialColor = product.colorOptions[0];
        setSelectedColor(initialColor);
        setMainImages(product.colorOptionImages[initialColor] || []);
      }

      // Fetch ratings if not cached
      if (!cache[productId]) {
        dispatch(fetchRatingsByProduct(productId));
      }
    }
  }, [dispatch, productId, product, cache]);

  useEffect(() => {
    if (
      product &&
      product.colorOptions.length > 0 &&
      product.colorOptionImages
    ) {
      const initialColor = product.colorOptions[0];
      setSelectedColor(initialColor);
      setMainImages(product.colorOptionImages[initialColor] || []);
    } else {
      setMainImages([]); // Reset if product is invalid or has no images
    }
  }, [product]);

  useEffect(() => {
    if (product && selectedColor) {
      setMainImages(product.colorOptionImages[selectedColor] || []);
    }
  }, [selectedColor, product]);

  useEffect(() => {
    if (!api) return;
    const updateCurrentIndex = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", updateCurrentIndex);
    return () => {
      api.off("select", updateCurrentIndex);
    };
  }, [api]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  if (loading.fetchProductDetails) {
    return <Loading />;
  }

  if (error.fetchProductDetails) {
    return <div className="p-6">Error: {error.fetchProductDetails}</div>;
  }

  if (!product) {
    return <div className="p-6">No product available.</div>;
  }

  const discountedPrice =
    product.price - product.price * (product.discount / 100);

  return (
    <>
      <div className="p-6 lg:p-10 flex flex-col lg:flex-row">
        {/!* Left Half: Image Carousel *!/}
        <div className="w-full lg:w-2/3">
          {/!* Mobile Carousel *!/}
          <div className="mb-4 lg:hidden">
            <Carousel className="w-full max-w-xs relative" setApi={setApi}>
              <CarouselContent>
                {mainImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-0">
                          <Image
                            src={image}
                            alt={`${product.name} - ${selectedColor} view ${
                              index + 1
                            }`}
                            className="object-cover h-96 rounded-lg"
                            width={512}
                            height={512}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
                {mainImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 mx-1 rounded-full ${
                      index === currentIndex ? "bg-zinc-500" : "bg-gray-300"
                    }`}
                    onClick={() => api?.scrollTo(index)}
                  />
                ))}
              </div>
            </Carousel>
          </div>

          {/!* Desktop Grid *!/}
          <div className="hidden lg:grid grid-cols-2 gap-4 mt-4">
            {mainImages?.map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <Lens>
                  <Image
                    src={image}
                    alt={`${product.name} - ${selectedColor} view ${index + 1}`}
                    className="w-full object-cover h-96 rounded-lg cursor-pointer"
                    width={512}
                    height={512}
                    priority
                    onClick={() => openModal(index)}
                  />
                </Lens>
              </div>
            ))}
          </div>
        </div>

        {/!* Right Half: Product Details *!/}
        <div className="w-full lg:w-1/3 lg:pl-8 mt-0 lg:mt-5">
          {/!* Color Selection *!/}
          <div className="lg:hidden grid grid-cols-3 gap-2 mt-2">
            {product?.colorOptions.map((color, index) => (
              <div
                key={index}
                className={`flex items-center justify-center cursor-pointer border rounded-lg p-0 ${
                  selectedColor === color ? "border-black" : ""
                }`}
                onClick={() => handleColorChange(color)}
              >
                <Image
                  src={product.colorOptionImages[color][0]}
                  alt={`${product.name} - ${color}`}
                  className="object-cover h-24 rounded-lg"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-2 text-black">
              {product.name}
            </h1>

            <WishListButton productId={product.id} />
          </div>
          <p className="text-lg text-gray-600 mb-4">
            <span className="font-thin text-zinc-500">{product.brand}</span>
          </p>
          <GetProductRating productId={productId} />

          <div className="mb-4">
            {product.discount > 0 ? (
              <div className="flex items-center">
                <p className="text-xl font-bold text-indigo-600">
                  ${discountedPrice.toFixed(2)}
                </p>
                <p className="ml-2 text-lg text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </p>
                <span className="ml-2 bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <p className="text-xl font-bold text-black">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>

          {/!* Desktop Color Selection *!/}
          <div className="hidden lg:grid grid-cols-4 my-2 p-0 gap-3">
            {product.colorOptions.map((color, index) => (
              <div
                key={index}
                className={`flex items-center justify-center cursor-pointer border rounded-lg p-0 ${
                  selectedColor === color ? "border-black" : ""
                }`}
                onClick={() => handleColorChange(color)}
              >
                <Image
                  src={product.colorOptionImages[color][0]}
                  alt={`${product.name} - ${color}`}
                  className="object-cover h-24 w-full rounded-lg"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>

          {/!* Size Selection *!/}
          <div className="my-4">
            <div className="flex justify-between">
              <label className="block text-sm font-medium mb-1 text-black">
                Size
              </label>
              <Link
                href="/products/size-guide"
                className="text-black flex mb-2"
              >
                <Ruler className="mr-1" /> Size Guide
              </Link>
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
              {product?.sizes?.map((size, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center cursor-pointer border rounded-lg p-2 hover:bg-gray-200"
                >
                  <span className="text-sm text-black">{size}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-4 mb-4">
            <Button className="w-full">Add to Cart</Button>
            <div className="text-black w-full flex justify-center items-center gap-x-2 border border-zinc-300 rounded-md p-2">
              <WishListButton productId={product.id} /> Add to Wishlist
            </div>
          </div>

          <p className="text-lg text-gray-700">{product.description}</p>

          {/!* Additional Details *!/}
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
            <p className="text-sm text-gray-600">
              Category: {product.category}
            </p>
            <p className="text-sm text-gray-600">Weight: {product.weight}</p>
            <p className="text-sm text-gray-600">
              Dimensions: {product.dimensions}
            </p>
            <p className="text-sm text-gray-600">Gender: {product.gender}</p>
            <StarRating productId={productId} ratings={ratings} />
          </div>
        </div>

        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={mainImages}
          initialIndex={selectedImageIndex}
        />
      </div>
      <ProductReviewsList productId={productId} ratings={ratings} />
    </>
  );
};

export default ProductDetails;
*/

/*
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "./ui/button";
import { Ruler } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";
import { Lens } from "./ui/lens";
import ImageModal from "./ImageModal";
import { fetchProductDetails } from "@/store/productSlice";
import WishListButton from "./WishListButton";
import { StarRating } from "./StarRating";
import ProductReviewsList from "./ProductReviewsList";
import { fetchRatingsByProduct } from "@/store/ratingSlice";
import GetProductRating from "./GetProductRating";
import Loading from "@/app/loading";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const productId = params.productId as string;

  // Get product and ratings from Redux store
  const { product, loading, error } = useSelector((state: RootState) => state.product);
  const { ratings, cache } = useSelector((state: RootState) => state.rating);

  // State for image handling and modal
  const [mainImages, setMainImages] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product and ratings data
  useEffect(() => {
    if (productId) {
      if (!product || product.id !== productId) {
        dispatch(fetchProductDetails(productId));
      } else {
        const initialColor = product.colorOptions[0];
        setSelectedColor(initialColor);
        setMainImages(getImagesForColor(initialColor));
      }
      if (!cache[productId]) {
        dispatch(fetchRatingsByProduct(productId));
      }
    }
  }, [dispatch, productId, product, cache]);

  // Helper function to get images for the selected color
  const getImagesForColor = (color: string) => {
    const selectedVariant = product?.variants.find((variant) => variant.color === color);
    return selectedVariant ? selectedVariant.colorOptionImages : [];
  };

  // Set images when product data changes
  useEffect(() => {
    if (product && product.colorOptions.length > 0) {
      const initialColor = product.colorOptions[0];
      setSelectedColor(initialColor);
      setMainImages(getImagesForColor(initialColor));
    } else {
      setMainImages([]); // Reset if product is invalid or has no images
    }
  }, [product]);

  // Update main images when color is changed
  useEffect(() => {
    if (product && selectedColor) {
      setMainImages(getImagesForColor(selectedColor));
    }
  }, [selectedColor, product]);

  // Handle carousel index changes
  useEffect(() => {
    if (!api) return;
    const updateCurrentIndex = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", updateCurrentIndex);
    return () => {
      api.off("select", updateCurrentIndex);
    };
  }, [api]);

  // Handle color change
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setMainImages(getImagesForColor(color)); // Update the images based on the selected color
  };

  // Open image modal
  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  // Loading and error handling
  if (loading.fetchProductDetails) {
    return <Loading />;
  }

  if (error.fetchProductDetails) {
    return <div className="p-6">Error: {error.fetchProductDetails}</div>;
  }

  if (!product) {
    return <div className="p-6">No product available.</div>;
  }

  // Calculate discounted price
  const discountedPrice = product.price - product.price * (product.discount / 100);

  return (
      <>
        <div className="p-6 lg:p-10 flex flex-col lg:flex-row">
          {/!* Left Half: Image Carousel *!/}
          <div className="w-full lg:w-2/3">
            {/!* Mobile Carousel *!/}
            <div className="mb-4 lg:hidden">
              <Carousel className="w-full max-w-xs relative" setApi={setApi}>
                <CarouselContent>
                  {mainImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-0">
                              <Image
                                  src={image}
                                  alt={`${product.name}-${selectedColor} view ${index + 1}`}
                                  className="object-cover h-96 rounded-lg"
                                  width={512}
                                  height={512}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
                  {mainImages.map((_, index) => (
                      <button
                          key={index}
                          className={`w-2 h-2 mx-1 rounded-full ${index === currentIndex ? "bg-zinc-500" : "bg-gray-300"}`}
                          onClick={() => api?.scrollTo(index)}
                      />
                  ))}
                </div>
              </Carousel>
            </div>
            {/!* Desktop Grid *!/}
            <div className="hidden lg:grid grid-cols-2 gap-4 mt-4">
              {mainImages.map((image, index) => (
                  <div key={index} className="relative overflow-hidden">
                    <Lens>
                      <Image
                          src={image}
                          alt={`${product.name}-${selectedColor} view ${index + 1}`}
                          className="w-full object-cover h-96 rounded-lg cursor-pointer"
                          width={512}
                          height={512}
                          priority
                          onClick={() => openModal(index)}
                      />
                    </Lens>
                  </div>
              ))}
            </div>
          </div>

          {/!* Right Half: Product Details *!/}
          <div className="w-full lg:w-1/3 lg:pl-8 mt-0 lg:mt-5">

            {/!* Product Name and Add to Wishlist *!/}
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold mb-2 text-black">{product.name}</h1>
              <WishListButton productId={product.id} />
            </div>
            <p className="text-lg text-gray-600 mb-4">
              <span className="font-thin text-zinc-500">{product.brand}</span>
            </p>
            <GetProductRating productId={productId} />
            <div className="mb-4">
              {product.discount > 0 ? (
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-indigo-600">${discountedPrice.toFixed(2)}</p>
                    <p className="ml-2 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</p>
                  </div>
              ) : (
                  <p className="text-xl font-bold text-black">${product.price.toFixed(2)}</p>
              )}
            </div>

            {/!* Color Selection *!/}
            <div className="hidden lg:grid grid-cols-4 my-2 p-0 gap-3" >
              {product.colorOptions.map((color, index) => (
                  <div
                      key={index}
                      className={`flex items-center justify-center cursor-pointer border rounded-lg p-0 ${selectedColor === color ? 'border-black' : ''}`}
                      onClick={() => handleColorChange(color)}
                  >
                    {getImagesForColor(color).length > 0 && (
                        <Image
                            src={getImagesForColor(color)[0]}
                            alt={`${product.name}-${color}`}
                            className="object-cover h-24 w-full rounded-lg"
                            width={100}
                            height={100}
                        />
                    )}
                  </div>
              ))}
            </div>

            {/!* Size Selection *!/}
            <div className="flex justify-between">
              <label className="block text-sm font-medium mb-1 text-black">Size</label>
              <Link href="/products/size-guide" className="text-black flex mb-2">
                <Ruler className="mr-1" />
                Size Guide
              </Link>
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
              {product.variants[0]?.sizes.map((size, index) => (
                  <div
                      key={index}
                      className="flex items-center justify-center cursor-pointer border rounded-lg p-2 hover:bg-gray-200"
                  >
                    <span className="text-sm text-black">{size.size}</span>
                  </div>
              ))}
            </div>

            {/!* Add to Cart and Wishlist *!/}
            <div className="flex flex-col space-y-4 mb-4">
              <Button className="w-full">Add to Cart</Button>
              <div className="text-black w-full flex justify-center items-center gap-x-2 border border-zinc-300 rounded-md p-2">
                <WishListButton productId={product.id} />
                Add to Wishlist
              </div>
            </div>
            <p className="text-lg text-gray-700">{product.description}</p>

            {/!* Additional Details *!/}
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
              <p className="text-sm text-gray-600">Category: {product.category}</p>
              <p className="text-sm text-gray-600">Weight: {product.weight}</p>
              <p className="text-sm text-gray-600">Dimensions: {product.dimensions}</p>
              <p className="text-sm text-gray-600">Material: {product.material}</p>
              <StarRating productId={productId} ratings={ratings} />
            </div>
          </div>
        </div>

        {/!* Image Modal *!/}
        <ImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} images={mainImages} initialIndex={selectedImageIndex} />

        {/!* Product Reviews *!/}
        <ProductReviewsList productId={productId} ratings={ratings} />
      </>
  );
};

export default ProductDetails;*/

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "./ui/button";
import { Ruler } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";
import { Lens } from "./ui/lens";
import ImageModal from "./ImageModal";
import {fetchProductDetails, Variant} from "@/store/productSlice";
import WishListButton from "./WishListButton";
import { StarRating } from "./StarRating";
import ProductReviewsList from "./ProductReviewsList";
import { fetchRatingsByProduct } from "@/store/ratingSlice";
import GetProductRating from "./GetProductRating";
import Loading from "@/app/loading";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const { product, loading, error } = useSelector((state: RootState) => state.product);
  const { ratings, cache } = useSelector((state: RootState) => state.rating);

  const [mainImages, setMainImages] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<Variant>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState<number>(0);
  const [sizes, setSizes] = useState<{ size: string; stockQuantity: number }[]>([]);

  useEffect(() => {
    if (productId && (!product || product.id !== productId)) {
      dispatch(fetchProductDetails(productId));
    }
    if (productId && !cache[productId]) {
      dispatch(fetchRatingsByProduct(productId));
    }
  }, [dispatch, productId, product, cache]);

  // Initialize variant based on URL or default
  useEffect(() => {
    if (product) {
      const variantSku = window.location.pathname.split('/').pop();
      const matchingVariant = product.variants.find(v => v.sku === variantSku) || product.variants[0];
      initializeVariant(matchingVariant);
    }
  }, [product]);

  useEffect(() => {
    if (!api) return;

    const updateCurrentIndex = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", updateCurrentIndex);

    return () => {
      api.off("select", updateCurrentIndex);
    };
  }, [api]);

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * (discount / 100));
  };

  const initializeVariant = (variant: Variant) => {
    if (!variant) return;

    setSelectedColor(variant.color);
    setSelectedVariant(variant);
    setMainImages(variant.colorOptionImages);
    setSizes(variant.sizes);
    setDiscountedPrice(calculateDiscountedPrice(variant.price, variant.discount));
  };

  const handleColorChange = (color: string) => {
    const newVariant = product?.variants.find((variant) => variant.color === color);
    if (!newVariant) return;

    // Update all state simultaneously
    const updates = () => {
      setSelectedColor(color);
      setSelectedVariant(newVariant);
      setMainImages(newVariant.colorOptionImages);
      setSizes(newVariant.sizes);
      setDiscountedPrice(calculateDiscountedPrice(newVariant.price, newVariant.discount));
    };

    // Perform state updates and URL change together
    updates();
    if(product) {
      router.push(`/products/${product.name}/${product.id}/${newVariant.sku}`);
    }
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  if (loading.fetchProductDetails) {
    return <Loading />;
  }

  if (error.fetchProductDetails) {
    return <div className="p-6">Error: {error.fetchProductDetails}</div>;
  }

  if (!product) {
    return <div className="p-6">No product available.</div>;
  }

  return (
      <>
        <div className="p-6 lg:p-10 flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3">
            <div className="mb-4 lg:hidden">
              <Carousel className="w-full max-w-xs relative" setApi={setApi}>
                <CarouselContent>
                  {mainImages.map((image, index) => (
                      <CarouselItem key={`${selectedColor}-${index}-mobile`}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-0">
                              <Image
                                  src={image}
                                  alt={`${product.name}-${selectedColor} view ${index + 1}`}
                                  className="object-cover h-96 rounded-lg"
                                  width={512}
                                  height={512}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
                  {mainImages.map((_, index) => (
                      <button
                          key={`${selectedColor}-dot-${index}`}
                          className={`w-2 h-2 mx-1 rounded-full ${
                              index === currentIndex ? "bg-zinc-500" : "bg-gray-300"
                          }`}
                          onClick={() => api?.scrollTo(index)}
                      />
                  ))}
                </div>
              </Carousel>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4 mt-4">
              {mainImages.map((image, index) => (
                  <div key={`${selectedColor}-${index}-desktop`} className="relative overflow-hidden">
                    <Lens>
                      <Image
                          src={image}
                          alt={`${product.name}-${selectedColor} view ${index + 1}`}
                          className="w-full object-cover h-96 rounded-lg cursor-pointer"
                          width={512}
                          height={512}
                          priority
                          onClick={() => openModal(index)}
                      />
                    </Lens>
                  </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3 lg:pl-8 mt-0 lg:mt-5">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold mb-2 text-black">{product.name}</h1>
              <WishListButton productId={product.id} />
            </div>

            <p className="text-lg text-gray-600 mb-4">
              <span className="font-thin text-zinc-500">{product.brand}</span>
            </p>

            <GetProductRating productId={productId} />

            <div className="mb-4">
              {selectedVariant && selectedVariant.discount > 0 ? (
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-indigo-600">
                      ${discountedPrice.toFixed(2)}
                    </p>
                    <p className="ml-2 text-lg text-gray-500 line-through">
                      ${selectedVariant.price.toFixed(2)}
                    </p>
                  </div>
              ) : (
                  selectedVariant && (
                      <p className="text-xl font-bold text-black">
                        ${selectedVariant.price.toFixed(2)}
                      </p>
                  )
              )}
            </div>

            <div className="hidden lg:grid grid-cols-4 my-2 p-0 gap-3">
              {product.variants.map((variant, index) => (
                  <div
                      key={`color-${variant.color}-${index}`}
                      className={`flex items-center justify-center cursor-pointer border rounded-lg p-0 
                  ${selectedColor === variant.color ? "border-black" : ""}`}
                      onClick={() => handleColorChange(variant.color)}
                  >
                    {variant.colorOptionImages.length > 0 && (
                        <Image
                            src={variant.colorOptionImages[0]}
                            alt={`${product.name}-${variant.color}`}
                            className="object-cover h-24 w-full rounded-lg"
                            width={100}
                            height={100}
                        />
                    )}
                  </div>
              ))}
            </div>

            <div className="flex justify-between">
              <label className="block text-sm font-medium mb-1 text-black">
                Size
              </label>
              <Link href="/products/size-guide" className="text-black flex mb-2">
                <Ruler className="mr-1" />
                Size Guide
              </Link>
            </div>

            <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
              {sizes.map((size, index) => (
                  <div
                      key={`${selectedColor}-size-${size.size}-${index}`}
                      className="flex items-center justify-center cursor-pointer border rounded-lg p-2 hover:bg-gray-200"
                  >
                    <span className="text-sm text-black">{size.size}</span>
                  </div>
              ))}
            </div>

            <div className="flex flex-col space-y-4 mb-4">
              <Button className="w-full">Add to Cart</Button>
              <div className="text-black w-full flex justify-center items-center gap-x-2 border border-zinc-300 rounded-md p-2">
                <WishListButton productId={product.id} />
                Add to Wishlist
              </div>
            </div>

            <p className="text-lg text-gray-700">{product.description}</p>

            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">SKU: {selectedVariant?.sku}</p>
              <p className="text-sm text-gray-600">Category: {product.category}</p>
              <p className="text-sm text-gray-600">Weight: {product.weight}</p>
              <p className="text-sm text-gray-600">Dimensions: {product.dimensions}</p>
              <p className="text-sm text-gray-600">Material: {product.material}</p>
              <StarRating productId={productId} ratings={ratings} />
            </div>
          </div>
        </div>

        <ImageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            images={mainImages}
            initialIndex={selectedImageIndex}
        />

        <ProductReviewsList productId={productId} ratings={ratings} />
      </>
  );
};

export default ProductDetails;