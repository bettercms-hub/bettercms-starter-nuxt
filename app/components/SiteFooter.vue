<script setup lang="ts">
/**
 * Ft7 footer — newsletter-first. It leads with the one thing the footer is actually for, and
 * keeps the index as a single quiet row (see design.md › Chrome).
 */
const { data } = useSiteData();
const brand = useBrand();
const tagline = computed(() => data.value?.site?.footerTagline ?? "A marketing starter powered by BetterCMS.");
const socials = computed(() => items(data.value?.site?.socials));
const nav = computed(() => items(data.value?.site?.navLinks));
/** The seeded Newsletter form. Absent (or renamed) → the footer just drops the block. */
const newsletter = computed(() => data.value?.newsletter ?? null);
const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="site-footer-say">
        <h2>{{ tagline }}</h2>
      </div>
      <NewsletterForm v-if="newsletter" :form="newsletter" />
      <p v-else class="newsletter-note">Add a Newsletter form in the CMS and it appears here.</p>
    </div>
    <div class="site-footer-meta">
      <NuxtLink class="brand" to="/">{{ brand }}<span class="dot">.</span></NuxtLink>
      <nav aria-label="Footer">
        <NuxtLink v-for="l in nav" :key="l.href" :to="l.href">{{ l.label }}</NuxtLink>
      </nav>
      <div v-if="socials.length" class="site-footer-socials">
        <a v-for="s in socials" :key="s.href" :href="s.href" target="_blank" rel="noreferrer noopener">{{ s.label }}</a>
      </div>
      <p class="site-footer-copy">© {{ year }} {{ brand }}</p>
    </div>
  </footer>
</template>
