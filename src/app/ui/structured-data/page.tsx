"use client";

import React, { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/structured-data/schema";

const StructuredData = () => {
  const [dishName, setDishName] = useState("");

  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structured-data",
    schema: recipeSchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ dishName });
    setDishName("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4">
      {/* Scrollable Content Area */}
      <div className="flex-1 w-full max-w-2xl mx-auto pt-20 pb-40">
        <div className="flex flex-col gap-8">
          {error && (
            <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg animate-in fade-in slide-in-from-top-4">
              {error.message}
            </div>
          )}

          {object?.recipe && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1.5">
                <div className="text-xs font-bold uppercase tracking-widest text-blue-500">
                  Recipe for
                </div>
                <div className="text-3xl font-bold text-neutral-100 leading-relaxed whitespace-pre-wrap">
                  {object.recipe.name}
                </div>
              </div>

              {object?.recipe?.ingredients &&
                object.recipe.ingredients.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-blue-500">
                      Ingredients
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-neutral-200 leading-relaxed">
                      {object.recipe.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50"
                        >
                          <span className="font-medium text-neutral-200">
                            {ingredient?.name}
                          </span>
                          <span className="text-neutral-400">
                            {ingredient?.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {object?.recipe?.steps && object.recipe.steps.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-500">
                    Steps
                  </div>
                  <div className="flex flex-col gap-3 text-sm text-neutral-200 leading-relaxed">
                    {object.recipe.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700/50"
                      >
                        <span className="font-bold text-neutral-500 shrink-0">
                          {index + 1}.
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={`flex flex-col ${!object?.recipe ? "items-center justify-center text-center min-h-[40vh]" : "mt-8"}`}
        >
          {isLoading ? (
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
              <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                Thinking
              </span>
            </div>
          ) : !object?.recipe ? (
            <div className="text-neutral-500 italic text-sm">
              Enter a dish name to generate a recipe.
            </div>
          ) : null}
        </div>
      </div>

      {/* Fixed Bottom Input Container */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/90 to-transparent pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 w-full items-end">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Enter a dish name..."
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
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
                disabled={isLoading || !dishName.trim()}
              >
                Generate
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default StructuredData;
