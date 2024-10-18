import React, { useState } from "react";
import { Filter } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

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

const shoeSizesUK = [
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
];

const shoeSizesUS = [
  "2",
  "2.5",
  "3",
  "4",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
];

const apparelSizes = ["XS", "S", "M", "L", "XL", "XXL"];

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
  const [priceRange, setPriceRange] = useState<number[]>([50, 1000]);
  const [selectedShoeSizes, setSelectedShoeSizes] = useState<string[]>([]);
  const [selectedApparelSizes, setSelectedApparelSizes] = useState<string[]>(
    []
  );
  const [sizeSystem, setSizeSystem] = useState<"UK" | "US">("UK");

  const toggleShoeSize = (size: string) => {
    setSelectedShoeSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const toggleApparelSize = (size: string) => {
    setSelectedApparelSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  return (
    <div className="p-4">
      <Accordion type="single" collapsible>
        {/* All Products */}
        <AccordionItem value="all">
          <AccordionTrigger>All Products</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col items-start gap-y-2">
              <div className="flex items-center">
                <Checkbox id="all-products" />
                <label htmlFor="all-products" className="ml-2">
                  All Products
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox id="new-arrivals" />
                <label htmlFor="new-arrivals" className="ml-2">
                  New Arrivals
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox id="sale" />
                <label htmlFor="sale" className="ml-2">
                  Sale
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col">
              <Slider
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
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Gender Filter */}
        <AccordionItem value="gender">
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
        </AccordionItem>

        {/* Brand Filter */}
        <AccordionItem value="brand">
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
              {/* Add more brands as needed */}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color Filter */}
        <AccordionItem value="color">
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
        </AccordionItem>

        {/* Size Filter */}
        <AccordionItem value="size">
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
        </AccordionItem>
      </Accordion>
    </div>
  );
};
