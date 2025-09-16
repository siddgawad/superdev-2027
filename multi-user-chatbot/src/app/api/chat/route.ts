// src/app/api/chat/route.ts
import OpenAI from "openai";
import { supabaseAdminNode } from "@/lib/supabase-admin-node";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DocumentMatch = {
  id: number;
  url: string;
  title: string | null;
  content: string;
  similarity: number;
};

type StartEvent = { event: "start"; interactionId: string };
type TokenEvent = { event: "token"; token: string };
type EndEvent = { event: "end"; final: string; references?: Array<{ url: string; title?: string | null }> };
type SsePayload = StartEvent | TokenEvent | EndEvent;

function sseChunk(payload: SsePayload | "[DONE]") {
  if (payload === "[DONE]") return `data: [DONE]\n\n`;
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const prompt = (searchParams.get("prompt") ?? "").toString();
  let conversationId = searchParams.get("conversationId");

  if (!prompt) return new Response("Missing prompt", { status: 400 });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // If no conversation id given, create one so inserts succeed
        if (!conversationId) {
          const { data, error } = await supabaseAdminNode
            .from("conversations")
            .insert([{ user_id: null }])
            .select("id")
            .single();
          if (error) throw error;
          conversationId = data.id as string;
        }

        // Insert user message
        await supabaseAdminNode.from("messages").insert({
          conversation_id: conversationId,
          speaker: "user",
          content: prompt,
        });

        // Embed + retrieve
        const emb = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: prompt,
        });

        const { data: raw, error: matchErr } = await supabaseAdminNode.rpc("match_documents", {
          query_embedding: emb.data[0].embedding,
          match_threshold: 0.7,
          match_count: 5,
        });
        if (matchErr) throw matchErr;

        const contexts = (raw ?? []) as DocumentMatch[];
        const contextText = contexts
          .map((c, i) => `Source ${i + 1} (${c.url}${c.title ? ` — ${c.title}` : ""}):\n${c.content}`)
          .join("\n\n");

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
          {
            role: "system",
            content:
              "You are a helpful assistant. Answer precisely using the provided sources. If unsure, say so. Prefer quoting urls.",
          },
          { role: "user", content: `Question: ${prompt}\n\nRelevant sources:\n${contextText}` },
        ];

        controller.enqueue(encoder.encode(sseChunk({ event: "start", interactionId: cryptoRandomId() })));

        let full = "";
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.2,
          stream: true,
        });

        for await (const part of completion) {
          const delta = part.choices?.[0]?.delta?.content ?? "";
          if (!delta) continue;
          full += delta;
          controller.enqueue(encoder.encode(sseChunk({ event: "token", token: delta })));
        }

        // Insert assistant msg
        if (full.trim()) {
          await supabaseAdminNode.from("messages").insert({
            conversation_id: conversationId,
            speaker: "assistant",
            content: full,
          });
        }

        controller.enqueue(
          encoder.encode(
            sseChunk({
              event: "end",
              final: full,
              references: contexts.map(({ url, title }) => ({ url, title })),
            })
          )
        );
        controller.enqueue(encoder.encode(sseChunk("[DONE]")));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        // best-effort error signal
        controller.enqueue(encoder.encode(sseChunk({ event: "end", final: `Sorry, error: ${msg}` } as EndEvent)));
        controller.enqueue(encoder.encode(sseChunk("[DONE]")));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

function cryptoRandomId(): string {
  try {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return Math.random().toString(36).slice(2);
  }
}
