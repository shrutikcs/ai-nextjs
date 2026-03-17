"use client";
import { useState } from "react";

const CompletionPage = () => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrompt("");
    setError(null);

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "something went wrong");
      }

      setCompletion(data.text);
    } catch (error) {
      console.log("error: ", error);
      setError(
        error instanceof Error ? error.message : "something went wrong here",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-black text-white">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="min-h-[100px] flex items-center justify-center text-center">
          {isLoading ? (
            <div className="flex items-center gap-2 text-neutral-400">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Thinking...
            </div>
          ) : completion ? (
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-neutral-200">
              {completion}
            </div>
          ) : (
            <div className="text-neutral-500">Ask me anything...</div>
          )}
        </div>

        <form onSubmit={complete} className="flex gap-2 w-full mt-auto">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your message..."
            className="flex-1 bg-neutral-900 border border-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompletionPage;
