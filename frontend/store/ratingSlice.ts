import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Rating {
    id: string;
    userId: string;
    userName: string;
    productId: string;
    rating: number;
    comment?: string;
    imageUrls?: string[];
    createdAt: string;
    updatedAt: string;
}

interface RatingState {
    ratings: Rating[];
    rating: Rating | null;
    averageRating?: number;
    totalReviews?: number;
    loading: { fetch: boolean; add: boolean; update: boolean; remove: boolean };
    error: string | null;
    cache: { [key: string]: Rating[] };
}

const initialState: RatingState = {
    ratings: [],
    rating: null,
    averageRating: 0,
    totalReviews: 0,
    loading: { fetch: false, add: false, update: false, remove: false },
    error: null,
    cache: {},
};

// Modified to match backend expectation
export const addRating = createAsyncThunk<
    Rating,
    {
        userId: string;
        productId: string;
        rating: number;
        comment?: string;
        imageUrls?: string[];
        userName: string;
    }
>(
    'rating/addRating',
    async (ratingData) => {
        const response = await axios.post(
            `http://localhost:8082/api/v1/ratings/${ratingData.userId}/products/${ratingData.productId}`,
            {
                rating: {
                    rating: ratingData.rating,
                    comment: ratingData.comment,
                    imageUrls: ratingData.imageUrls || []
                },
                userName: ratingData.userName
            }
        );
        return response.data;
    }
);

// Other thunks remain the same
export const fetchRatingsByProduct = createAsyncThunk<Rating[], string>(
    'rating/fetchRatingsByProduct',
    async (productId, { getState }) => {
        const state = getState() as { rating: RatingState };
        if (state.rating.cache[productId]) {
            return state.rating.cache[productId];
        }
        
        const response = await axios.get(`http://localhost:8082/api/v1/ratings/products/${productId}`);
        return response.data;
    }
);

export const fetchRatingsByUser = createAsyncThunk<Rating[], string>(
    'rating/fetchRatingsByUser',
    async (userId, { getState }) => {
        const state = getState() as { rating: RatingState };
        if (state.rating.cache[userId]) {
            return state.rating.cache[userId];
        }
        
        const response = await axios.get(`http://localhost:8082/api/v1/ratings/users/${userId}`);
        return response.data;
    }
);

export const updateRating = createAsyncThunk<Rating, { ratingId: string; rating: Rating }>(
    'rating/updateRating',
    async ({ ratingId, rating }) => {
        const response = await axios.put(`http://localhost:8082/api/v1/ratings/${ratingId}`, rating);
        return response.data;
    }
);

export const fetchUserRating = createAsyncThunk<
    Rating | null,
    { userId: string; productId: string }
>(
    'rating/fetchUserRating',
    async ({ userId, productId }) => {
        try {
            const response = await axios.get(
                `http://localhost:8082/api/v1/ratings/users/${userId}/products/${productId}`
            );
            return response.data;
        } catch (error) {
            return null;
        }
    }
);


export const fetchAverageRating = createAsyncThunk<{ averageRating: number; totalReviews: number }, string>(
    'rating/fetchAverageRating',
    async (productId) => {
        const response = await axios.get(`http://localhost:8082/api/v1/ratings/products/${productId}/average`);
        return response.data; // Assuming this returns { averageRating, totalReviews }
    }
);

export const removeRating = createAsyncThunk<void, string>(
    'rating/removeRating',
    async (ratingId) => {
        await axios.delete(`http://localhost:8082/api/v1/ratings/${ratingId}`);
    }
);

const ratingSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
        setRatings: (state, action) => {
            state.ratings = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatingsByProduct.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchRatingsByProduct.fulfilled, (state, action) => {
                state.ratings = action.payload;
                state.loading.fetch = false;
                state.cache[action.meta.arg] = action.payload;
            })
            .addCase(fetchRatingsByProduct.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message || 'Failed to load ratings';
            })
            .addCase(fetchRatingsByUser.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchRatingsByUser.fulfilled, (state, action) => {
                state.ratings = action.payload;
                state.loading.fetch = false;
                state.cache[action.meta.arg] = action.payload;
            })
            .addCase(fetchRatingsByUser.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message || 'Failed to load user ratings';
            })       
            .addCase(fetchAverageRating.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchAverageRating.fulfilled, (state, action) => {
                state.averageRating = action.payload.averageRating; // Update averageRating
                state.totalReviews = action.payload.totalReviews;   // Update totalReviews
                state.loading.fetch = false;
            })
            .addCase(fetchAverageRating.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message || 'Failed to load average rating';
            })   
            .addCase(addRating.pending, (state) => {
                state.loading.add = true;
                state.error = null;
            })
            .addCase(addRating.fulfilled, (state, action) => {
                state.ratings.push(action.payload);
                state.loading.add = false;
            })
            .addCase(addRating.rejected, (state, action) => {
                state.loading.add = false;
                state.error = action.error.message || 'Failed to add rating';
            })
            .addCase(updateRating.pending, (state) => {
                state.loading.update = true;
                state.error = null;
            })
            .addCase(updateRating.fulfilled, (state, action) => {
                const index = state.ratings.findIndex(rating => rating.id === action.payload.id);
                if (index !== -1) {
                    state.ratings[index] = action.payload;
                }
                state.loading.update = false;
            })
            .addCase(updateRating.rejected, (state, action) => {
                state.loading.update = false;
                state.error = action.error.message || 'Failed to update rating';
            })
            .addCase(removeRating.pending, (state) => {
                state.loading.remove = true;
                state.error = null;
            })
            .addCase(removeRating.fulfilled, (state, action) => {
                state.loading.remove = false;
            })
            .addCase(removeRating.rejected, (state, action) => {
                state.loading.remove = false;
                state.error = action.error.message || 'Failed to remove rating';
            });
    },
});

export const { setRatings } = ratingSlice.actions;
export default ratingSlice.reducer;