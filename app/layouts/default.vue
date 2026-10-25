<!--
  Shared page shell: skip link + nav + footer.

  Marketing pages render their CMS sections into the slot; blog/case routes render their own
  markup. Every route OWNS its own landmark (<main>) — the shell only supplies chrome.

  Brand and chrome come from the `site` global, so they're editable in the CMS. Nothing here
  hard-codes a brand: a page that wants a title composes it from `useBrand()`.
-->
<template>
  <div>
    <a class="skip-link" href="#main">Skip to content</a>
    <SiteNav />
    <slot />
    <SiteFooter />
  </div>
</template>
