"use client";

import { motion } from "motion/react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactCTA() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest drops, exclusive offers, and community events.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-md mx-auto"
        >
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              required
            />
            <Button type="submit">
              <Send className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-8 bg-card rounded-lg text-zinc-700"
        >
          <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
          <div className="space-y-2">
            <p>Email: contact@hypehouse.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Street Fashion Ave, Los Angeles, CA 90012</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}