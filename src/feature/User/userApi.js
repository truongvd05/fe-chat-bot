import baseQueryWithReauth from "@/services/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: "auth/me",
      }),
      providesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    findUser: builder.query({
      query: (q) => ({
        url: `user/search`,
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useLogoutMutation,
  useChangePasswordMutation,
  useFindUserQuery,
  // lazy
  useLazyFindUserQuery,
} = userApi;
