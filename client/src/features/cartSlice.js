import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../components/Utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const itemExists = state.cartItems.find((x) => x._id === item._id);
      if (itemExists) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === itemExists._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      //   CALCULATE SUM PRICE (4 functions) 😋
      return updateCart(state);
    },
    removeCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    shipAddress: (state, action) => {
      state.shippingAddress = action.payload;
      // localStorage.setItem("cart", JSON.stringify(state));
      return updateCart(state);
    },
    payMethod: (state, action) => {
      state.paymentMethod = action.payload;
      // localStorage.setItem("cart", JSON.stringify(state));
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      // localStorage.setItem("cart", JSON.stringify(state));
      return updateCart(state);
    },
    resetCart: (state) => (state = initialState),
  },
});

export const selectedAllCart = (state) => state.cart;
export const {
  addToCart,
  removeCart,
  shipAddress,
  payMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
