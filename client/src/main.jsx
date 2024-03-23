import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// On le met si npm i bootstrap
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { HelmetProvider } from "react-helmet-async";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Home from "./pages/Home";

import ProductId from "./pages/ProductId";

import Cart from "./screen/Cart";
import Login from "./screen/Login";
import Register from "./screen/Register";
import Profile from "./screen/Profile";
import Shipping from "./screen/CartDetails/Shipping";
import Payment from "./screen/CartDetails/Payment";
import PrivateRoute from "./components/PrivateRoute";
import Order from "./screen/CartDetails/Order";
import UserOrder from "./screen/CartDetails/UserOrder";
import AdminRoute from "./components/AdminRoute";
import OrderList from "./screen/Admin/OrderList";
import ProductList from "./screen/Admin/ProductList";
import EditProduct from "./screen/Admin/EditProduct";
import UserList from "./screen/Admin/UserList";
import EditUser from "./screen/Admin/EditUser";

//
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index={true} path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductId />} />
        {/* 😍 Pour la pagination et la search */}
        <Route path="/search/:keyword" element={<Home />} />
        <Route path="/page/:pageNumber" element={<Home />} />
        <Route path="/search/:keyword/page/:pageNumber" element={<Home />} />

        <Route path="/cart">
          <Route path="" element={<Cart />} />
        </Route>

        <Route path="/users">
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* PRIVATE ROUTE 😍 */}
        <Route path="" element={<PrivateRoute />}>
          <Route path="cart/shipping" element={<Shipping />} />
          <Route path="cart/payment" element={<Payment />} />
          <Route path="cart/order" element={<Order />} />
          <Route path="cart/order/:id" element={<UserOrder />} />
          <Route path="users/profile" element={<Profile />} />
        </Route>

        {/* ADMIN ROUTE 😍 */}
        <Route path="" element={<AdminRoute />}>
          <Route path="/admin/orderlist" element={<OrderList />} />

          <Route path="/admin/productlist" element={<ProductList />} />

          <Route path="/admin/product/:id/edit" element={<EditProduct />} />

          <Route path="/admin/userlist" element={<UserList />} />

          <Route path="/admin/user/:id/edit" element={<EditUser />} />

          {/* 😍 Pour la pagination et la search */}
          <Route
            path="/admin/productlist/:pageNumber"
            element={<ProductList />}
          />
        </Route>
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <Provider store={store}>
      <React.StrictMode>
        <PayPalScriptProvider>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </React.StrictMode>
      ,
    </Provider>
  </HelmetProvider>
);
