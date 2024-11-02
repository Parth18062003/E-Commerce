// store/store.ts
import { Action, configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import activityLogReducer from './activityLogSlice';
import deviceLogSliceReducer from './deviceLogSlice';
import userSliceReducer from './userSlice';
import productSliceReducer from './productSlice';
import wishListSliceReducer from './wishListSlice';
import ratingSliceReducer from './ratingSlice';
import { thunk, ThunkAction } from 'redux-thunk';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activityLog: activityLogReducer, 
    deviceLog: deviceLogSliceReducer,
    user: userSliceReducer,
    product: productSliceReducer,
    wishList: wishListSliceReducer,
    rating: ratingSliceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
