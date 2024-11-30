"use client";

import { motion } from "motion/react";
import {
  Zap,
  Heart,
  Globe,
  BookOpen,
  Coffee,
  DollarSign,
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Industry-leading compensation with equity options"
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health coverage and wellness programs"
  },
  {
    icon: Globe,
    title: "Remote Work",
    description: "Flexible work arrangements and remote options"
  },
  {
    icon: BookOpen,
    title: "Learning Budget",
    description: "Annual budget for courses and conferences"
  },
  {
    icon: Coffee,
    title: "Work-Life Balance",
    description: "Unlimited PTO and flexible hours"
  },
  {
    icon: Zap,
    title: "Employee Discounts",
    description: "Exclusive access to products and releases"
  }
];

export function Benefits() {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Why Join HypeHouse?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We offer more than just a job. Join us and enjoy these amazing benefits
            while building your career.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-zinc-600 text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}