import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/v1/activity-logs";

// Define the DeviceLog interface
interface DeviceLog {
  id: string;
  userId: string;
  os: string;
  browser: string;
  device: string;
  osVersion?: string;
  browserVersion?: string;
  deviceVendor?: string;
  deviceModel?: string;
  timestamp: string; 
}

// Define the payload for logging device info
interface LogDeviceInfoPayload {
  userId: string;
  os: string;
  browser: string;
  device: string;
  osVersion?: string;
  browserVersion?: string;
  deviceVendor?: string;
  deviceModel?: string;
}

// Define the state for device logs
interface DeviceLogState {
  deviceLogs: DeviceLog[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DeviceLogState = {
  deviceLogs: [],
  loading: false,
  error: null,
};

// Async thunk to fetch device logs
export const fetchDeviceLogs = createAsyncThunk<DeviceLog[], string>(
  "deviceLog/fetchDeviceLogs",
  async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/device-logs/${userId}`);
    return response.data.content; // Extracting the content array from the response
  }
);

// Async thunk to log device info
export const logDeviceInfo = createAsyncThunk<string, LogDeviceInfoPayload>(
  "deviceLog/logDeviceInfo",
  async ({
    userId,
    os,
    browser,
    device,
    osVersion,
    browserVersion,
    deviceModel,
    deviceVendor,
  }) => {
    const response = await axios.post(`${API_BASE_URL}/device-info`, {
      userId,
      os,
      browser,
      device,
      osVersion,
      browserVersion,
      deviceVendor,
      deviceModel,
    });
    return response.data; // Assuming it returns a success message
  }
);

// Create the slice
const deviceLogSlice = createSlice({
  name: "deviceLog",
  initialState,
  reducers: {
    setDeviceLogs(state, action: PayloadAction<DeviceLog[]>) {
      state.deviceLogs = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchDeviceLogs.fulfilled,
        (state, action: PayloadAction<DeviceLog[]>) => {
          state.deviceLogs = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchDeviceLogs.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on pending
      })
      .addCase(
        logDeviceInfo.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false; // No longer loading
          console.log(action.payload); // Log success message
        }
      )
      .addCase(logDeviceInfo.pending, (state) => {
        state.loading = true; // Set loading to true
      })
      .addMatcher(
        (action): action is { type: string; error: { message: string } } =>
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false; // Set loading to false on error
          state.error = action.error.message || "Something went wrong"; // Capture error message
        }
      );
  },
});

// Export the actions
export const { setDeviceLogs } = deviceLogSlice.actions;

// Export the reducer
export default deviceLogSlice.reducer;
