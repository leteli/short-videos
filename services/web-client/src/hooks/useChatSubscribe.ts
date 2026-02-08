import { useCallback } from "react";
import { useUnit } from "effector-react";
import { useSocketSubscribe } from "./useSocketSubscribe";
import { SocketEvents, useSocket } from "@/contexts/SocketContext";
import {
  sendMessageEvent,
  receiveMessageEvent,
  $chatStore,
  $authStore,
  getSendMessageResultEvent,
} from "@/stores";
import {
  IMessage,
  SendMessagePayload,
  MessageTypes,
  MessageStatus,
  SendMessageResult,
} from "@/stores/messages/types";
import { generateClientMessageId } from "@/utils/helpers/generateId";
import { socketHandlerType } from "@/utils/types";
import { ChatTypes } from "@/stores/chats/types";

export const useChatSubscribe = () => {
  const { emit } = useSocket();
  const { sendMessage, receiveMessage, getSendMessageResult } = useUnit({
    sendMessage: sendMessageEvent,
    getSendMessageResult: getSendMessageResultEvent,
    receiveMessage: receiveMessageEvent,
  });
  const chatStore = useUnit($chatStore);
  const authStore = useUnit($authStore);

  useSocketSubscribe({
    event: SocketEvents.MessageReceived,
    handler: receiveMessage as socketHandlerType,
  });

  const handleSendMessage = async (payload: SendMessagePayload) => {
    if (!chatStore?.chat || !authStore?.user) return;
    const newMessage: IMessage = {
      status: MessageStatus.Processing,
      type: payload.media ? MessageTypes.media : MessageTypes.text,
      clientMessageId: generateClientMessageId(),
      senderId: authStore.user.id as string,
      chatId: chatStore.chat.id as string,
      chatType: chatStore.chat.type as ChatTypes,
      createdAtLocal: new Date(),
    };
    if (payload.text) {
      newMessage.text = payload.text;
    }
    if (payload.media) {
      newMessage.media = payload.media;
    }
    sendMessage(newMessage);
    try {
      const result = await emit(SocketEvents.MessageSent, newMessage);
      getSendMessageResult(result as SendMessageResult);
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinChat = useCallback(({ chatId }: { chatId: string }) =>
    emit(SocketEvents.ChatJoined, { chatId }), [emit]);

  const handleLeaveChat = useCallback(({ chatId }: { chatId: string }) =>
    emit(SocketEvents.ChatLeft, { chatId }), [emit]);

  return {
    handleJoinChat,
    handleLeaveChat,
    handleSendMessage,
  };
};
