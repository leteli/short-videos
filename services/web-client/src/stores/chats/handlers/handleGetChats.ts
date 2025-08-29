import { sendServerHttpRequest } from "@/utils/http/sendServerHttpRequest";
import { HttpRequestMethods } from "@/constants/http";
import { API_CHATS } from "@/constants/serverHttp";
import { IChatsStore, IGetChatsParams } from "../types";

export const handleGetChats = async (params: IGetChatsParams) => {
  try {
    const result = await sendServerHttpRequest<IGetChatsParams, IChatsStore>({
      url: API_CHATS,
      method: HttpRequestMethods.Get,
      params,
    });
    console.log('handleGetChats data', result?.data);
    return result.data;
  } catch (err) {
    console.error("Failed to get chats", err);
  }
};
