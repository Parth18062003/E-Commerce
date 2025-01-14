import UserReviewsList from "@/components/Reviews/UserReviewsList";
import React from "react";
const UserReviewsPage = () => {
  return (
    <div className="h-screen p-4 lg:p-16">
      <h2 className="text-4xl text-black font-semibold">Your Reviews</h2>
      <UserReviewsList />
    </div>
  );
};

export default UserReviewsPage;
