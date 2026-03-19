"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertAction } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { IconAlertCircle, IconX } from "@tabler/icons-react";

const MAX_CHARS = 200;

const GenerateSpeech = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOverLimit = text.length > MAX_CHARS;
  const [hasAudio, setHasAudio] = useState(false);

  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || isOverLimit) return;
    setIsLoading(true);
    setError(null);
    setText("");

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    try {
      const response = await fetch("/api/generate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error("failed to generate audio");
      }

      const blob = await response.blob();
      audioUrlRef.current = URL.createObjectURL(blob);
      audioRef.current = new Audio(audioUrlRef.current);

      setHasAudio(true);
      audioRef.current.play();

      // audio.addEventListener("ended", () => {
      //   URL.revokeObjectURL(audioUrl);
      // });
    } catch (error) {
      console.error("error generating audio", error);
      setError(
        error instanceof Error
          ? error.message
          : "something went wrong, try again",
      );
      setHasAudio(false);
    } finally {
      setIsLoading(false);
    }
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

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
              <Spinner />
              <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                Synthesizing audio...
              </span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <Alert variant="destructive">
              <IconAlertCircle />
              <AlertDescription>{error}</AlertDescription>
              <AlertAction>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  aria-label="Dismiss error"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <IconX />
                </button>
              </AlertAction>
            </Alert>
          )}

          {hasAudio &&
            !isLoading &&
            (<Button onClick={replayAudio}>Replay</Button>)}
        </div>
      </div>

      {/* 3. Fixed bottom bar — gradient + input row, exactly like multi-modal-chat */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-background via-background/90 to-transparent pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 w-full items-end">
            {/* Input — goes red when over character limit */}
            <Field
              data-invalid={isOverLimit || undefined}
              className="flex-1"
            >
              <Input
                id="text-input"
                placeholder="What should I say?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isLoading}
                aria-invalid={isOverLimit || undefined}
                className="h-[50px] rounded-2xl bg-muted/50 border-muted px-5"
              />
            </Field>

            {/* Shadcn Button — sits next to input */}
            <Button
              type="submit"
              disabled={isLoading || !text || isOverLimit}
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
