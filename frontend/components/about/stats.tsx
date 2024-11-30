"use client";

import { motion } from "motion/react";
import { Users, Store, Globe, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1M+",
    label: "Community Members",
  },
  {
    icon: Store,
    value: "25+",
    label: "Retail Locations",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Countries Served",
  },
  {
    icon: Award,
    value: "15+",
    label: "Industry Awards",
  },
];

export function Stats() {
  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-4 flex justify-center">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-primary-foreground/80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}