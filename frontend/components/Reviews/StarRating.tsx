"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addRating, Rating } from "@/store/ratingSlice";
import { AppDispatch, RootState } from "@/store/store";
import RatingImageUpload from "./RatingImageUpload";
import LoginDialog from "../LoginDialog";

interface StarRatingProps {
  productId: string;
  ratings: Rating[];  // Accept ratings as a prop
}

export const StarRating: React.FC<StarRatingProps> = ({ productId, ratings }) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isSubmitted, setSubmissionState] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.rating);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const isLoggedIn = !!user;
  const userId = user?.id;
  const userName = user?.firstName + " " + user?.lastName;

  // Set initial values if the user already has a rating
  useEffect(() => {
    if (isLoggedIn && userId) {
      const existingRating = ratings.find((r) => r.userId === userId);
      if (existingRating) {
        setRatingValue(existingRating.rating);
        setComment(existingRating.comment || "");
        if (textRef.current) {
          textRef.current.value = existingRating.comment || "";
        }
        setSubmissionState(true);
        setUploadedImageUrls(existingRating.imageUrls || []);
      }
    }
  }, [isLoggedIn, userId, ratings]);

  const handleRating = (value: number) => {
    setRatingValue((prev) => (value === prev ? null : value)); // Toggle rating
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async () => {
    setError(null);

    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }

    if (!userId || !userName) {
      setError("User information is missing");
      return;
    }

    if (ratingValue === null) {
      setError("Please select a rating");
      return;
    }

    try {
      const ratingData = {
        userId,
        productId,
        rating: ratingValue,
        comment: textRef.current?.value || "",
        imageUrls: uploadedImageUrls,
        userName
      };

      const result = await dispatch(addRating(ratingData)).unwrap();
      setSubmissionState(true);
      setComment(textRef.current?.value || "");
    } catch (error) {
      setError("Failed to submit rating. Please try again.");
    }
  };

  const handleImageUploadComplete = (imageUrls: string[]) => {
    setUploadedImageUrls(imageUrls);
    setError(null);
  };

  const handleCloseDialog = () => {
    setShowLoginDialog(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ borderRadius: "2rem" }}
        animate={ratingValue ? { borderRadius: "0.5rem" } : { borderRadius: "2rem" }}
        className="w-fit overflow-hidden border py-2 shadow-xs dark:border-neutral-800 dark:bg-neutral-950"
      >
        {isSubmitted ? (
          <div className="flex items-center justify-center gap-3 pl-4 pr-2">
            <div className="text-sm text-black dark:text-neutral-400">Your Rating:</div>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <Star
                    key={starValue}
                    size={24}
                    className={`cursor-default ${ratingValue !== null && starValue <= ratingValue ? "text-yellow-500" : "text-gray-400"}`}
                  />
                );
              })}
            </div>
            <div className="text-sm text-black dark:text-neutral-400">{comment}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-3 pl-4 pr-2">
              <div className="text-sm text-black dark:text-neutral-400">Do you like the product?</div>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <button
                      key={starValue}
                      onClick={() => handleRating(starValue)}
                      className="flex items-center"
                    >
                      <Star
                        size={24}
                        aria-label={`Rate ${starValue}`}
                        className={`cursor-pointer transition-colors duration-200 } ${ratingValue && starValue <= ratingValue ? "text-yellow-500" : "text-gray-400"}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}
          </div>
        )}
        <motion.div
          aria-hidden={!ratingValue}
          initial={{ height: 0, translateY: 15 }}
          className="px-2"
          transition={{ ease: "easeInOut", duration: 0.3 }}
          animate={ratingValue ? { height: "auto" } : {}}
        >
          <AnimatePresence>
            {!isSubmitted ? (
              <motion.span exit={{ opacity: 0 }} initial={{ opacity: 1 }}>
                <textarea
                  ref={textRef}
                  placeholder="Your feedback here..."
                  className="min-h-36 w-full resize-none rounded-md border bg-transparent p-2 text-sm placeholder-neutral-400 focus:border-neutral-400 focus:outline-0 dark:border-neutral-800 dark:focus:border-white text-black"
                  onChange={() => setComment(textRef.current?.value || "")}
                />
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading.add}
                    className={`flex h-9 items-center justify-center rounded-md border bg-neutral-950 px-3 text-sm text-white transition duration-300 ease-in-out dark:bg-white dark:text-neutral-950 ${loading.add ? "bg-neutral-500 dark:bg-neutral-500" : ""}`}
                  >
                    {loading.add ? "Loading..." : "Submit"}
                  </button>
                  <RatingImageUpload onUploadComplete={handleImageUploadComplete} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {uploadedImageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Uploaded Image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-xs"
                    />
                  ))}
                </div>
              </motion.span>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full w-full flex-col items-center justify-start gap-2 pt-9 text-sm font-normal"
              >
                <div className="flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-full bg-blue-500 dark:bg-sky-500">
                  <span className="text-white">✓</span>
                </div>
                <div className="text-black my-4">
                  Your feedback has been received! <br /> Thank you for your help.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      {showLoginDialog && <LoginDialog onClose={handleCloseDialog} />}
    </>
  );
};