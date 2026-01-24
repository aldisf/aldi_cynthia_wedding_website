import type { APIRoute } from 'astro';
import { getVisibleMessages, createMessage, getGuestByCode } from '../../lib/supabase';

export const prerender = false;

// GET /api/messages - Get visible messages
export const GET: APIRoute = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  try {
    const { messages, hasMore } = await getVisibleMessages(page, limit);

    return new Response(JSON.stringify({ messages, hasMore }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch messages' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST /api/messages - Create a new message
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { guestCode, name, message } = body;

    // Validate required fields
    if (!guestCode || !message) {
      return new Response(
        JSON.stringify({ error: 'Guest code and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify guest exists
    const guest = await getGuestByCode(guestCode);
    if (!guest) {
      return new Response(
        JSON.stringify({ error: 'Invalid invitation link' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the message
    const result = await createMessage(guestCode, message.trim(), name || guest.name);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to send message' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating message:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
