"use client";

import { motion } from "motion/react";
import Image from "next/image";

const milestones = [
  {
    year: 2018,
    title: "The Beginning",
    description: "Started as a small sneaker boutique in downtown LA",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1"
  },
  {
    year: 2020,
    title: "Digital Revolution",
    description: "Launched our e-commerce platform and mobile app",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3"
  },
  {
    year: 2022,
    title: "Community Growth",
    description: "Opened flagship stores in New York and Tokyo",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  },
  {
    year: 2024,
    title: "Global Impact",
    description: "Reached 1 million active community members worldwide",
    image: "https://images.unsplash.com/photo-1539541417736-3d44c90da315"
  }
];

export function Timeline() {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Our Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From humble beginnings to a global community, every step of our journey
            has been driven by passion and authenticity.
          </p>
        </motion.div>

        <div className="space-y-16">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-8`}
            >
              <div className="flex-1">
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={milestone.image}
                    alt={milestone.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="text-4xl font-bold text-primary">
                  {milestone.year}
                </div>
                <h3 className="text-zinc-500 text-2xl font-bold">{milestone.title}</h3>
                <p className="text-muted-foreground">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}