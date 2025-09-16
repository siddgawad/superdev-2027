// src/app/layout.tsx
import type { Metadata } from "next";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "katex/dist/katex.min.css"; // ✅ local import — no SRI issues
import "./globals.css";

export const metadata: Metadata = {
  title: "Supabase RAG Chat",
  description: "AI chatbot grounded in your crawled documents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
