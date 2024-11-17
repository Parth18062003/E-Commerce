import React, { useState } from "react";
import { Filter } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import CustomRangeInput from "./Algolia/PriceFilter";
import { ClearRefinements } from "react-instantsearch";
import CustomRefinementList from "./CustomRefinementList";
import CustomSizeFilter from "@/components/CustomSizeFilter";
import { CustomRatingMenu } from "@/components/Algolia/CustomRatingMenu";
import CustomColorFilter from "@/components/Algolia/CustomColorFilter";

interface FilterProductsProps {
  toggleFilterSidebar: () => void; // Prop type for the toggle function
}

const colors = [
  { name: "Red", hex: "#EF2425" },
  { name: "Green", hex: "#6CD04D" },
  { name: "indigo", hex: "#44ABE5" },
  { name: "Yellow", hex: "#F8D95B" },
  { name: "Purple", hex: "#C958E9" },
  { name: "Orange", hex: "#FBA421" },
  { name: "Pink", hex: "#FCCCD2" },
  { name: "Brown", hex: "#8D6F64" },
  { name: "Gray", hex: "#CCC6C6" },
  { name: "Black", hex: "#000000" },
];

export const FilterProducts: React.FC<FilterProductsProps> = ({
  toggleFilterSidebar,
}) => {
  return (
    <div className="flex items-center">
      <span className="mr-2">
        <Filter />
      </span>
      <button onClick={toggleFilterSidebar}>Filters</button>
    </div>
  );
};

export const FilterOptions: React.FC = () => {

  return (
    <div className="p-4">
      <Accordion type="single" collapsible>
        {/* All Products */}
        <CustomRefinementList attribute="category" label="Category" />

        <CustomRefinementList attribute="type" label="Product Type" />
        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col">
              <CustomRangeInput attribute="price" />
              {/*               <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={1000}
                step={10}
                className="h-12"
              />
              <div className="flex justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div> */}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Gender Filter */}
        <CustomRefinementList attribute="gender" label="Gender" />
       {/* <AccordionItem value="gender">
          <AccordionTrigger>Gender</AccordionTrigger>
          <AccordionContent>
            <RadioGroup>
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center">
                  <RadioGroupItem value="male" id="male" />
                  <label htmlFor="male" className="ml-2">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="female" id="female" />
                  <label htmlFor="female" className="ml-2">
                    Female
                  </label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="unisex" id="unisex" />
                  <label htmlFor="unisex" className="ml-2">
                    Unisex
                  </label>
                </div>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>*/}

        {/* Brand Filter */}
        <CustomRefinementList attribute="brand" label="Brand" />
        {/*  <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center">
                <Checkbox id="nike" />
                <label htmlFor="nike" className="ml-2">
                  Nike
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox id="adidas" />
                <label htmlFor="adidas" className="ml-2">
                  Adidas
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox id="puma" />
                <label htmlFor="puma" className="ml-2">
                  Puma
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
 */}
        {/* Color Filter */}
        <CustomColorFilter attribute="variants.color" label="Color" />
        {/*<AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
              {colors.map((color) => (
                <div
                  key={color.name}
                  className="flex flex-col items-center justify-center"
                >
                  <div
                    className="w-8 h-8 rounded-full cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    // On click, you can add logic to filter products by this color
                  />
                  <span className="mt-1 text-xs">{color.name}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>*/}
        {/* Size Filter */}
        <CustomSizeFilter label="Sizes" attribute="variants.sizes.size" />
        {/*<AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div>
              <div className="font-semibold mb-2">{sizeSystem} Shoe Sizes</div>
              <div className="mb-4">
                <button
                  className={`py-1 px-2 rounded ${
                    sizeSystem === "UK"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSizeSystem("UK")}
                >
                  UK
                </button>
                <button
                  className={`py-1 px-2 rounded ${
                    sizeSystem === "US"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSizeSystem("US")}
                >
                  US
                </button>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
                {(sizeSystem === "UK" ? shoeSizesUK : shoeSizesUS).map(
                  (size) => (
                    <div
                      key={size}
                      className={`flex flex-col items-center justify-center cursor-pointer ${
                        selectedShoeSizes.includes(size) ? "bg-gray-200" : ""
                      }`}
                      onClick={() => toggleShoeSize(size)}
                    >
                      <div className="w-8 h-8 border rounded-full flex items-center justify-center">
                        <span className="text-sm">{size}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>*/}

        <CustomRatingMenu attribute="rating" label="Rating" />
      </Accordion>
      <ClearRefinements
        className="my-4"
        translations={{
          resetButtonText: "Clear all",
        }}
      />
    </div>
  );
};
