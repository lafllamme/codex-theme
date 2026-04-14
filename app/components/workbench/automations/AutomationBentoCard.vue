<script setup lang="ts">
defineProps<{
  icon: string
  body: string
}>()
</script>

<template>
  <article
    class="min-h-[120px] flex flex-col gap-3 border border-[color:color-mix(in_srgb,var(--wb-border-2)_50%,transparent)] rounded-[14px] bg-[color:color-mix(in_srgb,var(--wb-bg-panel-elevated,var(--wb-bg-panel))_88%,var(--wb-text-primary)_12%)] p-4 transition-colors duration-150 hover:border-[color:color-mix(in_srgb,var(--wb-border-2)_70%,transparent)]"
  >
    <div
      class="size-10 flex shrink-0 items-center justify-center border border-[color:color-mix(in_srgb,var(--wb-border-2)_45%,transparent)] rounded-[10px] bg-[color:color-mix(in_srgb,var(--wb-chip-ghost-bg-hover)_100%,transparent)]"
      aria-hidden="true"
    >
      <Icon :name="icon" class="size-5 text-[color:var(--wb-text-secondary)]" />
    </div>
    <p class="m-0 text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] leading-snug">
      {{ body }}
    </p>
  </article>
</template>
