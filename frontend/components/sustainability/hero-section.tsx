"use client";

import { motion } from "motion/react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
        alt="Sustainable Fashion"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-black/20" />
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Sustainability First
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/90 max-w-2xl mx-auto"
        >
          Our commitment to the planet goes beyond fashion. We're building a
          sustainable future through innovation and responsible practices.
        </motion.p>
      </div>
    </section>
  );
}