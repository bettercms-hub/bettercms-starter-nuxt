import type { NavLink, Repeatable } from "#shared/types/content";

/**
 * The `site` global and the Newsletter form, fetched once by app.vue (awaited there, so it is in
 * the payload of every prerendered route). Every other caller gets the same cached refs.
 */
export const useSiteData = () => useFetch("/api/site.json", { key: "site" });

/** The brand, from the CMS. The single source for <title>, the nav, and the footer. */
export const useBrand = () => {
  const { data } = useSiteData();
  return computed(() => data.value?.site?.brandName ?? "Harbor");
};

/** Unwrap a repeatable field to a plain list. */
export const items = <T>(field?: Repeatable<T>): T[] => (Array.isArray(field?.repeatable) ? field.repeatable : []);

export const FALLBACK_NAV: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];
