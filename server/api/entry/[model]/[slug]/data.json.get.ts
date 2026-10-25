import { ROUTED_MODELS, type BlogPostFields, type CaseStudyFields, type SnapshotEntry } from "#shared/types/content";

/**
 * One entry of a routed collection. The prerender list (nuxt.config.ts) is derived from this
 * same snapshot, so a miss while building means the snapshot changed under the build: the 404
 * fails the build rather than emit a blank page. A visitor's bad URL never reaches this — the
 * route was never built — and gets the site's 404 page instead.
 */
export default defineEventHandler((event) => {
  const model = getRouterParam(event, "model") ?? "";
  const slug = getRouterParam(event, "slug") ?? "";
  const entry = model in ROUTED_MODELS ? getEntry<BlogPostFields & CaseStudyFields>(model, slug) : undefined;
  if (!entry) throw createError({ statusCode: 404, statusMessage: `${model} not found: ${slug}` });
  return entry as SnapshotEntry<BlogPostFields & CaseStudyFields>;
});
