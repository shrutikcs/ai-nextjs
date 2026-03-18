import { groq } from "@ai-sdk/groq";
import { experimental_transcribe as transcribe } from "ai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response("no audio file provided", { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const transcript = await transcribe({
      model: groq.transcription("whisper-large-v3-turbo"),
      audio: uint8Array,
    });

    return Response.json(transcript);
  } catch (error) {
    console.error("error transcribing audio: ", error);
    return new Response("failed to transcribe audio", { status: 500 });
  }
}
