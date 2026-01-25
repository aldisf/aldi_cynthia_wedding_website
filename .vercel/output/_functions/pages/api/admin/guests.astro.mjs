import { s as supabase, g as getRSVPStats, a as getAllGuests, i as importGuests, b as generateUniqueGuestCode } from '../../../chunks/supabase_Bx56jtZG.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function isAuthenticated(cookies) {
  const authCookie = cookies.get("admin_auth");
  return authCookie?.value === "authenticated";
}
const GET = async ({ cookies, url }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  const action = url.searchParams.get("action");
  try {
    if (action === "stats") {
      const stats = await getRSVPStats();
      return new Response(
        JSON.stringify(stats),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const guests = await getAllGuests();
    return new Response(
      JSON.stringify({ guests }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching guests:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch guests" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const POST = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const body = await request.json();
    const { action, guests, guest } = body;
    if (action === "import" && guests) {
      const result = await importGuests(guests);
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    if (action === "add" && guest) {
      const uniqueCode = await generateUniqueGuestCode();
      const { data, error } = await supabase.from("guests").insert({
        unique_code: uniqueCode,
        name: guest.name,
        email: guest.email || null,
        phone: guest.phone || null,
        invited_to: guest.invited_to || "both",
        guest_side: guest.guest_side || "both",
        max_plus_ones: guest.max_plus_ones || 0,
        rsvp_status: "pending",
        attending_count: 0,
        attending_events: []
      }).select().single();
      if (error) {
        console.error("Error adding guest:", error);
        return new Response(
          JSON.stringify({ error: "Failed to add guest. Please try again." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      if (!data) {
        return new Response(
          JSON.stringify({ error: "Failed to add guest. Database operation was blocked." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ success: true, guest: data }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error managing guests:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const DELETE = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Guest ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { data: existingGuest } = await supabase.from("guests").select("id").eq("id", id).single();
    if (!existingGuest) {
      return new Response(
        JSON.stringify({ error: "Guest not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) {
      console.error("Error deleting guest:", error);
      return new Response(
        JSON.stringify({ error: "Failed to delete guest. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting guest:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete guest. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
