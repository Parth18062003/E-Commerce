"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsByUser, Rating, removeRating } from "@/store/ratingSlice";
import { CldImage } from "next-cloudinary";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProductsByIds, Product } from "@/store/productSlice";
import Image from "next/image";
import axios from "axios";
import sha1 from "sha1";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const UserReviewsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    ratings,
    loading: ratingsLoading,
    error: ratingsError,
  } = useSelector((state: RootState) => state.rating);
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.product);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const [mainImages, setMainImages] = useState<{ [key: string]: string[] }>({});
  const userId = user?.id as string;
  const router = useRouter();
  // Fetch user ratings when the component mounts
  useEffect(() => {
    if (userId) {
      dispatch(fetchRatingsByUser(userId))
        .unwrap()
        .then((ratings) => {
          console.log("Fetched ratings:", ratings);

          // After fetching ratings, immediately fetch the corresponding products
          if (ratings.length > 0) {
            const productIds = ratings.map((rating) => rating.productId);
            dispatch(fetchProductsByIds(productIds));
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user ratings:", error);
        });
    }
  }, [dispatch, userId]);

  // Create a lookup map of products by productId
  const productLookup = React.useMemo(() => {
    const lookup: { [key: string]: Product } = {};
    if (Array.isArray(products)) {
      products.forEach((product: Product) => {
        if (product && product.id) {
          lookup[product.id] = product;
        }
      });
    }
    console.log("ProductLookup created:", lookup);
    return lookup;
  }, [products]);

  // Set the main image for each product
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const updatedImages: { [key: string]: string[] } = {};
      products.forEach((product: Product) => {
        if (product?.variants?.[0]?.colorOptionImages) {
          updatedImages[product.id] = product.variants[0].colorOptionImages;
        }
      });
      setMainImages(updatedImages);
    }
  }, [products]);

  const handleRemoveReview = async (review: Rating) => {
    if (window.confirm("Are you sure you want to remove this review?")) {
      if (review.imageUrls) {
        await Promise.all(
          review.imageUrls.map(async (url) => {
            const publicId = getPublicIdFromUrl(url);
            if (publicId) {
              await handleDeleteImage(publicId);
            }
          })
        );
      }
      dispatch(removeRating(review.id))
        .unwrap()
        .catch((error) => {
          console.error("Failed to remove review:", error);
        });
    }
  };

  const handleDeleteImage = async (publicId: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
    const signature = sha1(
      `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
    );
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    try {
      await axios.post(url, {
        public_id: publicId,
        signature: signature,
        api_key: apiKey,
        timestamp: timestamp,
      });
    } catch (error) {
      console.error("Failed to delete old image from Cloudinary:", error);
    }
  };

  const getPublicIdFromUrl = (url: string) => {
    const regex = /\/upload\/v\d+\/(.*)\.\w{3,4}$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (ratingsError) {
    return (
      <div className="text-center text-red-500">
        Error loading reviews: {ratingsError}
      </div>
    );
  }

  if (ratings.length === 0) {
    return <div className="text-center text-black">No reviews yet.</div>;
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Reviews</h2>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        <div className="space-y-6">
          {ratings.map((review) => {
            const product = productLookup[review.productId];
            if (!product) return null;

            const variant = product.variants?.[0];
            const currentPrice = variant ? variant.price : product.price;
            const currentDiscount = variant ? variant.discount : product.discount;
            const finalPrice = currentPrice * (1 - currentDiscount / 100);

            return (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex-1 space-y-4">
                  {/* Review Images */}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.imageUrls.map((url, index) => (
                        <CldImage
                          key={index}
                          src={url}
                          alt={`Review Image ${index + 1}`}
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-lg object-cover border border-gray-200 hover:shadow-md transition-shadow"
                        />
                      ))}
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>
                        Brand: {product.brand} | Category: {product.category}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          ${finalPrice.toFixed(2)}
                        </span>
                        {currentDiscount > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ${currentPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-indigo-600">
                              ({currentDiscount}% off)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">{review.comment}</p>
                    <button
                      onClick={() => handleRemoveReview(review)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Review
                    </button>
                  </div>
                </div>

                {/* Product Main Image */}
                <div className="md:w-1/3 shrink-0">
                  {mainImages[review.productId]?.[0] ? (
                    <Image
                      src={mainImages[review.productId][0]}
                      alt={`${product.name}`}
                      width={512}
                      height={512}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center text-gray-500">
                      No image available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserReviewsList;
