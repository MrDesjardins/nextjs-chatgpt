"use client";
import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import styles from "./chat.module.css";
import { Author, AuthorType, ChatGPTAuthor, Message } from "../_models/chat";
import { uuidv7 } from "uuidv7";
import { APILLMRequest, ApiLLMResponse, LLMMessage } from "../_models/api";
export interface ChatSectionProps {
  author: Author;
}

export function ChatSection(props: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const onSend = async (txt: string) => {
    const newMessage: Message = {
      timestampMs: Date.now(),
      text: txt,
      id: uuidv7(),
      author: props.author,
      isSuccess: true,
    };
    const newAllMessages = [...messages, newMessage];
    setMessages(newAllMessages);
    setIsProcessing(true);
    const newMessageLLM: Message = await sendRequestToLLM(txt, newAllMessages);
    setMessages([...newAllMessages, newMessageLLM]);
    setIsProcessing(false);
  };
  return (
    <div className={styles.chatSection}>
      <ChatMessages messages={messages} />
      <ChatInput onSend={onSend} isProcessing={isProcessing} />
    </div>
  );
}
async function sendRequestToLLM(
  txt: string,
  allMessages: Message[]
): Promise<Message> {
  const responseBody: APILLMRequest = {
    messages: mapMessageToLLM(allMessages),
  };
  const response = await fetch("/api/llm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responseBody),
  });
  const data = (await response.json()) as ApiLLMResponse;
  const newMessageLLM: Message = {
    timestampMs: Date.now(),
    text: "",
    id: uuidv7(),
    author: ChatGPTAuthor,
    isSuccess: true,
  };
  if (data.type === "success") {
    newMessageLLM.text = data.response;
  } else {
    newMessageLLM.text = data.error;
    newMessageLLM.isSuccess = false;
  }
  return newMessageLLM;
}

function mapMessageToLLM(messages: Message[]): LLMMessage[] {
  return messages.map((msg) => ({
    role: msg.author.type === AuthorType.AI ? "assistant" : "user",
    content: msg.text,
  }));
}
