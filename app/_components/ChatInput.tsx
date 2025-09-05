"use client";
import { useState } from "react";
import styles from "./chat.module.css";

export interface ChatInputProps {
  onSend: (txt: string) => void;
}
export function ChatInput(props: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const onSend = () => {
    props.onSend(inputValue);
    setInputValue("");
  };
  return (
    <div className={styles.chatInput}>
      <input
        type="text"
        className={styles.chatInputField}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        value={inputValue}
      />
      <button className={styles.chatInputButton} onClick={onSend}>
        Send
      </button>
    </div>
  );
}
