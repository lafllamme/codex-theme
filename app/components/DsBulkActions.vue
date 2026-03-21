<script setup lang="ts">
defineProps<{
  resetLabel?: string
  stageLabel?: string
}>()

const emit = defineEmits<{
  resetAll: []
  stageAll: []
}>()
</script>

<template>
  <div
    class="inline-flex items-center whitespace-nowrap border border-[color:var(--wb-border-2)] rounded-full bg-[var(--wb-bubble-bg)] p-[3px] text-[length:var(--wb-ui-text-sm)] shadow-[0_8px_22px_rgba(0,0,0,0.28)]"
  >
    <button
      class="h-8 inline-flex items-center gap-2 rounded-full border-none bg-transparent px-3.5 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:text-[color:var(--wb-text-primary)]"
      type="button"
      @click="emit('resetAll')"
    >
      <Icon name="ph:arrow-u-up-left" class="h-[13px] w-[13px]" />
      <span class="font-medium">{{ resetLabel ?? 'Reset all' }}</span>
    </button>
    <span class="h-4 w-px bg-[color:var(--wb-divider)]" />
    <button
      class="h-8 inline-flex items-center gap-2 rounded-full border-none bg-transparent px-3.5 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:text-[color:var(--wb-text-primary)]"
      type="button"
      @click="emit('stageAll')"
    >
      <Icon name="ph:plus-bold" class="h-[13px] w-[13px]" />
      <span class="font-medium">{{ stageLabel ?? 'Stage all' }}</span>
    </button>
  </div>
</template>
