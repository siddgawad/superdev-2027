import { env } from "../../../env"; // triggers validation
export async function GET() {
  // no DB yet, just prove the app can read env
  return Response.json({ ok: true, hasDbUrl: !!env.DATABASE_URL });
}
