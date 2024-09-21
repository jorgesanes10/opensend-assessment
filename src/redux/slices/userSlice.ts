import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setIsAuthenticated } = userSlice.actions;
export default userSlice.reducer;
