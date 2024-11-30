"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setEmail("");
    setLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/5 border-white/10"
        />
        <Button type="submit" disabled={loading}>
          <Send className="h-4 w-4 mr-2" />
          Subscribe
        </Button>
      </div>
      <p className="text-sm text-white/60 mt-2 text-center">
        Join 50,000+ subscribers. Get exclusive drops & offers.
      </p>
    </motion.form>
  );
}