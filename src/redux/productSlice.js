import { createSlice } from "@reduxjs/toolkit";

// Load products from localStorage only
const initialState = JSON.parse(localStorage.getItem("products")) || [];

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = { id: Date.now(), ...action.payload };

      // Create a new array
      const updatedState = [...state, newProduct];

      // Save only products in localStorage
      localStorage.setItem("products", JSON.stringify(updatedState));

      // Update Redux state
      return updatedState;
    },
  },
});

export const { addProduct } = productSlice.actions;
export default productSlice.reducer;
