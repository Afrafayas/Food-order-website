import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';

// Preload products from localStorage
const preloadedProducts = JSON.parse(localStorage.getItem("products")) || [];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },
  preloadedState: {
    products: preloadedProducts, // Only products here
  },
});
