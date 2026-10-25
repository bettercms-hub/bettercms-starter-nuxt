/**
 * Field shapes seeded by the Marketing Starter template — the same names and shapes as the Astro
 * and React starters' `src/lib/content.ts`, so the four repos stay diffable. Shared by the server
 * (which reads the snapshot) and the app (which renders it); nothing here runs.
 */

/**
 * One entry as the snapshot carries it: the delivery API's entry, verbatim. `id` is what
 * `entryAttrs` / `entryField` address the entry by (`entry:<id>:<path>`); a snapshot written
 * before ids were kept has none, and the helpers then render the element unbound, never fail.
 */
export type SnapshotEntry<T> = { id?: string; slug: string; data: T };

/** Repeatable/zoned-array fields arrive as `{ repeatable: [...] }` at delivery depth ≥ 1. */
export type Repeatable<T> = { repeatable?: T[] };
export type NavLink = { label: string; href: string };
export type Social = { label: string; href: string };

export type Image = { url: string; alt?: string; altText?: string; width?: number; height?: number };
export type RichText = { html: string };

/** The `site` global — brand + chrome + SEO defaults, all editable in the CMS.
 *  Every field here is seeded by the template and rendered somewhere; if you add one,
 *  render it, and if you stop rendering one, drop it from the seed. */
export type Site = {
  brandName?: string;
  navLinks?: Repeatable<NavLink>;
  footerTagline?: string;
  socials?: Repeatable<Social>;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: Image;
  twitterHandle?: string;
};

export type Author = { name: string; role?: string; bio?: string; avatar?: Image };
/** A reference at delivery depth 1 is the referenced entry (`{ id, slug, data }`); at depth 0 its id. */
export type AuthorRef = SnapshotEntry<Author> | string;

export type BlogPostFields = {
  title: string;
  excerpt?: string;
  coverImage?: Image;
  body?: RichText;
  author?: AuthorRef;
  publishedDate?: string;
};
export type CaseStudyFields = {
  title: string;
  client?: string;
  summary?: string;
  coverImage?: Image;
  body?: RichText;
};

/** A form as the snapshot carries it — only what the footer newsletter reads. */
export type NewsletterForm = {
  id: string;
  name?: string;
  submitLabel?: string | null;
  successMessage?: string | null;
  honeypotField?: string | null;
  fields?: Array<{ key: string; type: string; label?: string; placeholder?: string | null }>;
};

/** The two collections that get their own routes. `author` renders inside a post. */
export const ROUTED_MODELS = { "blog-post": "/blog", "case-study": "/case-studies" } as const;
export type RoutedModel = keyof typeof ROUTED_MODELS;
