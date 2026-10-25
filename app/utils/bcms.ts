/**
 * The binding contract, in one place.
 *
 * Every rendered entry value is declared with the adapter's helpers: `entryAttrs(entry)` on the
 * card or article, `entryField(entry, path)` on each field's element — an ABSOLUTE address
 * (`entry:<id>:<path>`), so the editor binds it without guessing from the rendered text.
 *
 * On an entry's OWN route, a field also carries `data-bcms-field="<path>"` (and
 * `data-bcms-kind`), exactly as the Astro starter's `<BcmsField path>` writes it, so the platform
 * binds this build the same way it binds the other starters. That is `bcmsField` below. Index
 * cards get the absolute address only: a relative `title` on six cards would name six fields.
 */
import { entryField, type EntryRef } from "@bettercms-ai/nuxt";

export function bcmsField(entry: EntryRef, path: string, kind?: "richtext") {
  return { "data-bcms-field": path, ...(kind ? { "data-bcms-kind": kind } : {}), ...entryField(entry, path) };
}

/**
 * The media host an image URL already names (`https://cdn.example/media/<id>/x.png` →
 * `https://cdn.example`), so the optimized srcset stays on it; the platform CDN otherwise.
 * Pass it as `imageAttrs(value, { baseUrl: mediaBase(value.url) })`.
 */
export function mediaBase(url: string | undefined): string | undefined {
  const at = url?.indexOf("/media/") ?? -1;
  return url && at > 0 && /^https?:\/\//.test(url) ? url.slice(0, at) : undefined;
}

