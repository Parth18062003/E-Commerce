import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface WishList {
    id: string;
    userId: string;
    productIds: string[];
    createdAt: number[];
    updatedAt: number[];
}

interface WishListState {
    wishlists: WishList[];
    wishlist: WishList | null;
    loading: { fetch: boolean; add: boolean; remove: boolean };
    error: string | null;
}

// Initial state
const initialState: WishListState = {
    wishlists: [],
    wishlist: null,
    loading: { fetch: false, add: false, remove: false },
    error: null,
};

// Async thunk for fetching the wishlist by user ID
export const fetchWishList = createAsyncThunk<WishList, string>(
    'wishlist/fetchWishList',
    async (userId) => {
        const response = await axios.get(`http://192.168.29.159:8082/api/v1/wishlist/${userId}`);
        return response.data;
    }
);

// Async thunk for adding a product to the wishlist
export const addProductToWishList = createAsyncThunk<WishList, { userId: string; productId: string }>(
    'wishlist/addProductToWishList',
    async ({ userId, productId }) => {
        const response = await axios.post(`http://192.168.29.159:8082/api/v1/wishlist/${userId}/add`, productId);
        return response.data; // Return the updated wishlist
    }
);

// Async thunk for removing a product from the wishlist
export const removeProductFromWishList = createAsyncThunk<WishList, { userId: string; productId: string }>(
    'wishlist/removeProductFromWishList',
    async ({ userId, productId }) => {
        const response = await axios.delete(`http://192.168.29.159:8082/api/v1/wishlist/${userId}/remove/${productId}`);
        return response.data; // Return the updated wishlist
    }
);

// Create the wishlist slice
const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        setWishlists: (state, action) => {
            state.wishlists = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishList.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchWishList.fulfilled, (state, action) => {
                state.wishlist = action.payload;
                state.loading.fetch = false;
            })
            .addCase(fetchWishList.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message || 'Failed to load wishlist';
            })
            .addCase(addProductToWishList.pending, (state) => {
                state.loading.add = true;
                state.error = null;
            })
            .addCase(addProductToWishList.fulfilled, (state, action) => {
                if (state.wishlist) {
                    // Assuming action.payload returns the updated wishlist
                    state.wishlist = action.payload; // Replace the entire wishlist with the updated one
                }
                state.loading.add = false;
            })
            .addCase(addProductToWishList.rejected, (state, action) => {
                state.loading.add = false;
                state.error = action.error.message || 'Failed to add product to wishlist';
            })
            .addCase(removeProductFromWishList.pending, (state) => {
                state.loading.remove = true;
                state.error = null;
            })
            .addCase(removeProductFromWishList.fulfilled, (state, action) => {
                if (state.wishlist) {
                    // Assuming action.payload returns the updated wishlist
                    state.wishlist = action.payload; // Replace the entire wishlist with the updated one
                }
                state.loading.remove = false;
            })
            .addCase(removeProductFromWishList.rejected, (state, action) => {
                state.loading.remove = false;
                state.error = action.error.message || 'Failed to remove product from wishlist';
            });
    },
});

// Exporting actions and reducer
export const { setWishlists } = wishlistSlice.actions;
export default wishlistSlice.reducer;