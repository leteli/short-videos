"use client";
import { useUnit } from "effector-react";
import clsx from "clsx";
import { $chatStore  } from "@/stores";
import { Input, InputVariant } from "../common/Input/Input";
import { Text } from "../common/Text/Text";
import styles from "./Chat.module.scss";
import { ChatTypes } from "@/stores/chats/types";

export const Chat = () => {
  const { chat } = useUnit($chatStore);
  if (!chat) {
    <div className={clsx(styles.container, styles.noChatWrapper)}>
      <div className={styles.textLabel}>
        <Text>Select a chat to start messaging</Text>
      </div>
    </div>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {chat?.type === ChatTypes.direct && <Text>{chat.peer.username}</Text>}
      </div>
      <div className={styles.inputWrapper}>
        <Input variant={InputVariant.large} />
      </div>
    </div>
  );
};
