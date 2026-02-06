import type { APIRoute } from 'astro';
import { createSessionToken, verifyPassword, checkRateLimit } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  // Rate limiting
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many login attempts. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateCheck.retryAfter || 900),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    // Get admin password from environment variable
    const adminPassword = import.meta.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!password || !verifyPassword(password, adminPassword)) {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create signed session token
    const token = createSessionToken();

    cookies.set('admin_auth', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Login failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
