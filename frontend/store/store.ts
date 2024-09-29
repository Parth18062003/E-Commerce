// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import activityLogRedcer from './activityLogSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activityLog: activityLogRedcer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
