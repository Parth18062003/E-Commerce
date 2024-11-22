import React from "react";
import { CldImage } from "next-cloudinary";
import { Star } from "lucide-react";
import { Rating } from "@/store/ratingSlice";

interface ReviewsListProps {
  productId: string;
  ratings: Rating[];
}

const ProductReviewsList: React.FC<ReviewsListProps> = ({ productId, ratings }) => {
  
  if (ratings.length === 0) {
    return <div className="flex justify-start items-center text-black px-4">No reviews yet.</div>;
  }

  return (
    <div className="reviews-list mt-2 px-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {ratings.map((review: Rating) => (
        <div
          key={review.id}
          className="review mb-6 p-4 border border-gray-300 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-black">{review?.userName}</div>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index < review.rating ? "text-yellow-500" : "text-gray-400"
                  }`}
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
      ))}
    </div>
  );
};

export default ProductReviewsList;
