import React from "react";
import { useRefinementList, UseRefinementListProps } from "react-instantsearch";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "../ui/accordion";

interface CustomSizeFilterProps extends UseRefinementListProps {
  label: string;
}

const CustomSizeFilter: React.FC<CustomSizeFilterProps> = ({
  attribute,
  label,
}) => {
  const { items, refine, canToggleShowMore, isShowingMore, toggleShowMore } =
    useRefinementList({
      attribute,
      limit: 10, // Increase limit if necessary
      showMore: true,
    });

  // Function to categorize sizes based on whether they are numeric (for shoes) or alphabetic (for apparel)
  const categorizeSizes = (items: any[]) => {
    const shoeSizes = items.filter((item) => /^\d+$/.test(item.label)); // Numeric sizes for shoes
    const apparelSizes = items.filter((item) => /^[A-Za-z]+$/.test(item.label)); // Alphabetic sizes for apparel
    return { shoeSizes, apparelSizes };
  };

  const { shoeSizes, apparelSizes } = categorizeSizes(items);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={attribute}>
        <AccordionTrigger className="font-normal text-sm text-gray-800">
          {label}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col items-start gap-y-4 relative">
            {/* Shoe Sizes Section */}
            {shoeSizes.length > 0 && (
              <>
                <div className="font-semibold text-md text-gray-800 mb-2">
                  Shoe Sizes
                </div>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-4 p-2">
                  {shoeSizes.map((size) => (
                    <div
                      key={size.label}
                      className="flex items-center justify-center cursor-pointer"
                    >
                      <div
                        onClick={() => refine(size.value)}
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ease-in-out cursor-pointer`}
                      >
                        <span className="text-sm font-medium">
                          {size.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Separator between Shoe Sizes and Apparel Sizes */}
            <div className="w-full border-t border-gray-300 my-6" />

            {/* Apparel Sizes Section */}
            {apparelSizes.length > 0 && (
              <>
                <div className="font-semibold text-md text-gray-800 mb-2">
                  Apparel Sizes
                </div>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-4 p-2">
                  {apparelSizes.map((size) => (
                    <div
                      key={size.label}
                      className="flex items-center justify-center cursor-pointer"
                    >
                      <div
                        onClick={() => refine(size.value)}
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ease-in-out cursor-pointer`}
                      >
                        <span className="text-sm font-medium">
                          {size.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Show more button */}
            {canToggleShowMore && (
              <button
                onClick={toggleShowMore}
                className="text-blue-500 mt-4 text-sm font-medium"
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

export default CustomSizeFilter;
