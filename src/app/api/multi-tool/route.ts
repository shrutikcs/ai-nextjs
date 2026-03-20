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
  getLocation: tool({
    description: "Get the city/location name for a person.",
    inputSchema: z.object({
      name: z.string().describe("The name of the person to look up"),
    }),
    execute: async ({ name }) => {
      const normalizedName = name.toLowerCase().trim();
      if (normalizedName === "shrutik") return "bhilai";
      return "city not available";
    },
  }),

  getWeather: tool({
    description: "Get the current weather for a specific city.",
    inputSchema: z.object({
      city: z.string().describe("The name of the city"),
    }),
    execute: async ({ city }) => {
      const normalizedCity = city.toLowerCase().trim();
      if (normalizedCity === "bhilai") return "28 degree celsius";
      if (normalizedCity === "mumbai") return "30 degree celsius";
      return `Weather data for "${city}" is not available.`;
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: "You are a weather assistant. When given a name, first find their city with getLocation, then get the weather for that city.",
      messages: await convertToModelMessages(messages),
      tools,
      maxSteps: 5,
    } as any);

    return result.toUIMessageStreamResponse();
    // return result.toTextStreamResponse()
  } catch (error) {
    console.error("error streaming chat completion", error);
    return new Response("failed to stream chat completion", { status: 500 });
  }
}
