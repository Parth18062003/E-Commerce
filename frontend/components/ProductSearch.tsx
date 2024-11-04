"use client";

import React from "react";
import {
  Hits,
  Pagination,
  SearchBox,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import Hit from "./Hits";

const ProductSearch = () => {
  const { results } = useInstantSearch();
  const { query } = useSearchBox();
  return (
    <div>
      {" "}
      {/* Search Results */}
      {query && query.length > 0 && results && results.hits.length > 0 && (
        <div className="mt-4 mx-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">
                Search Results ({results.hits.length})
              </h3>
            </div>
            <Hits
              hitComponent={Hit}
              classNames={{
                list: "divide-y divide-gray-200",
                item: "p-0",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
