"use client";

import { Provider } from "react-redux";
import store from "../store/store";
import AlgoliaSearch from "./AlgoliaSearch";

type ReduxProviderProps = {
  children: React.ReactNode;
};

const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <AlgoliaSearch>
      <Provider store={store}>{children}</Provider>
    </AlgoliaSearch>
  );
};

export default ReduxProvider;
