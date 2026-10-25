import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";

/**
 * A fully static site. `npm run build` is `nuxt generate`: every route is rendered once, at build
 * time, to its own `index.html` under `.output/public` — which is what BetterCMS hosting serves,
 * and what it reads per route for the publish-time static annotation, the sitemap, llms.txt and
 * AEO. No Nitro server runs in production.
 *
 * The deploy Action writes `bcms-content.json` BEFORE the build (no API key at build time). The
 * dynamic routes are listed from it here, because a static build only renders what it is told
 * about: `crawlLinks` would find them through the index pages too, but an explicit list makes a
 * post reachable even when nothing links to it yet.
 */
type SnapshotLike = { collections?: Record<string, Array<{ slug?: string }>> };
const snapshot: SnapshotLike = (() => {
  try {
    return JSON.parse(readFileSync("bcms-content.json", "utf8")) as SnapshotLike;
  } catch {
    return {};
  }
})();
const slugs = (model: string): string[] =>
  (snapshot.collections?.[model] ?? []).map((e) => e.slug).filter((s): s is string => typeof s === "string" && s !== "");

const posts = slugs("blog-post");
const cases = slugs("case-study");

const routes = [
  "/",
  "/about",
  "/contact",
  "/blog",
  "/case-studies",
  ...posts.map((s) => `/blog/${s}`),
  ...cases.map((s) => `/case-studies/${s}`),
  // Not visited, only the source of /404.html (see the prerender hook below).
  "/404",
  // The pages' data as static JSON. A client-side navigation reads each route's _payload.json
  // instead; these are what a refetch reads — the editor canvas asking for a re-render
  // (`refreshNuxtData`, plugins/bcms.client.ts). Without them that refetch would 404 on a static
  // host and blank the page it was meant to refresh.
  "/api/site.json",
  ...["home", "about", "contact"].map((s) => `/api/pages/${s}/data.json`),
  "/api/list/blog-post/data.json",
  "/api/list/case-study/data.json",
  ...posts.map((s) => `/api/entry/blog-post/${s}/data.json`),
  ...cases.map((s) => `/api/entry/case-study/${s}/data.json`),
];

export default defineNuxtConfig({
  compatibilityDate: "2026-10-01",
  devtools: { enabled: false },
  css: ["~/assets/css/global.css"],
  vite: { plugins: [tailwindcss()] },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        // Static on purpose: the build is plain files, so there is no Nitro runtime to stamp it
        // (the adapter's bcmsNitroPlugin does that for a server-rendered Nuxt app instead).
        { name: "generator", content: "BetterCMS" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // Overridden by NUXT_PUBLIC_BCMS_API_URL. Read in the browser by the footer newsletter,
      // the one thing that talks to the API at runtime.
      bcmsApiUrl: process.env.PUBLIC_BCMS_API_URL || "https://api.bettercms.ai",
      // Absolute origin for canonical + og:url. The deploy Action sets it; unset (a local
      // build), those two tags are omitted rather than emitted as relative URLs.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || "",
    },
  },

  nitro: {
    prerender: {
      routes,
      crawlLinks: true,
      // A route that fails to render fails the build — never a deploy with a page missing.
      failOnError: true,
    },
    hooks: {
      // Nuxt prerenders /404.html as an empty SPA shell that draws the error page only after
      // JavaScript runs. Ship the real page instead: /404 (pages/404.vue) is written AS
      // 404.html — the file BetterCMS hosting and other static hosts serve for an unmatched
      // path — and the shell is dropped.
      "prerender:generate"(route) {
        if (route.route === "/404.html") route.skip = true;
        if (route.route === "/404") route.fileName = "/404.html";
      },
    },
  },
});
