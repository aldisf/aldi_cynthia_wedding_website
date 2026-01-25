import { e as createComponent, k as renderHead, l as renderScript, r as renderTemplate, h as createAstro } from '../../chunks/astro/server_BruaL4hw.mjs';
import 'piccolore';
import 'clsx';
import { c as config } from '../../chunks/config_B7u3G6-8.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const authCookie = Astro2.cookies.get("admin_auth");
  if (authCookie?.value === "authenticated") {
    return Astro2.redirect("/admin");
  }
  const pageTitle = `Admin Login - ${config.site.title}`;
  return renderTemplate`<html lang="en" data-astro-cid-rf56lckb> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet"><title>${pageTitle}</title>${renderHead()}</head> <body data-astro-cid-rf56lckb> <div class="login-card" data-astro-cid-rf56lckb> <h1 data-astro-cid-rf56lckb>Admin Login</h1> <p id="error-message" class="error" data-astro-cid-rf56lckb></p> <form id="login-form" data-astro-cid-rf56lckb> <div class="form-group" data-astro-cid-rf56lckb> <label for="password" data-astro-cid-rf56lckb>Password</label> <input type="password" id="password" name="password" required autocomplete="current-password" data-astro-cid-rf56lckb> </div> <button type="submit" data-astro-cid-rf56lckb>Login</button> </form> <a href="/" class="back-link" data-astro-cid-rf56lckb>&larr; Back to website</a> </div> ${renderScript($$result, "/Users/aldisf/workspace/wedding_website_v2/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/Users/aldisf/workspace/wedding_website_v2/src/pages/admin/login.astro", void 0);

const $$file = "/Users/aldisf/workspace/wedding_website_v2/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
