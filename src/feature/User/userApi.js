import baseQueryWithReauth from "@/services/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { updateUser } from "./userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Friends", "Friends-request"],
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
    toggleAiSuggest: builder.mutation({
      query: (aiSuggest) => ({
        url: "user/ai-suggest",
        method: "PATCH",
        body: { aiSuggest },
      }),
      invalidatesTags: ["User"],
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
    unFriend: builder.mutation({
      query: ({ targetUserId }) => ({
        url: "user/unfriend",
        method: "POST",
        body: { targetUserId },
      }),
      invalidatesTags: ["Friends"],
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
      invalidatesTags: ["Friends-request"],
    }),
    acceptFriend: builder.mutation({
      query: ({ requestId }) => ({
        url: "user/accept-friend",
        body: { requestId },
        method: "POST",
      }),
      invalidatesTags: ["Friends-request", "Friends"],
    }),
    rejectFriend: builder.mutation({
      query: ({ requestId }) => ({
        url: "user/reject-friend",
        body: { requestId },
        method: "POST",
      }),
      invalidatesTags: ["Friends-request", "Friends"],
    }),
    resendVerifyEmail: builder.mutation({
      query: (data) => ({
        url: "auth/resen-verify-email",
        method: "POST",
        body: data,
      }),
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => {
        return {
          url: `user/avatar`,
          method: "PATCH",
          body: formData,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data));
        } catch {}
      },
    }),
    editUser: builder.mutation({
      query: (formData) => ({
        url: `user`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // update state user khi sửa thông tin
          dispatch(updateUser(data));
        } catch {}
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetFriendQuery,
  useFindUserQuery,
  useGetFriendRequestQuery,
  useLazyFindUserQuery,
  useLogoutMutation,
  useChangePasswordMutation,
  useAddFriendMutation,
  useAcceptFriendMutation,
  useRejectFriendMutation,
  useResendVerifyEmailMutation,
  useUploadAvatarMutation,
  useEditUserMutation,
  useUnFriendMutation,
  useToggleAiSuggestMutation,
  // lazy
} = userApi;
