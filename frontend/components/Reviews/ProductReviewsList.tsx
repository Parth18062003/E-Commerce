import React from "react";
import { CldImage } from "next-cloudinary";
import { Star } from "lucide-react";
import { Rating } from "@/store/ratingSlice";
import { ReviewsList } from "./reviews-list";

interface ReviewsListProps {
  productId: string;
  ratings: Rating[];
}

const ProductReviewsList: React.FC<ReviewsListProps> = ({ productId, ratings }) => {
  
  if (ratings.length === 0) {
    return <div className="flex justify-start text-center items-center text-black px-20">No reviews yet. Be the first one Review</div>;
  }

  const handleReportReview = (id: string, reason: string) => {
    console.log(`Review ${id} reported for reason: ${reason}`);
  };

  return (
    <div className="max-w-4xl mx-6 lg:mx-16 py-12 lg:px-4">
      <h2 className="text-3xl font-bold mb-8 text-black">Customer Reviews</h2>
      
      <ReviewsList onReportReview={handleReportReview} reviews={ratings} />
{/*       {ratings.map((review: Rating) => (
        <div
          key={review.id}
          className=""
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
      ))} */}
    </div>
  );
};

export default ProductReviewsList;
