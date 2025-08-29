import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { API_GROUP_CHATS, HttpRequestMethods } from "@/constants/http";
import { ICreateGroupChatRequest, ICreateGroupChatResponse } from "../types";

export const handleCreateGroupChat = async (data: ICreateGroupChatRequest) => {
  try {
    const result = await sendHttpRequest<
      ICreateGroupChatRequest,
      ICreateGroupChatResponse
    >({
      url: API_GROUP_CHATS,
      method: HttpRequestMethods.Post,
      data,
    });
    return result.data;
  } catch (err) {
    console.error("Failed to create a chat", err);
    throw err;
  }
};
