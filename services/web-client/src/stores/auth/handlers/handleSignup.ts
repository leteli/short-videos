import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { API_SIGNUP, HttpRequestMethods } from "@/constants/http";
import { ISignupRequest, ISignupResponse } from "../types";

export const handleSignup = async (data: ISignupRequest) => {
  try {
    const result = await sendHttpRequest<ISignupRequest, ISignupResponse>({
      url: API_SIGNUP,
      method: HttpRequestMethods.Post,
      data,
    });
    if (!result?.data?.expiresAt) {
      throw new Error();
    }
    return result?.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
