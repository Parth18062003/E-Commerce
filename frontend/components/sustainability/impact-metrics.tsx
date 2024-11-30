"use client";

import { motion } from "motion/react";
import { Droplet, Wind, TreePine, Recycle } from "lucide-react";

const metrics = [
  {
    icon: Droplet,
    value: "500M",
    label: "Liters of Water Saved",
    description: "Through efficient production processes"
  },
  {
    icon: Wind,
    value: "30%",
    label: "Carbon Reduction",
    description: "Compared to industry standard"
  },
  {
    icon: TreePine,
    value: "100K",
    label: "Trees Planted",
    description: "Through our reforestation program"
  },
  {
    icon: Recycle,
    value: "5M",
    label: "Plastic Bottles Recycled",
    description: "Into sustainable materials"
  }
];

export function ImpactMetrics() {
  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className=" text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Measuring our progress towards a more sustainable future
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-4 flex justify-center">
                <metric.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-2">{metric.value}</div>
              <div className="font-medium mb-2">{metric.label}</div>
              <div className="text-sm text-primary-foreground/80">
                {metric.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}