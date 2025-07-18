import BookmarkCard from "@/components/BookmarkCard";

export default function Page() {
  return (
    <div className="space-y-4">
      <BookmarkCard
        title="OpenAI Docs"
        description="All things GPT, API keys, and embeddings."
        url="https://platform.openai.com/docs"
        tags={["openai", "ai", "api"]}
      />

      <BookmarkCard
        title="Shadcn Docs"
        description="Beautiful component system using Tailwind CSS."
        url="https://ui.shadcn.com/"
        tags={["shadcn", "ui", "tailwind"]}
      />
    </div>
  );
}
