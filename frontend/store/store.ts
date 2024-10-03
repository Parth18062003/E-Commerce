// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import activityLogReducer from './activityLogSlice';
import deviceLogSliceReducer from './deviceLogSlice';
import userSliceReducer from './userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activityLog: activityLogReducer, 
    deviceLog: deviceLogSliceReducer,
    user: userSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
