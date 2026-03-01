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
    createBotConversation: builder.mutation({
      query: (title) => ({
        url: `/conversation/bot`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: [{ type: "botConversation" }],
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
  // lazy
  useLazyGetBotConversationQuery,
  useLazyGetBotConversationsQuery,
  useLazyGetConversationQuery,
  useLazyGetConversationsQuery,
} = conversationApi;
