<script setup lang="ts">
import type { ComponentMentionBlock } from '~/types/workbench-chat'

defineProps<{
  block: ComponentMentionBlock
}>()
</script>

<template>
  <div class="group relative py-0">
    <div class="flex items-baseline gap-2.5">
      <span class="mt-0 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--wb-text-secondary)]" />
      <p class="m-0 text-[13px] text-[color:var(--wb-text-primary)] leading-[1.5]">
        <span class="text-[color:var(--wb-text-secondary)]">{{ block.lead }}</span>
        <span class="mx-1 font-semibold text-[color:var(--theme-accent)]">{{ block.component }}</span>
        <span v-if="block.trail" class="text-[color:var(--wb-text-secondary)]">{{ block.trail }}</span>
      </p>
    </div>
    <span class="pointer-events-none absolute left-[20px] top-full z-10 mt-1 inline-flex max-w-[88%] translate-y-1 items-center border border-[color:var(--wb-border-2)] rounded-[9px] bg-[var(--wb-input-bg)] px-2.5 py-1 text-[11px] text-[color:var(--wb-text-primary)] opacity-0 transition-[opacity,transform] duration-160 group-hover:translate-y-0 group-hover:opacity-100">
      <span class="truncate">{{ block.path }}</span>
    </span>
  </div>
</template>
