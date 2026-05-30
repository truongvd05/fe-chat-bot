import baseQueryWithReauth from "@/services/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Conversation", "group"],
  endpoints: (builder) => ({
    getGroupConversation: builder.query({
      query: () => "/conversation/groups",
      providesTags: ["group"],
    }),
    getConversations: builder.query({
      query: () => "/conversation/",
      providesTags: ["Conversation"],
    }),
    getConversation: builder.query({
      query: (conversationId) => `/conversation/${conversationId}`,
      providesTags: (result, error, id) => ["Conversation"],
    }),
    createDirectConversation: builder.mutation({
      query: (targetUserId) => ({
        url: `/conversation/direct`,
        method: "POST",
        body: { targetUserId },
      }),
      invalidatesTags: ["Conversation"],
    }),
    createGroupConversation: builder.mutation({
      query: ({ name, memberIds }) => ({
        url: `/conversation/group`,
        method: "POST",
        body: { name, members: memberIds },
      }),
      invalidatesTags: ["Conversation"],
    }),
    searchAvailableUsers: builder.query({
      query: ({ conversationId, q }) => ({
        url: `/conversation/${conversationId}/available-users`,
        params: { q },
      }),
    }),
    addMembersInConversation: builder.mutation({
      query: ({ conversationId, memberIds }) => ({
        url: `/participants/${conversationId}`,
        method: "POST",
        body: { members: memberIds },
      }),
      invalidatesTags: ["Conversation"],
    }),
    kickMembersInConversation: builder.mutation({
      query: ({ conversationId, memberIds }) => ({
        url: `/participants/${conversationId}`,
        method: "DELETE",
        body: { members: memberIds },
      }),
      invalidatesTags: ["Conversation"],
      async onQueryStarted(
        { conversationId, memberIds },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          conversationApi.util.updateQueryData(
            "getConversation",
            conversationId,
            (draft) => {
              draft.participants = draft.participants.filter(
                (m) => !memberIds.includes(m.userId),
              );
            },
          ),
        );
        try {
          // 2. Thực hiện mutation
          await queryFulfilled;
          // Nếu success thì không làm gì thêm (cache đã update)
        } catch (err) {
          // 3. Nếu backend lỗi, mất mạng...vv, thì rollback
          patchResult.undo();
        }
      },
    }),
    promoteToAdminConversation: builder.mutation({
      query: ({ conversationId, memberIds }) => ({
        url: `/conversation/${conversationId}/promoteToAdmin`,
        method: "POST",
        body: { members: memberIds },
      }),
      invalidatesTags: ["Conversation"],
    }),
    leaveGroup: builder.mutation({
      query: ({ conversationId }) => ({
        url: `/conversation/${conversationId}/leaveGroup`,
        method: "POST",
      }),
      invalidatesTags: ["group"],
    }),
  }),
});

export const {
  useGetConversationQuery,
  useGetConversationsQuery,
  useGetGroupConversationQuery,
  useCreateDirectConversationMutation,
  useCreateGroupConversationMutation,
  useAddMembersInConversationMutation,
  useKickMembersInConversationMutation,
  usePromoteToAdminConversationMutation,
  useLeaveGroupMutation,
  // lazy
  useLazyGetConversationQuery,
  useLazyGetConversationsQuery,
  useLazySearchAvailableUsersQuery,
} = conversationApi;
