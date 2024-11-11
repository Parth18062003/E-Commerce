"use client";

import React, { useState } from "react";
import {
  ClearRefinements,
  Configure,
  DynamicWidgets,
  Hits,
  HitsPerPage,
  Pagination,
  RefinementList,
  SearchBox,
  SortBy,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Hit from "./Hits";
import CustomPagination from "./CustomPagination";
import CustomSortBy from "./CustomSortBy";
import CustomRefinementList from "./CustomRefinementList";

const ProductSearch = () => {
  const { results } = useInstantSearch(); // Adding isSearching from Algolia
  const { query } = useSearchBox();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sortItems = [
    { label: "Featured", value: "products" },
    { label: "Price (asc)", value: "instant_search_price_asc" },
    { label: "Price (desc)", value: "instant_search_price_desc" },
  ];
  // Open dialog when query is entered and not empty
  const handleDialogOpen = () => {
    if (query?.length > 0) {
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }
  };

  // Close the dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // Trigger dialog opening when the query changes
  React.useEffect(() => {
    handleDialogOpen();
  }, [query]);

  return (
    <>
      {/* Dialog Overlay with ShadCN Dialog components */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {/* Trigger will be hidden, dialog will open based on `query` */}
          <Button variant="outline" className="hidden" />
        </DialogTrigger>
        <DialogContent className="fixed lg:min-w-[60rem] overflow-y-auto max-h-[90vh] transition-all bg-zinc-100 text-black">
          <DialogHeader>
            <DialogTitle className="text-black">Search Results</DialogTitle>
            <DialogDescription>
              Here are the results for{" "}
              <span className="font-semibold text-zinc-600 ">{query}</span>
            </DialogDescription>
            {/* Search Box inside Dialog */}
            <SearchBox
              placeholder="Search products..."
              classNames={{
                root: "w-full",
                form: "w-full",
                input:
                  "px-4 py-2 rounded-full border border-zinc-500 bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white focus:outline-none focus:ring-2 transition caret-indigo-400 w-full",
                submit: "hidden",
                reset: "hidden",
              }}
            />
          </DialogHeader>

          {/* Dialog Content */}
          <div className="p-4">
            {/* Display results only if there is a query */}
            {query && query.length > 0 && results && results.hits.length > 0 ? (
              <div>
                <div className="text-sm text-gray-600 mb-2">
                  {results.hits.length} Results found
                </div>
                <Configure hitsPerPage={5} />
                <Hits
                  hitComponent={Hit}
                  classNames={{
                    list: "divide-x divide-gray-200",
                    item: "p-0",
                  }}
                />
                <CustomPagination />
              </div>
            ) : query && query.length > 0 ? (
              <div className="text-sm text-gray-600">
                No results found for "{query}"
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                Please enter a query to search.
              </div>
            )}
          </div>

          {/* Dialog Footer with a close button */}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDialogClose}
              className="text-black"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductSearch;
