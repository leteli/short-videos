import { sendServerHttpRequest } from "@/utils/http/sendServerHttpRequest";
import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { HttpRequestMethods } from "@/constants/http";
import { API_CHATS_SERVER  } from "@/constants/serverHttp";
import { API_CHATS } from "@/constants/http";
import { IChatsStore, IGetChatsParams } from "../types";

export const handleGetChats = async (params: IGetChatsParams) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mode, serverSide, ...rest } = params;
    const sendRequest = serverSide ? sendServerHttpRequest : sendHttpRequest;
    const result = await sendRequest<IGetChatsParams, IChatsStore>({
      url: serverSide ? API_CHATS_SERVER : API_CHATS,
      method: HttpRequestMethods.Get,
      params: rest,
    });
    return result.data;
  } catch (err) {
    console.error("Failed to get chats", err);
  }
};
