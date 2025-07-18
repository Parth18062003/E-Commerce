"use client";

import { Provider } from "react-redux";
import store from "../store/store";
import AlgoliaSearch from "./AlgoliaSearch";
import { GlobalSearchProvider } from "@/hooks/useGlobalSearch";

type ReduxProviderProps = {
  children: React.ReactNode;
};

const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <GlobalSearchProvider>
      <AlgoliaSearch>
        <Provider store={store}>{children}</Provider>
      </AlgoliaSearch>
    </GlobalSearchProvider>
  );
};

export default ReduxProvider;
