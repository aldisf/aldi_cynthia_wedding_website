import type { APIRoute } from 'astro';
import type { AstroCookies } from 'astro';
import { getAllMessages, toggleMessageVisibility, deleteMessage } from '../../../lib/supabase';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

// Middleware to check admin authentication
function isAuthenticated(cookies: AstroCookies): boolean {
  const authCookie = cookies.get('admin_auth');
  return authCookie?.value === 'authenticated';
}

// GET /api/admin/messages - Get all messages
export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const messages = await getAllMessages();
    return new Response(
      JSON.stringify({ messages }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch messages' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST /api/admin/messages - Add a new message (admin can add on behalf of someone)
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { guest_name, content } = body;

    if (!guest_name || !content) {
      return new Response(
        JSON.stringify({ error: 'Guest name and content are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase.from('messages').insert({
      guest_name,
      content,
      is_visible: true,
    }).select().single();

    if (error) {
      console.error('Error creating message:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create message. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating message:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PATCH /api/admin/messages - Toggle message visibility
export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { id, is_visible } = body;

    if (!id || typeof is_visible !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'ID and visibility status are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await toggleMessageVisibility(id, is_visible);

    if (!result.success) {
      console.error('Error updating message visibility:', result.error);
      return new Response(
        JSON.stringify({ error: 'Failed to update message. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating message:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/admin/messages - Delete a message
export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Message ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await deleteMessage(id);

    if (!result.success) {
      console.error('Error deleting message:', result.error);
      return new Response(
        JSON.stringify({ error: 'Failed to delete message. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
