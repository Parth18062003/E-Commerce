"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, SlidersHorizontal } from "lucide-react";
import { StudentOffer, OfferCategory } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OfferCard } from "./offer-card";

interface OffersGridProps {
  offers: StudentOffer[];
  isVerified?: boolean;
}

type SortOption = "popularity" | "expiry" | "value";

export function OffersGrid({ offers, isVerified }: OffersGridProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<OfferCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredOffers = offers
    .filter(offer => {
      const matchesSearch = offer.companyName.toLowerCase().includes(search.toLowerCase()) ||
        offer.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || offer.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity;
        case "expiry":
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        case "value":
          return b.discountValue - a.discountValue;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 text-zinc-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search offers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as OfferCategory | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="expiry">Expiring Soon</SelectItem>
            <SelectItem value="value">Highest Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-primary/50 p-4 rounded-lg text-center"
        >
          Please verify your student status to view and redeem offers
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onFavorite={() => toggleFavorite(offer.id)}
            isFavorite={favorites.has(offer.id)}
          />
        ))}
      </div>
    </div>
  );
}