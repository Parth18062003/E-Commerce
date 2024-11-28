"use client";

import { Rating } from "@/store/ratingSlice";
import { ReviewCard, type Review } from "./review-card";

interface ReviewsListProps {
  reviews: Rating[];
  onReportReview: (id: string, reason: string) => void;
}

export function ReviewsList({ reviews, onReportReview }: ReviewsListProps) {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onReport={onReportReview}
        />
      ))}
    </div>
  );
}