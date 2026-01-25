import { e as createComponent, g as addAttribute, k as renderHead, r as renderTemplate, q as renderSlot, l as renderScript, h as createAstro, m as maybeRenderHead, u as unescapeHTML } from './astro/server_BruaL4hw.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */
import { c as config } from './config_B7u3G6-8.mjs';

const $$Astro$2 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = config.site.title,
    description = config.site.description,
    hideNav = false,
    bodyClass = ""
  } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(config.site.ogImage, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet"><title>${title}</title>${renderHead()}</head> <body${addAttribute(bodyClass, "class")}> ${!hideNav && renderTemplate`<nav class="nav" id="main-nav"> <div class="container"> <div class="flex items-center justify-between"> <a href="/" class="nav-link font-serif text-lg tracking-wider"> ${config.couple.person1.name} & ${config.couple.person2.name} </a> <!-- Desktop Navigation --> <div class="hidden md:flex items-center gap-8"> <a href="#story" class="nav-link">Story</a> <a href="#events" class="nav-link">Events</a> <a href="#gallery" class="nav-link">Gallery</a> <a href="#messages" class="nav-link">Wishes</a> <a href="#rsvp" class="nav-link">RSVP</a> </div> <!-- Mobile Menu Button --> <button class="md:hidden nav-link p-2" id="mobile-menu-btn" aria-label="Open menu"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> </div> </nav>

      <!-- Mobile Menu -->
      <div class="mobile-menu" id="mobile-menu"> <button class="absolute top-6 right-6 p-2 text-2xl" id="mobile-menu-close" aria-label="Close menu">
&times;
</button> <a href="#story" class="nav-link">Story</a> <a href="#events" class="nav-link">Events</a> <a href="#gallery" class="nav-link">Gallery</a> <a href="#messages" class="nav-link">Wishes</a> <a href="#rsvp" class="nav-link">RSVP</a> </div>`} ${renderSlot($$result, $$slots["default"])} <footer class="bg-secondary py-12"> <div class="container text-center"> <p class="font-serif text-2xl mb-2"> ${config.couple.person1.name} & ${config.couple.person2.name} </p> <p class="text-muted text-sm"> ${new Date(config.weddingDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </p> </div> </footer> ${renderScript($$result, "/Users/aldisf/workspace/wedding_website_v2/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/layouts/Layout.astro", void 0);

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const { person1, person2 } = config.couple;
  const weddingDate = new Date(config.weddingDate);
  const formattedDate = weddingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const heroImages = config.heroImages;
  const fonts = config.heroFontSizes;
  return renderTemplate`${maybeRenderHead()}<section class="relative h-screen min-h-[600px] flex items-center justify-center md:justify-start overflow-hidden" id="hero"${addAttribute(`
    --hero-tagline-mobile: ${fonts.tagline.mobile};
    --hero-tagline-desktop: ${fonts.tagline.desktop};
    --hero-names-mobile: ${fonts.names.mobile};
    --hero-names-desktop: ${fonts.names.desktop};
    --hero-ampersand-mobile: ${fonts.ampersand.mobile};
    --hero-ampersand-desktop: ${fonts.ampersand.desktop};
    --hero-date-mobile: ${fonts.date.mobile};
    --hero-date-desktop: ${fonts.date.desktop};
  `, "style")} data-astro-cid-bbe6dxrz> <!-- Background Images Slideshow --> <div class="absolute inset-0 z-0" data-astro-cid-bbe6dxrz> ${heroImages.map((image, index) => renderTemplate`<div${addAttribute(`hero-slide absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === 0 ? "opacity-100" : "opacity-0"}`, "class")}${addAttribute(`background-image: url('${image.src}')`, "style")}${addAttribute(index, "data-slide-index")} data-astro-cid-bbe6dxrz></div>`)} <div class="hero-overlay absolute inset-0" data-astro-cid-bbe6dxrz></div> </div> <!-- Content --> <div class="relative z-10 text-center md:text-left text-white px-6 md:px-16 lg:px-24" data-astro-cid-bbe6dxrz> <p class="hero-tagline uppercase tracking-[0.3em] mb-4 opacity-90 animate-fade-in" data-astro-cid-bbe6dxrz>
