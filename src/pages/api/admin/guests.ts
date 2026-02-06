import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { getAllGuests, importGuests, getRSVPStats, addGuest, deleteGuest } from '../../../lib/db';

export const prerender = false;

// GET /api/admin/guests - Get all guests
export const GET: APIRoute = async ({ cookies, url }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const action = url.searchParams.get('action');

  try {
    if (action === 'stats') {
      const stats = await getRSVPStats();
      return new Response(
        JSON.stringify(stats),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const guests = await getAllGuests();
    return new Response(
      JSON.stringify({ guests }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch guests' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST /api/admin/guests - Create guest or import CSV
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { action, guests, guest } = body;

    // Import multiple guests from CSV
    if (action === 'import' && guests) {
      const result = await importGuests(guests);
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add single guest
    if (action === 'add' && guest) {
      const result = await addGuest({
        name: guest.name,
        email: guest.email || undefined,
        phone: guest.phone || undefined,
        invited_to: guest.invited_to || 'both',
        guest_side: guest.guest_side || 'both',
        max_plus_ones: guest.max_plus_ones || 0,
      });

      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.error || 'Failed to add guest. Please try again.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, guest: result.guest }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/admin/guests - Delete a guest
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
        JSON.stringify({ error: 'Guest ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await deleteGuest(id);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to delete guest.' }),
        { status: result.error === 'Guest not found' ? 404 : 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to delete guest. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
