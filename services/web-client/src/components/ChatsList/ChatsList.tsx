"use client";
import { useUnit } from "effector-react";
import { $chatsStore, $chatStore, getChatsFx, openChatEvent } from "@/stores";
import { useBool } from "@/hooks/useBool";
import { Text, Variants, Tags } from "../common/Text/Text";
import { Loader } from "../common/Loader/Loader";
import { Button, ButtonSize, ButtonVariant } from "../common/Button/Button";
import styles from "./ChatsList.module.scss";
import { AddChatModal } from "../modals/AddChatModal";

export const ChatsList = () => {
  const { chatsStore, getChatsPending, openChat } = useUnit({
    chatsStore: $chatsStore,
    chatStore: $chatStore,
    getChatsPending: getChatsFx.pending,
    openChat: openChatEvent,
  });
  const addChatModal = useBool();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text variant={Variants.h2} tag={Tags.h2}>
          Chats
        </Text>
        <Button
          variant={ButtonVariant.primary}
          size={ButtonSize.small}
          text="New chat"
          onClick={addChatModal.onTrue}
        />
      </div>
      <div className={styles.chatsList}>
        {getChatsPending && !chatsStore.chats.length && <Loader />}
        {!getChatsPending && chatsStore.chats.length === 0 && (
          <div className={styles.emptyWrapper}>
            <Text className={styles.emptyText}>No chats yet</Text>
          </div>
        )}
        {chatsStore.chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => openChat(chat)}
            className={styles.listItem}
          >
            {chat.type === "direct" && <Text>{chat.peer.username}</Text>}
            {chat.type === "group" && <Text>{chat.title || "Group Chat"}</Text>}
          </div>
        ))}
      </div>
      <AddChatModal isOpen={addChatModal.value} onClose={addChatModal.onFalse}/>
    </div>
  );
};