We're getting married
</p> <h1 class="font-serif mb-6 animate-fade-in-delay-1" data-astro-cid-bbe6dxrz> <span class="hero-names block" data-astro-cid-bbe6dxrz>${person1.name}</span> <span class="hero-ampersand block my-4 font-sans font-light" data-astro-cid-bbe6dxrz>&</span> <span class="hero-names block" data-astro-cid-bbe6dxrz>${person2.name}</span> </h1> <div class="hero-divider flex items-center gap-4 justify-center md:justify-start my-8 animate-fade-in-delay-2" data-astro-cid-bbe6dxrz> <span class="text-accent" data-astro-cid-bbe6dxrz>&#10084;</span> <div class="w-16 md:w-24 h-px bg-accent" data-astro-cid-bbe6dxrz></div> </div> <p class="hero-date font-light tracking-wide animate-fade-in-delay-2" data-astro-cid-bbe6dxrz> ${formattedDate} </p> </div> <!-- Scroll Indicator --> <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white scroll-indicator" data-astro-cid-bbe6dxrz> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-bbe6dxrz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" data-astro-cid-bbe6dxrz></path> </svg> </div> </section>  ${renderScript($$result, "/Users/aldisf/workspace/wedding_website_v2/src/components/Hero.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/components/Hero.astro", void 0);

