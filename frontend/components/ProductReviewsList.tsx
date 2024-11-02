import React, { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsByProduct, Rating } from "@/store/ratingSlice";
import { CldImage } from "next-cloudinary";
import { Star } from "lucide-react";
import { AppDispatch } from "@/store/store";
import { fetchUserById } from "@/store/userSlice";

interface ReviewsListProps {
  productId: string;
}

const ProductReviewsList: React.FC<ReviewsListProps> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ratings, loading, error } = useSelector((state: any) => state.rating);
  const { user } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(fetchRatingsByProduct(productId));
  }, [dispatch, productId]);

  if (loading.fetch) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error fetching reviews: {error}
      </div>
    );
  }

  return (
    <div className="reviews-list mt-2 px-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {ratings.length > 0 ? (
        ratings.map((review: Rating) => (
          <div
            key={review.id}
            className="review mb-6 p-4 border border-gray-300 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-black">{review?.userName}</div>
              <div className="flex items-center">
                {/* Render stars based on the rating */}
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < review.rating
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    fill={review ? "#fde047" : "none"}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-gray-700">{review.comment}</p>
            {review.imageUrls && review.imageUrls.length > 0 && (
              <div className="image-gallery mt-2 flex flex-wrap">
                {review.imageUrls.map((url, index) => (
                  <CldImage
                    key={index}
                    src={url}
                    alt={`Review Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-24 h-24 rounded object-cover border-2 border-gray-300 m-1 shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">No reviews yet.</div>
      )}
    </div>
  );
};

export default ProductReviewsList;
