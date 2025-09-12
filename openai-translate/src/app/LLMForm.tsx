"use client";

import { useActionState, useState } from "react";
import { runLLM } from "./actions";

const initialState = { result: "" as string, error: undefined as string | undefined };

const LANGS = [
  "italian", "spanish", "french", "german", 
  "hindi", "marathi", "japanese", "portuguese", "chinese"
];

export default function LLMForm() {
  const [state, formAction, isPending] = useActionState(runLLM, initialState);
  const [mode, setMode] = useState<"translate" | "recipe">("translate");

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        {/* Mode selector */}
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="translate"
              checked={mode === "translate"}
              onChange={() => setMode("translate")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="font-medium">Translate Text</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="recipe"
              checked={mode === "recipe"}
              onChange={() => setMode("recipe")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="font-medium">Generate Recipe</span>
          </label>
        </div>

        {/* Translate fields */}
        {mode === "translate" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Language
              </label>
              <select 
                name="language" 
                className="w-full border border-slate-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="italian"
              >
                {LANGS.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                English Text to Translate
              </label>
              <textarea
                name="text"
                rows={4}
                placeholder="Enter the English text you want to translate..."
                className="w-full border border-slate-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
              />
            </div>
          </div>
        )}

        {/* Recipe fields */}
        {mode === "recipe" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Dish Name
            </label>
            <input
              name="dish"
              type="text"
              placeholder="e.g., Chicken Biryani, Caesar Salad, Chocolate Cake..."
              className="w-full border border-slate-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Enter any dish name to get a detailed recipe with ingredients and steps
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-slate-900 text-white px-6 py-3 rounded-md font-medium hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            `Generate ${mode === "translate" ? "Translation" : "Recipe"}`
          )}
        </button>
      </form>

      {/* Error display */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{state.error}</p>
        </div>
      )}

      {/* Result display */}
      {state.result && !state.error && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="h-5 w-5 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-slate-900 font-medium">
              {mode === "translate" ? "Translation" : "Recipe"}
            </span>
          </div>
          <div className="bg-red-100 rounded border p-4">
            <pre className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
              {state.result}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}