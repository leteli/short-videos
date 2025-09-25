import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { API_SIGNUP_CONFIRM, HttpRequestMethods } from "@/constants/http";
import { IConfirmSignupRequest, IConfirmSignupResponse } from "../types";

export const handleConfirmSignup = async (data: IConfirmSignupRequest) => {
  try {
    const result = await sendHttpRequest<
      IConfirmSignupRequest,
      IConfirmSignupResponse
    >({
      url: API_SIGNUP_CONFIRM,
      method: HttpRequestMethods.Post,
      data,
    });
    return result.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
