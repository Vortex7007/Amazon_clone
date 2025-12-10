import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    userLoginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    userLogout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { userLoginSuccess, userLogout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
