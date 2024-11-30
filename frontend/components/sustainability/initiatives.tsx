"use client";

import { motion } from "motion/react";
import { initiatives } from "./data";
import { Progress } from "@/components/ui/progress";


export function Initiatives() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Our Initiatives</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're taking bold steps to reduce our environmental impact and create
            positive change in the fashion industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {initiatives.map((initiative, index) => {


            return (
              <motion.div
                key={initiative.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <initiative.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-zinc-700 text-xl font-bold">{initiative.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Target: {initiative.target}
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {initiative.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{initiative.progress}%</span>
                  </div>
                  <Progress value={initiative.progress} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}