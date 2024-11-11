"use client";

import React from "react";
import { useSortBy } from "react-instantsearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown/dropdown-menu";
import { ArrowDownWideNarrow } from "lucide-react";

type SortByProps = {
  items: Array<{ label: string; value: string }>;
};

const CustomSortBy: React.FC<SortByProps> = ({ items }) => {
  const { currentRefinement, options, refine, canRefine } = useSortBy({
    items,
  });

  return (
    <div className="flex items-center">
      <span className="mr-2">
        <ArrowDownWideNarrow />
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {options.find((option) => option.value === currentRefinement)
            ?.label || "Sort by"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={currentRefinement}
            onValueChange={(value: string) => refine(value)}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomSortBy;
