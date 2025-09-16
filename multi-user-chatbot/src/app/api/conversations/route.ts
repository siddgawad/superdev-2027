// src/app/api/conversations/route.ts
import { supabaseAdminNode } from "@/lib/supabase-admin-node";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const { userId, title }: { userId?: string | null; title?: string | null } = await req.json().catch(() => ({}));
  const { data, error } = await supabaseAdminNode
    .from("conversations")
    .insert([{ user_id: userId ?? null, title: title ?? null }])
    .select("id")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ id: data.id });
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);

  let qb = supabaseAdminNode
    .from("conversations")
    .select("id, created_at, user_id, title")
    .order("created_at", { ascending: false })
    .limit(limit);

  qb = userId ? qb.eq("user_id", userId) : qb.is("user_id", null);

  const { data, error } = await qb;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ conversations: data ?? [] });
}
