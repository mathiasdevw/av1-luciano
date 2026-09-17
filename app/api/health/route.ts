import { database, databaseConfigured } from '@/lib/database';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
export async function GET() {
  const headers = { 'Cache-Control': 'no-store' };
  if (!databaseConfigured()) return Response.json({ status: 'unavailable' }, { status: 503, headers });
  try {
    const sql = database();
    await sql`SELECT id FROM av1_attempts LIMIT 1`;
    return Response.json({ status: 'ok' }, { headers });
  } catch {
    return Response.json({ status: 'unavailable' }, { status: 503, headers });
  }
}
