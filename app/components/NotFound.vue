<script setup lang="ts">
/** The not-found page body: pages/404.vue (→ 404.html) and error.vue both render it. */
const brand = useBrand();
usePageSeo(() => ({ title: `Page not found — ${brand.value}`, description: "That page doesn’t exist." }));
useSeoMeta({ robots: "noindex" });
</script>

<template>
  <main id="main" class="notfound">
    <h1>Page not found</h1>
    <p>That link is broken, or the page has moved.</p>
    <a class="bcms-btn bcms-btn-primary" href="/">Back to home</a>
  </main>
</template>
