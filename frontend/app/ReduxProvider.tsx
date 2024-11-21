"use client"; // Ensure this runs on the client side

import { Provider } from "react-redux";
import store from "../store/store";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Configure, InstantSearch } from "react-instantsearch";
import ProductSearch from "@/components/ProductSearch";
import {
    InstantSearchSSRProvider,
    InstantSearchServerState,
} from "react-instantsearch"; // Import SSR-related components
import { CustomConfigure } from "@/components/Algolia/CustomConfigure";

// Assuming `serverState` is passed from the server-side (getServerSideProps or similar)
type ReduxProviderProps = {
    children: React.ReactNode;
    serverState?: InstantSearchServerState; // Optional prop for server state
};

const ReduxProvider = ({ children, serverState }: ReduxProviderProps) => {
    const searchClient = algoliasearch(
        "G66MRCQA66",
        "cc985da48044a74a507f8d64c7a32265"
    );

    return (
        <InstantSearchSSRProvider {...serverState}> {/* Wrap with SSR provider */}
            <InstantSearch searchClient={searchClient} indexName="products">
                <CustomConfigure hitsPerPage={9}/>
                <Provider store={store}>
                    <ProductSearch />
                    {children}
                </Provider>
            </InstantSearch>
        </InstantSearchSSRProvider>
    );
};

export default ReduxProvider;
