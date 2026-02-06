import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { executeRawSQL } from '../../../lib/db';

export const prerender = false;

// POST /api/admin/sql - Execute arbitrary SQL (admin only)
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { sql, args } = body;

    if (!sql || typeof sql !== 'string') {
      return new Response(
        JSON.stringify({ error: 'SQL query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await executeRawSQL(sql, args || []);

    return new Response(
      JSON.stringify({
        columns: result.columns,
        rows: result.rows,
        rowsAffected: result.rowsAffected,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
