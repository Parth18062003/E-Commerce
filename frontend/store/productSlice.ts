import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

// Product interface definition
export interface Product {
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
    cache: { [key: string]: Product | null; }; // Cache for product details
    productsCache: { [key: number]: Product[]; }; // Cache for products by page
}

// Initial state
const initialState: ProductState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 0,
    cache: {}, // Initialize cache for product details
    productsCache: {}, // Initialize cache for products
};


// Async thunk for fetching product details
export const fetchProductDetails = createAsyncThunk<Product, string>(
    'product/fetchProductDetails',
    async (productId, { getState }) => {
        const state = getState() as RootState;
        
        // Check if the product is already cached
        if (state.product.cache[productId]) {
            return state.product.cache[productId]; // Return cached product
        }

        const response = await axios.get(`http://localhost:8082/api/v1/products/${productId}`);
        return response.data; // Fetch from API if not cached
    }
);


// Async thunk for fetching all products
export const fetchProducts = createAsyncThunk<{
    content: Product[];
    totalPages: number;
    number: number;
}, number>(
    'products/fetchProducts',
    async (page, { getState }) => {
        const state = getState() as RootState;

        // Check if the products for this page are already cached
        if (state.product.productsCache[page]) {
            return {
                content: state.product.productsCache[page],
                totalPages: state.product.totalPages,
                number: page,
            }; // Return cached products
        }

        const response = await axios.get(`http://localhost:8082/api/v1/products?page=${page}`);
        return response.data; // Fetch from API if not cached
    }
);

// Async thunk for creating a product
export const createProduct = createAsyncThunk<Product, Partial<Product>>(
    'product/createProduct',
    async (newProductData) => {
        const response = await axios.post('http://localhost:8082/api/v1/products/create-product', newProductData);
        return response.data; // Assuming your API returns the created product
    }
);

// Async thunk for updating a product
export const updateProduct = createAsyncThunk<Product, Partial<Product>>(
    'product/updateProduct',
    async (productData) => {
        const response = await axios.put(`http://localhost:8082/api/v1/products/update-product/${productData.id}`, productData);
        return response.data; // Return the updated product
    }
);

export const deleteProduct = createAsyncThunk<string, string>(
    'product/deleteProduct',
    async (productId) => {
        await axios.delete(`http://localhost:8082/api/v1/products/delete-product/${productId}`);
        return productId; // Return the ID for further processing
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
                state.cache[action.payload.id] = action.payload; // Cache the product
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
                state.productsCache[action.payload.number] = action.payload.content; // Cache the products for the page
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false; // Stop loading on error
                state.error = action.error.message || 'Failed to load products'; // Set error message
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload); // Add the new product to the products array
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true; // Set loading to true while creating
                state.error = null; // Reset error state
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false; // Stop loading on error
                state.error = action.error.message || 'Failed to create product'; // Set error message
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(product => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload; // Update the product in the array
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product.id !== action.payload);
            });
    },
});

// Exporting actions and reducer
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
