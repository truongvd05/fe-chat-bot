import baseQueryWithReauth from "@/services/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getMessage: builder.query({
      query: (conversationId) => `/message/conversations/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: "Message", id: conversationId },
      ],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, content }) => ({
        url: `/message/conversations/${conversationId}`,
        method: "POST",
        body: { content },
      }),
      // fake message gửi
      async onQueryStarted(
        { conversationId, content },
        { dispatch, queryFulfilled },
      ) {
        const tempId = Date.now();
        const result = dispatch(
          messageApi.util.updateQueryData(
            "getMessage",
            conversationId,
            (draft) => {
              draft.push({ id: tempId, content, isSending: true });
            },
          ),
        );
        try {
          const { data: newMessage } = await queryFulfilled;
          //   thay thể fake bằng cái thật
          dispatch(
            messageApi.util.updateQueryData(
              "getMessage",
              conversationId,
              (draft) => {
                const index = draft.findIndex((m) => m.id === tempId);
                if (index !== -1) {
                  draft[index] = newMessage;
                }
              },
            ),
          );
        } catch (err) {
          // lỗi thì rollback
          result.undo();
        }
      },
    }),
    // fake message edit
    editMessage: builder.mutation({
      query: ({ messageId, content }) => ({
        url: `/message/${messageId}`,
        method: "PUT",
        body: { content },
      }),
      async onQueryStarted(
        { messageId, content },
        { dispatch, queryFulfilled },
      ) {
        const result = dispatch(
          messageApi.util.updateQueryData(
            "getMessage",
            conversationId,
            (draft) => {
              const message = draft.find((m) => m.id === messageId);
              if (message) {
                message.content = content;
                message.isEditing = true;
              }
            },
          ),
        );
        try {
          const { data: updateMessage } = await queryFulfilled;
          dispatch(
            messageApi.util.updateQueryData(
              "getMessage",
              conversationId,
              (draft) => {
                const index = draft.findIndex((m) => m.id === messageId);
                if (index !== -1) {
                  draft[index] = updateMessage;
                }
              },
            ),
          );
        } catch (err) {
          result.undo();
        }
      },
    }),
  }),
});

export const { useGetMessageQuery, useSendMessageMutation } = messageApi;
