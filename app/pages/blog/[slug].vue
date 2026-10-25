<script setup lang="ts">
/**
 * One blog post, in the site's own markup, every value bound to its field:
 * `entryAttrs` declares the post on the article, `entryField` each value, the cover is the
 * adapter's optimized `<img>` (`imageAttrs`) with its field address, and the body is rich text
 * (`rich`). The author is its own entry (the `author` model, hydrated at depth 1), bound to its
 * own fields. See app/utils/bcms.ts for the contract.
 */
import { entryAttrs, entryField, imageAttrs, rich } from "@bettercms-ai/nuxt";

const COVER_SIZES = "(min-width: 42.5rem) 680px, 100vw";

const slug = useRoute().params.slug as string;
const { data: post } = await useFetch(`/api/entry/blog-post/${slug}/data.json`, { key: `entry:blog-post:${slug}` });
// The prerender list comes from the same snapshot, so a miss here is a corrupt snapshot: the
// build fails rather than ship a blank page. A visitor's bad URL is served the 404 page.
if (!post.value) throw createError({ statusCode: 404, statusMessage: `Blog post not found: ${slug}`, fatal: true });

const f = computed(() => post.value!.data);
const author = computed(() => authorEntry(f.value.author));

usePageSeo(() => ({ title: f.value.title, description: f.value.excerpt, schema: blogPostingSchema(f.value) }));
</script>

<template>
  <main v-if="post" id="main">
    <article class="article" v-bind="entryAttrs(post)">
      <NuxtLink class="back-link" to="/blog">← Back to blog</NuxtLink>
      <h1 v-bind="bcmsField(post, 'title')">{{ f.title }}</h1>
      <p v-if="author || f.publishedDate" class="byline">
        <template v-if="author">
          By <span v-bind="entryField(author, 'name')">{{ author.data.name }}</span>
          <template v-if="author.data.role">, <span v-bind="entryField(author, 'role')">{{ author.data.role }}</span></template>
        </template>
        <template v-if="author && f.publishedDate"> · </template>
        <time v-if="f.publishedDate" :datetime="f.publishedDate" v-bind="entryField(post, 'publishedDate')">{{ f.publishedDate }}</time>
      </p>
      <img
        v-if="f.coverImage?.url"
        class="cover"
        v-bind="{
          ...imageAttrs(f.coverImage, { path: 'coverImage', sizes: COVER_SIZES, loading: 'eager', baseUrl: mediaBase(f.coverImage.url) }),
          ...entryField(post, 'coverImage'),
        }"
      />
      <div v-if="f.body?.html" class="prose" v-bind="bcmsField(post, 'body', 'richtext')" v-html="rich(f.body)" />

      <aside
        v-if="author && (author.data.bio || author.data.avatar?.url)"
        class="mt-12 flex items-start gap-4 border-t border-line pt-6"
        aria-label="About the author"
        v-bind="entryAttrs(author)"
      >
        <img
          v-if="author.data.avatar?.url"
          class="size-16 shrink-0 rounded-full border border-line object-cover"
          v-bind="{
            ...imageAttrs(author.data.avatar, { width: 64, height: 64, fit: 'cover', baseUrl: mediaBase(author.data.avatar.url) }),
            ...entryField(author, 'avatar'),
          }"
        />
        <div>
          <p class="m-0 font-semibold text-ink" v-bind="entryField(author, 'name')">{{ author.data.name }}</p>
          <p v-if="author.data.bio" class="m-0 mt-1 text-muted" v-bind="entryField(author, 'bio')">{{ author.data.bio }}</p>
        </div>
      </aside>
    </article>
  </main>
</template>
