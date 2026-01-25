import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D68IUkqF.mjs';
import { manifest } from './manifest_1xW4cD6j.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/login.astro.mjs');
const _page2 = () => import('./pages/admin.astro.mjs');
const _page3 = () => import('./pages/api/admin/guests.astro.mjs');
const _page4 = () => import('./pages/api/admin/login.astro.mjs');
const _page5 = () => import('./pages/api/admin/logout.astro.mjs');
const _page6 = () => import('./pages/api/admin/messages.astro.mjs');
const _page7 = () => import('./pages/api/messages.astro.mjs');
const _page8 = () => import('./pages/api/rsvp.astro.mjs');
const _page9 = () => import('./pages/rsvp/_code_.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/login.astro", _page1],
    ["src/pages/admin/index.astro", _page2],
    ["src/pages/api/admin/guests.ts", _page3],
    ["src/pages/api/admin/login.ts", _page4],
    ["src/pages/api/admin/logout.ts", _page5],
    ["src/pages/api/admin/messages.ts", _page6],
    ["src/pages/api/messages.ts", _page7],
    ["src/pages/api/rsvp.ts", _page8],
    ["src/pages/rsvp/[code].astro", _page9],
    ["src/pages/index.astro", _page10]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "05799572-b6bc-4f83-afe6-dc5f296cb852",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
