"use server";
import { cookies } from "next/headers";
import axios, { Method, CancelToken, AxiosResponse } from "axios";
import {
  getAxiosErrorMessage,
  getAxiosErrorStatusCode,
} from "./handleApiError";
import { AUTH_COOKIE_KEY } from "@/constants/http";
import { handleLogout } from "@/stores/auth/handlers/handleLogout";


interface IArgs<T> {
  method: Method;
  url: string;
  data?: T;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  cancelToken?: CancelToken;
  signal?: AbortSignal;
}

export const sendServerHttpRequest = async <T, R>(
  args: IArgs<T>
): Promise<AxiosResponse<R>> => {
  const { url, method, data, params, headers = {}, cancelToken, signal } = args;

  const token = (await cookies()).get(AUTH_COOKIE_KEY)?.value;

  try {
    const result = await axios({
      url,
      method,
      data,
      params,
      headers: {
        ...headers,
        Cookie: `${AUTH_COOKIE_KEY}=${token}`,
      },
      cancelToken,
      signal,
      withCredentials: true,
    });
    return result;
  } catch (err) {
    console.error("[HttpServerRequestError]", err);
    const statusCode = getAxiosErrorStatusCode(err);
    if (statusCode && statusCode === 401) {
      handleLogout()
    }
    const errorMessage = getAxiosErrorMessage(err);
    throw new Error(errorMessage);
  }
};
