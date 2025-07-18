// searchClient.js
"use client"; // Ensure this runs on the client side

import { liteClient as algoliasearch } from "algoliasearch/lite";
// Instantiate the searchClient once
const searchClient = algoliasearch('FEAB6SUGD8', 'd52688759f05f0dd3f637a06a8987913');

export default searchClient;
