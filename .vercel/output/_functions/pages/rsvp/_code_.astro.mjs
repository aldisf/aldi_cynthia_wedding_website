import { e as createComponent, o as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, p as Fragment } from '../../chunks/astro/server_BruaL4hw.mjs';
import 'piccolore';
import { $ as $$Hero, a as $$Countdown, b as $$CoupleDetails, c as $$EventsTimeline, d as $$Venue, e as $$Gallery, f as $$MessageBoard, g as $$Registry, h as $$RSVP, i as $$Layout } from '../../chunks/RSVP_CfMl8xS_.mjs';
import { f as getGuestByCode } from '../../chunks/supabase_Bx56jtZG.mjs';
import { c as config } from '../../chunks/config_B7u3G6-8.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$code = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$code;
  const { code } = Astro2.params;
  let guest = null;
  let error = null;
  if (code) {
    try {
      guest = await getGuestByCode(code);
      if (!guest) {
        error = "Invalid invitation link";
      }
    } catch (e) {
      console.error("Error fetching guest:", e);
      error = "Failed to load invitation";
    }
  }
  const pageTitle = guest ? `${guest.name} - ${config.couple.person1.name} & ${config.couple.person2.name}'s Wedding` : config.site.title;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "bodyClass": guest ? "has-welcome-banner" : "" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${error ? renderTemplate`<section class="min-h-screen flex items-center justify-center bg-secondary"> <div class="text-center px-6"> <h1 class="font-serif text-4xl mb-4">Oops!</h1> <p class="text-muted mb-6">${error}</p> <a href="/" class="btn btn-primary">Go to Homepage</a> </div> </section>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`<div class="welcome-banner"> <span class="opacity-90">Welcome,</span>${" "} <span class="font-medium">${guest?.name}</span>!${" "} <span class="opacity-90">You're invited to celebrate with us.</span> </div> <div class="welcome-banner-spacer"></div> ${renderComponent($$result3, "Hero", $$Hero, {})} ${renderComponent($$result3, "Countdown", $$Countdown, {})} ${renderComponent($$result3, "CoupleDetails", $$CoupleDetails, {})} ${renderComponent($$result3, "EventsTimeline", $$EventsTimeline, {})} ${renderComponent($$result3, "Venue", $$Venue, {})} ${renderComponent($$result3, "Gallery", $$Gallery, {})} ${renderComponent($$result3, "MessageBoard", $$MessageBoard, { "guestCode": code, "guestName": guest?.name })} ${renderComponent($$result3, "Registry", $$Registry, {})} ${renderComponent($$result3, "RSVP", $$RSVP, { "guestCode": code, "guestName": guest?.name, "guestEmail": guest?.email, "invitedTo": guest?.invited_to, "maxPlusOnes": guest?.max_plus_ones || 0, "existingRsvpStatus": guest?.rsvp_status, "existingAttendingCount": guest?.attending_count || 0, "existingDietaryNotes": guest?.dietary_notes, "existingSongRequest": guest?.song_request, "existingAttendingEvents": guest?.attending_events || [] })} ` })}`} </main> ` })}`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/pages/rsvp/[code].astro", void 0);

const $$file = "/Users/aldisf/workspace/wedding_website_v2/src/pages/rsvp/[code].astro";
const $$url = "/rsvp/[code]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$code,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
