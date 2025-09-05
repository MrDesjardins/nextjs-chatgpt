'use client'
import { Message } from "../_models/chat";
import styles from "./chat.module.css";
export interface ChatMessageProps {
    message: Message;
}
export function ChatMessage(props:ChatMessageProps) {
    return (
        <div className={styles.chatMessage}>
            <span className={styles.chatMessageAuthor}>{props.message.author.name}</span>
            <span className={styles.chatMessageText}>{props.message.text}</span>
        </div>
    );
}