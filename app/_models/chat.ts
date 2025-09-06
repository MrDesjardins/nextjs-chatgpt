export interface Message {
    id: string;
    author: Author;
    text: string;
    timestampMs: number;
    isSuccess: boolean;
}

export enum AuthorType {
    AI = "AI",
    HUMAN = "HUMAN"
}

export interface Author {
    id: string;
    type: AuthorType;
    name: string;
    avatar: string;
}

export const ChatGPTAuthor: Author = {
    id: "chatgpt",
    type: AuthorType.AI,
    name: "ChatGPT",
    avatar: "/avatars/chatgpt.png"
};
