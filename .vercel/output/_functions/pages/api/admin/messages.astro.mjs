import { d as deleteMessage, c as getAllMessages, t as toggleMessageVisibility, s as supabase } from '../../../chunks/supabase_Bx56jtZG.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function isAuthenticated(cookies) {
  const authCookie = cookies.get("admin_auth");
  return authCookie?.value === "authenticated";
}
const GET = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const messages = await getAllMessages();
    return new Response(
      JSON.stringify({ messages }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch messages" }),
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
    const { guest_name, content } = body;
    if (!guest_name || !content) {
      return new Response(
        JSON.stringify({ error: "Guest name and content are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { data, error } = await supabase.from("messages").insert({
      guest_name,
      content,
      is_visible: true
    }).select().single();
    if (error) {
      console.error("Error creating message:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create message. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, message: data }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating message:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const PATCH = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const body = await request.json();
    const { id, is_visible } = body;
    if (!id || typeof is_visible !== "boolean") {
      return new Response(
        JSON.stringify({ error: "ID and visibility status are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const result = await toggleMessageVisibility(id, is_visible);
    if (!result.success) {
      console.error("Error updating message visibility:", result.error);
      return new Response(
        JSON.stringify({ error: "Failed to update message. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating message:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update message" }),
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
        JSON.stringify({ error: "Message ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const result = await deleteMessage(id);
    if (!result.success) {
      console.error("Error deleting message:", result.error);
      return new Response(
        JSON.stringify({ error: "Failed to delete message. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PATCH,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
