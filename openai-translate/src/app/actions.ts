"use server";

import { runLLMTask, type LLMMode } from "@/lib/promptTemplate";

export type ActionState = {
  result: string;
  error?: string;
};

export async function runLLM(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const mode = (formData.get("mode") as LLMMode) ?? "translate";
  const modelType = String(formData.get("modelType") ?? "gpt-4o-mini");
  const temperature = parseFloat(String(formData.get("temperature") ?? "0.3"));

  try {
    if (mode === "translate") {
      const language = String(formData.get("language") ?? "italian").trim();
      const text = String(formData.get("text") ?? "").trim();

      if (!text) {
        return { result: "", error: "Please enter some text to translate." };
      }

      if (text.length > 2000) {
        return { result: "", error: "Text is too long. Please keep it under 2000 characters." };
      }

      const result = await runLLMTask({ mode, language, text, modelType, temperature });
      return { result };
    }

    // mode === "recipe"
    const dish = String(formData.get("dish") ?? "").trim();

    if (!dish) {
      return { result: "", error: "Please enter a dish name." };
    }

    if (dish.length > 100) {
      return { result: "", error: "Dish name is too long. Please keep it under 100 characters." };
    }

    const result = await runLLMTask({ mode, dish, modelType, temperature });
    return { result };

  } catch (error: unknown) {
    console.error(`LLM task failed for mode ${mode}:`, error);

    const errorMessage = error instanceof Error
      ? error.message
      : "An unexpected error occurred. Please try again.";

    return {
      result: "",
      error: errorMessage.includes("API")
        ? "OpenAI API error. Please check your configuration and try again."
        : errorMessage
    };
  }
}