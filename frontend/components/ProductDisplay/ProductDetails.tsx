/* "use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
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
import { Lens } from "../ui/lens";
import ImageModal from "../ImageModal";
import { Product, Variant } from "@/store/productSlice";
import ProductReviewsList from "../Reviews/ProductReviewsList";
import { Rating } from "@/store/ratingSlice";
import GetProductRating from "../Reviews/GetProductRating";
import { createSlug } from "@/lib/utils";
import WishListButton from "../WishList/WishListButton";
import { StarRating } from "../Reviews/StarRating";

const ProductDetails: React.FC = ({
}) => {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [mainImages, setMainImages] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState<number>(0);
  const [sizes, setSizes] = useState<{ size: string; stockQuantity: number }[]>(
    []
  );
  // Track both product ID and initialization status
  const initialSetupRef = useRef<{
    productId: string | null;
    completed: boolean;
  }>({
    productId: null,
    completed: false,
  });

  // Initial setup effect - runs only once per unique product
  useEffect(() => {
    if (
      product &&
      (!initialSetupRef.current.completed ||
        initialSetupRef.current.productId !== product.id)
    ) {
      // Check URL for variant SKU
      const skuFromUrl = window.location.pathname.split("/").pop();
      let initialVariant = product.variants[0];

      // If URL contains SKU, find matching variant
      if (skuFromUrl) {
        const variantFromUrl = product.variants.find(
          (v) => createSlug(v.sku) === skuFromUrl
        );
        if (variantFromUrl) {
          initialVariant = variantFromUrl;
        }
      }

      if (initialVariant) {
        console.log("Performing initial setup with variant:", initialVariant);
        initializeVariant(initialVariant);
        initialSetupRef.current = {
          productId: product.id,
          completed: true,
        };
      }
    }
  }, [product, productId]); // Ensure to watch for product and productId changes

  // Function to initialize a selected variant
  const initializeVariant = (variant: Variant) => {
    console.log("Setting variant state:", variant.color);
    setSelectedColor(variant.color);
    setSelectedVariant(variant);
    setMainImages(variant.colorOptionImages);
    setSizes(variant.sizes);
    setDiscountedPrice(
      calculateDiscountedPrice(variant.price, variant.discount)
    );
  };

  // Calculate the discounted price
  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };

  // Handle color change when a thumbnail is clicked
  const handleColorChange = (color: string) => {
    const newVariant = product?.variants.find(
      (variant) => variant.color === color
    );
    if (!newVariant) {
      console.error(`No variant found for color: ${color}`);
      return;
    }

    console.log("Changing color to:", color);
    initializeVariant(newVariant);

    // Update the URL to reflect the selected variant
    if (product) {
      const colorUrl = `/products/${createSlug(product.name)}/${
        product.id
      }/${createSlug(newVariant.sku)}`;
      if (window.location.pathname !== colorUrl) {
        router.replace(colorUrl);
      }
    }
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

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
                            alt={`${product.name}-${selectedColor} view ${
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
              <div
                key={`${selectedColor}-${index}-desktop`}
                className="relative overflow-hidden"
              >
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
            <h1 className="text-2xl font-bold mb-2 text-black">
              {product.name}
            </h1>
            <WishListButton productId={product.id} />
          </div>

          <p className="text-lg text-gray-600 mb-4">
            <span className="font-thin text-zinc-500">{product.brand}</span>
          </p>

          <GetProductRating productId={product.id} />

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
            {product.variants.map((variant: Variant, index: number) => (
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

          {sizes.length > 0 && (
            <>
              <div className="flex justify-between">
                <label className="block text-sm font-medium my-3 text-black">
                  Available Sizes
                </label>
                <Link
                  href="/products/size-guide"
                  className="text-black flex mb-2"
                >
                  <Ruler className="mr-1" />
                  Size Guide
                </Link>
              </div>

              <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 mb-3">
                {sizes.map((size, index) => (
                  <div
                    key={`${selectedColor}-size-${size.size}-${index}`}
                    className="flex items-center justify-center cursor-pointer border rounded-lg p-2 hover:bg-gray-200"
                  >
                    <span className="text-sm text-black">{size.size}</span>
                  </div>
                ))}
              </div>
            </>
          )}

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
            <p className="text-sm text-gray-600">
              Category: {product.category}
            </p>
            <p className="text-sm text-gray-600">Weight: {product.weight}</p>
            <p className="text-sm text-gray-600">
              Dimensions: {product.dimensions}
            </p>
            <p className="text-sm text-gray-600">
              Material: {product.material}
            </p>
            <StarRating productId={productId} ratings={rating} />
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
 */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "../ui/button";
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
import { Lens } from "../ui/lens";
import ImageModal from "../ImageModal";
import { fetchProductDetails, Variant } from "@/store/productSlice";
import ProductReviewsList from "../Reviews/ProductReviewsList";
import { fetchRatingsByProduct } from "@/store/ratingSlice";
import GetProductRating from "../Reviews/GetProductRating";
import Loading from "@/app/loading";
import { createSlug } from "@/lib/utils";
import WishListButton from "../WishList/WishListButton";
import { StarRating } from "../Reviews/StarRating";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const { product, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { ratings, cache } = useSelector((state: RootState) => state.rating);

  const [mainImages, setMainImages] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState<number>(0);
  const [sizes, setSizes] = useState<{ size: string; stockQuantity: number }[]>(
    []
  );

  // Track both product ID and initialization status
  const initialSetupRef = useRef<{
    productId: string | null;
    completed: boolean;
  }>({
    productId: null,
    completed: false,
  });

  // Fetch product and ratings only when the productId changes
  useEffect(() => {
    if (productId) {
      console.log("Fetching product details and ratings");
  
      // Fetch product details if the product is not in the cache or not already loaded
      if (!product || product.id !== productId) {
        dispatch(fetchProductDetails(productId));
      }
  
      // Fetch ratings if not already cached
      if (!cache[productId]) {
        dispatch(fetchRatingsByProduct(productId));
      }
    }
  }, [dispatch, productId, product, cache]); // Only depend on productId and cache to trigger the effect
  

  // Initial setup effect - runs only once per unique product
  useEffect(() => {
    if (
      product &&
      (!initialSetupRef.current.completed ||
        initialSetupRef.current.productId !== product.id)
    ) {
      // Check URL for variant SKU
      const skuFromUrl = window.location.pathname.split("/").pop();
      let initialVariant = product.variants[0];

      // If URL contains SKU, find matching variant
      if (skuFromUrl) {
        const variantFromUrl = product.variants.find(
          (v) => createSlug(v.sku) === skuFromUrl
        );
        if (variantFromUrl) {
          initialVariant = variantFromUrl;
        }
      }

      if (initialVariant) {
        console.log("Performing initial setup with variant:", initialVariant);
        initializeVariant(initialVariant);
        initialSetupRef.current = {
          productId: product.id,
          completed: true,
        };
      }
    }
  }, [product, productId]); // Ensure to watch for product and productId changes

  // Function to initialize a selected variant
  const initializeVariant = (variant: Variant) => {
    console.log("Setting variant state:", variant.color);
    setSelectedColor(variant.color);
    setSelectedVariant(variant);
    setMainImages(variant.colorOptionImages);
    setSizes(variant.sizes);
    setDiscountedPrice(
      calculateDiscountedPrice(variant.price, variant.discount)
    );
  };

  // Calculate the discounted price
  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };

  // Handle color change when a thumbnail is clicked
  const handleColorChange = (color: string) => {
    const newVariant = product?.variants.find(
      (variant) => variant.color === color
    );
    if (!newVariant) {
      console.error(`No variant found for color: ${color}`);
      return;
    }

    console.log("Changing color to:", color);
    initializeVariant(newVariant);

    // Update the URL to reflect the selected variant
    if (product) {
      const colorUrl = `/products/${createSlug(product.name)}/${
        product.id
      }/${createSlug(newVariant.sku)}`;
      if (window.location.pathname !== colorUrl) {
        router.replace(colorUrl);
      }
    }
  };

  const swipeCaorusel = (index: number) => {
    setCurrentIndex(index);
    api?.scrollTo(index);
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
                            alt={`${product.name}-${selectedColor} view ${
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
                    key={`${selectedColor}-dot-${index}`}
                    className={`w-16 h-2  rounded-full ${
                      index === currentIndex ? "bg-zinc-500" : "bg-gray-300"
                    }`}
                    onClick={() => swipeCaorusel(index)}
                  />
                ))}
              </div>
            </Carousel>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4 mt-4">
            {mainImages.map((image, index) => (
              <div
                key={`${selectedColor}-${index}-desktop`}
                className="relative overflow-hidden"
              >
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

          <div className="grid grid-cols-2 lg:grid-cols-4 my-2 p-0 gap-3">
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

          {sizes.length > 0 && (
            <>
              <div className="flex justify-between">
                <label className="block text-sm font-medium my-3 text-black">
                  Available Sizes
                </label>
                <Link
                  href="/products/size-guide"
                  className="text-black flex mb-2"
                >
                  <Ruler className="mr-1" />
                  Size Guide
                </Link>
              </div>

              <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 mb-3">
                {sizes.map((size, index) => (
                  <div
                    key={`${selectedColor}-size-${size.size}-${index}`}
                    className="flex items-center justify-center cursor-pointer border rounded-lg p-2 hover:bg-gray-200"
                  >
                    <span className="text-sm text-black">{size.size}</span>
                  </div>
                ))}
              </div>
            </>
          )}

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
            <p className="text-sm text-gray-600">
              Category: {product.category}
            </p>
            <p className="text-sm text-gray-600">Weight: {product.weight}</p>
            <p className="text-sm text-gray-600">
              Dimensions: {product.dimensions}
            </p>
            <p className="text-sm text-gray-600">
              Material: {product.material}
            </p>
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
