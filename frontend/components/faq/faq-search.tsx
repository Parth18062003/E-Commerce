"use client";

import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FaqSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function FaqSearch({ value, onChange }: FaqSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search frequently asked questions..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </motion.div>
  );
}