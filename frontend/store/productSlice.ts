/* import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

export interface SizeVariant {
  size: string;
  stockQuantity: number;
}

export interface Variant {
  color: string;
  price: number;
  discount: number;
  sku: string;
  stockQuantity: number;
  sizes: SizeVariant[];
  colorOptionImages: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt?: string | string[];
  updatedAt?: string | string[];
  discount: number;
  dimensions: string;
  weight: string;
  colorOptions: string[];
  productStatus?: string;
  featured?: boolean;
  productURL: string;
  material: string;
  releaseDate: string;
  gender: string;
  type: string;
  variants: Variant[];
}

interface ProductsResponse {
  content: Product[];
  totalPages: number;
  number: number;
  size: number;
}

interface EntityCache<T> {
  [key: string]: T | null;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: Record<AsyncActionTypes, boolean>;
  error: Record<AsyncActionTypes, string | null>;
  totalPages: number;
  currentPage: number;
  cache: Record<string, Product>;
  productsCache: Record<string, Product[]>;
}

type AsyncActionTypes =
  | "fetchProducts"
  | "fetchProductDetails"
  | "fetchProductsByCategory"
  | "fetchProductsByReleaseDate"
  | "fetchProductsByGender"
  | "fetchProductsByBrand"
  | "fetchProductsByTag"
  | "fetchFeaturedProducts"
  | "createProduct"
  | "updateProduct"
  | "deleteProduct"
  | "fetchProductsByIds";

const API_BASE_URL = "http://192.168.29.152:8082/api/v1/products";
const productAPI = {
  fetchProduct: (id: string) => axios.get<Product>(`${API_BASE_URL}/${id}`),
  fetchProducts: (page: number, size: number) =>
    axios.get<ProductsResponse>(`${API_BASE_URL}?page=${page}&size=${size}`),
  fetchProductsByCategory: (category: string, page: number, size: number) =>
    axios.get<ProductsResponse>(
      `${API_BASE_URL}/category/${category}?page=${page}&size=${size}`
    ),
  fetchProductsByReleaseDate: (
    releaseDate: string,
    page: number,
    size: number
  ) =>
    axios.get<ProductsResponse>(
      `${API_BASE_URL}/release-date/${releaseDate}?page=${page}&size=${size}`
    ),
  fetchProductsByGender: (gender: string, page: number, size: number) =>
    axios.get<ProductsResponse>(
      `${API_BASE_URL}/gender/${gender}?page=${page}&size=${size}`
    ),
  fetchProductsByBrand: (brand: string, page: number, size: number) =>
    axios.get<ProductsResponse>(
      `${API_BASE_URL}/brand/${brand}?page=${page}&size=${size}`
    ),
  fetchProductsByTag: (tag: string, page: number, size: number) =>
    axios.get<ProductsResponse>(
      `${API_BASE_URL}/tags/${tag}?page=${page}&size=${size}`
    ),
  fetchFeaturedProducts: (page: number, size: number) =>
    axios.get<ProductsResponse>(
      `${API_BASE_URL}/featured?page=${page}&size=${size}`
    ),
  createProduct: (data: Partial<Product>) =>
    axios.post<Product>(`${API_BASE_URL}/create-product`, data),
  updateProduct: (id: string, data: Partial<Product>) =>
    axios.put<Product>(`${API_BASE_URL}/update-product/${id}`, data),
  deleteProduct: (id: string) =>
    axios.delete(`${API_BASE_URL}/delete-product/${id}`),
  fetchProductsByIds: (ids: string[]) => {
    return axios.get<Product[]>(`${API_BASE_URL}/ids`, {
      params: {
        ids: ids.join(","),
      },
    });
  },
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
  { page: number; size: number },
  { state: RootState }
>("products/fetchProducts", async ({ page, size }, { getState }) => {
  const state = getState();
  const cacheKey = `products_page_${page}`;

  const cachedProducts = state.product.productsCache[cacheKey];
  if (cachedProducts) {
    return {
      content: cachedProducts,
      totalPages: state.product.totalPages,
      number: page,
      size,
    };
  }

  const { data } = await productAPI.fetchProducts(page, size);
  return data;
});

export const fetchProductsByCategory = createAsyncThunk<
  ProductsResponse,
  { category: string; page: number; size: number },
  { state: RootState }
>(
  "products/fetchProductsByCategory",
  async ({ category, page, size }, { getState }) => {
    const state = getState();
    const cacheKey = `products_page_${category}_${page}`;

    if (state.product.productsCache[cacheKey]) {
      return {
        content: state.product.productsCache[cacheKey],
        totalPages: state.product.totalPages,
        number: page,
        size: size,
      };
    }

    const { data } = await productAPI.fetchProductsByCategory(
      category,
      page,
      size
    );
    return data;
  }
);

export const fetchProductsByReleaseDate = createAsyncThunk<
  ProductsResponse,
  { releaseDate: string; page: number; size: number },
  { state: RootState }
>(
  "products/fetchProductsByReleaseDate",
  async ({ releaseDate, page, size }, { getState }) => {
    const state = getState();
    const cacheKey = `products_page_${releaseDate}_${page}`;

    if (state.product.productsCache[cacheKey]) {
      return {
        content: state.product.productsCache[cacheKey],
        totalPages: state.product.totalPages,
        number: page,
        size: size,
      };
    }
    const { data } = await productAPI.fetchProductsByReleaseDate(
      releaseDate,
      page,
      size
    );
    return data;
  }
);

export const fetchProductsByTag = createAsyncThunk<
  ProductsResponse,
  { tag: string; page: number; size: number },
  { state: RootState }
>("products/fetchProductsByTag", async ({ tag, page, size }, { getState }) => {
  const state = getState();
  const cacheKey = `products_page_${tag}_${page}`;

  if (state.product.productsCache[cacheKey]) {
    return {
      content: state.product.productsCache[cacheKey],
      totalPages: state.product.totalPages,
      number: page,
      size: size,
    };
  }

  const { data } = await productAPI.fetchProductsByTag(tag, page, size);
  return data;
});

export const fetchProductsByGender = createAsyncThunk<
  ProductsResponse,
  { gender: string; page: number; size: number },
  { state: RootState }
>(
  "products/fetchProductsByGender",
  async ({ gender, page, size }, { getState }) => {
    const state = getState();
    const cacheKey = `products_page_${gender}_${page}`;

    if (state.product.productsCache[cacheKey]) {
      return {
        content: state.product.productsCache[cacheKey],
        totalPages: state.product.totalPages,
        number: page,
        size: size,
      };
    }

    const { data } = await productAPI.fetchProductsByGender(gender, page, size);
    return data;
  }
);

export const fetchProductsByBrand = createAsyncThunk<
  ProductsResponse,
  { brand: string; page: number; size: number },
  { state: RootState }
>(
  "products/fetchProductsByBrand",
  async ({ brand, page, size }, { getState }) => {
    const state = getState();
    const cacheKey = `products_page_${brand}_${page}`;

    if (state.product.productsCache[cacheKey]) {
      return {
        content: state.product.productsCache[cacheKey],
        totalPages: state.product.totalPages,
        number: page,
        size: size,
      };
    }
    const { data } = await productAPI.fetchProductsByBrand(brand, page, size);
    return data;
  }
);

export const fetchFeaturedProducts = createAsyncThunk<
  ProductsResponse,
  { page: number; size: number },
  { state: RootState }
>("products/fetchFeaturedProducts", async ({ page, size }, { getState }) => {
  const state = getState();
  const cacheKey = `featured_products_page_${page}`;

  if (state.product.productsCache[cacheKey]) {
    return {
      content: state.product.productsCache[cacheKey],
      totalPages: state.product.totalPages,
      number: page,
      size: size,
    };
  }
  const { data } = await productAPI.fetchFeaturedProducts(page, size);
  return data;
});


export const fetchProductsByIds = createAsyncThunk<
  Product[],
  string[],
  { state: RootState }
>("products/fetchProductsByIds", async (ids, { getState }) => {
  const state = getState();
  const cachedProducts = ids
    .map((id) => state.product.cache[id])
    .filter((product): product is Product => !!product);

  if (cachedProducts.length === ids.length) {
    return cachedProducts;
  }

  const { data } = await productAPI.fetchProductsByIds(ids);
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
    const { data } = await productAPI.updateProduct(
      productData.id,
      productData
    );
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
    fetchProductsByCategory: false,
    fetchProductsByReleaseDate: false,
    fetchProductsByGender: false,
    fetchProductsByBrand: false,
    fetchProductsByTag: false,
    fetchFeaturedProducts: false,
    createProduct: false,
    updateProduct: false,
    deleteProduct: false,
    fetchProductsByIds: false,
  },
  error: {
    fetchProducts: null,
    fetchProductDetails: null,
    fetchProductsByCategory: null,
    fetchProductsByReleaseDate: null,
    fetchProductsByGender: null,
    fetchProductsByBrand: null,
    fetchProductsByTag: null,
    fetchFeaturedProducts: null,
    createProduct: null,
    updateProduct: null,
    deleteProduct: null,
    fetchProductsByIds: null,
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
      Object.keys(state.productsCache).forEach((page) => {
        state.productsCache[page] = state.productsCache[page].filter(
          (product) => product.id !== action.payload
        );
      });
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setProductsCache: (
      state,
      action: PayloadAction<{ cacheKey: string; products: Product[] }>
    ) => {
      const { cacheKey, products } = action.payload;

      // Update individual product cache
      products.forEach((product) => {
        state.cache[product.id] = product;
      });

      // Update products cache with proper merging
      const existingProducts = state.productsCache[cacheKey] || [];
      const newProducts = products.filter(
        (newProduct) =>
          !existingProducts.some(
            (existingProduct) => existingProduct.id === newProduct.id
          )
      );

      state.productsCache[cacheKey] = [...existingProducts, ...newProducts];
    },
    removeFromCache: (
      state,
      action: PayloadAction<{ productId: string; cacheKey: string }>
    ) => {
      const { productId, cacheKey } = action.payload;

      // Only remove from productsCache, keep in main cache for other views
      if (state.productsCache[cacheKey]) {
        state.productsCache[cacheKey] = state.productsCache[cacheKey].filter(
          (product) => product.id !== productId
        );
      }
    },
    clearAllCache: (state) => {
      state.cache = {};
      state.productsCache = {};
    },
    createProduct: (state, action) => {
      state.products.push(action.payload);
      state.cache[action.payload.id] = action.payload;
      Object.keys(state.productsCache).forEach((page) => {
        state.productsCache[page].push(action.payload);
      });
      state.loading.createProduct = false;
    },
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      const productIndex = state.products.findIndex(
        (product) => product.id === updatedProduct.id
      );
      if (productIndex !== -1) {
        state.products[productIndex] = updatedProduct;
      }
      state.cache[updatedProduct.id] = updatedProduct;
      Object.keys(state.productsCache).forEach((page) => {
        const productIndexInPage = state.productsCache[page].findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (productIndexInPage !== -1) {
          state.productsCache[page][productIndexInPage] = updatedProduct;
        }
      });
      state.loading.updateProduct = false;
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
        state.error.fetchProductDetails =
          action.error.message ?? "Failed to load product details";
      })

      // FetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading.fetchProducts = true;
        state.error.fetchProducts = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { content, totalPages, number, size } = action.payload;

        // Store the products for the given page in the cache
        const cacheKey = `products_page_${number}`;
        state.productsCache = {
          ...state.productsCache,
          [cacheKey]: content,
        };

        // Update the overall product list (if needed)
        state.products = content;
        state.totalPages = totalPages;
        state.currentPage = number;
        state.loading.fetchProducts = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.fetchProducts = false;
        state.error.fetchProducts =
          action.error.message ?? "Failed to load products";
      })

      // FetchProductsByGender
      .addCase(fetchProductsByGender.pending, (state) => {
        state.loading.fetchProductsByGender = true;
        state.error.fetchProductsByGender = null;
      })
      .addCase(fetchProductsByGender.fulfilled, (state, action) => {
        const { content, totalPages, number, size } = action.payload;
        const cacheKey = `products_page_${action.meta.arg.gender}_${number}`;
        state.productsCache = {
          ...state.productsCache,
          [cacheKey]: content,
        };
        state.totalPages = totalPages;
        state.currentPage = number;
        state.products = content;
        state.loading.fetchProductsByGender = false;
      })
      .addCase(fetchProductsByGender.rejected, (state, action) => {
        state.loading.fetchProductsByGender = false;
        state.error.fetchProductsByGender =
          action.error.message ?? "Failed to load products by gender";
      })

      // FetchProductsByBrand
      .addCase(fetchProductsByBrand.pending, (state) => {
        state.loading.fetchProductsByBrand = true;
        state.error.fetchProductsByBrand = null;
      })
      .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
        const { content, totalPages, number, size } = action.payload;
        const cacheKey = `products_page_${action.meta.arg.brand}_${number}`;
        state.productsCache = {
          ...state.productsCache,
          [cacheKey]: content,
        };
        state.totalPages = totalPages;
        state.currentPage = number;
        state.products = content;
        state.loading.fetchProductsByBrand = false;
      })
      .addCase(fetchProductsByBrand.rejected, (state, action) => {
        state.loading.fetchProductsByBrand = false;
        state.error.fetchProductsByBrand =
          action.error.message ?? "Failed to load products by brand";
      })

      // FetchProductsByReleaseDate
      .addCase(fetchProductsByReleaseDate.pending, (state) => {
        state.loading.fetchProductsByReleaseDate = true;
        state.error.fetchProductsByReleaseDate = null;
      })
      .addCase(fetchProductsByReleaseDate.fulfilled, (state, action) => {
        const { content, totalPages, number, size } = action.payload;
        const cacheKey = `products_page_${action.meta.arg.releaseDate}_${number}`;
        state.productsCache = {
          ...state.productsCache,
          [cacheKey]: content,
        };
        state.totalPages = totalPages;
        state.currentPage = number;
        state.products = content;
        state.loading.fetchProductsByReleaseDate = false;
      })
      .addCase(fetchProductsByReleaseDate.rejected, (state, action) => {
        state.loading.fetchProductsByReleaseDate = false;
        state.error.fetchProductsByReleaseDate =
          action.error.message ?? "Failed to load products by release date";
      })

      // FetchFeaturedProducts
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading.fetchFeaturedProducts = true;
        state.error.fetchFeaturedProducts = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        const { content, totalPages, number, size } = action.payload;
        const cacheKey = `featured_products_${number}`;
        state.productsCache = {
          ...state.productsCache,
          [cacheKey]: content,
        };
        state.totalPages = totalPages;
        state.currentPage = number;
        state.products = content;
        state.loading.fetchProductsByGender = false;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading.fetchFeaturedProducts = false;
        state.error.fetchFeaturedProducts =
          action.error.message ?? "Failed to load featured products";
      })

      // FetchProductsByTags
      .addCase(fetchProductsByTag.pending, (state) => {
        state.loading.fetchProductsByTag = true;
        state.error.fetchProductsByTag = null;
      })
      .addCase(fetchProductsByTag.fulfilled, (state, action) => {
        const { content, totalPages, number, size } = action.payload;
        const cacheKey = `products_page_${action.meta.arg.tag}_${number}`;
        state.productsCache = {
          ...state.productsCache,
          [cacheKey]: content,
        };
        state.totalPages = totalPages;
        state.currentPage = number;
        state.products = content;
        state.loading.fetchProductsByTag = false;
      })
      .addCase(fetchProductsByTag.rejected, (state, action) => {
        state.loading.fetchProductsByTag = false;
        state.error.fetchProductsByTag =
          action.error.message ?? "Failed to load products by tag";
      })

      // FetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading.fetchProductsByCategory = true;
        state.error.fetchProductsByCategory = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        const { content, totalPages, number, size } = action.payload;
        const cacheKey = `products_page_${action.meta.arg.category}_${number}`;
        state.productsCache = {
          ...state.productsCache,
          [cacheKey]: content,
        };
        state.totalPages = totalPages;
        state.currentPage = number;
        state.products = content;
        state.loading.fetchProductsByCategory = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading.fetchProductsByCategory = false;
        state.error.fetchProductsByCategory =
          action.error.message ?? "Failed to load products by category";
      })

      // FetchProductsByIds
      .addCase(fetchProductsByIds.pending, (state) => {
        state.loading.fetchProductsByIds = true;
        state.error.fetchProductsByIds = null;
      })
      .addCase(fetchProductsByIds.fulfilled, (state, action) => {
        state.loading.fetchProductsByIds = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByIds.rejected, (state, action) => {
        state.loading.fetchProductsByIds = false;
        state.error.fetchProductsByIds =
          action.error.message ?? "Failed to load products by IDs";
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
        state.error.createProduct =
          action.error.message ?? "Failed to create product";
      })

      // UpdateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading.updateProduct = true;
        state.error.updateProduct = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Update cache and productsCache
        state.cache[action.payload.id] = action.payload;
        Object.keys(state.productsCache).forEach((page) => {
          const pageNumber = Number(page);
          const productIndex = state.productsCache[pageNumber]?.findIndex(
            (p) => p.id === action.payload.id
          );
          if (productIndex !== -1) {
            state.productsCache[pageNumber][productIndex] = action.payload;
          }
        });
        const updatedVariants = action.payload.variants.map((variant) => ({
          ...variant,
        }));

        state.products[index].variants = updatedVariants;
        state.loading.updateProduct = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading.updateProduct = false;
        state.error.updateProduct =
          action.error.message ?? "Failed to update product";
      })

      // DeleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.loading.deleteProduct = true;
        state.error.deleteProduct = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
        state.cache[action.payload] = null;
        Object.keys(state.productsCache).forEach((page) => {
          state.productsCache[Number(page)] = state.productsCache[
            Number(page)
          ].filter((product) => product.id !== action.payload);
        });
        state.loading.deleteProduct = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading.deleteProduct = false;
        state.error.deleteProduct =
          action.error.message ?? "Failed to delete product";
      });
  },
});

export const {
  setProducts,
  clearProductCache,
  setProductsCache,
  removeFromCache,
  clearAllCache,
} = productSlice.actions;
export default productSlice.reducer;
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

// Interfaces
export interface SizeVariant {
  size: string;
  stockQuantity: number;
}

export interface Variant {
  color: string;
  price: number;
  discount: number;
  sku: string;
  stockQuantity: number;
  sizes: SizeVariant[];
  colorOptionImages: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt?: string | string[];
  updatedAt?: string | string[];
  discount: number;
  dimensions: string;
  weight: string;
  colorOptions: string[];
  productStatus?: string;
  featured?: boolean;
  productURL: string;
  material: string;
  releaseDate: string;
  gender: string;
  type: string;
  variants: Variant[];
  manufacturer: string | null;
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface EntityCache<T> {
  [key: string]: T | null;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: Partial<Record<AsyncActionTypes, boolean>>;
  error: Partial<Record<AsyncActionTypes, string | null>>;
  totalPages: number;
  currentPage: number;
  cache: EntityCache<Product>;
  productsCache: Record<string, Product[]>;
}

type AsyncActionTypes =
  | "fetchProducts"
  | "fetchProductDetails"
  | "fetchProductsByCategory"
  | "fetchProductsByReleaseDate"
  | "fetchProductsByGender"
  | "fetchProductsByBrand"
  | "fetchProductsByTag"
  | "fetchFeaturedProducts"
  | "createProduct"
  | "updateProduct"
  | "deleteProduct"
  | "fetchProductsByIds";

// API Configuration
const API_BASE_URL = "http://192.168.29.152:8082/api/v1/products";

const fetchPaginated = <T>(endpoint: string, params: Record<string, any>) =>
  axios.get<PaginatedResponse<T>>(`${API_BASE_URL}${endpoint}`, { params });

const productAPI = {
  fetchProduct: (id: string) => axios.get<Product>(`${API_BASE_URL}/${id}`),
  
  fetchProducts: (page: number, size: number) =>
    fetchPaginated<Product>("", { page, size }),
  
  fetchProductsByCategory: (category: string, page: number, size: number) =>
    fetchPaginated<Product>(`/category/${category}`, { page, size }),
  
  fetchProductsByReleaseDate: (releaseDate: string, page: number, size: number) =>
    fetchPaginated<Product>(`/release-date/${releaseDate}`, { page, size }),
  
  fetchProductsByGender: (gender: string, page: number, size: number) =>
    fetchPaginated<Product>(`/gender/${gender}`, { page, size }),
  
  fetchProductsByBrand: (brand: string, page: number, size: number) =>
    fetchPaginated<Product>(`/brand/${brand}`, { page, size }),
  
  fetchProductsByTag: (tag: string, page: number, size: number) =>
    fetchPaginated<Product>(`/tags/${tag}`, { page, size }),
  
  fetchFeaturedProducts: (page: number, size: number) =>
    fetchPaginated<Product>("/featured", { page, size }),
  
  createProduct: (data: Partial<Product>) =>
    axios.post<Product>(`${API_BASE_URL}/create-product`, data),
  
  updateProduct: (id: string, data: Partial<Product>) =>
    axios.put<Product>(`${API_BASE_URL}/update-product/${id}`, data),
  
  deleteProduct: (id: string) =>
    axios.delete(`${API_BASE_URL}/delete-product/${id}`),
  
  fetchProductsByIds: (ids: string[]) =>
    axios.get<PaginatedResponse<Product>>(`${API_BASE_URL}/ids`, {
      params: { ids: ids.join(",") },
    }),
};

// Async Thunks
export const fetchProductDetails = createAsyncThunk<
  Product,
  string,
  { state: RootState }
>("product/fetchProductDetails", async (productId, { getState }) => {
  const state = getState();
  const cachedProduct = state.product.cache[productId];
  if (cachedProduct) return cachedProduct;
  const { data } = await productAPI.fetchProduct(productId);
  return data;
});

export const fetchProducts = createAsyncThunk<
  PaginatedResponse<Product>,
  { page: number; size: number },
  { state: RootState }
>("products/fetchProducts", async ({ page, size }, { getState }) => {
  const state = getState();
  const cacheKey = `products_page_${page}`;
  const cachedProducts = state.product.productsCache[cacheKey];
  
  if (cachedProducts) {
    return {
      content: cachedProducts,
      totalPages: state.product.totalPages,
      totalElements: cachedProducts.length,
      size,
      number: page,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      last: page === state.product.totalPages - 1,
      first: page === 0,
      numberOfElements: cachedProducts.length,
      empty: cachedProducts.length === 0,
    };
  }

  const { data } = await productAPI.fetchProducts(page, size);
  return data;
});

/* export const fetchProductsByIds = createAsyncThunk<
  Product[],
  string[],
  { state: RootState }
>("products/fetchProductsByIds", async (ids, { getState }) => {
  const state = getState();
  const cachedProducts = ids
    .map((id) => state.product.cache[id])
    .filter((product): product is Product => !!product);

  if (cachedProducts.length === ids.length) {
    return cachedProducts;
  }

  const { data } = await productAPI.fetchProductsByIds(ids);
  return Array.isArray(data.content) ? data.content : [];
});
 */
