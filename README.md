# BetterCMS Marketing Starter (Nuxt)

The **Nuxt** starter for the BetterCMS *Marketing Starter* template: a polished, fully static
marketing site rendered from a BetterCMS project. Nuxt 4, Vue 3, TypeScript, Tailwind v4.

- **Home / About / Contact** — CMS pages, drawn as their **sections** by BetterCMS's own
  renderer, so they match the hosted site and the editor's canvas. The Contact page carries a
  real **form block**, so submissions land in your project's inbox.
- **Blog** and **Case Studies** — content collections, listed and rendered as static pages in
  this site's own Vue markup, every value bound for click-to-edit.

Create a site from this template in the BetterCMS dashboard (pick *Marketing Starter* → *Nuxt*)
and it's deployed and wired automatically. Or run it locally below.

## The slug contract

This site reads these slugs from the CMS — they match the template's seeded content. Keep them in
sync if you rename models/pages (and mirror changes in `bettercms-starter`, `bettercms-starter-astro`
and `bettercms-starter-react`, the Next.js, Astro and React twins):

| Kind  | Slugs |
|-------|-------|
| Pages | `home`, `about`, `contact` |
| Models| `blog-post`, `case-study`, `author` |

## Run locally

```bash
cp .env.example .env            # set NUXT_PUBLIC_BCMS_WORKSPACE + _PROJECT_ID + BCMS_API_KEY (content:read)
npm install
npm run fetch-content           # writes bcms-content.json (pages, forms, entries)
npm run dev                     # http://localhost:3000
```

## Prerendered, not a server

`npm run build` is **`nuxt generate`**: every route is rendered once, at build time, to its own
`index.html` under **`.output/public`** — the folder to deploy. No Nitro server runs in
production. That matters beyond page speed: BetterCMS reads the deployed HTML per route for the
publish-time static annotation, the sitemap, `llms.txt`, and AEO.

The dynamic routes (`/blog/[slug]`, `/case-studies/[slug]`) are listed from the content snapshot
in `nuxt.config.ts` (`nitro.prerender.routes`), so a new post appears as a new HTML file on the
next build; publishing in the CMS triggers that build automatically. A route that fails to render
fails the build. `/404.html` is the real not-found page (`app/pages/404.vue`), not an empty shell.

## Where content comes from

Collections and page titles render from `bcms-content.json`, the build snapshot — no API key at
build time. It's gitignored, read on the server by `server/utils/content.ts` (absent → empty) and
served to the pages by the routes under `server/api/`, whose answers are baked into each page
(and written as static JSON, for a refetch). Regenerate it with `npm run fetch-content` after
editing content. On BetterCMS hosting the deploy Action writes it before each build.

The pages' sections are read from BetterCMS at build time (`bcms.sections(slug)`,
`server/api/pages/`). The platform sets `NUXT_PUBLIC_BCMS_API_URL`, `_WORKSPACE` and
`_PROJECT_ID` on every build. Without them (a fresh clone, CI) Home / About / Contact render
their title only and nothing reaches the network; with them, an unreachable API fails the build
rather than publish empty pages. The sections bring their own stylesheet and scripts, so a
Content-Security-Policy must allow inline scripts.

At runtime only the footer newsletter talks to the API.

## Visual editing

Collection entries render in this site's own markup, bound with `@bettercms-ai/nuxt`:
`entryAttrs(entry)` on each card and article, `entryField(entry, path)` on each value,
`imageAttrs(value, { sizes })` (an optimized `<img>` with a srcset) merged with the image's
`entryField`, and `rich(value)` for rich text. On an entry's own page each value also carries
`data-bcms-field`, as the Astro starter writes it (`app/utils/bcms.ts`). The author is its own
entry, bound to its own fields. If you render a value, bind it — an unbound value falls back to
fuzzy text matching.

`app/plugins/bcms.client.ts` starts the live bridge: when the editor asks the page to re-render,
it refetches the page's data instead of reloading the frame. Every page names BetterCMS in
`<meta name="generator">` (`nuxt.config.ts`).

## Design

`app/assets/css/global.css` is shared byte-for-byte with the other starters; `design.md` explains it.
`public/bcms-presentation.json` gives the BetterCMS renderer this theme's geometry and chrome.
