import { groq } from "@ai-sdk/groq";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  InferUITools,
  UIDataTypes,
  tool,
  stepCountIs,
} from "ai";
import z from "zod";

const tools = {
  getWeather: tool({
    description: "get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("the city to get the weather for"),
    }),
    execute: async ({ city }) => {
      const normalizedCity = city.toLowerCase().trim();
      if (normalizedCity === "bhilai") {
        return "28 degree celsius";
      } else if (normalizedCity === "mumbai") {
        return "30 degree celsius";
      } else {
        return `Weather data for "${city}" is not available.`;
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        "Be concise. You have access to tools — always use them when relevant. For any weather-related question, you MUST call the getWeather tool and return its result. Never say you don't have access to weather data.",
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
    // return result.toTextStreamResponse()
  } catch (error) {
    console.error("error streaming chat completion", error);
    return new Response("failed to stream chat completion", { status: 500 });
  }
}
