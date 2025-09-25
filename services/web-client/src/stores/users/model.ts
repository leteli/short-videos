import { usersDomain } from "../domains";
import {
  IMatchedUsersStore,
  IUserSearchQuery,
  IUserSearchResponse,
} from "./types";
import { handleSearchUsers } from "./handlers/handleSearchUsers";

export const $matchedUsersStore = usersDomain.createStore<IMatchedUsersStore>({
  users: [],
  page: 1,
  hasMore: false,
});

export const $query = usersDomain.createStore('');
export const changeQueryEvent = usersDomain.createEvent<string>();

export const searchUsersFx = usersDomain.createEffect<
  IUserSearchQuery,
  IUserSearchResponse
>(handleSearchUsers);

export const loadNextUsersPage = usersDomain.createEvent();
