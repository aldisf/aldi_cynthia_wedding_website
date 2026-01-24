import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Guest {
  id: string;
  unique_code: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvp_status: 'pending' | 'yes' | 'no';
  max_plus_ones: number;    // Allocated by couple (from CSV)
  attending_count: number;  // How many will attend (0 = not coming, 1 = just guest, 2+ = with plus ones)
  dietary_notes: string | null;
  song_request: string | null;
  invited_to: 'ceremony' | 'reception' | 'both';
  guest_side: 'groom' | 'bride' | 'both';  // Which side of the couple the guest belongs to
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

// Helper functions

/**
 * Generate a random 8-character code
 */
function generateRandomCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generate a unique guest code with collision prevention
 * Retries up to 5 times if a collision is detected
 */
export async function generateUniqueGuestCode(): Promise<string> {
  const maxRetries = 5;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const code = generateRandomCode();
    
    // Check if code already exists
    const { data } = await supabase
      .from('guests')
      .select('id')
      .eq('unique_code', code)
      .single();
    
    if (!data) {
      // Code is unique
      return code;
    }
  }
  
  // Fallback: add timestamp suffix to ensure uniqueness
  return generateRandomCode() + Date.now().toString(36).slice(-4);
}

/**
 * Generate a guest code (synchronous version for backward compatibility)
 * Note: For new code, prefer generateUniqueGuestCode() which checks for collisions
 */
export function generateGuestCode(): string {
  return generateRandomCode();
}

/**
 * Get guest by unique code
 */
export async function getGuestByCode(code: string): Promise<Guest | null> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('unique_code', code)
    .single();

  if (error || !data) return null;
  return data as Guest;
}

/**
 * Update guest RSVP
 */
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
  const { error } = await supabase
    .from('guests')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('unique_code', code);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Get visible messages
 */
export async function getVisibleMessages(
  page = 0,
  limit = 10
): Promise<{ messages: Message[]; hasMore: boolean }> {
  const { data, error, count } = await supabase
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    console.error('Error fetching messages:', error);
    return { messages: [], hasMore: false };
  }

  const totalCount = count || 0;
  const hasMore = (page + 1) * limit < totalCount;

  return {
    messages: (data as Message[]) || [],
    hasMore,
  };
}

/**
 * Create a new message
 */
export async function createMessage(
  guestCode: string,
  content: string,
  guestName: string
): Promise<{ success: boolean; error?: string }> {
  // First verify the guest exists
  const guest = await getGuestByCode(guestCode);
  if (!guest) {
    return { success: false, error: 'Invalid guest code' };
  }

  const { error } = await supabase.from('messages').insert({
    guest_id: guest.id,
    guest_name: guestName || guest.name,
    content,
    is_visible: true, // You can set to false if you want moderation first
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Get all guests (for admin)
 */
export async function getAllGuests(): Promise<Guest[]> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
  return (data as Guest[]) || [];
}

/**
 * Get RSVP statistics
 */
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

/**
 * Import guests from CSV data
 */
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
  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (const guest of guests) {
    const uniqueCode = await generateUniqueGuestCode();

    const { data, error } = await supabase.from('guests').insert({
      unique_code: uniqueCode,
      name: guest.name,
      email: guest.email || null,
      phone: guest.phone || null,
      invited_to: guest.invited_to || 'both',
      guest_side: guest.guest_side || 'both',
      max_plus_ones: guest.max_plus_ones || 0,
      rsvp_status: 'pending',
      attending_count: 0,
      attending_events: [],
    }).select('id').single();

    if (error) {
      results.failed++;
      results.errors.push(`Failed to import ${guest.name}: ${error.message}`);
    } else if (!data) {
      // RLS might have blocked the insert without returning an error
      results.failed++;
      results.errors.push(`Failed to import ${guest.name}: Insert was blocked`);
    } else {
      results.success++;
    }
  }

  return results;
}

/**
 * Get all messages (for admin)
 */
export async function getAllMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return (data as Message[]) || [];
}

/**
 * Toggle message visibility
 */
export async function toggleMessageVisibility(
  id: string,
  isVisible: boolean
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('messages')
    .update({ is_visible: isVisible })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Delete a message
 */
export async function deleteMessage(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('messages').delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
