"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";

interface CarouselCardProps {
  image: string;
  title: string;
  category: string;
}

export function CarouselCard({ image, title, category }: CarouselCardProps) {
  return (
    <motion.div
      className="relative shrink-0 cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-60 h-96 lg:w-[30rem] lg:h-[35rem] rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-10 left-10 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <Button variant="secondary" className="rounded-full bg-zinc-100 text-black backdrop-blur-sm">
            {category}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}