import { f as getGuestByCode, u as updateGuestRSVP } from '../../chunks/supabase_Bx56jtZG.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response(
      JSON.stringify({ error: "Guest code is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const guest = await getGuestByCode(code);
    if (!guest) {
      return new Response(
        JSON.stringify({ error: "Invalid invitation link" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        name: guest.name,
        email: guest.email,
        invitedTo: guest.invited_to,
        rsvpStatus: guest.rsvp_status,
        maxPlusOnes: guest.max_plus_ones,
        attendingCount: guest.attending_count,
        dietaryNotes: guest.dietary_notes,
        songRequest: guest.song_request,
        attendingEvents: guest.attending_events
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching guest:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch guest information" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      guestCode,
      attending,
      attendingCount,
      dietary,
      songRequest,
      events,
      email
    } = body;
    if (!guestCode || !attending) {
      return new Response(
        JSON.stringify({ error: "Guest code and attendance status are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const guest = await getGuestByCode(guestCode);
    if (!guest) {
      return new Response(
        JSON.stringify({ error: "Invalid invitation link" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    const maxAllowed = 1 + (guest.max_plus_ones || 0);
    const requestedCount = parseInt(attendingCount) || 0;
    if (requestedCount > maxAllowed) {
      return new Response(
        JSON.stringify({ error: `Maximum ${maxAllowed} attendees allowed` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const updateData = {
      rsvp_status: attending === "yes" ? "yes" : "no"
    };
    if (attending === "yes") {
      updateData.attending_count = requestedCount;
      updateData.dietary_notes = dietary?.trim() || null;
      updateData.song_request = songRequest?.trim() || null;
      updateData.attending_events = events || [];
    } else {
      updateData.attending_count = 0;
    }
    if (email) {
      updateData.email = email.trim();
    }
    const result = await updateGuestRSVP(guestCode, updateData);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || "Failed to submit RSVP" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: attending === "yes" ? "Thank you for confirming your attendance!" : "Thank you for letting us know."
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return new Response(
      JSON.stringify({ error: "Failed to submit RSVP" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
