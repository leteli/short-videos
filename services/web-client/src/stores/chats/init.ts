import {
  $chatsStore,
  getChatsFx,
  createDirectChatFx,
  createGroupChatFx,
  deleteChatFx,
  $chatStore,
  openChatEvent,
  resetChatStore,
  resetChatsStore,
  loadNextChatsPage,
} from "./model";
import { $authStore } from "../auth/model";
import { sample } from "effector";
import { FetchItemshModes } from "@/constants/http";

$chatsStore.on(getChatsFx.done, (state, { params, result }) => {
  if (!result?.chats) {
    return state;
  }
  const chats =
    params.mode === FetchItemshModes.append
      ? [...state.chats, ...result.chats]
      : result.chats;
  return { ...result, chats };
});

$chatsStore.on(createDirectChatFx.doneData, (state, payload) => {
  if (!payload?.chat) {
    return state;
  }
  return {
    ...state,
    ...payload,
    chats: [payload.chat, ...state.chats],
  };
});
$chatsStore.on(createGroupChatFx.doneData, (state, payload) => {
  if (!payload?.chat) {
    return state;
  }
  return {
    ...state,
    ...payload,
    chats: [payload.chat, ...state.chats],
  };
});

$chatStore.on(createDirectChatFx.doneData, (state, payload) => {
  if (!payload.chat) {
    return state;
  }
  return { chat: payload.chat };
});

$chatStore.on(openChatEvent, (_, payload) => {
  return { chat: payload };
});

$chatsStore.on(deleteChatFx.doneData, (state, payload) => {
  if (!payload.id) {
    return state;
  }
  return {
    ...state,
    ...payload,
    chats: state.chats.filter((chat) => chat.id !== payload.id),
  };
});

sample({
  clock: $authStore,
  filter: (store) => {
    return !!store.user;
  },
  target: [resetChatStore, resetChatsStore],
});

sample({
  clock: loadNextChatsPage,
  source: $chatsStore,
  filter: (store) => !!store.hasMore && !!store.cursor,
  fn: ({ cursor }) => {
    return {
      cursor,
      mode: FetchItemshModes.append,
    }
  },
  target: getChatsFx,
});
