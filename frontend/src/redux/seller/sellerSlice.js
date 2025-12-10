import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  seller: null,
  isAuthenticated: false,
};

const sellerAuthSlice = createSlice({
  name: "sellerAuth",
  initialState,
  reducers: {
    sellerLoginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.seller = action.payload.seller;
      state.isAuthenticated = true;
    },
    sellerLogout: (state) => {
      state.token = null;
      state.seller = null;
      state.isAuthenticated = false;
    }
  }
});

export const { sellerLoginSuccess, sellerLogout } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
