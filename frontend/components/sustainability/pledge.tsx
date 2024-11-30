"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pledge() {
  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">Our Sustainability Pledge</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            We're committed to becoming the most sustainable streetwear brand by 2025.
            Join us in making a difference.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="group"
          >
            Learn More About Our Goals
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          <div>
            <h3 className="text-xl font-bold mb-2">2025</h3>
            <p className="text-primary-foreground/80">
              Carbon neutral operations
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">100%</h3>
            <p className="text-primary-foreground/80">
              Sustainable materials
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Zero</h3>
            <p className="text-primary-foreground/80">
              Waste to landfill
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}