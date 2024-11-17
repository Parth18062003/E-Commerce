import React from "react";
import { useConnector } from "react-instantsearch";
import connectRatingMenu from "instantsearch.js/es/connectors/rating-menu/connectRatingMenu";
import { Star } from "lucide-react";

import type { RatingMenuConnectorParams, RatingMenuWidgetDescription } from "instantsearch.js/es/connectors/rating-menu/connectRatingMenu";

export type UseRatingMenuProps = RatingMenuConnectorParams;

export function useRatingMenu(props?: UseRatingMenuProps) {
    return useConnector<RatingMenuConnectorParams, RatingMenuWidgetDescription>(
        connectRatingMenu,
        props
    );
}

export function CustomRatingMenu({ attribute, label }: { attribute: string; label: string }) {
    const { items, refine, createURL } = useRatingMenu({ attribute });

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-md font-semibold text-gray-800 mb-4">{label}</h3>
            <ul className="space-y-3">
                {items.map((item) => {
                    const starCount = Number(item.value); // Convert to number for the correct star count

                    return (
                        <li key={item.value} className="flex items-center justify-between">
                            <a
                                href={createURL(item.value)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    refine(item.value); // Refine the filter based on the selected rating
                                }}
                                className={`flex items-center text-gray-600 hover:text-indigo-600 cursor-pointer ${
                                    item.isRefined ? "font-bold text-indigo-600" : ""
                                }`}
                                aria-label={`${item.value} & up`}
                            >
                                {/* Display the correct number of stars for the current rating range */}
                                {[...Array(5)].reverse().map((_, index) => {
                                    // Only fill the stars if the index is less than the current rating value
                                    const isFilled = index > starCount-1;
                                    return (
                                        <Star
                                            key={index}
                                            size={20}
                                            className={`mr-1 ${isFilled ? "text-zinc-400" : "text-yellow-400"}`}
                                            strokeWidth={isFilled ? 1 : 2} // Apply stroke width for unfilled stars
                                        />
                                    );
                                })}
                                <span className="text-sm">
                  {item.value} & Up
                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
