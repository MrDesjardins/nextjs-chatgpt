"use client";
import { useRef, useState } from "react";
import styles from "./chat.module.css";

export interface ChatInputProps {
  onSend: (txt: string, isStreaming: boolean) => void;
  isProcessing: boolean;
}
export function ChatInput(props: ChatInputProps) {
  const refTextBox = useRef<HTMLTextAreaElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const onSend = () => {
    if (props.isProcessing) return;
    if (inputValue.trim().length === 0) return;
    props.onSend(inputValue, true);
    setInputValue("");
    resetHeight();
    refTextBox.current?.focus();
  };
  const handleInput = () => {
    const textarea = refTextBox.current;
    if (!textarea) return;

    textarea.style.height = "auto"; // reset
    const maxHeight = parseInt(getComputedStyle(textarea).maxHeight);
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";

    // Toggle scrollbar
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSend();
      }
    }
  };

  const resetHeight = () => {
    const textarea = refTextBox.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.overflowY = "hidden";
    }
  };

  return (
    <div className={styles.chatInput}>
      <textarea
        ref={refTextBox}
        rows={1}
        placeholder="Type a message..."
        style={{
          overflow: "hidden",
        }}
        className={styles.chatInputField}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
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
