/** Schema builders (https://schema.org) — the same nodes the Astro starter's lib/seo.ts emits. */
import type { Author, AuthorRef, BlogPostFields, CaseStudyFields, Site } from "#shared/types/content";

export type Json = Record<string, unknown>;

/** The hydrated author entry, or null when the reference is unset or arrived as a bare id. */
export const authorEntry = (a: AuthorRef | undefined) => (!a || typeof a === "string" ? null : a);
export const authorData = (a: AuthorRef | undefined): Author | null => authorEntry(a)?.data ?? null;

export const organizationSchema = (s: Site): Json => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: s.brandName,
  ...(s.seoDescription ? { description: s.seoDescription } : {}),
  ...(s.ogImage?.url ? { logo: s.ogImage.url } : {}),
});

export const blogPostingSchema = (post: BlogPostFields): Json => {
  const author = authorData(post.author);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.coverImage?.url ? { image: post.coverImage.url } : {}),
    ...(post.publishedDate ? { datePublished: post.publishedDate } : {}),
    ...(author ? { author: { "@type": "Person", name: author.name, ...(author.role ? { jobTitle: author.role } : {}) } } : {}),
  };
};

export const caseStudySchema = (c: CaseStudyFields): Json => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: c.title,
  ...(c.summary ? { description: c.summary } : {}),
  ...(c.coverImage?.url ? { image: c.coverImage.url } : {}),
  ...(c.client ? { about: c.client } : {}),
});
