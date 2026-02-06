import { createHmac, timingSafeEqual } from 'crypto';
import type { AstroCookies } from 'astro';

const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

function getSecret(): string {
  const secret = import.meta.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET environment variable is not set');
  }
  return secret;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Create a signed session token: timestamp.signature
 */
export function createSessionToken(): string {
  const secret = getSecret();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = sign(timestamp, secret);
  return `${timestamp}.${signature}`;
}

/**
 * Verify a session token is valid and not expired
 */
export function verifySessionToken(token: string): boolean {
  try {
    const secret = getSecret();
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [timestamp, signature] = parts;
    const expectedSignature = sign(timestamp, secret);

    // Timing-safe comparison
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) return false;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return false;

    // Check expiry
    const tokenTime = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    if (now - tokenTime > SESSION_MAX_AGE) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if the request is authenticated via admin cookie
 */
export function isAuthenticated(cookies: AstroCookies): boolean {
  const authCookie = cookies.get('admin_auth');
  if (!authCookie?.value) return false;
  return verifySessionToken(authCookie.value);
}

/**
 * Timing-safe password comparison
 */
export function verifyPassword(input: string, expected: string): boolean {
  const inputBuf = Buffer.from(input);
  const expectedBuf = Buffer.from(expected);

  if (inputBuf.length !== expectedBuf.length) {
    // Still do a comparison to avoid timing leaks on length
    timingSafeEqual(inputBuf, inputBuf);
    return false;
  }

  return timingSafeEqual(inputBuf, expectedBuf);
}

// ============================================
// Simple Rate Limiter (in-memory, resets on cold start)
// ============================================

const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5;

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.firstAttempt + RATE_LIMIT_WINDOW - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

/**
 * Clean up old rate limit entries (call periodically if needed)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [ip, entry] of loginAttempts.entries()) {
    if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
      loginAttempts.delete(ip);
    }
  }
}
