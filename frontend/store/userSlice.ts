import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    createdAt: string;
    updatedAt: string;
    // Include other fields if necessary
}

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 0,
};

// Adjusting the fetchUsers async thunk to match your API response
export const fetchUsers = createAsyncThunk<{
    content: User[];
    totalPages: number;
    number: number;
}, number>(
    'users/fetchUsers',
    async (page) => {
        const response = await fetch(`http://localhost:8081/api/v1/users?page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload; // Set users directly from cache
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error state
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload.content; // Set users from API response
                state.totalPages = action.payload.totalPages; // Set total pages
                state.currentPage = action.payload.number; // Set current page
                state.loading = false; // Stop loading
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false; // Stop loading on error
                state.error = action.error.message || 'Failed to load users'; // Set error message
            });
    },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
