/* import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

// Types
export interface AddItemRequest {
  product_id: string;
  variant_sku: string;
  size: string;
  quantity: number;
}

export interface CartItem {
  productId: string;
  variantSku: string;
  size: string;
  quantity: number;
  imageUrl?: string; // Optional: Populated from productSlice
  productName?: string; // Optional: Populated from productSlice
  price?: number; // Optional: Populated from productSlice
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  expiresAt: string; // ISO date string
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface CartState {
  cart: Cart | null;
  loading: {
    fetch: boolean;
    add: boolean;
    update: boolean;
    remove: boolean;
  };
  error: string | null;
  lastUpdated: number | null; // Timestamp of the last successful update
}

// Utility function to enrich cart items with product-specific data
const enrichCartItems = (cart: Cart, getState: () => RootState): Cart => {
  const { products } = getState().product;

  // If products are not available or not an array, return the original cart
  if (!products || !Array.isArray(products)) {
    console.warn('Products are not available or not in the expected format. Cart items will not be enriched.');
    return cart;
  }

  const enrichedItems = cart.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      console.warn(`Product not found for ID: ${item.productId}`);
      return item;
    }

    const variant = product.variants.find((v) => v.sku === item.variantSku);

    if (!variant) {
      console.warn(`Variant not found for SKU: ${item.variantSku} in product: ${item.productId}`);
      return item;
    }

    return {
      ...item,
      imageUrl: variant.colorOptionImages[0],
      productName: product.name,
      price: variant.price,
    };
  });

  return {
    ...cart,
    items: enrichedItems,
  };
};

// Initial State
const initialState: CartState = {
  cart: null,
  loading: {
    fetch: false,
    add: false,
    update: false,
    remove: false,
  },
  error: null,
  lastUpdated: null,
};

// Fetch Cart
export const fetchCart = createAsyncThunk<Cart, string, { state: RootState }>(
  'cart/fetchCart',
  async (userId, { getState, rejectWithValue }) => {
    const state = getState();
    const { lastUpdated } = state.cart;
    const { loading: productLoading } = state.product;

    // Use the correct key from AsyncActionTypes
    if (productLoading.fetchProducts) {
      return rejectWithValue('Products are still loading. Please try again.');
    }

    // If the cart was last updated less than a minute ago, return the cached cart
    if (lastUpdated && Date.now() - lastUpdated < 60000 && state.cart.cart) {
      return state.cart.cart;
    }

    try {
      const localCart = loadCartFromLocalStorage();
      if (localCart) {
        const enrichedCart = enrichCartItems(localCart, getState);
        return enrichedCart;
      }

      const response = await axios.get<Cart>(
        `http://192.168.29.159:8084/api/v1/cart/get-cart`,
        {
          headers: {
            'X-User-ID': userId,
          },
        }
      );

      const enrichedCart = enrichCartItems(response.data, getState);
      saveCartToLocalStorage(enrichedCart);
      return enrichedCart;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch cart'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Add Item to Cart
export const addItemToCart = createAsyncThunk<Cart, { userId: string; request: AddItemRequest }, { state: RootState }>(
  'cart/addItem',
  async ({ userId, request }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post<Cart>(
        `http://192.168.29.159:8084/api/v1/cart/items/add-product`,
        request,
        {
          headers: { 'X-User-ID': userId },
        }
      );

      // Enrich the cart items with product-specific data
      const enrichedCart = enrichCartItems(response.data, getState);
      return enrichedCart;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Update Item Quantity
export const updateItemQuantity = createAsyncThunk<
  Cart,
  { userId: string; productId: string; variantSku: string; size: string; quantity: number },
  { state: RootState }
>(
  'cart/updateItemQuantity',
  async ({ userId, productId, variantSku, size, quantity }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put<Cart>(
        `http://192.168.29.159:8084/api/v1/cart/items/update-product/${productId}/${variantSku}/${size}`,
        { quantity },
        {
          headers: { 'X-User-ID': userId },
        }
      );

      // Enrich the cart items with product-specific data
      const enrichedCart = enrichCartItems(response.data, getState);
      return enrichedCart;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update item quantity');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Remove Item from Cart
export const removeItemFromCart = createAsyncThunk<
  Cart,
  { userId: string; productId: string; variantSku: string; size: string },
  { state: RootState }
>(
  'cart/removeItem',
  async ({ userId, productId, variantSku, size }, { rejectWithValue, getState }) => {
    try {
      await axios.delete(
        `http://192.168.29.159:8084/api/v1/cart/items/remove-product/${productId}/${variantSku}/${size}`,
        {
          headers: { 'X-User-ID': userId },
        }
      );
      
      // After successful deletion, fetch the updated cart
      const response = await axios.get<Cart>(
        `http://192.168.29.159:8084/api/v1/cart/get-cart`,
        {
          headers: { 'X-User-ID': userId },
        }
      );
      
      // Enrich the cart items with product-specific data
      const enrichedCart = enrichCartItems(response.data, getState);
      return enrichedCart;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Utility function to save cart to local storage
const saveCartToLocalStorage = (cart: Cart | null) => {
  try {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  } catch (error) {
    console.error('Failed to save cart to local storage:', error);
  }
};

// Utility function to load cart from local storage
const loadCartFromLocalStorage = (): Cart | null => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : null;
  } catch (error) {
    console.error('Failed to load cart from local storage:', error);
    return null;
  }
};

// Create the Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.lastUpdated = Date.now();
      // Save cart to local storage
      saveCartToLocalStorage(action.payload);
    },
    clearCart: (state) => {
      state.cart = null;
      state.lastUpdated = null;
      // Clear cart from local storage
      saveCartToLocalStorage(null);
    },
    updateLocalQuantity: (state, action: PayloadAction<{ productId: string; variantSku: string; size: string; quantity: number }>) => {
      if (state.cart) {
        const itemIndex = state.cart.items.findIndex(
          (item) =>
            item.productId === action.payload.productId &&
            item.variantSku === action.payload.variantSku &&
            item.size === action.payload.size
        );
        if (itemIndex !== -1) {
          state.cart.items[itemIndex].quantity = action.payload.quantity;
          // Save cart to local storage
          saveCartToLocalStorage(state.cart);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading.fetch = false;
        state.lastUpdated = Date.now();
        saveCartToLocalStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload as string;
      })
      // Add Item to Cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading.add = false;
        state.lastUpdated = Date.now();
        saveCartToLocalStorage(action.payload);
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload as string;
      })
      // Update Item Quantity
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading.update = false;
        state.lastUpdated = Date.now();
        saveCartToLocalStorage(action.payload);
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      })
      // Remove Item from Cart
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading.remove = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading.remove = false;
        state.lastUpdated = Date.now();
        saveCartToLocalStorage(action.payload);
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading.remove = false;
        state.error = action.payload as string;
      });
  },
});

// Export Actions and Reducer
export const { setCart, clearCart, updateLocalQuantity } = cartSlice.actions;
export default cartSlice.reducer; */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { Product } from './productSlice';

