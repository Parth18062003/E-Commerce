"use client";

import { motion } from "motion/react"
import { Flag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { ReviewImages } from "./review-image";
import { StarRatingBolt } from "./star-rating";
import { Rating } from "@/store/ratingSlice";

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  imageUrls?: string[];
  createdAt: string;
  verified?: boolean;
}

interface ReviewCardProps {
  review: Rating;
  onReport: (id: string, reason: string) => void;
}

export function ReviewCard({ review, onReport }: ReviewCardProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const isPositive = review.rating >= 3;

  const date = new Date(review.createdAt);

  // Format the date to 'Month Day, Year' format
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-card rounded-lg shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-black">{review.userName}</h3>
{/*             {review.verified && (
              <Badge variant="secondary" className="text-xs">
                Verified Purchase
              </Badge>
            )} */}
          </div>
          <StarRatingBolt rating={review.rating} className="mt-1" />
        </div>
        <Badge
          variant={isPositive ? "default" : "destructive"}
          className={cn(
            "px-2 py-1",
            isPositive ? "bg-green-500" : "bg-red-500"
          )}
        >
          {isPositive ? "Positive" : "Negative"}
        </Badge>
      </div>

      <p className="mt-4 text-muted-foreground">{review.comment}</p>

      {review.imageUrls && review.imageUrls.length > 0 && (
        <ReviewImages images={review.imageUrls} />
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">
          {formattedDate}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => setShowReportDialog(true)}
        >
          <Flag className="w-4 h-4 mr-2" />
          Report
        </Button>
      </div>

      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to report this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onReport(review.id, "Inappropriate content");
                setShowReportDialog(false);
              }}
            >
              Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
