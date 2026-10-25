<script setup lang="ts">
/**
 * An error raised while the app runs in the browser — a link to an entry the build never had,
 * say. A bad URL typed into the address bar never gets here: the host serves 404.html.
 */
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
// app.vue does not render on an error, so the chrome's data is fetched here too.
await useSiteData();
const brand = useBrand();
const notFound = computed(() => props.error.statusCode === 404);

if (!notFound.value) {
  usePageSeo(() => ({ title: `Something went wrong — ${brand.value}`, description: "This page could not be shown." }));
  useSeoMeta({ robots: "noindex" });
}
</script>

<template>
  <NuxtLayout>
    <NotFound v-if="notFound" />
    <main v-else id="main" class="notfound">
      <h1>Something went wrong</h1>
      <p>This page could not be shown. Try again in a moment.</p>
      <a class="bcms-btn bcms-btn-primary" href="/" @click.prevent="clearError({ redirect: '/' })">Back to home</a>
    </main>
  </NuxtLayout>
</template>