export const fetchProductsByIds = createAsyncThunk<Product[], string[], { state: RootState }>(
  "products/fetchProductsByIds",
  async (ids, { getState }) => {
    const state = getState().product;
    const uncachedIds = ids.filter(id => !state.cache[id]);
    
    if (uncachedIds.length === 0) {
      return ids.map(id => state.cache[id]!);
    }

    const { data } = await productAPI.fetchProductsByIds(uncachedIds);
    return data.content || [];
  }
)

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
    if (!productData.id) throw new Error("Product ID is required for update");
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

// Initial State
const initialState: ProductState = {
  products: [],
  product: null,
  loading: {},
  error: {},
  totalPages: 0,
  currentPage: 0,
  cache: {},
  productsCache: {},
};

// Slice Definition
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductCache: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      delete state.cache[productId];
      Object.keys(state.productsCache).forEach((key) => {
        state.productsCache[key] = state.productsCache[key].filter(
          (product) => product.id !== productId
        );
      });
      state.products = state.products.filter(
        (product) => product.id !== productId
      );
    },
    clearAllCache: (state) => {
      state.cache = {};
      state.productsCache = {};
    },
  },
  extraReducers: (builder) => {
    const handlePaginatedFulfilled = (
      state: ProductState,
      action: PayloadAction<PaginatedResponse<Product>>
    ) => {
      const { content, totalPages, number } = action.payload;
      const cacheKey = `products_page_${number}`;
      state.productsCache[cacheKey] = content;
      state.totalPages = totalPages;
      state.currentPage = number;
      state.products = content;
      state.loading[action.type as AsyncActionTypes] = false;
    };

    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading.fetchProducts = true;
        state.error.fetchProducts = null;
      })
      .addCase(fetchProducts.fulfilled, handlePaginatedFulfilled)
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.fetchProducts = false;
        state.error.fetchProducts = action.error.message ?? "Failed to load products";
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.product = action.payload;
        state.cache[action.payload.id] = action.payload;
        state.loading.fetchProductDetails = false;
      })
/*       .addCase(fetchProductsByIds.fulfilled, (state, action) => {
        const products = action.payload;
        action.payload.forEach((product) => {
          state.cache[product.id] = product;
        });
        
        state.loading.fetchProductsByIds = false;
      }) */
      .addCase(fetchProductsByIds.fulfilled, (state, action) => {
        action.payload.forEach(product => {
          if (product && product.id) {
            state.cache[product.id] = product;
            // Add to products array if not already present
            if (!state.products.some(p => p.id === product.id)) {
              state.products.push(product);
            }
          }
        });
          state.loading.fetchProductsByIds = false;
        })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.cache[action.payload.id] = action.payload;
        state.loading.createProduct = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
        state.cache[action.payload.id] = action.payload;
        state.loading.updateProduct = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        delete state.cache[action.payload];
        state.loading.deleteProduct = false;
      });
  },
});

export const { clearProductCache, clearAllCache } = productSlice.actions;
export default productSlice.reducer;