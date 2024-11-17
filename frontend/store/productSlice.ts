/*
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

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
interface EntityCache<T> {
  [key: string]: T | null;
}

interface ProductsResponse {
  content: Product[];
  totalPages: number;
  number: number;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: Record<AsyncActionTypes, boolean>;
  error: Record<AsyncActionTypes, string | null>;
  totalPages: number;
  currentPage: number;
  cache: EntityCache<Product>;
  productsCache: Record<number, Product[]>;
}

type AsyncActionTypes =
    | "fetchProducts"
    | "fetchProductDetails"
    | "createProduct"
    | "updateProduct"
    | "deleteProduct";

const API_BASE_URL = "http://localhost:8082/api/v1/products";

const productAPI = {
  fetchProduct: (id: string) => axios.get<Product>(`${API_BASE_URL}/${id}`),
  fetchProducts: (page: number) => axios.get<ProductsResponse>(`${API_BASE_URL}?page=${page}`),
  createProduct: (data: Partial<Product>) => axios.post<Product>(`${API_BASE_URL}/create-product`, data),
  updateProduct: (id: string, data: Partial<Product>) =>
      axios.put<Product>(`${API_BASE_URL}/update-product/${id}`, data),
  deleteProduct: (id: string) => axios.delete(`${API_BASE_URL}/delete-product/${id}`)
};

export const fetchProductDetails = createAsyncThunk<
    Product,
    string,
    { state: RootState }
>("product/fetchProductDetails", async (productId, { getState }) => {
  const state = getState();
  const cachedProduct = state.product.cache[productId];

  if (cachedProduct) {
    return cachedProduct;
  }

  const { data } = await productAPI.fetchProduct(productId);
  return data;
});

export const fetchProducts = createAsyncThunk<
    ProductsResponse,
    number,
    { state: RootState }
>("products/fetchProducts", async (page, { getState }) => {
  const state = getState();
  const cachedProducts = state.product.productsCache[page];

  if (cachedProducts) {
    return {
      content: cachedProducts,
      totalPages: state.product.totalPages,
      number: page,
    };
  }

  const { data } = await productAPI.fetchProducts(page);
  return data;
});

export const createProduct = createAsyncThunk<Product, Partial<Product>>(
    "product/createProduct",
    async (newProductData) => {
      const { data } = await productAPI.createProduct(newProductData);
      return data;
    }
);

export const updateProduct = createAsyncThunk<Product, Partial<Product>>(
    "product/updateProduct",
    async (productData) => {
      if (!productData.id) {
        throw new Error("Product ID is required for update");
      }
      const { data } = await productAPI.updateProduct(productData.id, productData);
      return data;
    }
);

export const deleteProduct = createAsyncThunk<string, string>(
    "product/deleteProduct",
    async (productId, { dispatch }) => {
      await productAPI.deleteProduct(productId);
      dispatch(clearProductCache(productId));
      return productId;
    }
);

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

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductCache: (state, action: PayloadAction<string>) => {
      delete state.cache[action.payload];
      // Clear product from products array if it exists
      state.products = state.products.filter(product => product.id !== action.payload);
      // Clear from productsCache
      Object.keys(state.productsCache).forEach(page => {
        state.productsCache[Number(page)] = state.productsCache[Number(page)]
            .filter(product => product.id !== action.payload);
      });
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setProductsCache: (state, action: PayloadAction<{ page: number; products: Product[] }>) => {
      state.productsCache[action.payload.page] = action.payload.products;
    },
    clearAllCache: (state) => {
      state.cache = {};
      state.productsCache = {};
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
          state.error.fetchProductDetails = action.error.message ?? "Failed to load product details";
        })
        .addCase(fetchProducts.pending, (state) => {
          state.loading.fetchProducts = true;
          state.error.fetchProducts = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.products = action.payload.content;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.number;
          state.productsCache[action.payload.number] = action.payload.content;
          state.loading.fetchProducts = false;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
          state.loading.fetchProducts = false;
          state.error.fetchProducts = action.error.message ?? "Failed to load products";
        })
        .addCase(createProduct.pending, (state) => {
          state.loading.createProduct = true;
          state.error.createProduct = null;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
          state.products.push(action.payload);
          state.loading.createProduct = false;
          // Update cache
          state.cache[action.payload.id] = action.payload;
        })
        .addCase(createProduct.rejected, (state, action) => {
          state.loading.createProduct = false;
          state.error.createProduct = action.error.message ?? "Failed to create product";
        })
        .addCase(updateProduct.pending, (state) => {
          state.loading.updateProduct = true;
          state.error.updateProduct = null;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
          const index = state.products.findIndex((product) => product.id === action.payload.id);
          if (index !== -1) {
            state.products[index] = action.payload;
          }
          state.cache[action.payload.id] = action.payload;
          // Update in productsCache if exists
          Object.keys(state.productsCache).forEach(page => {
            const pageNumber = Number(page);
            const productIndex = state.productsCache[pageNumber]?.findIndex(
                p => p.id === action.payload.id
            );
            if (productIndex !== -1 && productIndex !== undefined) {
              state.productsCache[pageNumber][productIndex] = action.payload;
            }
          });
          state.loading.updateProduct = false;
        })
        .addCase(updateProduct.rejected, (state, action) => {
          state.loading.updateProduct = false;
          state.error.updateProduct = action.error.message ?? "Failed to update product";
        })
        .addCase(deleteProduct.pending, (state) => {
          state.loading.deleteProduct = true;
          state.error.deleteProduct = null;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
          state.products = state.products.filter((product) => product.id !== action.payload);
          state.cache[action.payload] = null;
          state.loading.deleteProduct = false;
        })
        .addCase(deleteProduct.rejected, (state, action) => {
          state.loading.deleteProduct = false;
          state.error.deleteProduct = action.error.message ?? "Failed to delete product";
        });
  },
});

export const {
  setProducts,
  clearProductCache,
  setProductsCache,
  clearAllCache
} = productSlice.actions;

export default productSlice.reducer;*/
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

