import { messagesDomain } from "@/stores/domains";
import { handleGetChatMessages } from "./handlers/handleGetChatMessages";
import {
  GetMessagesQuery,
  GetMessagesResponse,
  IMessagesStore,
  ReceiveMessagePayload,
  IMessage,
  SendMessageResult,
} from "./types";

export const $messagesStore = messagesDomain.createStore<IMessagesStore>({
  messages: [],
  hasMore: false,
  cursor: undefined,
});

export const resetMessagesEvent = messagesDomain.createEvent();
$messagesStore.reset(resetMessagesEvent);

export const getChatMessagesFx = messagesDomain.createEffect<
  { chatId: string; query?: GetMessagesQuery },
  GetMessagesResponse | undefined
>(handleGetChatMessages);

export const loadNextMessagesPage = messagesDomain.createEvent();

export const sendMessageEvent =
  messagesDomain.createEvent<IMessage>();

export const receiveMessageEvent = messagesDomain.createEvent<ReceiveMessagePayload>();
export const getSendMessageResultEvent = messagesDomain.createEvent<SendMessageResult>();
