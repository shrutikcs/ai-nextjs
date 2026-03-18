"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GenerateSpeech = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    setIsLoading(true);
    // Your generation logic here...
  };

  return (
    // 1. Full screen container — same structure as multi-modal-chat
    <div className="flex flex-col min-h-screen bg-background text-foreground px-4">

      {/* 2. Scrollable main area — grows to fill all available space */}
      <div className="flex-1 w-full max-w-2xl mx-auto pt-20 pb-40">
        <div className="flex flex-col gap-8">

          {/* Empty state — mirrors the chat page's center placeholder */}
          {!isLoading && (
            <div className="flex flex-col items-center justify-center text-center min-h-[40vh]">
              <p className="text-muted-foreground italic text-sm">
                What should I say today?
              </p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
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
              <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                Synthesizing audio...
              </span>
            </div>
          )}

        </div>
      </div>

      {/* 3. Fixed bottom bar — gradient + input row, exactly like multi-modal-chat */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-background via-background/90 to-transparent pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 w-full items-end"
          >
            {/* Shadcn Input — sibling of Button, not nested inside it */}
            <Input
              id="text-input"
              placeholder="What should I say?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              className="flex-1 h-[50px] rounded-2xl bg-muted/50 border-muted px-5"
            />

            {/* Shadcn Button — sits next to input */}
            <Button
              type="submit"
              disabled={isLoading || !text}
              className="h-[50px] rounded-2xl px-6 shrink-0"
            >
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default GenerateSpeech;
