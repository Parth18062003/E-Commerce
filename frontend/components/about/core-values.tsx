"use client";

import { motion } from "motion/react";
import { Heart, Users, Sparkles, Target } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Authenticity",
    description: "We celebrate individuality and self-expression through style"
  },
  {
    icon: Users,
    title: "Community",
    description: "Building connections through shared passion for street culture"
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Pushing boundaries in fashion and technology"
  },
  {
    icon: Target,
    title: "Sustainability",
    description: "Committed to ethical practices and environmental responsibility"
  }
];

const goals = [
  {
    metric: "Carbon Neutral",
    target: "2025",
    progress: 65
  },
  {
    metric: "Global Stores",
    target: "50+",
    progress: 80
  },
  {
    metric: "Community Members",
    target: "2M+",
    progress: 45
  }
];

export function CoreValues() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide us in everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">2025 Goals</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ambitious targets driving our future
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.metric}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-card rounded-lg"
            >
              <div className="text-zinc-600 text-4xl font-bold mb-2">{goal.target}</div>
              <div className="text-zinc-500 text-lg font-medium mb-4">{goal.metric}</div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${goal.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-primary"
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {goal.progress}% Complete
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}