// Improved type definitions for the Product model

// SizeVariant type for sizes within a color option
export interface SizeVariant {
    size: string;
    stockQuantity: number;
}

// Variant type for product variants (e.g., different colors, prices, sizes)
export interface Variant {
    color: string;
    price: number;
    discount: number;
    sku: string;
    stockQuantity: number;
    sizes: SizeVariant[];
    colorOptionImages: string[]; // Images for the color option
    material: string;
    releaseDate: string;
    manufacturer: string;
}

// Main Product model type
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
    createdAt: string[];
    updatedAt: string[];
    discount: number;
    dimensions: string;
    weight: string;
    colorOptions: string[]; // Array of color options available
    isActive: boolean;
    objectID: string;
    isFeatured: boolean;
    productURL: string;
    material: string;
    releaseDate: string;
    gender: string;
    type: string;
    variants: Variant[]; // List of variants (different colors, sizes, prices)
}

// API response types
interface ProductsResponse {
    content: Product[];
    totalPages: number;
    number: number;
}

// Cache type for storing products in cache
interface EntityCache<T> {
    [key: string]: T | null;
}

// Product state interface
interface ProductState {
    products: Product[];
    product: Product | null;
    loading: Record<AsyncActionTypes, boolean>;
    error: Record<AsyncActionTypes, string | null>;
    totalPages: number;
    currentPage: number;
    cache: EntityCache<Product>;
    productsCache: Record<number, Product[]>;
}

// Async action types
type AsyncActionTypes =
    | "fetchProducts"
    | "fetchProductDetails"
    | "createProduct"
    | "updateProduct"
    | "deleteProduct";

// API configuration
const API_BASE_URL = "http://localhost:8082/api/v1/products";

// API service functions
const productAPI = {
    fetchProduct: (id: string) => axios.get<Product>(`${API_BASE_URL}/${id}`),
    fetchProducts: (page: number) => axios.get<ProductsResponse>(`${API_BASE_URL}?page=${page}`),
    createProduct: (data: Partial<Product>) => axios.post<Product>(`${API_BASE_URL}/create-product`, data),
    updateProduct: (id: string, data: Partial<Product>) => axios.put<Product>(`${API_BASE_URL}/update-product/${id}`, data),
    deleteProduct: (id: string) => axios.delete(`${API_BASE_URL}/delete-product/${id}`),
};

// Thunk creators with improved error handling and typing

// Fetch product details with caching
export const fetchProductDetails = createAsyncThunk<Product, string, { state: RootState }>(
    "product/fetchProductDetails",
    async (productId, { getState }) => {
        const state = getState();
        const cachedProduct = state.product.cache[productId];
        if (cachedProduct) {
            return cachedProduct;
        }
        const { data } = await productAPI.fetchProduct(productId);
        return data;
    }
);

// Fetch products with pagination and caching
/*export const fetchProducts = createAsyncThunk<ProductsResponse, number, { state: RootState }>(
    "products/fetchProducts",
    async (page, { getState }) => {
        const state = getState();
        const cachedProducts = state.product.productsCache[page];
        if (cachedProducts) {
            return { content: cachedProducts, totalPages: state.product.totalPages, number: page };
        }
        const { data } = await productAPI.fetchProducts(page);
        return data;
    }
);*/
export const fetchProducts = createAsyncThunk<ProductsResponse, number, { state: RootState }>(
    "products/fetchProducts",
    async (page, { getState }) => {
        const state = getState();
        const cachedProducts = state.product.productsCache[page];
        if (cachedProducts) {
            return {
                content: cachedProducts,
                totalPages: state.product.totalPages,
                number: page
            };
        }
        const { data } = await productAPI.fetchProducts(page);
        return data;  // Ensure `data` has { content, totalPages, number }
    }
);

