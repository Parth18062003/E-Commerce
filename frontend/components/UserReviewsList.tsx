"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsByUser, Rating, removeRating } from "@/store/ratingSlice";
import { CldImage } from "next-cloudinary";
import { Star } from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProductDetails } from "@/store/productSlice";
import Image from "next/image";
import axios from "axios";
import sha1 from "sha1";

const UserReviewsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ratings, loading: ratingsLoading, error: ratingsError } = useSelector((state: RootState) => state.rating);
  const { user } = useSelector((state: RootState) => state.auth);
  const { product, loading: productLoading, error: productError } = useSelector((state: RootState) => state.product);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const [mainImages, setMainImages] = useState<string[]>([]);
  const userId = user?.id as string;

  useEffect(() => {
    if (userId) {
      dispatch(fetchRatingsByUser(userId));
    }
  }, [dispatch, userId]);

  const productId = ratings[0]?.productId;

  useEffect(() => {
    if (productId) {
      const existingProduct = product;

      if (!existingProduct || existingProduct.id !== productId) {
        dispatch(fetchProductDetails(productId));
      } else {
        const initialColor = existingProduct.colorOptions[0];
        setMainImages(existingProduct.colorOptionImages[initialColor] || []);
      }
    }
  }, [dispatch, productId, product]);

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

  if (productLoading) {
    return <div className="text-center text-black">Loading...</div>;
  }

  if (ratingsError) {
    return <div className="text-black">Error fetching your reviews: {ratingsError}</div>;
  }

  if (productError) {
    return <div className="text-black">Error fetching product details: {productError}</div>;
  }

  return (
    <div className="user-reviews-list container mx-auto p-4">
      {ratings.length > 0 ? (
        ratings.map((review: Rating) => (
          <div key={review.id} className="review mb-6 p-4 border border-gray-300 rounded-lg shadow-lg bg-white flex">
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
              <h3 className="text-lg font-bold text-black mt-4">{product?.name || "Product Name Unavailable"}</h3>
              <p className="text-gray-700">{product?.description || "Description Unavailable"}</p>
              <div className="text-black font-semibold">${product?.price || "Price Unavailable"}</div>
            </div>
            {/* Product Main Image to the right */}
            <div className="ml-4 flex-shrink-0 w-1/3">
              {mainImages.length > 0 ? (
                <Image
                  src={mainImages[0]}
                  alt={`Review Product: ${product?.name}`}
                  width={200}
                  height={200}
                  className="rounded mt-2"
                />
              ) : (
                <div className="text-gray-500">No product image available</div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-black">No reviews yet.</div>
      )}
    </div>
  );
};

export default UserReviewsList;
