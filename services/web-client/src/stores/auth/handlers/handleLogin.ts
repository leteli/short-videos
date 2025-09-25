import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { API_LOGIN, HttpRequestMethods } from "@/constants/http";
import { ILoginRequest, ILoginResponse } from "../types";

export const handleLogin = async (data: ILoginRequest) => {
  try {
    const result = await sendHttpRequest<ILoginRequest, ILoginResponse>({
      url: API_LOGIN,
      method: HttpRequestMethods.Post,
      data,
    });
    return result.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
