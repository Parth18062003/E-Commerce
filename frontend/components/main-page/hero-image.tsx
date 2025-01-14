"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "motion/react";

const HeroImage = () => {
  return (
    <section className="relative h-[50vh] lg:h-[90vh] flex items-center justify-center mt-20">
      <Image
        src="https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/b8bc9548-a1e8-4f52-bfdd-e6d0ca90f68c/nike-just-do-it.jpg"
        alt="HypeHouse Office"
        height={1200}
        width={1800}
        className="absolute w-full h-full object-cover object-left"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/5" />

      <div className="hidden lg:block relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Step Into Comfort. Run With Style.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
        >
          Elevate your footwear game with innovative designs, unbeatable comfort, and unmatched performance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button size="lg" className="rounded-full">
            View Collection
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroImage;
