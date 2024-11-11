import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

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
  createdAt: number[];
  updatedAt: number[];
  discount: number;
  dimensions: string;
  weight: string;
  colorOptions: string[];
  colorOptionImages: Record<string, string[]>;
  sizes: string[];
  active: boolean;
  objectID: string;
  featured: boolean;
}

// Define a more generic cache structure for product data
interface EntityCache<T> {
  [key: string]: T | null;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: { [key in AsyncActionTypes]: boolean };
  error: { [key in AsyncActionTypes]: string | null };
  totalPages: number;
  currentPage: number;
  cache: EntityCache<Product>;
  productsCache: { [key: number]: Product[] };
}

// Action Types for Async Thunks
type AsyncActionTypes =
  | "fetchProducts"
  | "fetchProductDetails"
  | "createProduct"
  | "updateProduct"
  | "deleteProduct";

// Initial state
const initialState: ProductState = {
  products: [],
  product: null,
  loading: {
    fetchProducts: false,
    fetchProductDetails: false,
    createProduct: false,
    updateProduct: false,
    deleteProduct: false,
  },
  error: {
    fetchProducts: null,
    fetchProductDetails: null,
    createProduct: null,
    updateProduct: null,
    deleteProduct: null,
  },
  totalPages: 0,
  currentPage: 0,
  cache: {},
  productsCache: {},
};

// Async Thunks
export const fetchProductDetails = createAsyncThunk<Product, string>(
  "product/fetchProductDetails",
  async (productId, { getState }) => {
    const state = getState() as RootState;

    if (state.product.cache[productId]) {
      return state.product.cache[productId]!; // Return from cache if available
    }

    const response = await axios.get(
      `http://localhost:8082/api/v1/products/${productId}`
    );
    return response.data;
  }
);

export const fetchProducts = createAsyncThunk<{
  content: Product[];
  totalPages: number;
  number: number;
}, number>(
  "products/fetchProducts",
  async (page, { getState }) => {
    const state = getState() as RootState;

    // Return products from cache if available for the requested page
    if (state.product.productsCache[page]) {
      return {
        content: state.product.productsCache[page],
        totalPages: state.product.totalPages,
        number: page,
      };
    }

    // If not in cache, fetch from the server
    const response = await axios.get(
      `http://localhost:8082/api/v1/products?page=${page}`
    );
    return response.data;
  }
);

export const createProduct = createAsyncThunk<Product, Partial<Product>>(
  "product/createProduct",
  async (newProductData) => {
    const response = await axios.post(
      "http://localhost:8082/api/v1/products/create-product",
      newProductData
    );
    return response.data;
  }
);

export const updateProduct = createAsyncThunk<Product, Partial<Product>>(
  "product/updateProduct",
  async (productData) => {
    const response = await axios.put(
      `http://localhost:8082/api/v1/products/update-product/${productData.id}`,
      productData
    );
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk<string, string>(
  "product/deleteProduct",
  async (productId, { dispatch }) => {
    await axios.delete(
      `http://localhost:8082/api/v1/products/delete-product/${productId}`
    );
    dispatch(clearProductCache(productId)); // Clear the product from the cache after deletion
    return productId;
  }
);

// Slice Reducers
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductCache: (state, action) => {
      delete state.cache[action.payload]; // Clear the cache for the deleted product
    },
    setProducts: (state, action) => {
      state.products = action.payload; // Set all products in the state
    },
    setProductsCache: (state, action) => {
      state.productsCache[action.payload.page] = action.payload.products; // Cache the products for pagination
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading.fetchProductDetails = true;
        state.error.fetchProductDetails = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.product = action.payload;
        state.cache[action.payload.id] = action.payload;
        state.loading.fetchProductDetails = false;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading.fetchProductDetails = false;
        state.error.fetchProductDetails =
          action.error.message || "Failed to load product details";
      })

      .addCase(fetchProducts.pending, (state) => {
        state.loading.fetchProducts = true;
        state.error.fetchProducts = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
        state.loading.fetchProducts = false;
        state.productsCache[action.payload.number] = action.payload.content; // Cache the fetched products
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.fetchProducts = false;
        state.error.fetchProducts =
          action.error.message || "Failed to load products";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload); // Add new product to the list
      })
      .addCase(createProduct.pending, (state) => {
        state.loading.createProduct = true;
        state.error.createProduct = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading.createProduct = false;
        state.error.createProduct =
          action.error.message || "Failed to create product";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload; // Update product in the list
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
        state.cache[action.payload] = null; // Clear deleted product from cache
      });
  },
});

// Export actions to be dispatched
export const { setProducts, clearProductCache, setProductsCache } = productSlice.actions;

export default productSlice.reducer;
