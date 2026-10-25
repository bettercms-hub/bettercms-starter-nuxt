/**
 * Local-dev snapshot: write `bcms-content.json` (entries grouped into `collections`, plus pages
 * and forms) — the same shape the BetterCMS deploy Action generates on every publish. The static
 * Nuxt build reads everything from this file, so run it before `npm run dev` / `npm run build`.
 *
 *   NUXT_PUBLIC_BCMS_API_URL=… NUXT_PUBLIC_BCMS_WORKSPACE=… BCMS_API_KEY=… node scripts/fetch-content.mjs
 *
 * Reads `.env` when there is one (Node's own loader), and the BCMS_* / PUBLIC_BCMS_* spellings too.
 */
import { writeFile } from "node:fs/promises";

try {
  process.loadEnvFile(".env");
} catch {
  // no .env: the environment alone
}
const env = (name) => process.env[`NUXT_PUBLIC_BCMS_${name}`] || process.env[`BCMS_${name}`] || process.env[`PUBLIC_BCMS_${name}`];
const apiUrl = env("API_URL") ?? "https://api.bettercms.ai";
const workspace = env("WORKSPACE");
const apiKey = process.env.BCMS_API_KEY;
if (!workspace || !apiKey) {
  console.error("Set NUXT_PUBLIC_BCMS_WORKSPACE and BCMS_API_KEY (see .env.example).");
  process.exit(1);
}

const get = async (path) => {
  const res = await fetch(`${apiUrl}/api/v1/delivery/${workspace}/${path}`, { headers: { "X-API-Key": apiKey } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return (await res.json())?.data ?? null;
};

const [entries, pages, forms] = await Promise.all([
  get("content-entries?perPage=100&depth=1"),
  get("pages?perPage=100"),
  get("forms"),
]);

const collections = {};
for (const e of entries?.items ?? []) {
  const model = e?._meta?.modelSlug ?? "unknown";
  (collections[model] ??= []).push(e);
}

const snapshot = {
  $schema: "bcms-content/v1",
  workspace,
  collections,
  pages: pages?.items ?? [],
  forms: forms?.items ?? [],
  turnstileSiteKey: forms?.turnstileSiteKey ?? null,
};
await writeFile("bcms-content.json", JSON.stringify(snapshot, null, 2));
const counts = Object.entries(collections).map(([m, v]) => `${v.length} ${m}`).join(", ");
console.log(`Wrote bcms-content.json: ${snapshot.pages.length} page(s), ${snapshot.forms.length} form(s), entries [${counts}].`);
