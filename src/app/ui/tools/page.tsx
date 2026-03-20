"use client";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { IconAlertCircle } from "@tabler/icons-react";
import { DefaultChatTransport } from "ai";
import type { ChatMessage } from "@/app/api/tools/route";

const Chat = () => {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, stop } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/tools",
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground px-4">
      {/* Scrollable Content Area */}
      <div className="flex-1 w-full max-w-2xl mx-auto pt-20 pb-40">
        <div className="flex flex-col gap-8">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col gap-1.5">
              <div
                className={`text-xs font-bold uppercase tracking-widest ${
                  message.role === "user"
                    ? "text-muted-foreground"
                    : "text-primary"
                }`}
              >
                {message.role === "user" ? "You" : "AI Assistant"}
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <div key={`${message.id}-${index}`}>{part.text}</div>
                      );
                    case "tool-getWeather":
                      switch (part.state) {
                        case "input-streaming":
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className="my-1 rounded-lg border border-border bg-muted/40 px-3 py-2"
                            >
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                                Fetching weather…
                              </p>
                              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                                {JSON.stringify(part.input, null, 2)}
                              </pre>
                            </div>
                          );
                        case "input-available":
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className="my-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1"
                            >
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                Weather
                              </span>
                              <span className="text-xs text-foreground">
                                {part.input.city}
                              </span>
                            </div>
                          );
                        case "output-available":
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className="my-1 rounded-lg border border-border bg-muted/40 px-3 py-2"
                            >
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                                Weather
                              </p>
                              <p className="text-sm text-foreground">{part.output}</p>
                            </div>
                          );
                        case "output-error":
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className="my-1 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2"
                            >
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-destructive mb-1">
                                Error
                              </p>
                              <p className="text-xs text-destructive">{part.errorText}</p>
                            </div>
                          );
                        default:
                          return null;
                      }
                    
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-8">
            <Alert variant="destructive">
              <IconAlertCircle />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <div
          className={`flex flex-col ${
            messages.length === 0
              ? "items-center justify-center text-center min-h-[40vh]"
              : "mt-8"
          }`}
        >
          {isStreaming ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner />
              <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                Thinking
              </span>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground italic text-sm">
              What can I help you complete today?
            </p>
          ) : null}
        </div>
      </div>

      {/* Fixed Bottom Input Container */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-background via-background/90 to-transparent pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 w-full items-end">
            <Field className="flex-1">
              <Input
                type="text"
                placeholder="Write your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isStreaming}
                className="h-[50px] rounded-2xl bg-muted/50 border-muted px-5"
              />
            </Field>
            {isStreaming ? (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  stop();
                }}
                className="h-[50px] rounded-2xl px-6 shrink-0"
              >
                Stop
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={status !== "ready" || !input.trim()}
                className="h-[50px] rounded-2xl px-6 shrink-0"
              >
                Send
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
