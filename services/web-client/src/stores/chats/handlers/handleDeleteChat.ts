import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { API_CHAT, HttpRequestMethods } from "@/constants/http";

export const handleDeleteChat = async (id: string) => {
  try {
    const result = await sendHttpRequest<void, { id: string}>({
      url: API_CHAT(id),
      method: HttpRequestMethods.Get,
    });
    return result.data;
  } catch (err) {
    console.error("Failed to get chats", err);
    throw err;
  }
};