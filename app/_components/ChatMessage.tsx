"use client";
import { AuthorType, Message } from "../_models/chat";
import styles from "./chat.module.css";
export interface ChatMessageProps {
  message: Message;
}
export function ChatMessage(props: ChatMessageProps) {
  return (
    <div
      key={props.message.id}
      className={`${styles.chatMessage} ${
        props.message.author.type === AuthorType.AI
          ? styles.chatMessageRight
          : styles.chatMessageLeft
      } ${
        props.message.isSuccess
          ? styles.chatMessageSuccess
          : styles.chatMessageError
      }`}
    >
      <div className={styles.chatMessageContent}>
        <span className={styles.chatMessageAuthor}>
          {props.message.author.name}:
        </span>
        <span className={styles.chatMessageText}>{props.message.text}</span>
      </div>
    </div>
  );
}
