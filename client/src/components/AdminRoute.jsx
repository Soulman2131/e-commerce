import React from "react";
import { selectedAllUsers } from "../features/users/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { userInfo } = useSelector(selectedAllUsers);
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/users/login" replace />
  );
};

export default AdminRoute;
