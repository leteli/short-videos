import { chatsDomain } from "../domains";

import {
  IChatsStore,
  IDirectChatInfo,
  IGroupChatInfo,
  ICreateDirectChatRequest,
  ICreateDirectChatResponse,
  ICreateGroupChatRequest,
  ICreateGroupChatResponse,
  IGetChatsParams,
} from "./types";
import { handleGetChats } from "./handlers/handleGetChats";
import { handleCreateDirectChat } from "./handlers/handleCreateDirectChat";
import { handleCreateGroupChat } from "./handlers/handleCreateGroupChat";
import { handleDeleteChat } from "./handlers/handleDeleteChat";

export const $chatsStore = chatsDomain.createStore<IChatsStore>({
  chats: [],
  hasMore: false,
  cursor: undefined,
});
export const resetChatsStore = chatsDomain.createEvent();
$chatsStore.reset(resetChatsStore);

export const getChatsFx = chatsDomain.createEffect<
  IGetChatsParams,
  IChatsStore | undefined
>(handleGetChats);
export const loadNextChatsPage = chatsDomain.createEvent();

export const createDirectChatFx = chatsDomain.createEffect<
  ICreateDirectChatRequest,
  ICreateDirectChatResponse
>(handleCreateDirectChat);

export const createGroupChatFx = chatsDomain.createEffect<
  ICreateGroupChatRequest,
  ICreateGroupChatResponse
>(handleCreateGroupChat);

export const deleteChatFx = chatsDomain.createEffect<string, { id: string }>(
  handleDeleteChat
);

export const $chatStore = chatsDomain.createStore<{
  chat: IDirectChatInfo | IGroupChatInfo | null;
}>({
  chat: null,
});
export const resetChatStore = chatsDomain.createEvent();
$chatStore.reset(resetChatStore);

export const openChatEvent = chatsDomain.createEvent<IDirectChatInfo | IGroupChatInfo>();
