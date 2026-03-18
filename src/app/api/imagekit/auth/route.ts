import ImageKit from "imagekit";

export async function GET() {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
      privateKey: process.env.PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
    });

    const authParams = imagekit.getAuthenticationParameters();
    return Response.json(authParams);
  } catch (err) {
    console.error("ImageKit auth error", err);
    return new Response("Auth Error", { status: 500 });
  }
}
