import { translateDemo } from "@/lib/chatModel";
import LLMForm from "./LLMForm";

export default async function Page() {
  const output = await translateDemo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center">
            LangChain & OpenAI Demo
          </h1>
          <p className="text-slate-300 text-center mt-2">
            Simple LLM application with translation and recipe generation
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Demo Translation Result */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Demo Translation (English → Italian)
          </h2>
          <div className="bg-slate-50 rounded-md p-4">
            <p className="text-slate-700 italic">{output}</p>
          </div>
        </div>

        {/* Interactive Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Try It Yourself
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Choose <em>Translate</em> to convert English text to another language, 
            or <em>Recipe</em> to generate cooking instructions for any dish.
          </p>
          <LLMForm />
        </div>
      </div>
    </div>
  );
}