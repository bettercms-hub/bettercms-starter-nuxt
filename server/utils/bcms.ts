import { createBcms, type BcmsSite } from "@bettercms-ai/nuxt";

/**
 * The site's BetterCMS access, for the one thing read from the API at build time: a CMS page's
 * sections, drawn by the hosted renderer (`bcms.sections(slug)`).
 *
 * The platform sets NUXT_PUBLIC_BCMS_API_URL / _WORKSPACE / _PROJECT_ID (and BCMS_*) on every
 * build. Without them — a fresh clone, a CI run, a fork with no project yet — this is `null`:
 * the pages render their title and an empty note, nothing reaches the network, and nothing
 * throws (`createBcms` itself throws on a missing API URL or workspace, so it is only called
 * once all three are known).
 */
const setting = (name: string): string | undefined =>
  process.env[`NUXT_PUBLIC_BCMS_${name}`] || process.env[`BCMS_${name}`] || undefined;

let site: BcmsSite | null | undefined;
export function bcmsSite(): BcmsSite | null {
  if (site !== undefined) return site;
  site = setting("API_URL") && setting("WORKSPACE") && setting("PROJECT_ID") ? createBcms({ env: process.env }) : null;
  return site;
}
