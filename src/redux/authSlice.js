import { createSlice } from "@reduxjs/toolkit";

const initial = JSON.parse(localStorage.getItem('auth')) || {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      localStorage.setItem('auth', JSON.stringify(state));
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth');
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('auth', JSON.stringify(state));
    },
  }
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer; 