import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { getAllMessages, toggleMessageVisibility, deleteMessage, addAdminMessage } from '../../../lib/db';

export const prerender = false;

const MAX_MESSAGE_LENGTH = 1000;

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
  } catch {
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

    if (content.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await addAdminMessage(guest_name.trim(), content.trim());

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to create message. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: result.message }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
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
      return new Response(
        JSON.stringify({ error: 'Failed to update message. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
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
      return new Response(
        JSON.stringify({ error: 'Failed to delete message. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to delete message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
