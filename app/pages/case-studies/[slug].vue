<script setup lang="ts">
/** One case study. Same shape as blog/[slug].vue — see its note on why every value is bound. */
import { entryAttrs, entryField, imageAttrs, rich } from "@bettercms-ai/nuxt";

const COVER_SIZES = "(min-width: 42.5rem) 680px, 100vw";

const slug = useRoute().params.slug as string;
const { data: cs } = await useFetch(`/api/entry/case-study/${slug}/data.json`, { key: `entry:case-study:${slug}` });
// See blog/[slug].vue — a miss is a corrupt snapshot, not a visitor's bad URL.
if (!cs.value) throw createError({ statusCode: 404, statusMessage: `Case study not found: ${slug}`, fatal: true });

const f = computed(() => cs.value!.data);

usePageSeo(() => ({ title: f.value.title, description: f.value.summary, schema: caseStudySchema(f.value) }));
</script>

<template>
  <main v-if="cs" id="main">
    <article class="article" v-bind="entryAttrs(cs)">
      <NuxtLink class="back-link" to="/case-studies">← Back to case studies</NuxtLink>
      <h1 v-bind="bcmsField(cs, 'title')">{{ f.title }}</h1>
      <p v-if="f.client" class="byline" v-bind="bcmsField(cs, 'client')">{{ f.client }}</p>
      <img
        v-if="f.coverImage?.url"
        class="cover"
        v-bind="{
          ...imageAttrs(f.coverImage, { path: 'coverImage', sizes: COVER_SIZES, loading: 'eager', baseUrl: mediaBase(f.coverImage.url) }),
          ...entryField(cs, 'coverImage'),
        }"
      />
      <p v-if="f.summary" class="prose summary" v-bind="bcmsField(cs, 'summary')">{{ f.summary }}</p>
      <div v-if="f.body?.html" class="prose" v-bind="bcmsField(cs, 'body', 'richtext')" v-html="rich(f.body)" />
    </article>
  </main>
</template>
