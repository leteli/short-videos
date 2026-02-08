"use client";

import { Text } from "../common/Text/Text";
import { IMessage } from "@/stores/messages/types";
import { formatHhMm } from "@/utils/helpers/time";
import styles from "./Message.module.scss";

interface IProps {
  message: IMessage;
}

export const Message = ({ message }: IProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentBlock}>
        {message.text && <Text>{message.text}</Text>}
        {message.media && <div>{/* TODO: <MediaBlock /> */}</div>}
      </div>
      <span className={styles.caption}>
        {formatHhMm(message.createdAt ?? message.createdAtLocal)}
      </span>
      <span className={styles.caption}>
        {message.isRead ? "read" : "not read"}
      </span>
    </div>
  );
};
