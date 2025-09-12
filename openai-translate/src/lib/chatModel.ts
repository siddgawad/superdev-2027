// src/lib/chatModel.ts
import "server-only";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: "gpt-4o-mini", 
  temperature: 0,
});

export async function translateDemo() {
  const messages = [
    new SystemMessage("Translate the following from English into Italian"),
    new HumanMessage(
      "hi! I love to eat pizza and bacon, and watch cristiano ronaldo score goals."
    ),
  ];

  const ai = await model.invoke(messages);

  return typeof ai.content === "string" ? ai.content : JSON.stringify(ai.content);
}