// Types
export interface AddItemRequest {
  product_id: string;
  variant_sku: string;
  size: string;
  quantity: number;
}

export interface CartItem {
  productId: string;
  variantSku: string;
  size: string;
  quantity: number;
  imageUrl?: string; // Optional: Populated from productSlice
  productName?: string; // Optional: Populated from productSlice
  price?: number; // Optional: Populated from productSlice
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  expiresAt: string; // ISO date string
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface CartState {
  cart: Cart | null;
  loading: {
    fetch: boolean;
    add: boolean;
    update: boolean;
    remove: boolean;
  };
  error: string | null;
  lastUpdated: number | null; // Timestamp of the last successful update
}

// Utility to save cart to localStorage
const saveCartToLocalStorage = (cart: Cart | null) => {
  try {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

// Utility to load cart from localStorage
const loadCartFromLocalStorage = (): Cart | null => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : null;
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return null;
  }
};

// Utility to enrich cart items with product data
const enrichCartItems = (cart: Cart, products: Product[]): Cart => {
  const enrichedItems = cart.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      console.warn(`Product not found for ID: ${item.productId}`);
      return item;
    }
    const variant = product.variants.find((v) => v.sku === item.variantSku);
    if (!variant) {
      console.warn(`Variant not found for SKU: ${item.variantSku} in product: ${item.productId}`);
      return item;
    }
    return {
      ...item,
      imageUrl: variant.colorOptionImages[0],
      productName: product.name,
      price: variant.price,
    };
  });
  return { ...cart, items: enrichedItems };
};

// API Calls
const API_BASE_URL = 'http://192.168.29.159:8084/api/v1/cart';

