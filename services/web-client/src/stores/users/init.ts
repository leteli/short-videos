import { sample } from "effector";
import { $matchedUsersStore, searchUsersFx, $query, changeQueryEvent, loadNextUsersPage } from "./model";
import { FetchItemshModes } from "@/constants/http";

$matchedUsersStore.on(searchUsersFx.done, (state, { params, result }) => {
  const users = params.mode === FetchItemshModes.append ? [...state.users, ...result.users] : result.users;
  return { ...result, users };
});

$query.on(changeQueryEvent, (_, payload) => payload);
sample({
  clock: $query,
  source: $matchedUsersStore,
  fn: ({ page }, query) => {
    return { searchQuery: query, page, mode: FetchItemshModes.replace };
  },
  target: searchUsersFx,
})

sample({
  clock: loadNextUsersPage,
  source: { store: $matchedUsersStore, query: $query },
  filter: ({ store }) => store.hasMore,
  fn: ({ store, query }) => {
    return { searchQuery: query, page: store.page + 1, mode: FetchItemshModes.append };
  },
  target: searchUsersFx,
});
