import { $matchedUsers, searchUsersFx } from "./model";

$matchedUsers.on(searchUsersFx.doneData, (state, payload) => {
  if (state.page === 1) {
    return { ...state, ...payload };
  }
  return { ...state, users: [...state.users, ...payload.users] };
});
