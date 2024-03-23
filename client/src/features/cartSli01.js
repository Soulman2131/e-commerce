import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      //  We don't need user, rating, numReviews or reviews
      // in the cart
      //   const { user, rating, numReviews, reviews, ...item } = action.payload;
      const item = action.payload;

      const itemExists = state.cartItems.find((x) => x._id === item._id);
      if (itemExists) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === itemExists._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      //   CALCULATE SUM PRICE (4 functions)

      const addDecimal = (num) => {
        return Math.round((num * 100) / 100).toFixed(2);
      };
      //1   Calculate Items price
      // function accumulator for calculate 😍
      state.itemPrice = addDecimal(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );

      //2   Calculate Shipping price (order free if 100eur sinon fdp 10eur)
      state.shippingPrice = addDecimal(state.itemPrice > 100 ? 0 : 10);

      //3   Calculate Tax price
      state.taxPrice = addDecimal(Number(state.itemPrice * 0.15).toFixed(2));

      //4   Calculate Total price
      state.totalPrice = (
        Number(state.itemPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);

      //   final 😍😎
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
