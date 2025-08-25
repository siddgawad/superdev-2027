import { prisma } from "../../../lib/db";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, db: "ok" });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, db: "down" }), { status: 500 });
  }
}
