"use client";
import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import styles from "./chat.module.css";
import { Author, AuthorType, ChatGPTAuthor, Message } from "../_models/chat";
import { uuidv7 } from "uuidv7";
import {
  APILLM_CLEAR_TOKEN,
  APILLM_CREATED_TOKEN,
  APILLM_END_TOKEN,
  APILLM_THINKING_TOKEN,
  APILLMRequest,
  ApiLLMResponse,
  LLMMessage,
} from "../_models/api";
export interface ChatSectionProps {
  author: Author;
}
export function getNewMessagesList(
  existings: Message[],
  id: string,
  txt: string,
  edit: boolean
): Message[] {
  const oldOne = existings.find((d) => d.id === id);
  if (!oldOne) return existings;
  const updatedMessages = [
    ...existings.filter((d) => d.id !== id),
    { ...oldOne, text: edit ? oldOne.text + txt : txt },
  ];
  return updatedMessages;
}
export function ChatSection(props: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const onSend = async (txt: string, isStreaming: boolean) => {
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
    if (isStreaming) {
      try {
        await streamMessages(
          newAllMessages,
          (newMessageLLM: Message) => {
            setMessages([...newAllMessages, newMessageLLM]);
          },
          (id: string, msg: string) => {
            if (msg.indexOf(APILLM_CREATED_TOKEN) >= 0) {
              setMessages((existings) => {
                return getNewMessagesList(
                  existings,
                  id,
                  "Request started...",
                  false
                );
              });
            } else if (msg.indexOf(APILLM_THINKING_TOKEN) >= 0) {
              setMessages((existings) => {
                return getNewMessagesList(existings, id, "Thinking...", false);
              });
            } else if (msg.indexOf(APILLM_CLEAR_TOKEN) >= 0) {
              const start = msg.indexOf(APILLM_CLEAR_TOKEN) + APILLM_CLEAR_TOKEN.length;
              const rest = msg.substring(start);
              setMessages((existings) => {
                return getNewMessagesList(existings, id, rest, false);
              });
            } else {
              setMessages((existings) => {
                return getNewMessagesList(existings, id, msg, true);
              });
            }
          },
          () => {
            setIsProcessing(false);
          }
        );
      } catch (err) {
        console.log(err);
      } finally {
        setIsProcessing(false);
      }
    } else {
      const newMessageLLM: Message = await sendRequestToLLM(
        txt,
        newAllMessages
      );
      setMessages([...newAllMessages, newMessageLLM]);
      setIsProcessing(false);
    }
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
  allMessages: Message[] // Containt txt
): Promise<Message> {
  const responseBody: APILLMRequest = {
    messages: mapMessageToLLM(allMessages),
  };
  const response = await fetch("/api/llm", {
    method: "GET",
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

async function streamMessages(
  messages: Message[],
  create: (msg: Message) => void,
  edit: (id: string, msg: string) => void,
  completeSignal: () => void
) {
  // Response message
  const msgStream: Message = {
    timestampMs: Date.now(),
    text: "",
    id: uuidv7(),
    author: ChatGPTAuthor,
    isSuccess: true,
  };
  const response = await fetch("/api/llmstream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  create(msgStream); // Add the new message to the list

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true && reader) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    if (chunk.indexOf(APILLM_END_TOKEN) >= 0) {
      completeSignal();
    } else {
      edit(msgStream.id, chunk);
    }
  }
}
