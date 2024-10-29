import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Product interface definition
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stockQuantity: number;
    sku: string;
    tags: string[];
    rating: number;
    reviewCount: number;
    createdAt: number[]; // Keeping it as an array for your specific format
    updatedAt: number[]; // Keeping it as an array for your specific format
    discount: number;
    dimensions: string;
    weight: string;
    colorOptions: string[];
    colorOptionImages: Record<string, string[]>; // Object with color names as keys and image arrays as values
    sizes: string[];
    active: boolean;
    objectID: string;
    featured: boolean;
}

interface ProductState {
    products: Product[];
    product: Product | null; // For a single product
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

// Initial state
const initialState: ProductState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 0,
};

// Async thunk for fetching product details
export const fetchProductDetails = createAsyncThunk<Product, string>(
    'product/fetchProductDetails',
    async (productId) => {
        const response = await axios.get(`http://localhost:8082/api/v1/products/${productId}`);
        return response.data;
    }
);

// Async thunk for fetching all products
export const fetchProducts = createAsyncThunk<{
    content: Product[];
    totalPages: number;
    number: number;
}, number>(
    'products/fetchProducts',
    async (page) => {
        const response = await axios.get(`http://localhost:8082/api/v1/products?page=${page}`);
        return response.data; // Ensure this matches your API response structure
    }
);

// Create the product slice
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload; // Set products directly from cache
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error state
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.product = action.payload; // Set the single product
                state.loading = false; // Stop loading
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false; // Stop loading on error
                state.error = action.error.message || 'Failed to load product details'; // Set error message
            })
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error state
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload.content; // Set products from API response
                state.totalPages = action.payload.totalPages; // Set total pages
                state.currentPage = action.payload.number; // Set current page
                state.loading = false; // Stop loading
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false; // Stop loading on error
                state.error = action.error.message || 'Failed to load products'; // Set error message
            });
    },
});

// Exporting actions and reducer
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
