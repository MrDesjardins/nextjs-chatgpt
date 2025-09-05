'use client'
import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import styles from "./chat.module.css";
import { Author, Message } from "../_models/chat";
import { uuidv7 } from "uuidv7";
export interface ChatSectionProps {
  author: Author;
}

export function ChatSection(props: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const onSend = (txt: string) => {
    const id = uuidv7();
    const newMessage: Message = { timestampMs: Date.now(), text: txt, id, author: props.author };
    setMessages([...messages, newMessage]);
  };
  return (
    <div className={styles.chatSection}>
      <ChatMessages messages={messages} />
      <ChatInput onSend={onSend} />
    </div>
  );
}
