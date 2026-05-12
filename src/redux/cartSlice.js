import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI, decreaseCartItem } from "../services/api";


// Fetch cart
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCart();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/add',
  async (cartData, { rejectWithValue }) => {
    try {
      const res = await addToCartAPI(cartData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await removeFromCartAPI(productId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await clearCartAPI();
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
    }
  }
);


// Decrease quantity
export const decreaseQuantity = createAsyncThunk(
  'cart/decrease',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await decreaseCartItem(productId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to decrease quantity');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    totalPrice: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })

      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })

      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalPrice = 0;
      })

      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
      });

     
  },
});

export default cartSlice.reducer;