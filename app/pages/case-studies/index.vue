<script setup lang="ts">
const brand = useBrand();
</script>

<template>
  <CollectionIndex
    model="case-study"
    base="/case-studies"
    heading="Case studies"
    intro="A closer look at what we’ve shipped, and how."
    eyebrow="client"
    blurb="summary"
    :description="`Selected work from ${brand}.`"
    empty="No published case studies yet."
  />
</template>
