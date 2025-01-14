"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsByUser, Rating, removeRating } from "@/store/ratingSlice";
import { CldImage } from "next-cloudinary";
import { Star } from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProductsByIds, Product } from "@/store/productSlice";
import Image from "next/image";
import axios from "axios";
import sha1 from "sha1";

const UserReviewsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ratings, loading: ratingsLoading, error: ratingsError } = useSelector((state: RootState) => state.rating);
  const { user } = useSelector((state: RootState) => state.auth);
  const { products, loading, error } = useSelector((state: any) => state.product);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const [mainImages, setMainImages] = useState<{ [key: string]: string[] }>({}); // Stores images per product
  const userId = user?.id as string;

  useEffect(() => {
    if (userId) {
      dispatch(fetchRatingsByUser(userId));
    }
  }, [dispatch, userId]);

  // Fetch product details based on the productIds in ratings
  useEffect(() => {
    if (ratings.length > 0) {
      const productIds = ratings.map((rating) => rating.productId);
      if (productIds.length > 0) {
        dispatch(fetchProductsByIds(productIds));  // Fetch products by multiple IDs
      }
    }
  }, [dispatch, ratings]); // Trigger on ratings change

  // Create a lookup map of products by productId
  const productLookup = React.useMemo(() => {
    const lookup: { [key: string]: any } = {};

    // Access products from 'content' instead of 'products'
    if (Array.isArray(products.content)) {
      products.content.forEach((product: Product) => {
        lookup[product.id] = product;
      });
    }

    return lookup;
  }, [products]);

  console.log("products", products);

  // Set the main image for each product
  useEffect(() => {
    if (Array.isArray(products.content ) && products.content.length > 0) {
      const updatedImages: { [key: string]: string[] } = {};
      products.content.forEach((product: Product) => {
        const initialColor = product.colorOptions ? product.colorOptions[0] : null; // Assuming first color option
        const variantForColor = product.variants?.find(
          (variant) => variant.color === initialColor
        );
        if (variantForColor && variantForColor.colorOptionImages) {
          updatedImages[product.id] = variantForColor.colorOptionImages || [];
        }
      });
      setMainImages(updatedImages); // Update main images state for all products
    }
  }, [products]); // Trigger when products change

  const handleRemoveReview = async (review: Rating) => {
    if (window.confirm("Are you sure you want to remove this review?")) {
      // Delete images from Cloudinary
      if (review.imageUrls) {
        await Promise.all(review.imageUrls.map(async (url) => {
          const publicId = getPublicIdFromUrl(url);
          if (publicId) {
            await handleDeleteImage(publicId);
          }
        }));
      }

      // Dispatch remove rating action
      dispatch(removeRating(review.id));
      // Update the local state to immediately reflect the change
      const updatedRatings = ratings.filter((r) => r.id !== review.id);
      dispatch({ type: 'rating/setRatings', payload: updatedRatings });
    }
  };

  const handleDeleteImage = async (publicId: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    // Generate the signature using sha1
    const signature = sha1(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`);
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    try {
      await axios.post(url, {
        public_id: publicId,
        signature: signature,
        api_key: apiKey,
        timestamp: timestamp,
      });
      console.log("Old image deleted successfully.");
    } catch (error) {
      console.error("Failed to delete old image from Cloudinary:", error);
    }
  };

  const getPublicIdFromUrl = (url: string) => {
    const regex = /\/upload\/v\d+\/(.*)\.\w{3,4}$/;
    const match = url.match(regex);
    return match ? match[1] : null; // Returns the public ID or null if not found
  };

  return (
    <div className="user-reviews-list container mx-auto p-4">
      {ratings.length > 0 ? (
        ratings.map((review: Rating) => {
          const product = productLookup[review.productId]; // Get the product for this review

          if (!product) {
            return null; // Skip if no product found
          }

          return (
            <div key={review.id} className="max-w-3xl mb-6 p-4 border border-gray-300 rounded-lg shadow-lg bg-white flex">
              <div className="flex-1">
                {/* Review Images */}
                {review.imageUrls && review.imageUrls.length > 0 && (
                  <div className="image-gallery mb-2 flex flex-wrap">
                    {review.imageUrls.map((url, index) => (
                      <CldImage
                        key={index}
                        src={url}
                        alt={`Review Image ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-24 h-24 rounded object-cover border-2 border-gray-300 m-1 hover:shadow-lg transition-shadow"
                      />
                    ))}
                  </div>
                )}
                {/* Review Text */}
                <p className="mt-2 text-gray-800 italic">{review.comment}</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`h-5 w-5 ${index < review.rating ? "text-yellow-500" : "text-gray-400"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleRemoveReview(review)}
                  className="mt-4 text-red-600 hover:underline"
                >
                  Remove Review
                </button>
                {/* Product Details below the review */}
                <div>
                  <h3 className="text-lg font-bold text-black mt-4">{product.name}</h3>
                  <p className="text-gray-700 line-clamp-2">{product.description}</p>
                  <div className="text-black font-semibold">${product.price}</div>
                </div>
              </div>
              {/* Product Main Image to the right */}
              {mainImages[review.productId] && mainImages[review.productId].length > 0 ? (
                <div className="ml-4 flex-shrink-0 w-1/3">
                  <Image
                    src={mainImages[review.productId][0]}
                    alt={`Review Product: ${product.name}`}
                    width={200}
                    height={200}
                    className="rounded mt-2"
                  />
                </div>
              ) : (
                <div className="text-gray-500">No product image available</div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-black">No reviews yet.</div>
      )}
    </div>
  );
};

export default UserReviewsList;
