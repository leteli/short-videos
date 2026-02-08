import {
  $messagesStore,
  getChatMessagesFx,
  loadNextMessagesPage,
  sendMessageEvent,
  receiveMessageEvent,
  getSendMessageResultEvent,
} from "./model";
import { sample } from "effector";
import { $chatStore } from "../chats/model";
import { IChatInfo } from "../chats/types";
import { MessageStatus } from "./types";

$messagesStore
  .on(getChatMessagesFx.doneData, (state, payload) => {
    if (!payload) {
      return state;
    }
    const { messages, hasMore, cursor } = payload;
    return {
      messages: [...state.messages, ...messages],
      hasMore,
      cursor,
    };
  })
  .on(receiveMessageEvent, (state, payload) => {
    if (!payload?.message) {
      return state;
    }
    return {
      ...state,
      messages: [payload.message, ...state.messages],
    }
  })
  .on(sendMessageEvent, (state, payload) => {
    if (!payload) return state;
    return {
      ...state,
      messages: [payload, ...state.messages]
    }
  })
  .on(getSendMessageResultEvent, (state, payload) => {
    const messages = [...state.messages];
    const messageIndex = messages.findIndex(({ clientMessageId }) => clientMessageId === payload.message.clientMessageId);
    if (messageIndex === -1) {
      return state;
    }
    if (payload.ok) {
      messages[messageIndex] = { ...payload.message, status: MessageStatus.Sent };
    } else {
      messages[messageIndex].status = MessageStatus.Failed;
    }
    return { ...state, messages };
  });


sample({
  clock: loadNextMessagesPage,
  source: {
    chatStore: $chatStore,
    messagesStore: $messagesStore,
  },
  filter: ({ chatStore, messagesStore }) =>
    !!chatStore.chat?.id &&
    !!messagesStore.hasMore &&
    !!messagesStore.cursor,
  fn: ({ chatStore, messagesStore }) => {
    const chat = chatStore.chat as IChatInfo;
    return {
      chatId: chat.id,
      query: {
        cursor: messagesStore.cursor,
      },
    };
  },
  target: getChatMessagesFx,
});
