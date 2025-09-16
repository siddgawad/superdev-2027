
import { supabaseAdminNode } from "@/lib/supabase-admin-node";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const id = params.id;
  const { title }: { title?: string | null } = await req.json().catch(() => ({}));
  if (!id) return new Response("Missing conversation id", { status: 400 });
  if (typeof title !== "string") return new Response("Missing or invalid title", { status: 400 });

  const { error } = await supabaseAdminNode.from("conversations").update({ title }).eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
