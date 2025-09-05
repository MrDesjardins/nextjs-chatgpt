export interface Message {
    id: string;
    author: Author;
    text: string;
    timestampMs: number;
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