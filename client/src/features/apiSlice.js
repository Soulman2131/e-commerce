import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../url/baseUrl";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

//

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "User", "Order"],
  // ça servira pour productApiSlice
  endpoints: (builder) => ({}),
});
