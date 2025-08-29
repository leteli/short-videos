import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { API_VERIFY_USERNAME, HttpRequestMethods } from "@/constants/http";
import { IVerifyUsername } from "../types";

export const handleVerifyUsername = async ({ username }: IVerifyUsername) => {
  try {
    await sendHttpRequest<void, IVerifyUsername>({
      url: API_VERIFY_USERNAME,
      method: HttpRequestMethods.Get,
      params: { username },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
