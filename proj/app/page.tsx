import { AutoBatchDemo } from "./AutoBatchDemo";
import { SearchConcurrentDemo } from "./SearchConcurrentDemo";

export default function HomePage() {
  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "1.5rem",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>React Performance Lab</h1>
      <p style={{ maxWidth: 650, marginBottom: "1.5rem", opacity: 0.9 }}>
        Small experiments to understand automatic batching and concurrent
        rendering with transitions.
      </p>

      <AutoBatchDemo />

      <hr style={{ margin: "2rem 0" }} />

      <SearchConcurrentDemo />
    </main>
  );
}
