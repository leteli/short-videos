import axios, { Method, CancelToken, AxiosResponse } from "axios";
import { getAxiosErrorMessage } from "./handleApiError";

interface IArgs<T> {
  method: Method;
  url: string;
  data?: T;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  cancelToken?: CancelToken;
  signal?: AbortSignal;
  withCredentials?: boolean;
}

export const sendHttpRequest = async <T, R>(
  args: IArgs<T>
): Promise<AxiosResponse<R>> => {
  const { url, method, data, params, headers = {}, cancelToken, signal, withCredentials = true } = args;

  try {
    const result = await axios({
      url,
      method,
      data,
      params,
      headers,
      cancelToken,
      signal,
      withCredentials,
    });
    return result;
  } catch (err) {
    console.error('[HttpRequestError]', err);
    const errorMessage = getAxiosErrorMessage(err);
    throw new Error(errorMessage);
  }
};
