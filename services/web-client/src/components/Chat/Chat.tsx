"use client";
import { useEffect, KeyboardEvent } from "react";
import { useUnit } from "effector-react";
import clsx from "clsx";
import { $chatStore, getChatMessagesFx, resetMessagesEvent } from "@/stores";
import { Input, InputVariant } from "../common/Input/Input";
import { Text } from "../common/Text/Text";
import styles from "./Chat.module.scss";
import { ChatTypes } from "@/stores/chats/types";
import { MessagesList } from "../MessagesList/MessagesList";
import { useChatSubscribe } from "@/hooks/useChatSubscribe";

export const Chat = () => {
  const { chat } = useUnit($chatStore);
  const { getChatMessages, resetMessages } = useUnit({
    getChatMessages: getChatMessagesFx,
    resetMessages: resetMessagesEvent,
  });

  const { handleSendMessage, handleJoinChat, handleLeaveChat } =
    useChatSubscribe();

  useEffect(() => {
    const chatId = chat?.id;
    if (!chatId) return;
    handleJoinChat({ chatId });
    getChatMessages({ chatId });
    return () => {
      handleLeaveChat({ chatId });
      resetMessages();
    };
  }, [chat?.id, handleJoinChat, handleLeaveChat]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const text = e.currentTarget?.value;
    if (!text?.trim()) return;
    handleSendMessage({ text });
    e.currentTarget.value = "";
  };

  if (!chat) {
    return (
      <div className={clsx(styles.container, styles.noChatWrapper)}>
        <div className={styles.textLabel}>
          <Text>Select a chat to start messaging</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {chat?.type === ChatTypes.direct && <Text>{chat.peer.username}</Text>}
      </div>
      <MessagesList />
      <div className={styles.inputWrapper}>
        <Input
          variant={InputVariant.large}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};
