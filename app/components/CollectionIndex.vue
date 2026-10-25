<script setup lang="ts">
/**
 * The Blog and Case-studies indexes. One component: both are "list a collection as cards",
 * differing only in the model slug, the copy, and which fields supply the eyebrow and blurb.
 *
 * Each card declares its entry (`entryAttrs`) and each value its field (`entryField`), so the
 * editor binds a card's title to that entry's title — not to whichever card's text matched.
 */
import { entryAttrs, entryField, imageAttrs } from "@bettercms-ai/nuxt";
import type { RoutedModel } from "#shared/types/content";

const props = defineProps<{
  model: RoutedModel;
  base: string;
  heading: string;
  intro: string;
  /** Small line above the card title — a date for posts, the client for case studies. */
  eyebrow: "publishedDate" | "client";
  /** Card body copy. */
  blurb: "excerpt" | "summary";
  description: string;
  empty: string;
}>();

const brand = useBrand();
const { data: entries } = await useFetch(`/api/list/${props.model}/data.json`, { key: `list:${props.model}`, default: () => [] });

/** The card grid's track: one column on phones, two from 48rem, three at the full measure. */
const THUMB_SIZES = "(min-width: 70rem) 360px, (min-width: 48rem) 50vw, 100vw";

usePageSeo(() => ({ title: `${props.heading} — ${brand.value}`, description: props.description }));
</script>

<template>
  <main id="main" class="container">
    <header class="page-head">
      <h1>{{ heading }}</h1>
      <p>{{ intro }}</p>
    </header>
    <p v-if="!entries.length" class="empty-note">{{ empty }}</p>
    <div v-else class="card-grid">
      <article v-for="e in entries" :key="e.slug" class="card" v-bind="entryAttrs(e)">
        <NuxtLink :to="`${base}/${e.slug}`">
          <img
            v-if="e.data.coverImage?.url"
            class="thumb"
            v-bind="{
              ...imageAttrs(e.data.coverImage, { sizes: THUMB_SIZES, baseUrl: mediaBase(e.data.coverImage.url) }),
              ...entryField(e, 'coverImage'),
            }"
          />
          <div class="body">
            <span v-if="e.data[eyebrow]" class="eyebrow" v-bind="entryField(e, eyebrow)">{{ e.data[eyebrow] }}</span>
            <h3 v-bind="entryField(e, 'title')">{{ e.data.title }}</h3>
            <p v-if="e.data[blurb]" v-bind="entryField(e, blurb)">{{ e.data[blurb] }}</p>
          </div>
        </NuxtLink>
      </article>
    </div>
  </main>
</template>
