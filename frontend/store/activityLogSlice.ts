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

interface ActivitySummary {
  [key: string]: number;
}

interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    // Add other pagination fields if needed
  };
  totalElements: number;
  totalPages: number;
}

interface ActivityLogState {
  loginFailuresCount: number;
  loginSuccessesCount: number;
  uniqueLoginsCount: number;
  userActivities: ActivityLog[]; // This will hold the current page data
  lastUserActivities: ActivityLog[];
  loading: boolean;
  error: string | null;
  dailyLoginsCount: number;
  registrationsCount: number;
  updatesCount: number;
  deletionsCount: number;
  activityTrends: { [key: string]: number }; // Changed to an object
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
  };
}

const initialState: ActivityLogState = {
  loginFailuresCount: 0,
  loginSuccessesCount: 0,
  uniqueLoginsCount: 0,
  userActivities: [],
  lastUserActivities: [],
  loading: false,
  error: null,
  dailyLoginsCount: 0,
  registrationsCount: 0,
  updatesCount: 0,
  deletionsCount: 0,
  activityTrends: {}, // Changed to an object
  pagination: {
    currentPage: 0,
    totalPages: 0,
    pageSize: 10,
    totalElements: 0,
  },
};

// Create async thunk actions
export const fetchActivityCounts = createAsyncThunk<{
  loginFailuresCount: number; 
  loginSuccessesCount: number; 
  uniqueLoginsCount: number;
}, void>('activityLog/fetchActivityCounts', async () => {
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

export const fetchUserActivities = createAsyncThunk<PaginatedResponse<ActivityLog>, { userId: string; page: number }>(
  'activityLog/fetchUserActivities',
  async ({ userId, page }) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/activities`, { params: { page } });
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

export const fetchDailyLoginsCount = createAsyncThunk<number, string>(
  'activityLog/fetchDailyLoginsCount',
  async (dateString) => {
    const response = await axios.get(`${API_BASE_URL}/daily-logins`, { params: { date: dateString } });
    return response.data;
  }
);

export const fetchRegistrationsCount = createAsyncThunk<number, { startDate: string; endDate: string }>(
  'activityLog/fetchRegistrationsCount',
  async ({ startDate, endDate }) => {
    const response = await axios.get(`${API_BASE_URL}/registrations/count`, { params: { startDate, endDate } });
    return response.data;
  }
);

export const fetchUpdatesCount = createAsyncThunk<number, { startDate: string; endDate: string }>(
  'activityLog/fetchUpdatesCount',
  async ({ startDate, endDate }) => {
    const response = await axios.get(`${API_BASE_URL}/updates/count`, { params: { startDate, endDate } });
    return response.data;
  }
);

export const fetchDeletionsCount = createAsyncThunk<number, { startDate: string; endDate: string }>(
  'activityLog/fetchDeletionsCount',
  async ({ startDate, endDate }) => {
    const response = await axios.get(`${API_BASE_URL}/deletions/count`, { params: { startDate, endDate } });
    return response.data;
  }
);

export const fetchActivitySummary = createAsyncThunk<ActivitySummary, string>(
  'activityLog/fetchActivitySummary',
  async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/activity-summary`);
    return response.data;
  }
);

export const fetchDailyActivityTrends = createAsyncThunk<{ [key: string]: number }, string>(
  'activityLog/fetchDailyActivityTrends',
  async (activityType) => {
    const response = await axios.get(`${API_BASE_URL}/activity-trends/daily`, { params: { activityType } });
    return response.data; // Assuming the API returns an object
  }
);

// Create the slice
const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
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
      .addCase(fetchUserActivities.fulfilled, (state, action: PayloadAction<PaginatedResponse<ActivityLog>>) => {
        state.userActivities = action.payload.content; // Store current page of activities
        state.pagination.currentPage = action.payload.pageable.pageNumber;
        state.pagination.totalPages = action.payload.totalPages; // Use totalPages directly from the response
        state.pagination.pageSize = action.payload.pageable.pageSize; // Use pageSize from pageable
        state.pagination.totalElements = action.payload.totalElements; // Use totalElements directly from the response
        state.loading = false;
      })      
      .addCase(fetchLastUserActivities.fulfilled, (state, action: PayloadAction<ActivityLog[]>) => {
        state.lastUserActivities = action.payload;
        state.loading = false;
      })
      .addCase(fetchDailyLoginsCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.dailyLoginsCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchRegistrationsCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.registrationsCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchUpdatesCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.updatesCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchDeletionsCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.deletionsCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchActivitySummary.fulfilled, (state, action: PayloadAction<ActivitySummary>) => {
        // handle activity summary if needed
        state.loading = false;
      })
      .addCase(fetchDailyActivityTrends.fulfilled, (state, action: PayloadAction<{ [key: string]: number }>) => {
        state.activityTrends = action.payload; // Assuming the API returns an object
        state.loading = false;
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

// Export the actions and reducer
export const activityLogActions = activityLogSlice.actions;
export default activityLogSlice.reducer;
