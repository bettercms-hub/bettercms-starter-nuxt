<script setup lang="ts">
// The chrome's data (brand, nav, footer, newsletter form) — awaited here, once, so it is in
// every prerendered route's HTML and payload. The layout and pages read the same cached refs.
await useSiteData();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
