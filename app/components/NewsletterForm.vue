<script setup lang="ts">
/**
 * Footer newsletter (Ft7). Renders the seeded `Newsletter` form: a one-field inline row (label ·
 * input · button) with its own aria-live status copy. It posts to the public submissions
 * endpoint — the one thing on this site that talks to the API at runtime. Without JavaScript the
 * form still posts (method + action); with it, the visitor stays on the page.
 */
import type { NewsletterForm as Form } from "#shared/types/content";

const props = defineProps<{ form: Form }>();
const apiUrl = (useRuntimeConfig().public.bcmsApiUrl as string).replace(/\/+$/, "");
const action = computed(() => `${apiUrl}/api/v1/forms/public/${encodeURIComponent(props.form.id)}/submissions`);
const email = computed(() => props.form.fields?.find((f) => f.type === "email"));
const emailKey = computed(() => email.value?.key ?? "email");

const busy = ref(false);
const msg = ref<{ text: string; ok: boolean } | null>(null);

async function submit(e: Event) {
  const el = e.target as HTMLFormElement;
  if (!el.reportValidity()) return;
  const data: Record<string, string> = {};
  new FormData(el).forEach((v, k) => {
    data[k] = String(v);
  });
  busy.value = true;
  try {
    await $fetch(action.value, { method: "POST", body: { data } });
    el.reset();
    msg.value = { text: props.form.successMessage ?? "Thanks — you're subscribed.", ok: true };
  } catch {
    msg.value = { text: "Something went wrong. Please try again.", ok: false };
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <form class="newsletter" method="post" :action="action" @submit.prevent="submit">
    <label class="newsletter-label" for="newsletter-email">{{ email?.label ?? "Subscribe" }}</label>
    <div class="newsletter-row">
      <input
        id="newsletter-email"
        type="email"
        :name="emailKey"
        required
        :placeholder="email?.placeholder ?? 'you@company.com'"
        autocomplete="email"
      />
      <button type="submit" :disabled="busy">{{ form.submitLabel || "Subscribe" }}</button>
    </div>
    <input
      v-if="form.honeypotField"
      type="text"
      :name="form.honeypotField"
      tabindex="-1"
      autocomplete="off"
      style="position: absolute; left: -9999px"
      aria-hidden="true"
    />
    <!-- aria-live so the outcome reaches a screen reader — it's the only feedback there is. -->
    <p
      class="newsletter-msg"
      :class="msg ? (msg.ok ? 'newsletter-msg--ok' : 'newsletter-msg--err') : undefined"
      role="status"
      aria-live="polite"
      :hidden="!msg"
    >
      {{ msg?.text }}
    </p>
  </form>
</template>
