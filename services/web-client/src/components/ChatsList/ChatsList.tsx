"use client";
import { useUnit } from "effector-react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { $chatsStore, $chatStore, getChatsFx, openChatEvent, loadNextChatsPage } from "@/stores";
import { useBool } from "@/hooks/useBool";
import { Text, Variants, Tags } from "../common/Text/Text";
import { Loader, LoaderSizes } from "../common/Loader/Loader";
import { Button, ButtonSize, ButtonVariant } from "../common/Button/Button";
import styles from "./ChatsList.module.scss";
import { AddChatModal } from "../modals/AddChatModal";

export const ChatsList = () => {
  const { chatsStore, getChatsPending, openChat, loadNextPage } = useUnit({
    chatsStore: $chatsStore,
    chatStore: $chatStore,
    getChatsPending: getChatsFx.pending,
    openChat: openChatEvent,
    loadNextPage: loadNextChatsPage,
  });
  const addChatModal = useBool();

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading: getChatsPending,
    hasNextPage: Boolean(chatsStore.hasMore),
    onLoadMore: loadNextPage,
    disabled: getChatsPending || !chatsStore.hasMore || !chatsStore.cursor,
    rootMargin: "0px 0px 100px 0px",
    delayInMs: 500,
  });

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
      <div className={styles.chatsList} ref={rootRef}>
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
        {chatsStore.hasMore && (
          <div ref={infiniteRef} className={styles.loaderWrapper}>
            <Loader size={LoaderSizes.small} />
          </div>
        )}
      </div>
      <AddChatModal
        isOpen={addChatModal.value}
        onClose={addChatModal.onFalse}
      />
    </div>
  );
};
