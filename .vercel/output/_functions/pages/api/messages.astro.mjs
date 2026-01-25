import { e as getVisibleMessages, f as getGuestByCode, h as createMessage } from '../../chunks/supabase_Bx56jtZG.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const page = parseInt(url.searchParams.get("page") || "0");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  try {
    const { messages, hasMore } = await getVisibleMessages(page, limit);
    return new Response(JSON.stringify({ messages, hasMore }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch messages" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { guestCode, name, message } = body;
    if (!guestCode || !message) {
      return new Response(
        JSON.stringify({ error: "Guest code and message are required" }),
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
    const result = await createMessage(guestCode, message.trim(), name || guest.name);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || "Failed to send message" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating message:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send message" }),
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
