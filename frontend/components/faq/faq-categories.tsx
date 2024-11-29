"use client";

import { motion } from "motion/react"; // Correct import for motion
import { Button } from "@/components/ui/button";
import { Truck, Package, RefreshCw, Ruler } from "lucide-react";

type IconName = "truck" | "package" | "refresh-cw" | "ruler";

export interface FaqCategory {
  id: string;
  name: string;
  description: string;
  icon: IconName; // Icon name as a string (e.g., "Truck")
}

interface FaqCategoriesProps {
  categories: FaqCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const faqIcons: Record<IconName, React.ElementType> = {
  truck: Truck,
  package: Package,
  "refresh-cw": RefreshCw,
  ruler: Ruler,
};

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

        const Icon = faqIcons[category.icon]; // Dynamically import the icon based on its name
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
              <Icon className="h-16 w-16" />
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
