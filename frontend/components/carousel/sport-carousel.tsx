"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarouselCard } from "./carousel-card";
import { motion, useScroll, useSpring } from "motion/react";

const CARDS = [
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_599,c_limit/a3c971bc-bc0a-4c0c-8bdf-e807a3027e53/nike-just-do-it.jpg",
    category: "Running",
    link: "/products/filter/tags?tags=running",
  },
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_600,c_limit/e4695209-3f23-4a05-a9f9-d0edde31b653/nike-just-do-it.jpg",
    category: "Football",
    link: "/products/filter/tags?tags=football",
  },
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_600,c_limit/38ed4b8e-9cfc-4e66-9ddd-02a52314eed9/nike-just-do-it.jpg",
    category: "Basketball",
    link: "/products/filter/tags?tags=basketball",
  },
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_600,c_limit/e36a4a2b-4d3f-4d1c-bc75-d6057b7cec87/nike-just-do-it.jpg",
    category: "Training & Gym",
    link: "/products/filter/tags?tags=training",
  },
  {
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_600,c_limit/7ce96f81-bf80-45b9-918e-f2534f14015d/nike-just-do-it.jpg",
    category: "Tennis",
    link: "/products/filter/tags?tags=tennis",
  },
];

export function SportCarousel() {
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
    <div className="relative my-8">
        <h3 className="text-black mx-3 lg:mx-14 text-3xl font-medium ">Shop By Sport</h3>
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
        className="flex gap-6 overflow-x-scroll scrollbar-hide lg:mx-6 pt-8 pb-4"
        whileTap={{ cursor: "grabbing" }}
      >
        {CARDS.map((card, index) => (
          <CarouselCard key={index} {...card} className=" w-72 h-60 lg:w-[30rem] lg:h-[20rem]"/>
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
        className="h-3 bg-zinc-500 origin-left mb-8"
        style={{ scaleX }}
      ></motion.div>
    </div>
  );
}
