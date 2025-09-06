export interface APILLMResponseSuccess {
  type: "success";
  response: string;
}

export interface APILLMResponseError {
  type: "error";
  error: string;
}

export type ApiLLMResponse = APILLMResponseSuccess | APILLMResponseError;

export interface LLMMessage{
  role: "system" | "user" | "assistant";
  content: string;
}
export interface APILLMRequest {
  messages: LLMMessage[]
}