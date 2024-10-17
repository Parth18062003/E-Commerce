"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown/dropdown-menu";
import { ArrowDownWideNarrow } from "lucide-react";
import { useState } from "react";

type SortOrder = "default" | "asc" | "desc" | "popular";

const sortOptions: Record<SortOrder, string> = {
  default: "All",
  asc: "Price [Low - High]",
  desc: "Price [High - Low]",
  popular: "Most Popular",
};

export const DropdownSort: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  return (
    <div className="flex items-center">
      <span className="mr-2">
        <ArrowDownWideNarrow />
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {sortOptions[sortOrder] || "Sort by"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={sortOrder}
            onValueChange={(value: string) => setSortOrder(value as SortOrder)}
          >
            {Object.entries(sortOptions).map(([value, label]) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
