<script setup lang="ts">
import type { ComponentMentionBlock } from '~/types/workbench-chat'

defineProps<{
  block: ComponentMentionBlock
}>()

const isHovered = ref(false)
</script>

<template>
  <div class="relative py-0">
    <div class="flex items-baseline gap-2.5">
      <span class="mt-0 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--wb-text-primary)]" />
      <p
        class="m-0 text-[length:var(--wb-chat-message-size)] text-[color:var(--wb-text-primary)] leading-[1.5]"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <span>{{ block.lead }}</span>
        <span class="mx-1 font-semibold text-[color:var(--theme-accent)]">{{ block.component }}</span>
        <span v-if="block.trail">{{ block.trail }}</span>
      </p>
    </div>
    <span
      class="pointer-events-none absolute left-0 top-0 z-50 inline-flex max-w-[calc(100%-12px)] -translate-y-[calc(100%+6px)] items-center truncate whitespace-nowrap border border-[color:var(--wb-border-3)] rounded-[8px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_88%,var(--wb-text-primary)_12%)] px-3 py-1 text-[length:var(--wb-code-text-sm)] text-[color:var(--wb-text-primary)] font-[var(--font-code)] opacity-0 transition-[opacity,transform] duration-150"
      :class="isHovered ? '-translate-y-[calc(100%+4px)] opacity-100' : ''"
    >
      <span class="truncate">{{ block.path }}</span>
    </span>
  </div>
</template>
