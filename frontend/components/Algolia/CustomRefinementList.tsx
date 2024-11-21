import React from "react";
import { useRefinementList, UseRefinementListProps } from "react-instantsearch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const CustomRefinementList = ({
  attribute,
  label,
}: UseRefinementListProps & { label: string }) => {
  const {
    items,
    refine,
    searchForItems,
    canToggleShowMore,
    isShowingMore,
    toggleShowMore,
  } = useRefinementList({ attribute, limit: 10, showMore: true });

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={attribute}>
        <AccordionTrigger className="">{label}</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col items-start gap-y-4 relative">
            {" "}
            {/* Make sure it has position relative */}
            {/* Search bar */}
            <input
              type="search"
              placeholder={`Search ${label.toLowerCase()}...`}
              className="p-2 my-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) => searchForItems(event.currentTarget.value)}
            />
            {/* Checkbox list */}
            <div className="space-y-2 w-full">
              {items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center space-x-2 z-20 relative"
                >
                  {/* Ensure z-index is high enough to interact with the checkbox */}
                  <input
                    type="checkbox"
                    checked={item.isRefined}
                    onChange={() => refine(item.value)}
                  />
                  <label htmlFor={item.value} className="text-sm text-gray-700">
                    {item.label} ({item.count})
                  </label>
                </div>
              ))}
            </div>
            {/* Show more button */}
            {canToggleShowMore && (
              <button
                onClick={toggleShowMore}
                className="text-blue-500 mt-2 text-sm"
                aria-expanded={isShowingMore ? "true" : "false"}
              >
                {isShowingMore ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomRefinementList;
