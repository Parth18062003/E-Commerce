"use client";

import { Carousel } from "@/components/carousel/carousel";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/utils/TransitionLink";
import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();
  const previousLink = () => {
    router.back();
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center px-6 py-12 lg:px-20">
      {/* Background image or illustration */}

      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">Oops! 404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist or has been moved.</p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        {/* Home link with smooth transition */}
        <TransitionLink
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-all duration-300 ease-in-out text-xl font-semibold"
        >
          Go to Home
        </TransitionLink>

        {/* Go Back button with hover effect */}
        <Button
          variant="ghost"
          className="ml-4 py-2 px-6 text-lg font-medium border-2 border-gray-600 hover:bg-gray-100 transition-all duration-300 ease-in-out text-zinc-800"
          onClick={previousLink}
        >
          Go Back
        </Button>
      </div>
      <div className="relative w-full max-w-8xl">
        <Carousel />
      </div>
    </div>
  );
};

export default NotFound;
