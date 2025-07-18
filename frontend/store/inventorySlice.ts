import { FilterConfig, InventoryItem, PaginationConfig, SortConfig } from '@/components/Inventory/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface InventoryState {
  items: InventoryItem[];
  item: InventoryItem | null;
  loading: {
    fetch: boolean;
    add: boolean;
    update: boolean;
    reserve: boolean;
  };
  error: string | null;
  sort: SortConfig;
  filter: FilterConfig;
  pagination: PaginationConfig;
}

const initialState: InventoryState = {
  items: [],
  item: null,
  loading: { fetch: false, add: false, update: false, reserve: false },
  error: null,
  sort: { key: 'updatedAt', direction: 'desc' },
  filter: { sku: '', productId: '', color: '' },
  pagination: { page: 0, pageSize: 10, totalPages: 0 },
};

// Utility function to update an item in the items array
const updateItemInArray = (items: InventoryItem[], updatedItem: InventoryItem): InventoryItem[] => {
  return items.map(item => (item.variantSku === updatedItem.variantSku ? updatedItem : item));
};

export const fetchAllInventory = createAsyncThunk<InventoryItem[],{page: number, pageSize: number}>(
  'inventory/fetchAllInventory',
  async ({page, pageSize}, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get<{
        content: InventoryItem[];
        pageable: { pageNumber: number; pageSize: number; };
        totalElements: number;
      }>('http://192.168.29.152:8083/api/v1/inventory', {
        params: { page, size: pageSize }
      });
      dispatch(setPagination({
        //page: response.data.pageable.pageNumber,
        //pageSize: response.data.pageable.pageSize,
        totalItems: response.data.totalElements,
      }));
      return response.data.content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
); 

export const fetchInventoryItem = createAsyncThunk<InventoryItem, { productId: string; variantSku: string }>(
  'inventory/fetchInventoryItem',
  async ({ productId, variantSku }, { rejectWithValue }) => {
    try {
      const response = await axios.get<InventoryItem>(`http://192.168.29.152:8083/api/v1/inventory/${productId}/variant/${variantSku}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory item');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const fetchInventoryItems = createAsyncThunk<InventoryItem[], string>(
  'inventory/fetchInventoryItems',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get<InventoryItem[]>(`http://192.168.29.152:8083/api/v1/inventory/${productId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory items');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const addInventory = createAsyncThunk<InventoryItem, { productId: string; variantSku: string; inventoryRequest: { color: string; sizeStock: { [key: string]: number } } }>(
  'inventory/addInventory',
  async ({ productId, variantSku, inventoryRequest }, { rejectWithValue }) => {
    try {
      // Make API call to add inventory
      const response = await axios.post<InventoryItem>(
        `http://192.168.29.152:8083/api/v1/inventory/add/${productId}/${variantSku}`,
        inventoryRequest
      );
      
      return response.data; // Return the updated inventory
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add inventory');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const addStock = createAsyncThunk<InventoryItem, { productId: string; variantSku: string; size: string; quantity: number }>(
  'inventory/addStock',
  async ({ productId, variantSku, size, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post<InventoryItem>(
        `http://192.168.29.152:8083/api/v1/inventory/${productId}/variant/${variantSku}/size/${size}/add-stock`,
        null,
        { params: { quantity } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add stock');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const reduceStock = createAsyncThunk<InventoryItem, { productId: string; variantSku: string; size: string; color: string; quantity: number }>(
  'inventory/reduceStock',
  async ({ productId, variantSku, size, color, quantity }, { rejectWithValue }) => {
    try {
      // Make the PUT request to reduce stock
      const response = await axios.put<InventoryItem>(
        `http://192.168.29.152:8083/api/v1/inventory/${productId}/variant/${variantSku}/size/${size}/reduce-stock`,
        null, // No request body needed for this API
        {
          params: {
            color,
            quantity, // Send a negative quantity to reduce stock
          },
        }
      );
      return response.data; // Return the updated inventory
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to reduce stock');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateStock = createAsyncThunk<InventoryItem, { productId: string; variantSku: string; size: string; quantity: number }>(
  'inventory/updateStock',
  async ({ productId, variantSku, size, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put<InventoryItem>(
        `http://192.168.29.152:8083/api/v1/inventory/${productId}/variant/${variantSku}/size/${size}/stock`,
        null,
        { params: { quantity } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update stock');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const reserveStock = createAsyncThunk<InventoryItem, { productId: string; variantSku: string; size: string; quantity: number }>(
  'inventory/reserveStock',
  async ({ productId, variantSku, size, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put<InventoryItem>(
        `http://192.168.29.152:8083/api/v1/inventory/${productId}/variant/${variantSku}/size/${size}/reserve-stock`,
        null,
        { params: { quantity } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to reserve stock');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Create the inventory slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setItem: (state, action) => {
      state.item = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory item by SKU and product ID
      .addCase(fetchInventoryItem.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchInventoryItem.fulfilled, (state, action) => {
        state.item = action.payload;
        state.loading.fetch = false;
      })
      .addCase(fetchInventoryItem.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload as string;
      })

      // Fetch all inventory items for a product
      .addCase(fetchInventoryItems.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchInventoryItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading.fetch = false;
      })
      .addCase(fetchInventoryItems.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload as string;
      })

      // Fetch all inventory items for a product
      .addCase(fetchAllInventory.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchAllInventory.fulfilled, (state, action) => {
        state.items = action.payload;     
        state.loading.fetch = false;
      }) 
      .addCase(fetchAllInventory.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload as string;
      })

      // Add inventory for a product variant
      .addCase(addInventory.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addInventory.fulfilled, (state, action) => {
        state.items = updateItemInArray(state.items, action.payload);
        state.loading.add = false;
      })
      .addCase(addInventory.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload as string;
      })
      // Add stock to a product variant
      .addCase(addStock.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addStock.fulfilled, (state, action) => {
        state.items = updateItemInArray(state.items, action.payload);
        state.loading.add = false;
      })
      .addCase(addStock.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload as string;
      })

      // Reduce stock for a product variant
      .addCase(reduceStock.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(reduceStock.fulfilled, (state, action) => {
        state.items = updateItemInArray(state.items, action.payload);
        state.loading.update = false;
      })
      .addCase(reduceStock.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      })

      // Update stock quantity for a product variant
      .addCase(updateStock.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.items = updateItemInArray(state.items, action.payload);
        state.loading.update = false;
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      })

      // Reserve stock for a product variant
      .addCase(reserveStock.pending, (state) => {
        state.loading.reserve = true;
        state.error = null;
      })
      .addCase(reserveStock.fulfilled, (state, action) => {
        state.items = updateItemInArray(state.items, action.payload);
        state.loading.reserve = false;
      })
      .addCase(reserveStock.rejected, (state, action) => {
        state.loading.reserve = false;
        state.error = action.payload as string;
      });
  },
});

// Exporting actions and reducer
export const { setItems, setItem, setSort, setFilter, setPagination } = inventorySlice.actions;
export default inventorySlice.reducer;