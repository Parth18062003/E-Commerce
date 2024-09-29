import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1/activity-logs';

// Define types for the state
interface ActivityLog {
  userId: string;
  email: string;
  activityType: string;
  details: string;
  timestamp: string;
}

interface ActivityLogState {
  loginFailuresCount: number;
  loginSuccessesCount: number;
  uniqueLoginsCount: number;
  userActivities: ActivityLog[];
  lastUserActivities: ActivityLog[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityLogState = {
  loginFailuresCount: 0,
  loginSuccessesCount: 0,
  uniqueLoginsCount: 0,
  userActivities: [],
  lastUserActivities: [],
  loading: false,
  error: null,
};

// Create async thunk actions
export const fetchActivityCounts = createAsyncThunk<{
  loginFailuresCount: number; 
  loginSuccessesCount: number; 
  uniqueLoginsCount: number;
}, void>('activityLog/fetchCounts', async () => {
  const [failures, successes, uniqueLogins] = await Promise.all([
    axios.get(`${API_BASE_URL}/login-failures/count`),
    axios.get(`${API_BASE_URL}/login-successes/count`),
    axios.get(`${API_BASE_URL}/unique-logins/count`),
  ]);
  return {
    loginFailuresCount: failures.data,
    loginSuccessesCount: successes.data,
    uniqueLoginsCount: uniqueLogins.data,
  };
});

export const fetchUserActivities = createAsyncThunk<ActivityLog[], string>(
  'activityLog/fetchUserActivities',
  async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/activities`);
    return response.data;
  }
);

export const fetchLastUserActivities = createAsyncThunk<ActivityLog[], string>(
  'activityLog/fetchLastUserActivities',
  async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/last-activities`);
    return response.data;
  }
);

// Create the slice
const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityCounts.fulfilled, (state, action: PayloadAction<{
        loginFailuresCount: number; 
        loginSuccessesCount: number; 
        uniqueLoginsCount: number;
      }>) => {
        state.loginFailuresCount = action.payload.loginFailuresCount;
        state.loginSuccessesCount = action.payload.loginSuccessesCount;
        state.uniqueLoginsCount = action.payload.uniqueLoginsCount;
        state.loading = false;
      })
      .addCase(fetchUserActivities.fulfilled, (state, action: PayloadAction<ActivityLog[]>) => {
        state.userActivities = action.payload;
      })
      .addCase(fetchLastUserActivities.fulfilled, (state, action: PayloadAction<ActivityLog[]>) => {
        state.lastUserActivities = action.payload;
      })
      .addMatcher(
        (action): action is { type: string; error: { message: string } } => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is { type: string; error: { message: string } } => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Something went wrong';
        }
      );
  },
});

// Export the reducer
export default activityLogSlice.reducer;
