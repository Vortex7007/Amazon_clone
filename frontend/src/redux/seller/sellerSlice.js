import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get the base URL from the environment, or default to localhost if running locally
const rootUrl = process.env.REACT_APP_BACKEND_SERVER_LINK || "http://localhost:5000";

// Append /api to it
const API_BASE_URL = `${rootUrl}/api`;

// Async thunks for seller operations
export const fetchSellerProducts = createAsyncThunk(
  'seller/fetchProducts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { seller } = getState().seller;
      const token = seller?.token || localStorage.getItem('sellerToken');

      const response = await axios.get(`${API_BASE_URL}/seller/products`, {
        headers: { 'auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const updateSellerProduct = createAsyncThunk(
  'seller/updateProduct',
  async ({ productId, productData }, { rejectWithValue, getState }) => {
    try {
      const { seller } = getState().seller;
      const token = seller?.token || localStorage.getItem('sellerToken');

      const response = await axios.put(`${API_BASE_URL}/seller/products/${productId}`, productData, {
        headers: { 'auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update product');
    }
  }
);

export const deleteSellerProduct = createAsyncThunk(
  'seller/deleteProduct',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const { seller } = getState().seller;
      const token = seller?.token || localStorage.getItem('sellerToken');

      await axios.delete(`${API_BASE_URL}/seller/products/${productId}`, {
        headers: { 'auth-token': token }
      });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete product');
    }
  }
);

export const fetchSellerAnalytics = createAsyncThunk(
  'seller/fetchAnalytics',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { seller } = getState().seller;
      const token = seller?.token || localStorage.getItem('sellerToken');

      const response = await axios.get(`${API_BASE_URL}/seller/analytics`, {
        headers: { 'auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch analytics');
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'seller/fetchOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { seller } = getState().seller;
      const token = seller?.token || localStorage.getItem('sellerToken');

      const response = await axios.get(`${API_BASE_URL}/seller/orders`, {
        headers: { 'auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'seller/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue, getState }) => {
    try {
      const { seller } = getState().seller;
      const token = seller?.token || localStorage.getItem('sellerToken');

      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status }, {
        headers: { 'auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update order status');
    }
  }
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState: {
    token: null,
    seller: null,
    isAuthenticated: false,
    products: [],
    analytics: null,
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    sellerLoginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.seller = action.payload.seller;
      state.isAuthenticated = true;
      // Store seller token separately
      localStorage.setItem('sellerToken', action.payload.token);
    },
    sellerLogout: (state) => {
      state.token = null;
      state.seller = null;
      state.isAuthenticated = false;
      state.products = [];
      state.analytics = null;
      state.orders = [];
      localStorage.removeItem('sellerToken');
    },
    clearSellerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p._id === action.payload.product._id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })
      .addCase(updateSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Analytics
      .addCase(fetchSellerAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchSellerAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Orders
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.order;
        const index = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { sellerLoginSuccess, sellerLogout, clearSellerError } = sellerSlice.actions;
export default sellerSlice.reducer;
