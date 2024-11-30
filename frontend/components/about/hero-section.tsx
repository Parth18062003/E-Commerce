"use client";

import { motion } from "motion/react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1556906781-9a412961c28c"
        alt="HypeHouse Store"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Elevating Street Culture
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/90 max-w-2xl mx-auto"
        >
          We're not just selling sneakers and streetwear; we're cultivating a community
          where style meets authenticity, and creativity knows no bounds.
        </motion.p>
      </div>
    </section>
  );
}