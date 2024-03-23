export const addDecimal = (num) => {
  return Math.round((num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //1   Calculate Items price
  // function accumulator for calculate 😍
  state.itemsPrice = addDecimal(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  //2   Calculate Shipping price (order free if 100eur sinon fdp 10eur)
  state.shippingPrice = addDecimal(state.itemsPrice > 100 ? 0 : 10);

  //3   Calculate Tax price
  state.taxPrice = addDecimal(Number(state.itemsPrice * 0.15).toFixed(2));

  //4   Calculate Total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  //   final 😍😎
  localStorage.setItem("cart", JSON.stringify(state));

  //
  return state;
};