// Fetch cart from server
const fetchCartFromServer = async (userId: string) => {
  const response = await axios.get<Cart>(`${API_BASE_URL}/get-cart`, {
    headers: { 'X-User-ID': userId },
  });
  return response.data;
};

// Add item to cart
const addItemToCartOnServer = async (userId: string, request: AddItemRequest) => {
  const response = await axios.post<Cart>(`${API_BASE_URL}/items/add-product`, request, {
    headers: { 'X-User-ID': userId },
  });
  return response.data;
};

// Update item quantity
const updateItemQuantityOnServer = async (
  userId: string,
  productId: string,
  variantSku: string,
  size: string,
  quantity: number
) => {
  const response = await axios.put<Cart>(
    `${API_BASE_URL}/items/update-product/${productId}/${variantSku}/${size}`,
    { quantity },
    { headers: { 'X-User-ID': userId } }
  );
  return response.data;
};

// Remove item from cart
const removeItemFromCartOnServer = async (
  userId: string,
  productId: string,
  variantSku: string,
  size: string
) => {
  await axios.delete(`${API_BASE_URL}/items/remove-product/${productId}/${variantSku}/${size}`, {
    headers: { 'X-User-ID': userId },
  });
  return fetchCartFromServer(userId); // Fetch updated cart after removal
};

// Async Thunks
export const fetchCart = createAsyncThunk<Cart, string, { state: RootState }>(
  'cart/fetchCart',
  async (userId, { getState, rejectWithValue }) => {
    const state = getState();
    const { lastUpdated } = state.cart;

    // Use cached cart if it was updated less than a minute ago
    if (lastUpdated && Date.now() - lastUpdated < 60000 && state.cart.cart) {
      return state.cart.cart;
    }

    try {
      const localCart = loadCartFromLocalStorage();
      if (localCart) {
        const enrichedCart = enrichCartItems(localCart, state.product.products);
        return enrichedCart;
      }

      const cart = await fetchCartFromServer(userId);
      const enrichedCart = enrichCartItems(cart, state.product.products);
      saveCartToLocalStorage(enrichedCart);
      return enrichedCart;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to fetch cart'
      );
    }
  }
);

export const addItemToCart = createAsyncThunk<
  Cart,
  { userId: string; request: AddItemRequest },
  { state: RootState }
>(
  'cart/addItem',
  async ({ userId, request }, { getState, rejectWithValue }) => {
    try {
      const cart = await addItemToCartOnServer(userId, request);
      const enrichedCart = enrichCartItems(cart, getState().product.products);
      saveCartToLocalStorage(enrichedCart);
      return enrichedCart;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to add item to cart'
      );
    }
  }
);

export const updateItemQuantity = createAsyncThunk<
  Cart,
  { userId: string; productId: string; variantSku: string; size: string; quantity: number },
  { state: RootState }
>(
  'cart/updateItemQuantity',
  async ({ userId, productId, variantSku, size, quantity }, { getState, rejectWithValue }) => {
    try {
      const cart = await updateItemQuantityOnServer(userId, productId, variantSku, size, quantity);
      const enrichedCart = enrichCartItems(cart, getState().product.products);
      saveCartToLocalStorage(enrichedCart);
      return enrichedCart;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to update item quantity'
      );
    }
  }
);

export const removeItemFromCart = createAsyncThunk<
  Cart,
  { userId: string; productId: string; variantSku: string; size: string },
  { state: RootState }
>(
  'cart/removeItem',
  async ({ userId, productId, variantSku, size }, { rejectWithValue }) => {
    try {
      const cart = await removeItemFromCartOnServer(userId, productId, variantSku, size);
      saveCartToLocalStorage(cart);
      return cart;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to remove item from cart'
      );
    }
  }
);

// Initial State
const initialState: CartState = {
  cart: null,
  loading: {
    fetch: false,
    add: false,
    update: false,
    remove: false,
  },
  error: null,
  lastUpdated: null,
};

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.lastUpdated = Date.now();
      saveCartToLocalStorage(action.payload);
    },
    clearCart: (state) => {
      state.cart = null;
      state.lastUpdated = null;
      saveCartToLocalStorage(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.loading.fetch = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading.fetch = false;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.loading.add = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading.add = false;
      })
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.loading.update = false;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading.update = false;
      })
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading.remove = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.loading.remove = false;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading.remove = false;
      });
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;