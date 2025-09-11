import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  APILLMRequest,
  APILLMResponseError,
  APILLMResponseSuccess,
} from "../../_models/api";

export async function POST(request: Request) {
  const userMessage = await request.json() as APILLMRequest;
  try {
    const client = new OpenAI();

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: userMessage.messages,
    });

    return NextResponse.json({
      type: "success",
      response: response.output_text,
    } satisfies APILLMResponseSuccess);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      type: "error",
      error: "Failed to generate response",
    } satisfies APILLMResponseError);
  }
}
