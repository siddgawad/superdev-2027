
"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import * as timeago from "timeago.js";
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

type Speaker = "user" | "assistant" | "system";

type ConversationEntry = {
  message: string;
  speaker: Speaker;
  date: Date;
};

type HistoryRow = {
  id: number;
  conversation_id: string;
  speaker: Speaker;
  content: string;
  created_at: string; // ISO
};

type StartEvent = { event: "start"; interactionId: string };
type TokenEvent = { event: "token"; token: string };
type EndEvent = {
  event: "end";
  final: string;
  references?: Array<{ url: string; title?: string | null }>;
};
type SsePayload = StartEvent | TokenEvent | EndEvent;

export default function Page() {
  const [text, setText] = useState("");
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [botIsTyping, setBotIsTyping] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Waiting for query...");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const esRef = useRef<EventSource | null>(null);
  const currentAssistantMsgRef = useRef<string>("");

  // localStorage helpers
  function loadConversationId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("conversation_id");
  }
  function saveConversationId(id: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("conversation_id", id);
  }
  function clearConversationId() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("conversation_id");
    setConversationId(null);
  }

  // Hydrate conversation id on mount
  useEffect(() => {
    const existing = loadConversationId();
    if (existing) setConversationId(existing);
  }, []);

  // Load history when we have a conversation id
  useEffect(() => {
    (async () => {
      if (!conversationId) return;
      try {
        const res = await fetch(`/api/conversations/${conversationId}/messages`, { cache: "no-store" });
        if (!res.ok) return;
        const { messages } = (await res.json()) as { messages: HistoryRow[] };
        setConversation(
          (messages ?? []).map((m) => ({
            speaker: m.speaker,
            message: m.content,
            date: new Date(m.created_at),
          }))
        );
      } catch {
        // ignore
      }
    })();
  }, [conversationId]);

  // Create real conversation (server)
  async function ensureConversation(): Promise<string> {
    if (conversationId) return conversationId;

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // include { userId } if you wire Supabase Auth
    });
    if (!res.ok) throw new Error(await res.text());
    const { id } = (await res.json()) as { id: string };
    setConversationId(id);
    saveConversationId(id);
    return id;
  }

  async function startNewChat() {
    esRef.current?.close();
    setConversation([]);
    setStatusMessage("New chat…");
    clearConversationId();
    await ensureConversation();
    setStatusMessage("Waiting for query...");
  }

  function parseSseJSON(data: string): SsePayload | null {
    try {
      const obj = JSON.parse(data) as unknown;
      if (!obj || typeof obj !== "object" || !("event" in obj)) return null;
      const evt = (obj as { event: string }).event;
      if (evt === "start" || evt === "token" || evt === "end") return obj as SsePayload;
      return null;
    } catch {
      return null;
    }
  }

  async function submit() {
    const prompt = text.trim();
    if (!prompt || botIsTyping) return;

    const convId = await ensureConversation();

    setConversation((prev) => [...prev, { message: prompt, speaker: "user", date: new Date() }]);
    setText("");
    setBotIsTyping(true);
    setStatusMessage("Thinking…");
    currentAssistantMsgRef.current = "";

    esRef.current?.close();

    const qs = new URLSearchParams({ prompt, conversationId: convId });
    const es = new EventSource(`/api/chat?${qs.toString()}`, { withCredentials: false });
    esRef.current = es;

    es.onmessage = (evt) => {
      if (!evt.data) return;
      if (evt.data === "[DONE]") {
        es.close();
        setBotIsTyping(false);
        setStatusMessage("Waiting for query...");
        return;
      }
      const payload = parseSseJSON(evt.data);
      if (!payload) return;

      if (payload.event === "start") {
        setConversation((prev) => [...prev, { message: "", speaker: "assistant", date: new Date() }]);
        return;
      }
      if (payload.event === "token") {
        currentAssistantMsgRef.current += payload.token;
        setConversation((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.speaker === "assistant") last.message = currentAssistantMsgRef.current;
          return copy;
        });
        return;
      }
      if (payload.event === "end") {
        // could render payload.references in UI if you want
        return;
      }
    };

    es.onerror = () => {
      es.close();
      setBotIsTyping(false);
      setStatusMessage("Network error. Try again.");
    };
  }

  // Cleanup SSE
  useEffect(() => () => esRef.current?.close(), []);

  return (
    <main style={{ position: "relative", height: "98vh", overflow: "hidden", padding: 8 }}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Actions>
              <button
                onClick={startNewChat}
                style={{
                  border: "1px solid #ccc",
                  padding: "6px 10px",
                  marginRight: 8,
                  borderRadius: 6,
                  cursor: "pointer",
                  background: "white",
                }}
              >
                New chat
              </button>
            </ConversationHeader.Actions>
            <ConversationHeader.Content userName="Supabase RAG" info={statusMessage} />
          </ConversationHeader>

          <MessageList typingIndicator={botIsTyping ? <TypingIndicator content="Assistant is typing…" /> : null}>
            {conversation.map((entry, idx) => (
              <Message
                key={`${entry.speaker}-${idx}-${entry.date.getTime()}`}
                style={{ width: "90%" }}
                model={{
                  type: "custom",
                  sender: entry.speaker,
                  position: "single",
                  direction: entry.speaker === "assistant" ? "incoming" : "outgoing",
                }}
              >
                <Message.CustomContent>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {entry.message}
                  </ReactMarkdown>
                </Message.CustomContent>
                <Message.Footer
                  sentTime={timeago.format(entry.date)}
                  sender={entry.speaker === "assistant" ? "Assistant" : "You"}
                />
              </Message>
            ))}
          </MessageList>

          <MessageInput
            placeholder="Ask anything about your docs…"
            onSend={submit}
            onChange={(_e, v) => setText(v)}
            value={text}
            sendButton
            autoFocus
            disabled={botIsTyping}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </main>
  );
}
