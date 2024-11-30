"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ApplicationForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
  };

  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Apply Now</h2>
          <p className="text-muted-foreground">
            Take the first step towards joining our team
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-card p-8 rounded-lg text-zinc-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              placeholder="Tell us about your relevant experience..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume</Label>
            <div className="flex items-center gap-4">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                required
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              PDF, DOC, or DOCX files only
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            By submitting, you agree to our Terms and Privacy Policy
          </p>
        </motion.form>
      </div>
    </section>
  );
}