// Create a new product
export const createProduct = createAsyncThunk<Product, Partial<Product>>(
    "product/createProduct",
    async (newProductData) => {
        const { data } = await productAPI.createProduct(newProductData);
        return data;
    }
);

// Update an existing product
export const updateProduct = createAsyncThunk<Product, Partial<Product>>(
    "product/updateProduct",
    async (productData) => {
        if (!productData.id) {
            throw new Error("Product ID is required for update");
        }
        const { data } = await productAPI.updateProduct(productData.id, productData);
        return data;
    }
);

// Delete a product
/*export const deleteProduct = createAsyncThunk<string, string>(
    "product/deleteProduct",
    async (productId, { dispatch }) => {
        await productAPI.deleteProduct(productId);
        dispatch(clearProductCache(productId));
        return productId;
    }
);*/
export const deleteProduct = createAsyncThunk<string, string>(
    "product/deleteProduct",
    async (productId, { dispatch }) => {
        await productAPI.deleteProduct(productId);
        dispatch(clearProductCache(productId));
        return productId;
    }
);

// Initial state for product slice
/*
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
*/
const initialState: ProductState = {
    products: [],
    product: null,
    loading: {
        fetchProducts: false,
        fetchProductDetails: false,
        createProduct: false,
        updateProduct: false,
        deleteProduct: false
    },
    error: {
        fetchProducts: null,
        fetchProductDetails: null,
        createProduct: null,
        updateProduct: null,
        deleteProduct: null
    },
    totalPages: 0,
    currentPage: 0,
    cache: {},
    productsCache: {}
};

// Product slice with reducers and extra reducers for async actions
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        clearProductCache: (state, action: PayloadAction<string>) => {
            delete state.cache[action.payload];
            state.products = state.products.filter((product) => product.id !== action.payload);
            Object.keys(state.productsCache).forEach((page) => {
                state.productsCache[Number(page)] = state.productsCache[Number(page)].filter((product) => product.id !== action.payload);
            });
        },
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        },
        setProductsCache: (state, action: PayloadAction<{ page: number; products: Product[] }>) => {
            state.productsCache[action.payload.page] = action.payload.products;
        },
        clearAllCache: (state) => {
            state.cache = {};
            state.productsCache = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // FetchProductDetails
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
                state.error.fetchProductDetails = action.error.message ?? "Failed to load product details";
            })

            // FetchProducts
            .addCase(fetchProducts.pending, (state) => {
                state.loading.fetchProducts = true;
                state.error.fetchProducts = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.number;
                state.productsCache[action.payload.number] = action.payload.content;
                state.loading.fetchProducts = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading.fetchProducts = false;
                state.error.fetchProducts = action.error.message ?? "Failed to load products";
            })

            // CreateProduct
            .addCase(createProduct.pending, (state) => {
                state.loading.createProduct = true;
                state.error.createProduct = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
                state.loading.createProduct = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading.createProduct = false;
                state.error.createProduct = action.error.message ?? "Failed to create product";
            })

            // UpdateProduct
            .addCase(updateProduct.pending, (state) => {
                state.loading.updateProduct = true;
                state.error.updateProduct = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex((product) => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                // Update cache and productsCache
                state.cache[action.payload.id] = action.payload;
                Object.keys(state.productsCache).forEach((page) => {
                    const pageNumber = Number(page);
                    const productIndex = state.productsCache[pageNumber]?.findIndex((p) => p.id === action.payload.id);
                    if (productIndex !== -1) {
                        state.productsCache[pageNumber][productIndex] = action.payload;
                    }
                });
                state.loading.updateProduct = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading.updateProduct = false;
                state.error.updateProduct = action.error.message ?? "Failed to update product";
            })

            // DeleteProduct
            .addCase(deleteProduct.pending, (state) => {
                state.loading.deleteProduct = true;
                state.error.deleteProduct = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product.id !== action.payload);
                state.cache[action.payload] = null;
                Object.keys(state.productsCache).forEach((page) => {
                    state.productsCache[Number(page)] = state.productsCache[Number(page)].filter((product) => product.id !== action.payload);
                });
                state.loading.deleteProduct = false;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading.deleteProduct = false;
                state.error.deleteProduct = action.error.message ?? "Failed to delete product";
            });
    },
});

// Export the actions
export const { setProducts, clearProductCache, setProductsCache, clearAllCache } = productSlice.actions;

// Default export of the reducer
export default productSlice.reducer;