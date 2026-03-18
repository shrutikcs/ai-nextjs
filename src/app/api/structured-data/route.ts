import { groq } from "@ai-sdk/groq";
import { streamText, Output } from "ai";
import { recipeSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { dishName } = await req.json();

    const result = await streamText({
      model: groq("openai/gpt-oss-20b"),
      output: Output.object({ schema: recipeSchema }),
      prompt: `generate a recipe for ${dishName}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("error generating recipe: ", error);
    return new Response("failed to generate recipe", { status: 500 });
  }
}
