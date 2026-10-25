/**
 * Head metadata + JSON-LD, resolved page-over-site.
 *
 * The `site` global seeds seoTitle / seoDescription / ogImage / twitterHandle. They're editable
 * in the CMS, so they resolve here rather than being hard-coded per route.
 *
 * The merge itself is the SDK's `resolveSeo` — the same function the server-side renderer uses,
 * so `*.bettercms.site` and this static build emit identical <head> SEO. Empty inputs collapse
 * to "" meaning "omit the tag": it never fabricates a value. `@bettercms-ai/sdk/seo` is pure,
 * so it is safe in the browser bundle too (the root entry is not: it carries the management
 * client and its node:fs imports).
 */
import { resolveSeo } from "@bettercms-ai/sdk/seo";
import { organizationSchema, type Json } from "~/utils/schema";

export interface PageSeo {
  /** The route's own title. Always wins over the site's SEO title. */
  title: string;
  metaTitle?: string | null;
  description?: string | null;
  /** Page-level JSON-LD; the site's Organization node is merged in automatically. */
  schema?: Json | Json[];
}

const orUndefined = (v: string | null | undefined): string | undefined => (v ? v : undefined);
/** One node per <script>; the 50 KB cap guards against a runaway CMS field in every <head>. */
const ldJson = (node: Record<string, unknown>): string | null => {
  const json = JSON.stringify(node).replace(/</g, "\\u003c");
  return json.length <= 50_000 ? json : null;
};

export function usePageSeo(input: () => PageSeo) {
  const { data } = useSiteData();
  const route = useRoute();
  const siteUrl = useRuntimeConfig().public.siteUrl as string;

  const meta = computed(() => {
    const page = input();
    const site = data.value?.site ?? undefined;
    return resolveSeo(
      {
        title: page.title,
        metaTitle: page.metaTitle,
        metaDescription: page.description,
        metaJson: page.schema ? { schema: page.schema } : null,
      },
      {
        metaTitle: site?.seoTitle,
        metaDescription: site?.seoDescription,
        ogImage: site?.ogImage?.url ?? null,
        twitterHandle: site?.twitterHandle ?? null,
        siteSchema: site ? organizationSchema(site) : undefined,
      },
      // Absolute URLs need a known origin. Unset (a local build) → no canonical / og:url,
      // rather than a relative one.
      siteUrl ? { siteUrl, path: route.path } : undefined,
    );
  });

  useSeoMeta({
    title: () => meta.value.title,
    description: () => orUndefined(meta.value.description),
    ogTitle: () => meta.value.og.title,
    ogDescription: () => orUndefined(meta.value.og.description),
    ogType: () => (meta.value.og.type || "website") as "website",
    ogImage: () => orUndefined(meta.value.og.image),
    ogUrl: () => orUndefined(meta.value.canonical),
    ogSiteName: () => orUndefined(data.value?.site?.brandName),
    twitterCard: () => (meta.value.twitter.card || "summary_large_image") as "summary_large_image",
    twitterTitle: () => meta.value.twitter.title,
    twitterDescription: () => orUndefined(meta.value.twitter.description),
    twitterImage: () => orUndefined(meta.value.twitter.image),
    twitterSite: () => orUndefined(meta.value.twitter.site),
    robots: () => (meta.value.noindex ? "noindex" : undefined),
  });

  useHead({
    link: () => (meta.value.canonical ? [{ rel: "canonical", href: meta.value.canonical }] : []),
    script: () =>
      meta.value.jsonLd
        .filter(Boolean)
        .map(ldJson)
        .filter((json): json is string => json !== null)
        .map((json) => ({ type: "application/ld+json", innerHTML: json })),
  });
}
