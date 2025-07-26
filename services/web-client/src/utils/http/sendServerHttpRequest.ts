"use server";
import axios, { Method, CancelToken, AxiosResponse } from "axios";
import {
  getAxiosErrorMessage,
} from "./handleApiError";

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
): Promise<AxiosResponse<R> | undefined> => {
  const { url, method, data, params, headers = {}, cancelToken, signal } = args;

  try {
    const result = await axios({
      url,
      method,
      data,
      params,
      headers,
      cancelToken,
      signal,
      withCredentials: true,
    });
    return result;
  } catch (err) {
    console.error("[HttpServerRequestError]", err);
    const errorMessage = getAxiosErrorMessage(err);
    throw new Error(errorMessage);
  }
};
