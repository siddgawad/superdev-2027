# SuperDev 2027 — AI & Full-Stack Project Lab

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js)](https://nextjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?logo=langchain&logoColor=white)](https://js.langchain.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

A collection of production-grade AI and full-stack projects exploring LLMs, RAG systems, real-time communication, and modern web development.

**[Live App](https://superdev-2027.vercel.app)** (OpenAI Translator)

---

## Projects

### 🌐 OpenAI Translator (`openai-translate/`)
LLM-powered multilingual translation with **LangChain** prompt chains. Context-aware prompting preserves tone across translations.
- **Stack:** Next.js, LangChain, OpenAI API, Tailwind CSS
- **[Live →](https://superdev-2027.vercel.app)**

### 🏎️ F1 RAG (`f1-rag/`)
Retrieval-Augmented Generation system for querying Formula 1 technical data.
- **Stack:** LangChain, vector embeddings, OpenAI

### 🤖 AI Agents (`mastra-ai-agents/`)
Multi-agent orchestration using the Mastra AI framework.
- **Stack:** Mastra, TypeScript, agentic workflows

### 💬 Multi-User Chatbot (`multi-user-chatbot/`)
Real-time chatbot with multi-user session management.
- **Stack:** Next.js, WebSockets, OpenAI

### 🔐 OAuth (`OAuth/`)
OAuth 2.0 authentication implementation.
- **Stack:** Next.js, OAuth providers

### 🎨 GSAP Animations (`gsap/`)
Interactive web animations and scroll-triggered effects.
- **Stack:** GSAP, Next.js, CSS animations

### 🔌 QnA Mini Gateway (`qna-mini-gateway/`)
Lightweight question-answering API gateway.
- **Stack:** Node.js, REST API

## Tech Stack Across Projects

| Technology | Used In |
|-----------|---------|
| LangChain | openai-translate, f1-rag |
| OpenAI API | openai-translate, f1-rag, multi-user-chatbot |
| Next.js | openai-translate, multi-user-chatbot, OAuth, gsap |
| Docker | welcome-to-docker |
| GSAP | gsap |
| WebSockets | multi-user-chatbot |
| Mastra | mastra-ai-agents |

## Quick Start

```bash
# Clone
git clone https://github.com/siddgawad/superdev-2027.git
cd superdev-2027

# Pick a project
cd openai-translate
npm install
npm run dev
```

## License

MIT
