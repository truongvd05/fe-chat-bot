import baseQueryWithReauth from "@/services/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Conversation"],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => "/conversation/",
      providesTags: ["Conversation"],
    }),
    getBotConversation: builder.query({
      query: (conversationId) => `/conversation/bot/${conversationId}`,
      providesTags: (result, error, id) => [{ type: "Conversation", id }],
    }),
    getBotConversations: builder.query({
      query: (type) => `/conversation/${type}`,
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
  }),
});

export const {
  useGetBotConversationQuery,
  useGetBotConversationsQuery,
  useGetConversationQuery,
  useGetConversationsQuery,
  useCreateDirectConversationMutation,
  // lazy
  useLazyGetBotConversationQuery,
  useLazyGetBotConversationsQuery,
  useLazyGetConversationQuery,
  useLazyGetConversationsQuery,
} = conversationApi;
