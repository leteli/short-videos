"use client";

import {useMemo } from "react";
import { useUnit } from "effector-react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import {
  $authStore,
  $messagesStore,
  getChatMessagesFx,
  loadNextMessagesPage,
} from "@/stores";
import { Message } from "../Message/Message";
import { useBottomScroll } from "@/hooks/useBottomScroll";
import { Loader, LoaderSizes } from "../common/Loader/Loader";
import styles from "./MessagesList.module.scss";
import { IMessage } from "@/stores/messages/types";

export const MessagesList = () => {

  const { user } = useUnit($authStore);
  const { messagesStore, getMessagesPending, loadNextPage } = useUnit({
    messagesStore: $messagesStore,
    getMessagesPending: getChatMessagesFx.pending,
    loadNextPage: loadNextMessagesPage,
  });

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading: getMessagesPending,
    hasNextPage: Boolean(messagesStore.hasMore),
    onLoadMore: loadNextPage,
    disabled:
      getMessagesPending || !messagesStore.hasMore || !messagesStore.cursor,
    rootMargin: "0px 0px 100px 0px",
    delayInMs: 500,
  });

  const { rootRefSetter, handleScroll } = useBottomScroll<IMessage>({
    rootRef,
    items: messagesStore.messages.toReversed(),
    getId: (message: IMessage) => message.clientMessageId,
    isMine: (message: IMessage) => !!user?.id && message.senderId === user?.id,
  });

  const messagesList = useMemo(() => {
    return messagesStore.messages.toReversed().map((message) => {
      return (
        <Message
          key={message.clientMessageId}
          message={message}
        />
      );
    });
  }, [messagesStore.messages]);

  return (
    <div
      className={styles.container}
      ref={rootRefSetter}
      onScroll={handleScroll}
    >
      {getMessagesPending && !messagesStore.messages.length && <Loader />}
      {messagesStore.hasMore && (
        <div ref={infiniteRef} className={styles.loaderWrapper}>
          <Loader size={LoaderSizes.small} />
        </div>
      )}
      <div className={styles.list}>{messagesList}</div>
    </div>
  );
};
