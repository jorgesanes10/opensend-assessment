import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import apiReducer, { apiSlice } from './slices/apiSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    api: apiReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
