import { sendHttpRequest } from "@/utils/http/sendHttpRequest";
import { API_USERS, HttpRequestMethods } from "@/constants/http";
import {
  IUserSearchQuery,
  IUserSearchResponse,
} from "../types";

export const handleSearchUsers = async (params: IUserSearchQuery) => {
  try {
    const result = await sendHttpRequest<IUserSearchQuery, IUserSearchResponse>({
      url: API_USERS,
      method: HttpRequestMethods.Get,
      params: { ...params },
    });
    return result.data;
  } catch (err) {
    console.error('[handleSearchUsers]', err);
    throw err;
  }
};
