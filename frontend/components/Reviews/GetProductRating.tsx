/* import React from "react";
import { Star } from "lucide-react";

const GetProductRating = ({ averageRatingData }: { averageRatingData : { averageRating:number, totalReviews: number  } }) => {
  const { averageRating, totalReviews } = averageRatingData;
  return (
    <div>
      {averageRating !== undefined ? (
        <div className="flex items-center mb-4">
          <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
          <span className="ml-1 text-black">{averageRating}</span>
          <span className="mx-1 text-gray-400">|</span>
          <span className="text-gray-400">{totalReviews} reviews</span>
        </div>
      ) : (
        <div>No ratings available.</div>
      )}
    </div>
  );
};

export default GetProductRating;
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAverageRating } from "@/store/ratingSlice"; // Adjust the import based on your store structure
import { AppDispatch, RootState } from "@/store/store";
import { Star } from "lucide-react";

const GetProductRating = ({ productId }: { productId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { averageRating, totalReviews, loading, error, cache } = useSelector(
    (state: RootState) => state.rating
  );

  // Effect to fetch the average rating if it's not cached
  useEffect(() => {
    // Check if the average rating for this product is not in cache
    if (!cache[productId]) {
      dispatch(fetchAverageRating(productId));
    }
  }, [dispatch, productId, cache]);

  // Handle loading state
  if (loading.fetch) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {averageRating !== undefined ? (
        <div className="flex items-center mb-4">
          <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
          <span className="ml-1 text-black">{averageRating.toFixed(1)}</span>
          <span className="mx-1 text-gray-400">|</span>
          <span className="text-gray-600">{totalReviews} reviews</span>
        </div>
      ) : (
        <div>No ratings available.</div>
      )}
    </div>
  );
};

export default GetProductRating;