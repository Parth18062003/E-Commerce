"use client";

import React from "react";
import { useHitsPerPage, UseHitsPerPageProps } from "react-instantsearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown/dropdown-menu";
import { List } from "lucide-react";

type CustomHitsPerPageProps = UseHitsPerPageProps;

const CustomHitsPerPage: React.FC<CustomHitsPerPageProps> = (props) => {
  const { items, refine } = useHitsPerPage(props);
  const { value: currentValue } = items.find(({ isRefined }) => isRefined)! || {};

  return (
    <div className="flex items-center">
      <span className="mr-2">
        <List />
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {items.find((item) => item.value === currentValue)?.label || "Items per page"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Items per page</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={String(currentValue)}
            onValueChange={(value: string) => refine(Number(value))}
          >
            {items.map((item) => (
              <DropdownMenuRadioItem key={item.value} value={String(item.value)}>
                {item.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomHitsPerPage;
