"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToJobs = () => {
    const jobsSection = document.getElementById("jobs");
    jobsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1604014237800-1c9102c219da"
        alt="HypeHouse Office"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Join the Future of Fashion
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
        >
          Be part of a team that's redefining streetwear culture and pushing the
          boundaries of retail innovation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={scrollToJobs}
            className="group"
          >
            View Open Positions
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}