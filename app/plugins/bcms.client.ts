import { startBcmsLive } from "@bettercms-ai/nuxt";

/**
 * Live editing, browser only. In the BetterCMS editor's canvas, a structural draft edit asks the
 * page to re-render, and this answers by refetching the page's data (`refreshNuxtData`) instead
 * of reloading the frame, which would end the author's inline edit. A draft render also loads the
 * click-to-edit overlay. On the public site it is inert: a publish rebuilds the static site.
 */
export default defineNuxtPlugin(() => {
  startBcmsLive({ refresh: () => refreshNuxtData() });
});
