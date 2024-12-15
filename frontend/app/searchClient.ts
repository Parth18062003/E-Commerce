// searchClient.js
"use client"; // Ensure this runs on the client side

import { liteClient as algoliasearch } from "algoliasearch/lite";
// Instantiate the searchClient once
const searchClient = algoliasearch('G66MRCQA66', 'cc985da48044a74a507f8d64c7a32265');

export default searchClient;
