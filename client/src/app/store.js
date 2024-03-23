import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/apiSlice";
import cartReducer from "../features/cartSlice";
import authReducer from "../features/users/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
