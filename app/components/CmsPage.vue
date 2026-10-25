<script setup lang="ts">
/**
 * A marketing route: whatever the CMS page holds, drawn by BetterCMS.
 *
 * Home, About and Contact are block trees composed in the editor, so they render as the page's
 * SECTIONS FRAGMENT — the hosted renderer's markup, its scoped stylesheet and the scripts its
 * forms, sliders and tabs need — which makes the page here identical to the hosted one and to
 * the editor's canvas. Contact's form block is one of those sections.
 *
 * No project settings (a fresh clone, CI) or a page not published yet → the page's title and a
 * note, never an error.
 */
import { sectionsMarkup, vBcmsSections } from "@bettercms-ai/nuxt";

const props = defineProps<{ slug: string; label?: string }>();

/**
 * `v-bcms-sections` runs the fragment's scripts on mount, for a client-side navigation, where
 * markup set with v-html never runs its <script>s. On the FIRST load the browser has already run
 * them while parsing the prerendered HTML, so hydration would run every form, slider and tab
 * script a second time. This directive, placed before it, marks those parsed scripts as run
 * during hydration only; the adapter then skips them. Harmless once the adapter does the same.
 */
const hydrating = import.meta.client && useNuxtApp().isHydrating;
const vParsedScripts = {
  mounted: (el: Element) => {
    if (hydrating) el.querySelectorAll("script").forEach((s) => s.setAttribute("data-bcms-ran", ""));
  },
};
const brand = useBrand();
const { data: page } = await useFetch(`/api/pages/${props.slug}/data.json`, { key: `page:${props.slug}` });

const fallbackTitle = computed(() => (props.label ? `${props.label} — ${brand.value}` : brand.value));
const title = computed(() => page.value?.title || fallbackTitle.value);

usePageSeo(() => ({
  title: title.value,
  metaTitle: page.value?.metaTitle,
  description: page.value?.metaDescription,
}));
</script>

<template>
  <main v-if="page?.sections" id="main" class="page-sections">
    <div v-parsed-scripts v-bcms-sections v-html="sectionsMarkup(page.sections)" />
  </main>
  <main v-else id="main" class="page-body">
    <div>
      <h1>{{ title }}</h1>
      <p class="empty-note">This page has no published content yet — add blocks to it in BetterCMS and publish.</p>
    </div>
  </main>
</template>
