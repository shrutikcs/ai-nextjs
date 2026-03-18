export const uploadFilesToImageKit = async (
  files: FileList | File[],
) => {
  const fileList = Array.from(files);
  const uploadedUrls = [];

  for (const file of fileList) {
    // Get authentication parameters from our server route
    const authRes = await fetch("/api/imagekit/auth");
    
    if (!authRes.ok) {
      throw new Error(`Failed to get ImageKit auth params: ${authRes.statusText}`);
    }
    const { token, expire, signature } = await authRes.json();

    // Create the multipart/form-data upload payload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("publicKey", process.env.NEXT_PUBLIC_PUBLIC_KEY || "");
    formData.append("signature", signature);
    formData.append("expire", expire);
    formData.append("token", token);
    formData.append("fileName", file.name);

    // Call ImageKit API
    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload to ImageKit: ${uploadRes.statusText}`);
    }

    const uploadData = await uploadRes.json();

    if (uploadData.url) {
      // Return the structure expected by the Vercel AI SDK files/attachments array
      uploadedUrls.push({
        type: "file" as const,
        url: uploadData.url,
        name: uploadData.name || file.name,
        mediaType: file.type,
      });
    }
  }

  return uploadedUrls;
};
