import baseQueryWithReauth from "@/services/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User, Friends, Friends-request"],
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
    getFriend: builder.query({
      query: () => ({
        url: "user/friends",
      }),
      providesTags: ["Friends"],
    }),
    getFriendRequest: builder.query({
      query: () => ({
        url: "user/friend-request",
      }),
      providesTags: ["Friends-request"],
    }),
    addFriend: builder.mutation({
      query: ({ targetUserId }) => ({
        url: "user/add-friend",
        method: "POST",
        body: { targetUserId },
      }),
    }),
    accFriend: builder.mutation({
      query: ({ targetUserId }) => ({
        url: "user/",
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetFriendQuery,
  useFindUserQuery,
  useGetFriendRequestQuery,
  useLogoutMutation,
  useChangePasswordMutation,
  useAddFriendMutation,
  // lazy
  useLazyFindUserQuery,
} = userApi;
