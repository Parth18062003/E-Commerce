"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "../ui/button";
import clsx from "clsx";
import { TransitionLink } from "../utils/TransitionLink";

interface CarouselCardProps {
  image: string;
  title?: string;
  category?: string;
  className?: string;
  link: string;
}

export function CarouselCard({ image, title, category, className, link }: CarouselCardProps) {
  return (
    <motion.div
      className="relative shrink-0 cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <TransitionLink href={link}>
      <div className={clsx("relative rounded-xl overflow-hidden", className)}> {/*"relative w-60 h-96 lg:w-[30rem] lg:h-[35rem] rounded-xl overflow-hidden*/}
        
        <Image
          src={image}
          alt={`Image of ${title}`}
          width={600}
          height={800}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 lg:bottom-10 lg:left-10 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <Button variant="secondary" className="rounded-full bg-zinc-100 text-black backdrop-blur-sm">
            {category}
          </Button>
        </div>
      </div>
      </TransitionLink>
    </motion.div>
  );
}