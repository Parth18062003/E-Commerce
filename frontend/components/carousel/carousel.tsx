"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarouselCard } from "./carousel-card";
import { motion, useScroll, useSpring } from "motion/react";

const CARDS = [
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_750,c_limit/d8eba42a-99d7-4910-8ab5-91f431124728/image.jpg",
    title: "Nike Air Max",
    category: "Running",
  },
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_750,c_limit/459497c0-24bb-4c2d-92ce-0924ef452857/image.png",
    title: "Air Jordan 1",
    category: "Basketball",
  },
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_749,c_limit/0bf28d64-7630-4151-b130-e6ee10c892e6/image.png",
    title: "Yeezy Boost",
    category: "Lifestyle",
  },
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_749,c_limit/4f637392-183f-4bd2-b326-1dcb15a9afc6/image.png",
    title: "New Balance 990",
    category: "Running",
  },
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_749,c_limit/a9767bce-db10-41ff-9eb5-f5daf8bbb3e6/nike-just-do-it.png",
    title: "Adidas Ultra Boost",
    category: "Running",
  },
];

export function Carousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: carouselRef });

  // Use `useSpring` to make the scale animation smoother
  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleScrollNext = () => {
    if (carouselRef.current) {
      const currentScroll = carouselRef.current.scrollLeft;
      const viewportWidth = carouselRef.current.offsetWidth;

      carouselRef.current.scrollTo({
        left: currentScroll + viewportWidth,
        behavior: "smooth",
      });
    }
  };

  const handleScrollPrevious = () => {
    if (carouselRef.current) {
      const currentScroll = carouselRef.current.scrollLeft;
      const viewportWidth = carouselRef.current.offsetWidth;

      carouselRef.current.scrollTo({
        left: currentScroll - viewportWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Previous Button */}
      <Button
        variant="secondary"
        size="icon"
        className="hidden lg:block absolute top-1/2 left-8 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 z-10"
        onClick={handleScrollPrevious}
      >
        <ChevronRight className="h-4 w-4 transform rotate-180" />
      </Button>

      {/* Carousel */}
      <motion.div
        ref={carouselRef}
        className="flex gap-6 overflow-x-scroll scrollbar-hide lg:mx-6 py-8"
        whileTap={{ cursor: "grabbing" }}
      >
        {CARDS.map((card, index) => (
          <CarouselCard key={index} {...card} />
        ))}
      </motion.div>

      {/* Next Button */}
      <Button
        variant="secondary"
        size="icon"
        className="hidden lg:block absolute top-1/2 right-10 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        onClick={handleScrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Progress Bar */}
      <motion.div
        className="h-3 bg-zinc-500 origin-left"
        style={{ scaleX }}
      ></motion.div>
    </div>
  );
}
