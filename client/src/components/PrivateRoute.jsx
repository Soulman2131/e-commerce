import React from "react";
import { selectedAllUsers } from "../features/users/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { userInfo } = useSelector(selectedAllUsers);
  return userInfo ? <Outlet /> : <Navigate to="/users/login" replace />;
};

export default PrivateRoute;
