"use client";

import { useCompletion } from "@ai-sdk/react";

const Stream = () => {
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    setInput,
    stop,
  } = useCompletion({
    api: "/api/stream",
  });

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4">
      {/* Scrollable Content Area */}
      <div className="flex-1 w-full max-w-2xl mx-auto pt-20 pb-40">
        {error && (
          <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg animate-in fade-in slide-in-from-top-4">
            {error.message}
          </div>
        )}

        <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
          {isLoading && !completion ? (
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
            <div className="w-full whitespace-pre-wrap text-lg leading-relaxed text-neutral-200 text-left animate-in fade-in duration-500">
              {completion}
            </div>
          ) : (
            <div className="text-neutral-500 italic">
              What can I help you complete today?
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Input Container */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setInput("");
              handleSubmit(e);
            }}
            className="flex gap-2 w-full items-end"
          >
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Write your message..."
                value={input}
                onChange={handleInputChange}
                className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-neutral-100"
              />
            </div>
            {isLoading ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  stop();
                }}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-6 py-3 rounded-2xl font-medium transition-all shadow-lg border border-neutral-700 h-[50px] flex items-center justify-center whitespace-nowrap"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] h-[50px] flex items-center justify-center whitespace-nowrap"
                disabled={isLoading || !input.trim()}
              >
                Send
              </button>
            )}
          </form>
          <p className="text-[10px] text-center text-neutral-600 mt-3 font-medium tracking-tight uppercase">
            Powered by Groq & Llama 3.3
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stream;
