"use client";

import { motion } from "motion/react"; // Correct import for motion
import { Button } from "@/components/ui/button";

export interface FaqCategory {
  id: string;
  name: string;
  description: string;
  icon: any; 
}

interface FaqCategoriesProps {
  categories: FaqCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function FaqCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: FaqCategoriesProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-black"
    >
      {categories.map((category) => {
        // Dynamically import the icon based on its name
        return (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="w-full h-auto flex flex-col items-center gap-2 p-4"
              onClick={() =>
                onSelectCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <category.icon className="w-8 h-8" />
              </div>

              <div className="text-center">
                <div className="font-semibold">{category.name}</div>
                <div className="text-sm text-muted-foreground text-ellipsis overflow-hidden line-clamp-3 whitespace-normal">
                  {category.description}
                </div>
              </div>
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
