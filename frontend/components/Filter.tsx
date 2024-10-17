import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface FilterProductsProps {
  toggleFilterSidebar: () => void; // Prop type for the toggle function
}

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
                    <label htmlFor="all-products" className="ml-2">All Products</label>
                </div>
                <div className="flex items-center">
                    <Checkbox id="new-arrivals" />
                    <label htmlFor="new-arrivals" className="ml-2">New Arrivals</label>
                </div>
                <div className="flex items-center">
                    <Checkbox id="sale" />
                    <label htmlFor="sale" className="ml-2">Sale</label>
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
                  max={100}
                  step={1}
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
                    <label htmlFor="male" className="ml-2">Male</label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="female" id="female" />
                    <label htmlFor="female" className="ml-2">Female</label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="unisex" id="unisex" />
                    <label htmlFor="unisex" className="ml-2">Unisex</label>
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
                  <label htmlFor="nike" className="ml-2">Nike</label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="adidas" />
                  <label htmlFor="adidas" className="ml-2">Adidas</label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="puma" />
                  <label htmlFor="puma" className="ml-2">Puma</label>
                </div>
                {/* Add more brands as needed */}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };