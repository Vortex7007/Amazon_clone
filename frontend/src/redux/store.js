import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import sellerReducer from "./seller/sellerSlice";
import cartReducer from "./cart/cartSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    cart: cartReducer
  },
});
export default store;