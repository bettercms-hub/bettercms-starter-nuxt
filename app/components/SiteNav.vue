<script setup lang="ts">
/**
 * N1b nav — three sections: wordmark · links · one CTA.
 *
 * Everything comes from the `site` global, so rebranding happens in the CMS, not here. The CTA
 * is DERIVED from navLinks (the last entry) rather than appended to them, so Contact never
 * renders twice (a link and a button beside it).
 */
const { data } = useSiteData();
const brand = useBrand();
const route = useRoute();

const nav = computed(() => {
  const links = items(data.value?.site?.navLinks);
  return links.length ? links : FALLBACK_NAV;
});
/** The last link is the CTA — one button, never a duplicate of a link beside it. */
const cta = computed(() => nav.value.at(-1));
const links = computed(() => nav.value.slice(0, -1));

const norm = (p: string) => p.replace(/\/$/, "") || "/";
const current = (href: string) => norm(href) === norm(route.path);
</script>

<template>
  <nav class="site-nav" aria-label="Primary">
    <NuxtLink class="brand" to="/">{{ brand }}<span class="dot">.</span></NuxtLink>
    <div class="links">
      <NuxtLink v-for="l in links" :key="l.href" :to="l.href" :aria-current="current(l.href) ? 'page' : undefined">{{ l.label }}</NuxtLink>
      <NuxtLink v-if="cta" class="bcms-btn bcms-btn-primary nav-cta" :to="cta.href">{{ cta.label }}</NuxtLink>
    </div>
  </nav>
</template>
