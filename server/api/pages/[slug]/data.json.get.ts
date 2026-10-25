import type { SectionsFragment } from "@bettercms-ai/nuxt";

/**
 * A CMS page (home / about / contact): its head meta from the snapshot, and its sections as the
 * hosted renderer draws them — markup, scoped stylesheet and the runtime its forms, sliders and
 * tabs need. One renderer for every site, so the page is the hosted site's and the editor's.
 *
 * Read once, while `nuxt generate` prerenders the route; the answer ships in that route's payload.
 * Without the project settings (see server/utils/bcms.ts) `sections` is null and the page renders
 * its title only, with no network call. With them, a page that is not published yet is null too
 * (the API answers 404); any other failure FAILS the build, because a deploy that silently
 * replaced the live home page with an empty one would be worse than no deploy.
 */
// The build renders each page twice (its HTML and its static JSON): one API read serves both.
const fragments = new Map<string, Promise<SectionsFragment | null>>();

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") ?? "home";
  const page = getPage(slug);
  const bcms = bcmsSite();
  let sections: Promise<SectionsFragment | null> | undefined = fragments.get(slug);
  if (!sections) {
    sections = bcms ? bcms.sections(slug) : Promise.resolve(null);
    fragments.set(slug, sections);
  }
  return {
    slug,
    title: page?.title ?? null,
    metaTitle: page?.metaTitle ?? null,
    metaDescription: page?.metaDescription ?? null,
    sections: await sections,
  };
});
