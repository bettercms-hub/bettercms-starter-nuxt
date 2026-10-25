/**
 * The chrome every route shares: the `site` global (brand, nav, footer, SEO defaults) and the
 * seeded Newsletter form the footer renders. Absent (or renamed) form → the footer drops it.
 */
export default defineEventHandler(() => ({
  site: getSite() ?? null,
  newsletter: getForms().find((f) => /newsletter/i.test(f.name ?? "")) ?? null,
}));
