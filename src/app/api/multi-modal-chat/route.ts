import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
    // return result.toTextStreamResponse()
  } catch (error) {
    console.error("error streaming chat completion", error);
    return new Response("failed to stream chat completion", { status: 500 });
  }
}
