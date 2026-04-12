<script setup lang="ts">
import type { ComponentMentionBlock } from '~/types/workbench-chat'

const props = withDefaults(defineProps<{
  block: ComponentMentionBlock
  compact?: boolean
  hideDot?: boolean
  muted?: boolean
  added?: number
  removed?: number
}>(), {
  compact: false,
  hideDot: false,
  muted: false,
  added: undefined,
  removed: undefined,
})

const isHovered = ref(false)
</script>

<template>
  <div class="relative py-0">
    <div class="flex items-baseline gap-2.5">
      <span
        v-if="!props.hideDot"
        class="mt-0 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--wb-text-primary)]"
      />
      <p
        class="m-0 font-normal leading-[1.5]"
        :class="[
          props.compact ? 'text-[length:var(--wb-ui-text-xs)]' : 'text-[length:var(--wb-chat-message-size)]',
          props.muted ? 'text-[color:var(--wb-text-muted)]' : 'text-[color:var(--wb-text-primary)]',
        ]"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <span>{{ block.lead }}</span>
        <span class="mx-1 text-[color:var(--theme-accent)] font-normal">{{ block.component }}</span>
        <span v-if="block.trail">{{ block.trail }}</span>
        <span v-if="typeof props.added === 'number'" class="ml-1 text-[color:var(--wb-diff-delta-added)]">+{{ props.added }}</span>
        <span v-if="typeof props.removed === 'number'" class="ml-1 text-[color:var(--wb-diff-delta-removed)]">-{{ props.removed }}</span>
      </p>
    </div>
    <span
      class="pointer-events-none absolute left-0 top-0 z-50 max-w-[calc(100%-12px)] inline-flex items-center truncate whitespace-nowrap border border-[color:var(--wb-border-3)] rounded-[8px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_88%,var(--wb-text-primary)_12%)] px-3 py-1 text-[length:var(--wb-code-text-sm)] text-[color:var(--wb-text-primary)] font-[var(--font-code)] opacity-0 transition-[opacity,transform] duration-150 -translate-y-[calc(100%+6px)]"
      :class="isHovered ? '-translate-y-[calc(100%+4px)] opacity-100' : ''"
    >
      <span class="truncate">{{ block.path }}</span>
    </span>
  </div>
</template>
