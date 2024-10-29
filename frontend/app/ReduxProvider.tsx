// app/ReduxProvider.tsx
"use client"; // Ensure this runs on the client side

import { Provider } from "react-redux";
import store from "../store/store";
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const searchClient = algoliasearch('G66MRCQA66', 'cc985da48044a74a507f8d64c7a32265');

  return (
    <>
    <InstantSearch searchClient={searchClient} indexName="products">
      <Provider store={store}>
        {children}
      </Provider>
      </InstantSearch>
    </>
  );
};

export default ReduxProvider;
