import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Generate speech using the Groq SDK
    const result = await groq.audio.speech.create({
      model: "canopylabs/orpheus-v1-english",
      voice: "autumn",
      input: text,
      response_format: "wav",
    });

    // Convert to arrayBuffer to send in the Response
    const audioBuffer = await result.arrayBuffer();

    // Return the audio as a Response (exactly like the photo)
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
      },
    });
  } catch (error) {
    console.error("error genererating the audio:", error);
    return new Response("failed to generate speech", { status: 500 });
  }
}
