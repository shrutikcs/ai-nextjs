import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
        {
          role: "system",
          content:
            "you are direct. answer using KISS principle in under 3 lines.",
        },
        ...(await convertToModelMessages(messages)),
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputToken: usage.inputTokenDetails,
        outputToken: usage.outputTokenDetails,
        totalToken: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
    // return result.toTextStreamResponse()
  } catch (error) {
    console.error("error streaming chat completion", error);
    return new Response("failed to stream chat completion", { status: 500 });
  }
}
