import React, { useState, useEffect } from "react";
import { useRange } from "react-instantsearch";
import { Slider } from "@/components/ui/slider";

interface UseRangeProps {
  attribute: string;
  min?: number;
  max?: number;
}

const CustomRangeSlider = (props: UseRangeProps) => {
  const { start, range, canRefine, refine } = useRange(props);

  // Ensure min and max are valid numbers, provide fallbacks if undefined
  const validMin = typeof range?.min === 'number' ? range.min : 0;
  const validMax = typeof range?.max === 'number' ? range.max : 1000;

  // Helper function to get initial values with proper type handling
  const getInitialValue = (startValue: number | undefined, defaultValue: number): number => {
    if (typeof startValue === 'undefined' || !Number.isFinite(startValue)) {
      return defaultValue;
    }
    return startValue;
  };

  // Initialize state with proper type handling for RangeBoundaries
  const [value, setValue] = useState<[number, number]>([
    getInitialValue(start[0], validMin),
    getInitialValue(start[1], validMax),
  ]);

  // Sync values from useRange hook with local state
  useEffect(() => {
    const from = Math.max(validMin, getInitialValue(start[0], validMin));
    const to = Math.min(validMax, getInitialValue(start[1], validMax));
    setValue([from, to]);
  }, [start, validMin, validMax]);

  // Handle slider value change with proper typing
  const handleValueChange = (newValue: number[]) => {
    // Ensure we always have exactly two values for RangeBoundaries
    const boundedValue: [number, number] = [
      newValue[0] ?? validMin,
      newValue[1] ?? validMax,
    ];
    setValue(boundedValue);
    refine(boundedValue);
  };

  return (
    <div className="space-y-4">
      <Slider
        value={value}
        min={validMin}
        max={validMax}
        step={1}
        onValueChange={handleValueChange}
        className="w-full"
        disabled={!canRefine}
      />
      
      <div className="flex justify-between items-center">
        <div className="px-2 py-1 bg-gray-100 rounded-md">
          <span className="text-sm font-medium">{value[0]}</span>
        </div>
        <div className="px-2 py-1 bg-gray-100 rounded-md">
          <span className="text-sm font-medium">{value[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomRangeSlider;