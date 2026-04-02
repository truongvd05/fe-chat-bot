import baseQueryWithReauth from "@/services/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Conversation", "botConversation"],
  endpoints: (builder) => ({
    getBotConversation: builder.query({
      query: (conversationId) => `/conversation/bot/${conversationId}`,
      providesTags: (result, error, id) => [{ type: "botConversation", id }],
    }),
    getBotConversations: builder.query({
      query: (type) => `/conversation/${type}`,
      providesTags: ["botConversation"],
    }),
    getConversations: builder.query({
      query: () => "/conversation/",
      providesTags: ["Conversation"],
    }),
    getConversation: builder.query({
      query: (conversationId) => `/conversation/${conversationId}`,
      providesTags: (result, error, id) => [{ type: "Conversation", id }],
    }),
    createDirectConversation: builder.mutation({
      query: (targetUserId) => ({
        url: `/conversation/direct`,
        method: "POST",
        body: { targetUserId },
      }),
      invalidatesTags: [{ type: "Conversation" }],
    }),
    createGroupConversation: builder.mutation({
      query: ({ name, memberIds }) => ({
        url: `/conversation/group`,
        method: "POST",
        body: { name, members: memberIds },
      }),
      invalidatesTags: [{ type: "Conversation" }],
    }),
    createBotConversation: builder.mutation({
      query: (title) => ({
        url: `/conversation/bot`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: [{ type: "botConversation" }],
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
      invalidatesTags: [{ type: "Conversation" }],
      async onQueryStarted(
        { conversationId, memberIds },
        { dispatch, queryFulfilled },
      ) {
        // thêm member vào cache ngay
        const patchResult = dispatch(
          conversationApi.util.updateQueryData(
            "getConversation",
            conversationId,
            (draft) => {
              // tránh duplicate nếu trùng id
              const existingIds = draft.participants.map((m) => m.userId);
              const newMembers = memberIds
                .filter((id) => !existingIds.includes(id))
                .map((id) => ({ id, name: "..." }));
              draft.participants.push(...newMembers);
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo(); // rollback nếu backend fail
        }
      },
    }),
    kickMembersInConversation: builder.mutation({
      query: ({ conversationId, memberIds }) => ({
        url: `/participants/${conversationId}`,
        method: "DELETE",
        body: { members: memberIds },
      }),
      invalidatesTags: [{ type: "Conversation" }],
      async onQueryStarted(
        { conversationId, memberIds },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          conversationApi.util.updateQueryData(
            "getConversation",
            conversationId,
            (draft) => {
              draft.members = draft.participants.filter(
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
      invalidatesTags: [{ type: "Conversation" }],
    }),
  }),
});

export const {
  useGetBotConversationQuery,
  useGetBotConversationsQuery,
  useGetConversationQuery,
  useGetConversationsQuery,
  useCreateDirectConversationMutation,
  useCreateBotConversationMutation,
  useCreateGroupConversationMutation,
  useAddMembersInConversationMutation,
  useKickMembersInConversationMutation,
  usePromoteToAdminConversationMutation,
  // lazy
  useLazyGetBotConversationQuery,
  useLazyGetBotConversationsQuery,
  useLazyGetConversationQuery,
  useLazyGetConversationsQuery,
  useLazySearchAvailableUsersQuery,
} = conversationApi;
