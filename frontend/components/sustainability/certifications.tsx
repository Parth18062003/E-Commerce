"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { certifications } from "./data";
import { Badge } from "@/components/ui/badge";

export function Certifications() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-zinc-700 text-3xl font-bold mb-4">Our Certifications</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're proud to be recognized by leading environmental and social
            responsibility organizations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-zinc-600 text-xl font-bold">{cert.name}</h3>
                  <Badge variant="secondary">Since {cert.year}</Badge>
                </div>
                <p className="text-muted-foreground">{cert.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}