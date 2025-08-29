import { usersDomain } from "../domains";
import {
  IMatchedUsersStore,
  IUserSearchQuery,
  IUserSearchResponse,
} from "./types";
import { handleSearchUsers } from "./handlers/handleSearchUsers";

export const $matchedUsers = usersDomain.createStore<IMatchedUsersStore>({
  users: [],
  page: 1,
});
export const searchUsersFx = usersDomain.createEffect<
  IUserSearchQuery,
  IUserSearchResponse
>(handleSearchUsers);

export const setUsersSearchPage = usersDomain.createEvent<number>();
