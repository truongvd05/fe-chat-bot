import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (Headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      Headers.set("authorization", `Bearer ${token}`);
    }
    return Headers;
  },
  credentials: "include",
});

// xử lí data.data
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.data && result.data.data) {
    return {
      ...result,
      data: result.data.data,
    };
  }
  return result;
};

export default baseQuery;
