import { Message } from "../_models/chat";

export interface ChatMessagesProps {
    messages: Message[];
}
export function ChatMessages(props:ChatMessagesProps) {
  return (
    <div className="chatMessages">
      {props.messages.map((message) => (
        <div key={message.id} className="chatMessage">
          <span className="chatMessageAuthor">{message.author.name}</span>
          <span className="chatMessageText">{message.text}</span>
        </div>
      ))}
    </div>
  );
}
