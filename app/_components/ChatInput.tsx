"use client";
import { useState } from "react";
import styles from "./chat.module.css";

export interface ChatInputProps {
  onSend: (txt: string, isStreaming: boolean) => void;
  isProcessing: boolean;
}
export function ChatInput(props: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const onSend = () => {
    props.onSend(inputValue, true);
    setInputValue("");
  };
  return (
    <div className={styles.chatInput}>
      <input
        type="text"
        disabled={props.isProcessing}
        className={styles.chatInputField}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        value={inputValue}
      />
      <button
        className={styles.chatInputButton}
        onClick={onSend}
        disabled={props.isProcessing}
        title={props.isProcessing ? "Waiting LLM" : "Send"}
      >
        Send
      </button>
    </div>
  );
}
