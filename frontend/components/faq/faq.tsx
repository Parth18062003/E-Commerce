"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { FaqSearch } from "./faq-search";
import { FaqCategories, FaqCategory } from "./faq-categories";
import { FaqItem } from "./faq-item";
import { faqItems } from "./data";

export const faqCategories: FaqCategory[] = [
  {
    id: "shipping",
    name: "Shipping & Delivery",
    description: "Information about shipping methods and delivery times",
    icon: "truck"
  },
  {
    id: "returns",
    name: "Returns & Refunds",
    description: "Our return policy and refund process",
    icon: "refresh-cw" 
  },
  {
    id: "sizing",
    name: "Sizing & Fit",
    description: "Help finding your perfect size",
    icon: "ruler"
  },
  {
    id: "orders",
    name: "Orders",
    description: "Managing and tracking your orders",
    icon: "package" 
  }
];

export function FAQ() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((faq) => {
      const matchesSearch = search === "" || 
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = !selectedCategory || faq.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Find answers to common questions about our products and services
        </p>
      </motion.div>

      <FaqSearch value={search} onChange={setSearch} />

      <FaqCategories
        categories={faqCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <FaqItem key={faq.id} item={faq} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            No FAQs found matching your criteria
          </motion.div>
        )}
      </div>
    </div>
  );
}