<script setup lang="ts">
const brand = useBrand();
</script>

<template>
  <CollectionIndex
    model="blog-post"
    base="/blog"
    heading="Blog"
    intro="Notes, updates, and what we’re thinking about."
    eyebrow="publishedDate"
    blurb="excerpt"
    :description="`Writing from the ${brand} team.`"
    empty="No published posts yet."
  />
</template>
