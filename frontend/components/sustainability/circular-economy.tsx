"use client";

import { motion } from "motion/react";
import { RefreshCw, Recycle, ArrowDownCircle } from "lucide-react";

const steps = [
  {
    icon: RefreshCw,
    title: "Design for Longevity",
    description: "Creating durable products that stand the test of time"
  },
  {
    icon: Recycle,
    title: "Recycling Program",
    description: "Turn in your old gear for store credit"
  },
  {
    icon: ArrowDownCircle,
    title: "Reduce Waste",
    description: "Minimizing packaging and production waste"
  }
];

export function CircularEconomy() {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-zinc-700 text-3xl font-bold mb-4">Circular Economy</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're closing the loop on waste by implementing circular practices
            throughout our business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}