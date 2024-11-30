"use client";

import { motion } from "motion/react";
import Image from "next/image";

const images = [
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    alt: "Team collaboration"
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    alt: "Office space"
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    alt: "Team meeting"
  }
];

export function CultureSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Life at HypeHouse</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience a culture that celebrates creativity, diversity, and innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={image.alt}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative h-[300px] rounded-lg overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center text-zinc-600">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-2">Diverse & Inclusive</h3>
            <p className="text-muted-foreground">
              We celebrate diversity and create an inclusive environment where everyone belongs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-2">Growth Focused</h3>
            <p className="text-muted-foreground">
              Continuous learning and development opportunities to advance your career
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-2">Work-Life Balance</h3>
            <p className="text-muted-foreground">
              Flexible schedules and policies that support your wellbeing
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}