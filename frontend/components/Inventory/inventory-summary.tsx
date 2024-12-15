// InventorySummary.tsx
"use client";

import { motion } from "motion/react";
import { Package, AlertTriangle, Clock, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust this to your store location
import { InventoryItem } from "./types";

const summaryItems = [
  {
    icon: Package,
    label: "Total Products",
    value: (items: InventoryItem[]) => items.length,
    color: "text-blue-500"
  },
  {
    icon: AlertTriangle,
    label: "Low Stock Items",
    value: (items: InventoryItem[]) => items.filter(item => item.stockQuantity < 10).length,
    color: "text-yellow-500"
  },
  {
    icon: Clock,
    label: "Reserved Items",
    value: (items: InventoryItem[]) => items.reduce((acc, item) => acc + item.reservedStock, 0),
    color: "text-purple-500"
  },
  {
    icon: Check,
    label: "Available Items",
    value: (items: InventoryItem[]) => items.reduce((acc, item) => acc + item.availableStock, 0),
    color: "text-green-500"
  }
];

export function InventorySummary() {
  // Using useSelector to access the Redux state
  const { items } = useSelector((state: RootState) => state.inventory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-zinc-700">
      {summaryItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-card ${item.color} bg-opacity-10`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">
                {item.value(items || [])} {/* Use the value calculation function from summaryItems */}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}