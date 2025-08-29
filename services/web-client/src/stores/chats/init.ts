import { $chatsStore, getChatsFx, createDirectChatFx, createGroupChatFx, deleteChatFx, $chatStore , openChatEvent } from "./model";

$chatsStore.on(getChatsFx.doneData, (state, payload) => {

    if (!payload?.chats) {
        return state; 
    }
    return {
        ...payload,
        chats: [...state.chats, ...payload.chats],
    }
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
    chats: state.chats.filter((chat) => chat.id !== payload.id)
  }
});
