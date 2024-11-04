import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAverageRating } from "@/store/ratingSlice"; // Adjust the import based on your store structure
import { AppDispatch, RootState } from "@/store/store";
import { Star } from "lucide-react";

const GetProductRating = ({ productId }: { productId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { averageRating, totalReviews, loading, error } = useSelector(
    (state: RootState) => state.rating
  );

  useEffect(() => {
    // Dispatch the fetchAverageRating action when the component mounts
    dispatch(fetchAverageRating(productId));
  }, [dispatch, productId]);

  if (loading.fetch) {
    return <div>Loading...</div>;
  }

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
