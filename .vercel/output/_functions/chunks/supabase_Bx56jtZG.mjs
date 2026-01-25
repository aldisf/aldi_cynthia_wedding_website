import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://egwfthapyenvgfjealff.supabase.co";
const supabaseAnonKey = "sb_publishable_EZW2UJVXNUESVi37fqSxRw_HVGU-kHD";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
function generateRandomCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
async function generateUniqueGuestCode() {
  const maxRetries = 5;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const code = generateRandomCode();
    const { data } = await supabase.from("guests").select("id").eq("unique_code", code).single();
    if (!data) {
      return code;
    }
  }
  return generateRandomCode() + Date.now().toString(36).slice(-4);
}
async function getGuestByCode(code) {
  const { data, error } = await supabase.from("guests").select("*").eq("unique_code", code).single();
  if (error || !data) return null;
  return data;
}
async function updateGuestRSVP(code, data) {
  const { error } = await supabase.from("guests").update({
    ...data,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("unique_code", code);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
async function getVisibleMessages(page = 0, limit = 10) {
  const { data, error, count } = await supabase.from("messages").select("*", { count: "exact" }).eq("is_visible", true).order("created_at", { ascending: false }).range(page * limit, (page + 1) * limit - 1);
  if (error) {
    console.error("Error fetching messages:", error);
    return { messages: [], hasMore: false };
  }
  const totalCount = count || 0;
  const hasMore = (page + 1) * limit < totalCount;
  return {
    messages: data || [],
    hasMore
  };
}
async function createMessage(guestCode, content, guestName) {
  const guest = await getGuestByCode(guestCode);
  if (!guest) {
    return { success: false, error: "Invalid guest code" };
  }
  const { error } = await supabase.from("messages").insert({
    guest_id: guest.id,
    guest_name: guestName || guest.name,
    content,
    is_visible: true
    // You can set to false if you want moderation first
  });
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
async function getAllGuests() {
  const { data, error } = await supabase.from("guests").select("*").order("name", { ascending: true });
  if (error) {
    console.error("Error fetching guests:", error);
    return [];
  }
  return data || [];
}
async function getRSVPStats() {
  const guests = await getAllGuests();
  const stats = {
    total: guests.length,
    confirmed: 0,
    declined: 0,
    pending: 0,
    totalGuests: 0
  };
  guests.forEach((guest) => {
    if (guest.rsvp_status === "yes") {
      stats.confirmed++;
      stats.totalGuests += guest.attending_count || 0;
    } else if (guest.rsvp_status === "no") {
      stats.declined++;
    } else {
      stats.pending++;
    }
  });
  return stats;
}
async function importGuests(guests) {
  const results = { success: 0, failed: 0, errors: [] };
  for (const guest of guests) {
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
    }).select("id").single();
    if (error) {
      results.failed++;
      results.errors.push(`Failed to import ${guest.name}: ${error.message}`);
    } else if (!data) {
      results.failed++;
      results.errors.push(`Failed to import ${guest.name}: Insert was blocked`);
    } else {
      results.success++;
    }
  }
  return results;
}
async function getAllMessages() {
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return data || [];
}
async function toggleMessageVisibility(id, isVisible) {
  const { error } = await supabase.from("messages").update({ is_visible: isVisible }).eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
async function deleteMessage(id) {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export { getAllGuests as a, generateUniqueGuestCode as b, getAllMessages as c, deleteMessage as d, getVisibleMessages as e, getGuestByCode as f, getRSVPStats as g, createMessage as h, importGuests as i, supabase as s, toggleMessageVisibility as t, updateGuestRSVP as u };
