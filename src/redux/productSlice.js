// import { createSlice } from "@reduxjs/toolkit";

// // Load products from localStorage only
// const initialState = JSON.parse(localStorage.getItem("products")) || [];

// const productSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {
//     addProduct: (state, action) => {
//       const newProduct = { id: Date.now(), ...action.payload };

//       // Create a new array
//       const updatedState = [...state, newProduct];

//       // Save only products in localStorage
//       localStorage.setItem("products", JSON.stringify(updatedState));

//       // Update Redux state
//       return updatedState;
//     },
//   },
// });

// export const { addProduct } = productSlice.actions;
// export default productSlice.reducer;

  
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/api";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProducts();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Create product (admin)
export const addProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await createProduct(productData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create product');
    }
  }
);

// Update product (admin)
export const editProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateProduct(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update product');
    }
  }
);

// Delete product (admin)
export const removeProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

    // Edit product
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })

    // Delete product
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export default productSlice.reducer;