const $$Countdown = createComponent(($$result, $$props, $$slots) => {
  const weddingDate = config.weddingDate;
  return renderTemplate`${maybeRenderHead()}<section class="section bg-secondary" id="countdown"> <div class="container"> <div class="text-center animate-on-scroll"> <h2 class="section-title">Counting Down To</h2> <p class="section-subtitle">The day we say "I do"</p> </div> <div class="flex justify-center gap-4 md:gap-8 lg:gap-12 stagger-children" id="countdown-timer"${addAttribute(weddingDate, "data-wedding-date")}> <div class="countdown-item"> <span class="countdown-number" id="countdown-days">--</span> <span class="countdown-label">Days</span> </div> <div class="countdown-item"> <span class="countdown-number" id="countdown-hours">--</span> <span class="countdown-label">Hours</span> </div> <div class="countdown-item"> <span class="countdown-number" id="countdown-minutes">--</span> <span class="countdown-label">Minutes</span> </div> <div class="countdown-item"> <span class="countdown-number" id="countdown-seconds">--</span> <span class="countdown-label">Seconds</span> </div> </div> </div> </section> ${renderScript($$result, "/Users/aldisf/workspace/wedding_website_v2/src/components/Countdown.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/components/Countdown.astro", void 0);

const $$CoupleDetails = createComponent(($$result, $$props, $$slots) => {
  const { person1, person2 } = config.couple;
  return renderTemplate`${maybeRenderHead()}<section class="section" id="story"> <div class="container"> <div class="text-center animate-on-scroll"> <h2 class="section-title">Our Story</h2> <p class="section-subtitle">Two hearts, one love</p> </div> <div class="max-w-4xl mx-auto"> <div class="grid md:grid-cols-2 gap-12 md:gap-16"> <!-- Person 1 --> <div class="text-center slide-from-left"> <div class="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-secondary"> <img src="/images/person1.jpg"${addAttribute(person1.fullName, "alt")} class="w-full h-full object-cover" onerror="this.style.display='none'"> </div> <h3 class="font-serif text-2xl mb-2">${person1.fullName}</h3> <p class="text-muted text-sm uppercase tracking-wider mb-4">The Groom</p> <p class="text-muted text-sm">
Son of<br> <span class="text-text">${person1.parents}</span> </p> </div> <!-- Person 2 --> <div class="text-center slide-from-right"> <div class="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-secondary"> <img src="/images/person2.jpg"${addAttribute(person2.fullName, "alt")} class="w-full h-full object-cover" onerror="this.style.display='none'"> </div> <h3 class="font-serif text-2xl mb-2">${person2.fullName}</h3> <p class="text-muted text-sm uppercase tracking-wider mb-4">The Bride</p> <p class="text-muted text-sm">
Daughter of<br> <span class="text-text">${person2.parents}</span> </p> </div> </div> <!-- Optional Love Story --> <div class="mt-16 text-center animate-on-scroll"> <div class="divider"> <span class="text-accent font-serif text-xl">&hearts;</span> </div> <p class="text-muted max-w-2xl mx-auto leading-relaxed mt-6"> <!-- You can add your love story here -->
We met and knew that our lives would never be the same.
          Now, we're excited to start this new chapter together and
          we would be honored to have you celebrate with us.
</p> </div> </div> </div> </section>`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/components/CoupleDetails.astro", void 0);

const $$EventsTimeline = createComponent(($$result, $$props, $$slots) => {
  const events = config.events;
  const icons = {
    church: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`,
    utensils: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    party: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>`,
    default: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  };
  return renderTemplate`${maybeRenderHead()}<section class="section bg-secondary" id="events"> <div class="container"> <div class="text-center animate-on-scroll"> <h2 class="section-title">Wedding Day Timeline</h2> <p class="section-subtitle">Join us in celebrating our special moments</p> </div> <div class="max-w-4xl mx-auto"> <div class="timeline"> ${events.map((event, index) => renderTemplate`<div${addAttribute(`timeline-item animate-on-scroll`, "class")}${addAttribute(`transition-delay: ${index * 150}ms`, "style")}> <div class="timeline-dot"></div> <div class="bg-white p-6 shadow-sm"> <div class="flex items-start gap-4 mb-4"> <div class="text-primary flex-shrink-0">${unescapeHTML(icons[event.icon] || icons.default)}</div> <div class="flex-1"> <h3 class="font-serif text-xl mb-1">${event.title}</h3> <p class="text-primary font-medium"> ${event.time} ${event.endTime && ` - ${event.endTime}`} </p> </div> </div> <p class="text-muted mb-3">${event.description}</p> <div class="text-sm"> <p class="font-medium">${event.venue}</p> <p class="text-muted">${event.address}</p> </div> ${event.dressCode && renderTemplate`<p class="mt-3 text-sm"> <span class="text-muted">Dress Code:</span>${" "} <span class="font-medium">${event.dressCode}</span> </p>`} ${event.mapsLink && renderTemplate`<a${addAttribute(event.mapsLink, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:text-accent transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg>
View on Maps
</a>`} </div> </div>`)} </div> </div> </div> </section>`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/components/EventsTimeline.astro", void 0);

const $$Venue = createComponent(($$result, $$props, $$slots) => {
  const venuesWithMaps = config.events.filter((event) => event.mapsEmbed);
  const mainVenue = venuesWithMaps[0];
  return renderTemplate`${maybeRenderHead()}<section class="section" id="venue"> <div class="container"> <div class="text-center animate-on-scroll"> <h2 class="section-title">Venue</h2> <p class="section-subtitle">Where we'll celebrate our love</p> </div> ${mainVenue && renderTemplate`<div class="max-w-4xl mx-auto"> <div class="grid md:grid-cols-2 gap-8 items-center"> <!-- Venue Info --> <div class="animate-on-scroll"> <h3 class="font-serif text-2xl mb-4">${mainVenue.title}</h3> <div class="space-y-4"> <div class="flex items-start gap-3"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> <div> <p class="font-medium">${mainVenue.venue}</p> <p class="text-muted">${mainVenue.address}</p> </div> </div> <div class="flex items-start gap-3"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <div> <p class="font-medium">${mainVenue.time}</p> <p class="text-muted">${mainVenue.description}</p> </div> </div> ${mainVenue.mapsLink && renderTemplate`<a${addAttribute(mainVenue.mapsLink, "href")} target="_blank" rel="noopener noreferrer" class="btn btn-outline mt-4">
Get Directions
</a>`} </div> </div> <!-- Map --> <div class="animate-on-scroll aspect-square md:aspect-auto md:h-80 bg-secondary rounded overflow-hidden"> ${mainVenue.mapsEmbed ? renderTemplate`<iframe${addAttribute(mainVenue.mapsEmbed, "src")} width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"${addAttribute(`Map to ${mainVenue.venue}`, "title")}></iframe>` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-muted"> <p>Map will be displayed here</p> </div>`} </div> </div>  ${venuesWithMaps.length > 1 && renderTemplate`<div class="mt-12 pt-12 border-t border-secondary"> <h3 class="font-serif text-xl text-center mb-8">Other Venues</h3> <div class="grid md:grid-cols-2 gap-6"> ${venuesWithMaps.slice(1).map((venue) => renderTemplate`<div class="bg-secondary p-6 animate-on-scroll"> <h4 class="font-serif text-lg mb-2">${venue.title}</h4> <p class="font-medium">${venue.venue}</p> <p class="text-muted text-sm mb-2">${venue.address}</p> <p class="text-primary text-sm">${venue.time}</p> ${venue.mapsLink && renderTemplate`<a${addAttribute(venue.mapsLink, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:text-accent">
View on Maps &rarr;
</a>`} </div>`)} </div> </div>`} </div>`} </div> </section>`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/components/Venue.astro", void 0);

const $$Gallery = createComponent(($$result, $$props, $$slots) => {
  const gallery = config.gallery;
  return renderTemplate`${maybeRenderHead()}<section class="section bg-secondary" id="gallery" data-astro-cid-ihllb3az> <div class="container" data-astro-cid-ihllb3az> <div class="text-center animate-on-scroll" data-astro-cid-ihllb3az> <h2 class="section-title" data-astro-cid-ihllb3az>Our Gallery</h2> <p class="section-subtitle" data-astro-cid-ihllb3az>Moments we've shared together</p> </div> <div class="gallery-grid stagger-children" id="gallery-grid" data-astro-cid-ihllb3az> ${gallery.map((photo, index) => renderTemplate`<div class="gallery-item"${addAttribute(index, "data-index")}${addAttribute(photo.src, "data-src")}${addAttribute(photo.alt, "data-alt")} data-astro-cid-ihllb3az> <img${addAttribute(photo.src, "src")}${addAttribute(photo.alt, "alt")} loading="lazy" onerror="this.parentElement.classList.add('bg-gray-200'); this.style.display='none';" data-astro-cid-ihllb3az> </div>`)} </div> ${gallery.length === 0 && renderTemplate`<div class="text-center py-12 text-muted" data-astro-cid-ihllb3az> <p data-astro-cid-ihllb3az>Photos coming soon...</p> </div>`} </div> </section> <!-- Lightbox --> <div class="lightbox" id="lightbox" data-astro-cid-ihllb3az> <button class="lightbox-close" id="lightbox-close" aria-label="Close lightbox" data-astro-cid-ihllb3az>&times;</button> <button class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Previous image" data-astro-cid-ihllb3az> <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ihllb3az> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-astro-cid-ihllb3az></path> </svg> </button> <button class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Next image" data-astro-cid-ihllb3az> <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ihllb3az> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-ihllb3az></path> </svg> </button> <img src="" alt="" id="lightbox-img" data-astro-cid-ihllb3az> </div>  ${renderScript($$result, "/Users/aldisf/workspace/wedding_website_v2/src/components/Gallery.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/components/Gallery.astro", void 0);

const $$Astro$1 = createAstro();
const $$MessageBoard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$MessageBoard;
  const { guestCode, guestName } = Astro2.props;
  const { title, subtitle } = config.messageBoard;
  const canPost = !!guestCode;
  return renderTemplate`${maybeRenderHead()}<section class="section" id="messages" data-astro-cid-k4ji3z3e> <div class="container" data-astro-cid-k4ji3z3e> <div class="text-center animate-on-scroll" data-astro-cid-k4ji3z3e> <h2 class="section-title" data-astro-cid-k4ji3z3e>${title}</h2> <p class="section-subtitle" data-astro-cid-k4ji3z3e>${subtitle}</p> </div> <div class="max-w-4xl mx-auto" data-astro-cid-k4ji3z3e>  ${canPost && renderTemplate`<div class="mb-12 animate-on-scroll" data-astro-cid-k4ji3z3e> <form id="message-form" class="bg-secondary p-6 md:p-8" data-astro-cid-k4ji3z3e> <input type="hidden" name="guestCode"${addAttribute(guestCode, "value")} data-astro-cid-k4ji3z3e> <div class="mb-4" data-astro-cid-k4ji3z3e> <label class="form-label" data-astro-cid-k4ji3z3e>Your Name</label> <input type="text" name="name" class="form-input"${addAttribute(guestName || "", "value")}${addAttribute(!!guestName, "readonly")} required data-astro-cid-k4ji3z3e> </div> <div class="mb-4" data-astro-cid-k4ji3z3e> <label class="form-label" data-astro-cid-k4ji3z3e>Your Message</label> <textarea name="message" class="form-textarea" placeholder="Write your wishes for the couple..." required data-astro-cid-k4ji3z3e></textarea> </div> <button type="submit" class="btn btn-primary w-full md:w-auto" data-astro-cid-k4ji3z3e>
Send Wishes
</button> <p id="form-status" class="mt-4 text-sm hidden" data-astro-cid-k4ji3z3e></p> </form> </div>`}  <div id="messages-container" class="messages-grid" data-astro-cid-k4ji3z3e> <div class="text-center py-8 text-muted" data-astro-cid-k4ji3z3e> <p data-astro-cid-k4ji3z3e>Loading messages...</p> </div> </div>  <div class="text-center mt-8 hidden" id="load-more-container" data-astro-cid-k4ji3z3e> <button class="btn btn-outline" id="load-more-btn" data-astro-cid-k4ji3z3e>
Load More Messages
</button> </div> </div> </div> </section>  ${renderScript($$result, "/Users/aldisf/workspace/wedding_website_v2/src/components/MessageBoard.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/components/MessageBoard.astro", void 0);

const $$Registry = createComponent(($$result, $$props, $$slots) => {
  const { message, items } = config.registry;
  return renderTemplate`${renderTemplate`${maybeRenderHead()}<section class="section bg-secondary" id="registry"><div class="container"><div class="text-center animate-on-scroll"><h2 class="section-title">Gift Registry</h2><p class="section-subtitle">${message}</p></div><div class="max-w-4xl mx-auto"><div class="grid md:grid-cols-2 gap-6">${items.map((item, index) => renderTemplate`<div class="bg-white p-6 shadow-sm animate-on-scroll"${addAttribute(`transition-delay: ${index * 100}ms`, "style")}>${item.image && renderTemplate`<div class="aspect-video bg-gray-100 mb-4 overflow-hidden"><img${addAttribute(item.image, "src")}${addAttribute(item.name, "alt")} class="w-full h-full object-cover" loading="lazy" onerror="this.parentElement.classList.add('hidden')"></div>`}<h3 class="font-serif text-xl mb-2">${item.name}</h3><p class="text-muted text-sm mb-4">${item.description}</p>${item.targetAmount && renderTemplate`<div class="mb-4"><div class="flex justify-between text-sm mb-1"><span class="text-muted">Goal</span><span class="font-medium">$${item.targetAmount.toLocaleString()}</span></div></div>`}${item.link && renderTemplate`<a${addAttribute(item.link, "href")}${addAttribute(item.external ? "_blank" : void 0, "target")}${addAttribute(item.external ? "noopener noreferrer" : void 0, "rel")} class="btn btn-outline w-full">${item.external ? "View Registry" : "Contribute"}${item.external && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>`}</a>`}</div>`)}</div><div class="mt-12 text-center animate-on-scroll"><div class="divider"><span class="text-accent">&hearts;</span></div><p class="text-muted text-sm mt-4">
Your presence at our wedding is the greatest gift of all.
</p></div></div></div></section>`}`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/components/Registry.astro", void 0);

const $$Astro = createAstro();
const $$RSVP = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$RSVP;
  const {
    guestCode,
    guestName,
    guestEmail,
    invitedTo = "both",
    maxPlusOnes = 0,
    existingRsvpStatus = "pending",
    existingAttendingCount = 0,
    existingDietaryNotes = "",
    existingSongRequest = "",
    existingAttendingEvents = []
  } = Astro2.props;
  const { deadline} = config.rsvp;
  const hasValidCode = !!guestCode;
  const hasExistingRsvp = existingRsvpStatus !== "pending";
  const deadlineDate = new Date(deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const maxAttendees = 1 + maxPlusOnes;
  const showAttendingFields = existingRsvpStatus === "yes" || existingAttendingCount > 0;
  return renderTemplate`${maybeRenderHead()}<section class="section" id="rsvp" data-astro-cid-e3hz6gho> <div class="container" data-astro-cid-e3hz6gho> <div class="text-center animate-on-scroll" data-astro-cid-e3hz6gho> <h2 class="section-title" data-astro-cid-e3hz6gho>RSVP</h2> <p class="section-subtitle" data-astro-cid-e3hz6gho> ${hasValidCode ? `Please let us know if you can make it by ${formattedDeadline}` : "Please use your unique invitation link to RSVP"} </p> </div> <div class="max-w-xl mx-auto" data-astro-cid-e3hz6gho> ${hasValidCode ? renderTemplate`<form id="rsvp-form" class="bg-secondary p-6 md:p-8 animate-on-scroll"${addAttribute(maxAttendees, "data-max-attendees")} data-astro-cid-e3hz6gho> <input type="hidden" name="guestCode"${addAttribute(guestCode, "value")} data-astro-cid-e3hz6gho> <input type="hidden" name="maxPlusOnes"${addAttribute(maxPlusOnes, "value")} data-astro-cid-e3hz6gho>  <div class="mb-6" data-astro-cid-e3hz6gho> <label class="form-label" data-astro-cid-e3hz6gho>Your Name</label> <input type="text" name="name" class="form-input"${addAttribute(guestName || "", "value")}${addAttribute(!!guestName, "readonly")} required data-astro-cid-e3hz6gho> </div>  <div class="mb-6" data-astro-cid-e3hz6gho> <label class="form-label" data-astro-cid-e3hz6gho>Email Address</label> <input type="email" name="email" class="form-input"${addAttribute(guestEmail || "", "value")} placeholder="your@email.com" data-astro-cid-e3hz6gho> </div>  ${maxPlusOnes > 0 ? (
    /* Guest has allocated plus ones - show attending count selector */
    renderTemplate`<div class="mb-6" data-astro-cid-e3hz6gho> <label class="form-label" data-astro-cid-e3hz6gho>How many people will be attending?</label> <p class="text-sm text-muted mb-3" data-astro-cid-e3hz6gho>
You have been allocated ${maxPlusOnes} additional guest${maxPlusOnes > 1 ? "s" : ""}.
</p> <select name="attendingCount" class="form-input" id="attending-count-select" data-astro-cid-e3hz6gho> <option value="0"${addAttribute(existingAttendingCount === 0, "selected")} data-astro-cid-e3hz6gho>Not attending (0 people)</option> ${Array.from({ length: maxAttendees }, (_, i) => renderTemplate`<option${addAttribute(i + 1, "value")}${addAttribute(existingAttendingCount === i + 1, "selected")} data-astro-cid-e3hz6gho> ${i + 1} ${i + 1 === 1 ? "person" : "people"} attending
</option>`)} </select> </div>`
  ) : (
    /* No plus ones - simple yes/no */
    renderTemplate`<div class="mb-6" data-astro-cid-e3hz6gho> <label class="form-label" data-astro-cid-e3hz6gho>Will you be attending?</label> <div class="grid grid-cols-2 gap-4 mt-2" data-astro-cid-e3hz6gho> <label class="rsvp-option" data-astro-cid-e3hz6gho> <input type="radio" name="attending" value="yes" class="sr-only" required${addAttribute(existingRsvpStatus === "yes", "checked")} data-astro-cid-e3hz6gho> <div class="rsvp-option-box" data-astro-cid-e3hz6gho> <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-e3hz6gho> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-e3hz6gho></path> </svg> <span data-astro-cid-e3hz6gho>Joyfully Accept</span> </div> </label> <label class="rsvp-option" data-astro-cid-e3hz6gho> <input type="radio" name="attending" value="no" class="sr-only" required${addAttribute(existingRsvpStatus === "no", "checked")} data-astro-cid-e3hz6gho> <div class="rsvp-option-box" data-astro-cid-e3hz6gho> <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-e3hz6gho> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-e3hz6gho></path> </svg> <span data-astro-cid-e3hz6gho>Regretfully Decline</span> </div> </label> </div> </div>`
  )}  ${invitedTo === "both" && renderTemplate`<div${addAttribute(`mb-6 rsvp-attending-only ${showAttendingFields ? "show" : ""}`, "class")} data-astro-cid-e3hz6gho> <label class="form-label" data-astro-cid-e3hz6gho>Which events will you attend?</label> <div class="space-y-2 mt-2" data-astro-cid-e3hz6gho> <label class="flex items-center gap-3" data-astro-cid-e3hz6gho> <input type="checkbox" name="events" value="ceremony"${addAttribute(existingAttendingEvents.length === 0 || existingAttendingEvents.includes("ceremony"), "checked")} class="w-4 h-4" data-astro-cid-e3hz6gho> <span data-astro-cid-e3hz6gho>Holy Matrimony</span> </label> <label class="flex items-center gap-3" data-astro-cid-e3hz6gho> <input type="checkbox" name="events" value="reception"${addAttribute(existingAttendingEvents.length === 0 || existingAttendingEvents.includes("reception"), "checked")} class="w-4 h-4" data-astro-cid-e3hz6gho> <span data-astro-cid-e3hz6gho>Reception & Dinner</span> </label> </div> </div>`}  ${renderTemplate`<div${addAttribute(`mb-6 rsvp-attending-only ${showAttendingFields ? "show" : ""}`, "class")} data-astro-cid-e3hz6gho> <label class="form-label" data-astro-cid-e3hz6gho>Dietary Restrictions or Allergies</label> <textarea name="dietary" class="form-textarea" rows="2" placeholder="Please let us know of any dietary requirements..." data-astro-cid-e3hz6gho>${existingDietaryNotes || ""}</textarea> </div>`}  ${renderTemplate`<div${addAttribute(`mb-6 rsvp-attending-only ${showAttendingFields ? "show" : ""}`, "class")} data-astro-cid-e3hz6gho> <label class="form-label" data-astro-cid-e3hz6gho>Song Request (Optional)</label> <input type="text" name="songRequest" class="form-input" placeholder="What song will get you on the dance floor?"${addAttribute(existingSongRequest || "", "value")} data-astro-cid-e3hz6gho> </div>`}  <button type="submit" class="btn btn-primary w-full" data-astro-cid-e3hz6gho> ${hasExistingRsvp ? "Update RSVP" : "Submit RSVP"} </button> <p id="rsvp-status" class="mt-4 text-sm text-center hidden" data-astro-cid-e3hz6gho></p> </form>` : renderTemplate`<div class="text-center py-12 bg-secondary animate-on-scroll" data-astro-cid-e3hz6gho> <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto mb-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-e3hz6gho> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-astro-cid-e3hz6gho></path> </svg> <p class="text-muted mb-4" data-astro-cid-e3hz6gho>
Check your email or message for your personal invitation link.
</p> <p class="text-sm text-muted" data-astro-cid-e3hz6gho>
If you haven't received an invitation, please contact us directly.
</p> </div>`} </div> </div> </section>  ${renderScript($$result, "/Users/aldisf/workspace/wedding_website_v2/src/components/RSVP.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/components/RSVP.astro", void 0);

export { $$Hero as $, $$Countdown as a, $$CoupleDetails as b, $$EventsTimeline as c, $$Venue as d, $$Gallery as e, $$MessageBoard as f, $$Registry as g, $$RSVP as h, $$Layout as i };
