<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="marketplace-section mb-8 min-w-0 last:mb-0">
    <div class="mb-3 flex items-center gap-3">
      <h2 class="m-0 shrink-0 text-[13px] text-[color:var(--wb-text-primary)] font-semibold leading-none tracking-[0.02em]">
        {{ title }}
      </h2>
      <div
        class="h-px min-w-0 flex-1 bg-[color:var(--wb-chrome-hairline)] opacity-90"
        aria-hidden="true"
      />
    </div>
    <div class="grid grid-cols-1 min-w-0 gap-x-10 gap-y-0.5 md:grid-cols-2">
      <slot />
    </div>
  </section>
</template>
