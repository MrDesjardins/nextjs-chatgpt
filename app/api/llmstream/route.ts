import OpenAI from "openai";
import {
  APILLM_CLEAR_TOKEN,
  APILLM_CREATED_TOKEN,
  APILLM_END_TOKEN,
  APILLM_THINKING_TOKEN,
} from "../../_models/api";
import { Message } from "../../_models/chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const jsonPayload = await request.json();
  const messages: Message[] = jsonPayload.messages;
  if (messages == null) {
    return new NextResponse("Error", {
      status: 403,
      statusText: "invalid message",
    });
  }
  try {
    const client = new OpenAI();

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: messages.map((d) => d.author.name + " said: " + d.text).join("\n"),
      stream: true,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        // Handle client abort (user cancels request)
        request.signal.addEventListener("abort", () => {
          controller.close();
        });

        try {
          for await (const event of response) {
            console.log("LLM Event:", event);

            if (event.type === "response.output_text.delta") {
              const data = event.delta;
              controller.enqueue(encoder.encode(data));
            } else if (event.type === "response.created") {
              const data = APILLM_CREATED_TOKEN;
              controller.enqueue(encoder.encode(data));
            } else if (event.type === "response.in_progress") {
              const data = APILLM_THINKING_TOKEN;
              controller.enqueue(encoder.encode(data));
            } else if (
              event.type === "response.content_part.added" &&
              event.part.type === "output_text"
            ) {
              const data = APILLM_CLEAR_TOKEN;
              controller.enqueue(encoder.encode(data));
            } else if (
              event.type === "response.completed" ||
              event.type === "response.output_text.done"
            ) {
              const data = APILLM_END_TOKEN;
              controller.enqueue(encoder.encode(data));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // disables buffering on some reverse proxies
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      type: "error",
      error: "Failed to generate response",
    });
  }
}
