"use client";

import { useRef, useState } from "react";

interface TranscriptResult {
  text: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  language?: string;
  durationInSeconds: number;
}

const TranscribeAudio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setSelectedFile(null);
    setTranscript(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an audio file");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      setTranscript(data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("error transcribing audio", error);
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTranscript(null);
      setError(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4 font-sans">
      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-2xl mx-auto pt-20 pb-40">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">
          Audio Transcription
        </h1>

        {error && (
          <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="flex items-center gap-3 text-blue-500">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
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
              <span className="text-sm font-bold uppercase tracking-widest">
                Processing Audio
              </span>
            </div>
          </div>
        )}

        {transcript && !isLoading && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold uppercase tracking-widest text-blue-500">
                Transcription Result
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-neutral-200 leading-relaxed shadow-xl">
                <p className="whitespace-pre-wrap">{transcript.text}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {transcript.language && (
                <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    Language
                  </div>
                  <div className="text-sm text-neutral-200 font-medium capitalize">
                    {transcript.language}
                  </div>
                </div>
              )}
              {transcript.durationInSeconds && (
                <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    Duration
                  </div>
                  <div className="text-sm text-neutral-200 font-medium">
                    {transcript.durationInSeconds.toFixed(1)} seconds
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!transcript && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 border border-neutral-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-400"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-200 mb-2">
              Ready to transcribe
            </h2>
            <p className="text-neutral-500 text-sm max-w-sm">
              Upload an audio file to convert it into text with high accuracy
              using AI.
            </p>
          </div>
        )}
      </div>

      {/* Fixed Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/90 to-transparent pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col gap-4 w-full">
            {/* File selection preview */}
            {selectedFile && (
              <div className="flex gap-2 mx-1 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-xl text-xs text-neutral-300">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                  <span className="truncate max-w-[200px] font-medium">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-neutral-500 hover:text-red-400 transition-colors ml-2 p-1 hover:bg-neutral-700 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-3 w-full">
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*"
                className="hidden"
                id="audio-upload"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 px-5 py-3 rounded-2xl transition-all border border-neutral-800 h-[56px] flex items-center justify-center shrink-0 group shadow-lg"
                title="Select Audio"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </button>

              <button
                type="submit"
                disabled={isLoading || !selectedFile}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] h-[56px] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
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
                    Transcribing...
                  </>
                ) : (
                  "Transcribe Audio"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscribeAudio;
