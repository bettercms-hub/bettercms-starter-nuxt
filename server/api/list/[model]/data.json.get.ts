import { ROUTED_MODELS, type BlogPostFields, type CaseStudyFields, type SnapshotEntry } from "#shared/types/content";

/** A routed collection's entries, for its index page's cards. */
export default defineEventHandler((event) => {
  const model = getRouterParam(event, "model") ?? "";
  if (!(model in ROUTED_MODELS)) throw createError({ statusCode: 404, statusMessage: `No collection "${model}"` });
  return listEntries<BlogPostFields & CaseStudyFields>(model) as SnapshotEntry<BlogPostFields & CaseStudyFields>[];
});
