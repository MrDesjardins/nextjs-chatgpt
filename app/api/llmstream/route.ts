import OpenAI from "openai";
import { APILLM_CLEAR_TOKEN, APILLM_CREATED_TOKEN, APILLM_END_TOKEN, APILLM_THINKIN_TOKEN, APILLMResponseError } from "../../_models/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userMessage = request.nextUrl.searchParams.get("txt");
  if (userMessage == null) {
    return new NextResponse("Error", {
      status: 403,
      statusText: "invalid message",
    });
  }
  try {
    const client = new OpenAI();

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: userMessage,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        request.signal.addEventListener("abort", () => {
          controller.close();
        });

        for await (const event of response) {
          console.log(event);
          if (event.type === "response.output_text.delta") {
            const data = `data: ${event.delta}\n\n`;
            controller.enqueue(encoder.encode(data));
          } else if(event.type === "response.created") {
            const data = `data: ${APILLM_CREATED_TOKEN}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          else if(event.type === "response.in_progress") {
            const data = `data: ${APILLM_THINKIN_TOKEN}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          else if(event.type === "response.content_part.added" && event.part.type==="output_text") {
            const data = `data: ${APILLM_CLEAR_TOKEN}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          else if (
            event.type === "response.completed" ||
            event.type === "response.output_text.done"
          ) {
            const data = `data: ${APILLM_END_TOKEN}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      type: "error",
      error: "Failed to generate response",
    } satisfies APILLMResponseError);
  }
}
