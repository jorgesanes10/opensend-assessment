import { configureStore } from '@reduxjs/toolkit';
import { themeSlice } from '../features/themeSlice';
import { apiSlice } from '../features/apiSlice';
import { userSlice } from '../features/userSlice';

export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    api: apiSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
