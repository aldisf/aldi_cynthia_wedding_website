import { createClient, type Client, type InStatement } from '@libsql/client';
import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

// ============================================
// Turso Client
// ============================================

let _client: Client | null = null;

function getClient(): Client {
  if (!_client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error('TURSO_DATABASE_URL environment variable is not set');
    }

    _client = createClient({
      url,
      authToken: authToken || undefined,
    });
  }
  return _client;
}

// ============================================
// Types
// ============================================

export interface Guest {
  id: string;
  unique_code: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvp_status: 'pending' | 'yes' | 'no';
  max_plus_ones: number;
  attending_count: number;
  dietary_notes: string | null;
  song_request: string | null;
  invited_to: 'ceremony' | 'reception' | 'both';
  guest_side: 'groom' | 'bride' | 'both';
  attending_events: string[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  guest_id: string | null;
  guest_name: string;
  content: string;
  is_visible: boolean;
  created_at: string;
}

export interface RegistryItem {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  link: string | null;
  target_amount: number | null;
  current_amount: number;
  is_claimed: boolean;
  claimed_by_guest_id: string | null;
  created_at: string;
}

// ============================================
// Schema Migration
// ============================================

const SCHEMA_VERSION = 1;

const MIGRATIONS: Record<number, string[]> = {
  1: [
    `CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY
    )`,
    `CREATE TABLE IF NOT EXISTS guests (
      id TEXT PRIMARY KEY,
      unique_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'yes', 'no')),
      max_plus_ones INTEGER DEFAULT 0,
      attending_count INTEGER DEFAULT 0,
      dietary_notes TEXT,
      song_request TEXT,
      invited_to TEXT DEFAULT 'both' CHECK (invited_to IN ('ceremony', 'reception', 'both')),
      guest_side TEXT DEFAULT 'both' CHECK (guest_side IN ('groom', 'bride', 'both')),
      attending_events TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_guests_unique_code ON guests(unique_code)`,
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      guest_id TEXT REFERENCES guests(id) ON DELETE SET NULL,
      guest_name TEXT NOT NULL,
      content TEXT NOT NULL,
      is_visible INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_messages_visible ON messages(is_visible, created_at DESC)`,
    `CREATE TABLE IF NOT EXISTS registry_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      link TEXT,
      target_amount REAL,
      current_amount REAL DEFAULT 0,
      is_claimed INTEGER DEFAULT 0,
      claimed_by_guest_id TEXT REFERENCES guests(id) ON DELETE SET NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
  ],
};

let _initialized = false;

async function ensureSchema(): Promise<void> {
  if (_initialized) return;

  const db = getClient();

  // Create schema_version table if it doesn't exist
  await db.execute(
    `CREATE TABLE IF NOT EXISTS schema_version (version INTEGER PRIMARY KEY)`
  );

  // Get current version
  const result = await db.execute(
    `SELECT MAX(version) as version FROM schema_version`
  );
  const currentVersion = (result.rows[0]?.version as number) ?? 0;

  // Run pending migrations
  for (let v = currentVersion + 1; v <= SCHEMA_VERSION; v++) {
    const statements = MIGRATIONS[v];
    if (!statements) continue;

    for (const sql of statements) {
      await db.execute(sql);
    }
    await db.execute({
      sql: `INSERT OR REPLACE INTO schema_version (version) VALUES (?)`,
      args: [v],
    });
  }

  _initialized = true;
}

// ============================================
// Row Helpers
// ============================================

function rowToGuest(row: Record<string, unknown>): Guest {
  return {
    id: row.id as string,
    unique_code: row.unique_code as string,
    name: row.name as string,
    email: (row.email as string) || null,
    phone: (row.phone as string) || null,
    rsvp_status: (row.rsvp_status as Guest['rsvp_status']) || 'pending',
    max_plus_ones: (row.max_plus_ones as number) || 0,
    attending_count: (row.attending_count as number) || 0,
    dietary_notes: (row.dietary_notes as string) || null,
    song_request: (row.song_request as string) || null,
    invited_to: (row.invited_to as Guest['invited_to']) || 'both',
    guest_side: (row.guest_side as Guest['guest_side']) || 'both',
    attending_events: parseJsonArray(row.attending_events as string),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function rowToMessage(row: Record<string, unknown>): Message {
  return {
    id: row.id as string,
    guest_id: (row.guest_id as string) || null,
    guest_name: row.guest_name as string,
    content: row.content as string,
    is_visible: Boolean(row.is_visible),
    created_at: row.created_at as string,
  };
}

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ============================================
// Guest Code Generation (Cryptographically secure)
// ============================================

function generateRandomCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  // Convert to base36 and take 8 chars
  let code = '';
  for (const byte of bytes) {
    code += byte.toString(36);
  }
  return code.slice(0, 8).padEnd(8, '0');
}

export async function generateUniqueGuestCode(): Promise<string> {
  await ensureSchema();
  const db = getClient();
  const maxRetries = 5;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const code = generateRandomCode();

    const result = await db.execute({
      sql: `SELECT id FROM guests WHERE unique_code = ?`,
      args: [code],
    });

    if (result.rows.length === 0) {
      return code;
    }
  }

  // Fallback: use part of a UUID for uniqueness
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

export function generateGuestCode(): string {
  return generateRandomCode();
}

// ============================================
// Guest Functions
// ============================================

export async function getGuestByCode(code: string): Promise<Guest | null> {
  await ensureSchema();
  const db = getClient();

  const result = await db.execute({
    sql: `SELECT * FROM guests WHERE unique_code = ?`,
    args: [code],
  });

  if (result.rows.length === 0) return null;
  return rowToGuest(result.rows[0] as unknown as Record<string, unknown>);
}

export async function updateGuestRSVP(
  code: string,
  data: {
    rsvp_status: 'yes' | 'no';
    attending_count?: number;
    dietary_notes?: string;
    song_request?: string;
    attending_events?: string[];
    email?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  await ensureSchema();
  const db = getClient();

  const setClauses: string[] = ['rsvp_status = ?', 'updated_at = datetime(\'now\')'];
  const args: (string | number | null)[] = [data.rsvp_status];

  if (data.attending_count !== undefined) {
    setClauses.push('attending_count = ?');
    args.push(data.attending_count);
  }
  if (data.dietary_notes !== undefined) {
    setClauses.push('dietary_notes = ?');
    args.push(data.dietary_notes);
  }
  if (data.song_request !== undefined) {
    setClauses.push('song_request = ?');
    args.push(data.song_request);
  }
  if (data.attending_events !== undefined) {
    setClauses.push('attending_events = ?');
    args.push(JSON.stringify(data.attending_events));
  }
  if (data.email !== undefined) {
    setClauses.push('email = ?');
    args.push(data.email);
  }

  args.push(code);

  try {
    await db.execute({
      sql: `UPDATE guests SET ${setClauses.join(', ')} WHERE unique_code = ?`,
      args,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getAllGuests(): Promise<Guest[]> {
  await ensureSchema();
  const db = getClient();

  const result = await db.execute(
    `SELECT * FROM guests ORDER BY name ASC`
  );

  return result.rows.map((row) =>
    rowToGuest(row as unknown as Record<string, unknown>)
  );
}

export async function getRSVPStats(): Promise<{
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  totalGuests: number;
}> {
  const guests = await getAllGuests();

  const stats = {
    total: guests.length,
    confirmed: 0,
    declined: 0,
    pending: 0,
    totalGuests: 0,
  };

  guests.forEach((guest) => {
    if (guest.rsvp_status === 'yes') {
      stats.confirmed++;
      stats.totalGuests += guest.attending_count || 0;
    } else if (guest.rsvp_status === 'no') {
      stats.declined++;
    } else {
      stats.pending++;
    }
  });

  return stats;
}

export async function importGuests(
  guests: Array<{
    name: string;
    email?: string;
    phone?: string;
    invited_to?: 'ceremony' | 'reception' | 'both';
    guest_side?: 'groom' | 'bride' | 'both';
    max_plus_ones?: number;
  }>
): Promise<{ success: number; failed: number; errors: string[] }> {
  await ensureSchema();
  const db = getClient();
  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (const guest of guests) {
    const uniqueCode = await generateUniqueGuestCode();
    const id = randomUUID();

    try {
      await db.execute({
        sql: `INSERT INTO guests (id, unique_code, name, email, phone, invited_to, guest_side, max_plus_ones, rsvp_status, attending_count, attending_events)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, '[]')`,
        args: [
          id,
          uniqueCode,
          guest.name,
          guest.email || null,
          guest.phone || null,
          guest.invited_to || 'both',
          guest.guest_side || 'both',
          guest.max_plus_ones || 0,
        ],
      });
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(
        `Failed to import ${guest.name}: ${(error as Error).message}`
      );
    }
  }

  return results;
}

export async function addGuest(guest: {
  name: string;
  email?: string;
  phone?: string;
  invited_to?: 'ceremony' | 'reception' | 'both';
  guest_side?: 'groom' | 'bride' | 'both';
  max_plus_ones?: number;
}): Promise<{ success: boolean; guest?: Guest; error?: string }> {
  await ensureSchema();
  const db = getClient();

  const uniqueCode = await generateUniqueGuestCode();
  const id = randomUUID();

  try {
    await db.execute({
      sql: `INSERT INTO guests (id, unique_code, name, email, phone, invited_to, guest_side, max_plus_ones, rsvp_status, attending_count, attending_events)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, '[]')`,
      args: [
        id,
        uniqueCode,
        guest.name,
        guest.email || null,
        guest.phone || null,
        guest.invited_to || 'both',
        guest.guest_side || 'both',
        guest.max_plus_ones || 0,
      ],
    });

    const result = await db.execute({
      sql: `SELECT * FROM guests WHERE id = ?`,
      args: [id],
    });

    if (result.rows.length === 0) {
      return { success: false, error: 'Insert succeeded but failed to retrieve guest' };
    }

    return {
      success: true,
      guest: rowToGuest(result.rows[0] as unknown as Record<string, unknown>),
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteGuest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await ensureSchema();
  const db = getClient();

  try {
    // Verify exists
    const existing = await db.execute({
      sql: `SELECT id FROM guests WHERE id = ?`,
      args: [id],
    });

    if (existing.rows.length === 0) {
      return { success: false, error: 'Guest not found' };
    }

    await db.execute({
      sql: `DELETE FROM guests WHERE id = ?`,
      args: [id],
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================
// Message Functions
// ============================================

export async function getVisibleMessages(
  page = 0,
  limit = 10
): Promise<{ messages: Message[]; hasMore: boolean }> {
  await ensureSchema();
  const db = getClient();

  const offset = page * limit;

  const countResult = await db.execute(
    `SELECT COUNT(*) as count FROM messages WHERE is_visible = 1`
  );
  const totalCount = (countResult.rows[0]?.count as number) || 0;

  const result = await db.execute({
    sql: `SELECT * FROM messages WHERE is_visible = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    args: [limit, offset],
  });

  const messages = result.rows.map((row) =>
    rowToMessage(row as unknown as Record<string, unknown>)
  );

  return {
    messages,
    hasMore: (page + 1) * limit < totalCount,
  };
}

export async function createMessage(
  guestCode: string,
  content: string,
  guestName: string
): Promise<{ success: boolean; error?: string }> {
  const guest = await getGuestByCode(guestCode);
  if (!guest) {
    return { success: false, error: 'Invalid guest code' };
  }

  const db = getClient();
  const id = randomUUID();

  try {
    await db.execute({
      sql: `INSERT INTO messages (id, guest_id, guest_name, content, is_visible)
            VALUES (?, ?, ?, ?, 1)`,
      args: [id, guest.id, guestName || guest.name, content],
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function addAdminMessage(
  guestName: string,
  content: string
): Promise<{ success: boolean; message?: Message; error?: string }> {
  await ensureSchema();
  const db = getClient();
  const id = randomUUID();

  try {
    await db.execute({
      sql: `INSERT INTO messages (id, guest_name, content, is_visible)
            VALUES (?, ?, ?, 1)`,
      args: [id, guestName, content],
    });

    const result = await db.execute({
      sql: `SELECT * FROM messages WHERE id = ?`,
      args: [id],
    });

    if (result.rows.length === 0) {
      return { success: false, error: 'Insert succeeded but failed to retrieve message' };
    }

    return {
      success: true,
      message: rowToMessage(result.rows[0] as unknown as Record<string, unknown>),
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getAllMessages(): Promise<Message[]> {
  await ensureSchema();
  const db = getClient();

  const result = await db.execute(
    `SELECT * FROM messages ORDER BY created_at DESC`
  );

  return result.rows.map((row) =>
    rowToMessage(row as unknown as Record<string, unknown>)
  );
}

export async function toggleMessageVisibility(
  id: string,
  isVisible: boolean
): Promise<{ success: boolean; error?: string }> {
  await ensureSchema();
  const db = getClient();

  try {
    await db.execute({
      sql: `UPDATE messages SET is_visible = ? WHERE id = ?`,
      args: [isVisible ? 1 : 0, id],
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteMessage(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await ensureSchema();
  const db = getClient();

  try {
    await db.execute({
      sql: `DELETE FROM messages WHERE id = ?`,
      args: [id],
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================
// Raw SQL (for admin endpoint)
// ============================================

export async function executeRawSQL(
  sql: string,
  args?: (string | number | null)[]
): Promise<{ columns: string[]; rows: Record<string, unknown>[]; rowsAffected: number }> {
  await ensureSchema();
  const db = getClient();

  const result = await db.execute({
    sql,
    args: args || [],
  });

  return {
    columns: result.columns,
    rows: result.rows as unknown as Record<string, unknown>[],
    rowsAffected: result.rowsAffected,
  };
}
