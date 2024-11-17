import React from "react";
import {ClearRefinements, useRefinementList} from "react-instantsearch";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// Sample colors and their hex values
const colors = [
    { name: "Red", hex: "#EF2425" },
    { name: "Green", hex: "#6CD04D" },
    { name: "Blue", hex: "#44ABE5" },
    { name: "Yellow", hex: "#F8D95B" },
    { name: "Purple", hex: "#C958E9" },
    { name: "Orange", hex: "#FBA421" },
    { name: "Pink", hex: "#FCCCD2" },
    { name: "Brown", hex: "#8D6F64" },
    { name: "Gray", hex: "#CCC6C6" },
    { name: "Black", hex: "#000000" },
];

// Color mapping from VIBGYOR colors to actual product color names (simplified)
type ColorCategory = "Green" | "Blue" | "Red" | "Yellow" | "Purple" | "Pink" | "Orange" | "Black" | "Brown" | "Grey";

// Color mapping from product colors to VIBGYOR colors
const colorMapping: { [key in ColorCategory]: string[] } = {
    Green: ["Kinetic Green", "Olive Green", "Seafoam", "Vapour Green", "Vintage Green"],
    Blue: ["Blue", "Navy", "Sky Blue"],
    Red: ["Coconut Milk", "Crimson Red"],
    Yellow: ["Pure Platinum", "Sunset Yellow"],
    Purple: ["Purple", "Lavender"],
    Pink: ["Pink", "Hot Pink"],
    Grey: ["Wolf Grey", "Cement Grey"],
    Brown: ["Brown", "Taupe"],
    Orange: ["Sand Drift", "Tangerine"],
    Black: ["Black", "Charcoal"]
};

interface CustomColorFilterProps {
    label: string;
    attribute: string; // the attribute being used for filtering, e.g., "variants.color"
}

const CustomColorFilter: React.FC<CustomColorFilterProps> = ({ label, attribute }) => {
    const { refine } = useRefinementList({
        attribute,
        limit: 10, // Adjust limit if necessary
        showMore: true,
    });
    // Function to handle refining based on color category and its variants
    const refineColorCategory = (category: ColorCategory) => {
        const colorVariants = colorMapping[category];

        // Refine by each individual variant in the selected color category
        colorVariants.forEach((variant) => {
            refine(variant); // Refine by each color variant individually
        });
    };

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value={attribute}>
                <AccordionTrigger className="font-normal text-sm text-gray-800">
                    {label}
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col items-start gap-y-4 relative">
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
                            {colors.map((color) => {
                                // Check if the color or any of its variants are part of the refined results
                                return (
                                    <div key={color.name} className="flex flex-col items-center justify-center">
                                        <div
                                            className={`w-8 h-8 rounded-full cursor-pointer `}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                            onClick={() => refineColorCategory(color.name as ColorCategory)} // refine by color category
                                        />
                                        <span className="mt-1 text-xs">{color.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <ClearRefinements
                        className="my-4"
                        translations={{
                            resetButtonText: "Clear Colors",
                        }}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default CustomColorFilter;
