"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { materials } from "./data";
import { Progress } from "@/components/ui/progress";

export function MaterialsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Sustainable Materials</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We carefully select materials that minimize environmental impact while
            maximizing performance and durability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {materials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={material.image}
                  alt={material.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-zinc-600 text-xl font-bold mb-2">{material.name}</h3>
                <p className="text-muted-foreground mb-4">{material.description}</p>
                <div className="space-y-4">
                  <div>
                    <div className="text-zinc-500 text-sm font-medium mb-1">Environmental Impact</div>
                    <p className="text-sm text-muted-foreground">{material.impact}</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-zinc-500">
                      <span>Usage in Products</span>
                      <span>{material.percentage}%</span>
                    </div>
                    <Progress value={material.percentage} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}