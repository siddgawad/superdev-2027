
import "dotenv/config"; // loads .env for local runs
import { CheerioCrawler, log, type RequestOptions } from "crawlee";
import TurndownService from "turndown";
import OpenAI from "openai";
import crypto from "node:crypto";

// IMPORTANT: use the admin client (bypasses RLS) for ingestion
import { supabaseAdmin } from "../src/lib/supabase-admin";
// OPTIONAL: use anon client for retrieval if you want to test search here too
import { supabase as supabaseClient } from "../src/lib/supabase-client";

/** ---------------------------
 *  Env + tunables (safe defaults)
 *  -------------------------- */
const REQUIRED = ["SITE_URL", "OPENAI_API_KEY", "DB_URL", "DB_ROLE_KEY"] as const;
for (const k of REQUIRED) {
  if (!process.env[k]) throw new Error(`Missing env: ${k}`);
}

const SITE_URL = process.env.SITE_URL!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const USER_AGENT = process.env.CRAWLER_UA ?? "GreasyMonkeyCrawler/1.0 (+https://example.com/bot-info)";

const MAX_REQUESTS = Number(process.env.CRAWLER_MAX_REQUESTS ?? 1000);
const MAX_RPM = Number(process.env.CRAWLER_MAX_RPM ?? 300);
const MAX_CONCURRENCY = Number(process.env.CRAWLER_MAX_CONCURRENCY ?? 5);
const MIN_TEXT_LEN = Number(process.env.CRAWLER_MIN_TEXT_LEN ?? 200);
const CHUNK_CHARS = Number(process.env.CRAWLER_CHUNK_CHARS ?? 1200);
const CHUNK_OVERLAP = Number(process.env.CRAWLER_CHUNK_OVERLAP ?? 150);

// Keep this synced with your `documents.embedding` dim
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small"; // 1536 dims

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/** ---------------------------
 *  Types (minimal to avoid cheerio type clashes)
 *  -------------------------- */
type Page = { url: string; title: string; text: string };
type MinimalSelection = {
  remove(): void;
  first(): MinimalSelection;
  html(): string | null;
  text(): string;
  length: number;
};
type MinimalCheerio = {
  (selector: string): MinimalSelection;
};

/** ---------------------------
 *  Helpers
 *  -------------------------- */
function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function normalizeUrl(base: string, maybeRelative: string) {
  const u = new URL(maybeRelative, base);
  u.hash = "";
  return u.toString();
}

function chunkText(text: string, chunkSize = CHUNK_CHARS, overlap = CHUNK_OVERLAP): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + chunkSize);
    out.push(text.slice(i, end));
    if (end === text.length) break;
    i = end - overlap;
  }
  return out;
}

/** ---------------------------
 *  Crawler
 *  -------------------------- */
class Crawler {
  private pages: Page[] = [];
  private roots: string[];
  private turndown = new TurndownService();

  constructor(private urls: string[]) {
    this.roots = urls.map((u) => new URL(u).host);
    log.setLevel(log.LEVELS.INFO);
  }

  private sameHost(url: string): boolean {
    try {
      return this.roots.includes(new URL(url).host);
    } catch {
      return false;
    }
  }

  private stripAndMarkdown($: unknown): string {
    const $$ = $ as MinimalCheerio;
    if (typeof $$ !== "function") return "";
    // Remove non-content elements
    $$("script, style, nav, header, footer, noscript, iframe, svg, img").remove();
    // Prefer main, fallback to body
    const main = $$("main").first();
    const html = (main.length ? main : $$("body")).html() ?? "";
    return this.turndown.turndown(html);
  }

  async start(): Promise<Page[]> {
    this.pages = [];

    const crawler = new CheerioCrawler({
      maxConcurrency: MAX_CONCURRENCY,
      maxRequestsPerMinute: MAX_RPM,
      maxRequestsPerCrawl: MAX_REQUESTS,
      requestHandlerTimeoutSecs: 30,
      navigationTimeoutSecs: 20,

      preNavigationHooks: [
        async ({ request }) => {
          if (!this.sameHost(request.url)) request.skipNavigation = true;
          request.headers ||= {};
          request.headers["user-agent"] = USER_AGENT;
        },
      ],

      requestHandler: async ({ request, $, contentType, enqueueLinks }) => {
        if (!$ || !contentType?.type?.includes("text/html")) return;

        const $$ = $ as MinimalCheerio;
        const markdown = this.stripAndMarkdown($);
        const title = $$("title").first().text().trim();

        if (markdown.length >= MIN_TEXT_LEN) {
          this.pages.push({ url: request.url, title, text: markdown });
        }

        await enqueueLinks({
          selector: "a[href]",
          transformRequestFunction: (opts: RequestOptions) => {
            if (!opts.url) return null;
            try {
              const normalized = normalizeUrl(request.url, opts.url);
              return this.sameHost(normalized) ? { ...opts, url: normalized } : null;
            } catch {
              return null;
            }
          },
        });
      },

      failedRequestHandler: async ({ request }) => {
        log.warning(`Request failed: ${request.url} (retries: ${request.retryCount})`);
      },
    });

    await crawler.run(this.urls.map((url) => ({ url })));
    return this.pages;
  }
}

/** ---------------------------
 *  DB upsert (idempotent) with embeddings (admin client)
 *  -------------------------- */
async function upsertPage(page: Page) {
  const chunks = chunkText(page.text);

  for (const chunk of chunks) {
    const content_sha256 = sha256(`${page.url}|${chunk}`);

    // Create embedding for the chunk
    const emb = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: chunk,
    });

    const { error } = await supabaseAdmin
      .from("documents")
      .upsert(
        {
          url: page.url,
          title: page.title,
          content: chunk,
          content_sha256,
          embedding: emb.data[0].embedding,
        },
        { onConflict: "content_sha256" }
      );

    if (error) {
      console.error(`[upsert error] ${page.url}`, error);
    }
  }

  console.log(`Stored: ${page.url} (${chunks.length} chunk${chunks.length > 1 ? "s" : ""})`);
}

/** ---------------------------
 *  Retrieval helper (anon client) — optional smoke test
 *  -------------------------- */
export async function retrieveDocs(query: string, k = 5, threshold = 0.7) {
  const emb = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  });

  const { data, error } = await supabaseClient.rpc("match_documents", {
    query_embedding: emb.data[0].embedding,
    match_threshold: threshold,
    match_count: k,
  });

  if (error) throw error;
  return data ?? [];
}

/** ---------------------------
 *  Main
 *  -------------------------- */
async function main() {
  const crawler = new Crawler([SITE_URL]);
  const pages = await crawler.start();

  for (const page of pages) {
    await upsertPage(page);
  }

  console.log(`Done. Pages processed: ${pages.length}`);

  // Optional smoke test:
  // const results = await retrieveDocs("test query about my site");
  // console.log(results);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
