import { useEffect, useRef, useState } from "react";
import { Message } from "../_models/chat";
import styles from "./chat.module.css";
export interface ChatMessagesProps {
  messages: Message[];
}
export function ChatMessages(props: ChatMessagesProps) {
  const [isShowScrollBack, setIsShowScrollBack] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [props.messages]);
  const onScrollEvent = () => {
    const chatMessages = chatMessagesRef.current;
    if (chatMessages) {
      console.log("Scroll Top:", chatMessages.scrollTop, chatMessages.scrollHeight, chatMessages.clientHeight);
      setIsShowScrollBack(chatMessages.scrollTop + chatMessages.clientHeight + 100 < chatMessages.scrollHeight );
    }
  };
  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (chatMessages) {
      chatMessages.addEventListener("scroll", onScrollEvent);
      return () => {
        chatMessages.removeEventListener("scroll", onScrollEvent);
      };
    }
  }, [chatMessagesRef]);
  return (
    <div className={styles.chatMessages} ref={chatMessagesRef}>
      {props.messages.map((message) => (
        <div key={message.id} className={styles.chatMessage}>
          <span className={styles.chatMessageAuthor}>
            {message.author.name}
          </span>
          <span className={styles.chatMessageText}>{message.text}</span>
        </div>
      ))}
      {isShowScrollBack && (
        <button
          className={styles.scrollBackButton}
          onClick={() => {
            if (chatMessagesRef.current) {
              chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
            }
          }}
        >
          Scroll Back
        </button>
      )}
    </div>
  );
}
