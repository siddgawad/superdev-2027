// src/lib/promptTemplate.ts
import "server-only";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const dynamic = 'force-dynamic';

const translationPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Translate the following from English into {language}."],
  ["user", "{text}"],
]);

const recipePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a safety-conscious chef. Return a concise, structured recipe for {dish} with 'Ingredients' and 'Steps'."],
  ["user", "Dish: {dish}. Please use clear headings and bullet points."]
]);

export type LLMMode = "translate" | "recipe";

export async function runLLMTask(params: {
  mode: LLMMode;
  language?: string; // required if mode=translate
  text?: string;     // required if mode=translate
  dish?: string;     // required if mode=recipe
  modelType?: string;
  temperature?: number;
}) {
  const model = new ChatOpenAI({
    model: params.modelType ?? "gpt-4o-mini",
    temperature: params.temperature ?? 0.3,
  });
  if (params.mode === "translate") {
    const chain = translationPrompt.pipe(model);
    const res = await chain.invoke({
      language: params.language ?? "italian",
      text: params.text ?? "",
    });
    return typeof res.content === "string" ? res.content : JSON.stringify(res.content);
  }

  // mode === "recipe"
  const chain = recipePrompt.pipe(model);
  const res = await chain.invoke({
    dish: params.dish ?? "",
  });
  return typeof res.content === "string" ? res.content : JSON.stringify(res.content);
}
