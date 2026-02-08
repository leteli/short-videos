import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { HttpRequestMethods, API_CHAT_MESSAGES } from "@/constants/http";
import { GetMessagesQuery, GetMessagesResponse } from "../types";

export const handleGetChatMessages = async ({
  chatId,
  query = {},
}: {
  chatId: string;
  query?: GetMessagesQuery;
}) => {
  try {
    const response = await sendHttpRequest<
      GetMessagesQuery,
      GetMessagesResponse
    >({
      url: API_CHAT_MESSAGES(chatId),
      method: HttpRequestMethods.Get,
      params: { ...query },
    });
    return response.data;
  } catch (err) {
    console.error("Failed to get messages", err);
  }
};
