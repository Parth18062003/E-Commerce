"use client";

import React, { useEffect, useRef } from "react";
import { useSearchBox } from "react-instantsearch";
import { Search, Mic } from "lucide-react";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

interface GlobalSearchInputProps {
  placeholder?: string;
  className?: string;
  showIcons?: boolean;
}

const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({
  placeholder = "Search products...",
  className = "",
  showIcons = true,
}) => {
  const { query, refine } = useSearchBox();
  const { openSearchModal } = useGlobalSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input focus - open modal
  const handleFocus = () => {
    openSearchModal(query);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    refine(value);
    openSearchModal(value);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K or CTRL+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        } else {
          // If input is not visible, open modal
          openSearchModal("");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openSearchModal]);

  return (
    <div className="relative">
      <div className="grow max-w-xl">
        <input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          className={`pl-10 pr-10 py-2 rounded-full border border-zinc-500 bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white focus:outline-hidden focus:ring-2 transition caret-indigo-400 ${className}`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {showIcons && (
          <>
            <div className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchInput;
