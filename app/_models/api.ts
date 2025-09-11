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

export const APILLM_END_TOKEN = "[done]";
export const APILLM_CREATED_TOKEN = "[created]";
export const APILLM_THINKIN_TOKEN = "[thinking]";