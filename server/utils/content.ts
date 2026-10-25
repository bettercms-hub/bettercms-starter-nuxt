import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { NewsletterForm, Site, SnapshotEntry } from "#shared/types/content";

/**
 * Read the deploy Action's build snapshot (`bcms-content.json`): entries grouped under
 * `collections` by model slug (depth-1 hydrated), plus published pages and forms. A static
 * build resolves everything from here — no API key needed at build time. Absent file → empty
 * (e.g. before `npm run fetch-content` locally).
 *
 * Server-only on purpose: `nuxt generate` runs these reads while it prerenders, and the answers
 * reach the browser inside each route's payload. Nothing in the app bundle touches the file.
 */
export interface SnapshotPage {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
}
interface Snapshot {
  workspace?: string;
  collections?: Record<string, SnapshotEntry<unknown>[]>;
  pages?: SnapshotPage[];
  forms?: NewsletterForm[];
  turnstileSiteKey?: string | null;
}

let cache: Snapshot | null = null;
function snap(): Snapshot {
  if (cache) return cache;
  try {
    cache = JSON.parse(readFileSync(resolve(process.cwd(), "bcms-content.json"), "utf8")) as Snapshot;
  } catch {
    cache = {};
  }
  return cache;
}

export const snapshotWorkspace = (): string | undefined => snap().workspace;

export const getPage = (slug: string): SnapshotPage | undefined =>
  (snap().pages ?? []).find((p) => p.slug === slug);
export const getForms = (): NewsletterForm[] => snap().forms ?? [];

export const listEntries = <T>(model: string): SnapshotEntry<T>[] =>
  (snap().collections?.[model] ?? []) as SnapshotEntry<T>[];
export const getEntry = <T>(model: string, slug: string): SnapshotEntry<T> | undefined =>
  listEntries<T>(model).find((e) => e.slug === slug);

/** Singleton models (site/home/…) have exactly one entry — return its data. */
export const getSingleton = <T>(model: string): T | undefined => listEntries<T>(model)[0]?.data;

export const getSite = (): Site | undefined => getSingleton<Site>("site");
