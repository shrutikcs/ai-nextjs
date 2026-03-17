"use client"
import { useChat } from "@ai-sdk/react"
import { useState } from "react"

const Chat = () => {

  const [input, setInput] = useState("")

  const { messages, sendMessage, status, error, stop } = useChat()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage({ text: input })
    setInput("")
  }


  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4">
      {/* Scrollable Content Area */}
      <div className="flex-1 w-full max-w-2xl mx-auto pt-20 pb-40">

        <div className="flex flex-col gap-8">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col gap-1.5">
              <div className={`text-xs font-bold uppercase tracking-widest ${message.role === "user" ? "text-neutral-500" : "text-blue-500"}`}>
                {message.role === "user" ? "You" : "AI Assistant"}
              </div>
              <div className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return <div key={`${message.id}-${index}`}>
                        {part.text}
                      </div>
                    default:
                      return null
                  }
                })}
              </div>
            </div>
          ))}
        </div>


        {error && (
          <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg animate-in fade-in slide-in-from-top-4">
            {error.message}
          </div>
        )}

        <div className={`flex flex-col ${messages.length === 0 ? "items-center justify-center text-center min-h-[40vh]" : "mt-8"}`}>
          {status === "streaming" || status === "submitted" ? (
            <div className="flex items-center gap-2 text-neutral-400">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
              <span className="text-xs font-medium uppercase tracking-widest opacity-60">Thinking</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-neutral-500 italic text-sm">
              What can I help you complete today?
            </div>
          ) : null}
        </div>
      </div>

      {/* Fixed Bottom Input Container */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/90 to-transparent pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 w-full items-end"
          >
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Write your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)
                }
                className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-neutral-100"
              />
            </div>
            {(status === "streaming" || status === "submitted") ? (
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
                disabled={status !== "ready" || !input.trim()}
              >
                Send
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat