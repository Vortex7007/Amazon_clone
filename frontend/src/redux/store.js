import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import sellerReducer from "./seller/sellerSlice";
import cartReducer from "./cart/cartSlice";
import orderReducer from "./order/orderSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    cart: cartReducer,
    order: orderReducer
  },
});
export default store;
