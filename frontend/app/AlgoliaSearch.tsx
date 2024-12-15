
import React from "react";
import { CustomConfigure } from "@/components/Algolia/CustomConfigure";
import searchClient from "./searchClient";
import { InstantSearchNext } from "react-instantsearch-nextjs";

const AlgoliaSearch = ({ children }: { children: React.ReactNode }) => {
  return (
    <InstantSearchNext searchClient={searchClient} indexName="products">
      <CustomConfigure hitsPerPage={9} />
      {children}
    </InstantSearchNext>
  );
};

export default AlgoliaSearch;
