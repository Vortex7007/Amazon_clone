import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.totalQuantity = action.payload.totalQuantity || 0;
      state.totalAmount = action.payload.totalAmount || 0;
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId || item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push(action.payload);
      }
      state.totalQuantity = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        item => (item.productId || item.id) !== action.payload
      );
      state.totalQuantity = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  }
});

export const { setCart, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
