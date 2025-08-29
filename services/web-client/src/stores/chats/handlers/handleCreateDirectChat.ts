import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { API_DIRECT_CHATS, HttpRequestMethods } from "@/constants/http";
import { ICreateDirectChatRequest, ICreateDirectChatResponse } from "../types";

export const handleCreateDirectChat = async (data: ICreateDirectChatRequest) => {
  try {
    console.log("handleCreateDirectChat", data);
    const result = await sendHttpRequest<
      ICreateDirectChatRequest,
      ICreateDirectChatResponse
    >({
      url: API_DIRECT_CHATS,
      method: HttpRequestMethods.Post,
      data,
    });
    console.log("handleCreateDirectChat result", result);
    return result.data;
  } catch (err) {
    console.error("Failed to create a chat", err);
    throw err;
  }
};
