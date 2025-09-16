
import { supabaseAdminNode } from "@/lib/supabase-admin-node";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const id = params.id;
  if (!id) return new Response("Missing conversation id", { status: 400 });

  const { data, error } = await supabaseAdminNode
    .from("messages")
    .select("id, conversation_id, speaker, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ messages: data ?? [] });
}
