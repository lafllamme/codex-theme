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
    class="inline-flex items-center border border-[color:var(--wb-border-2)] rounded-full bg-[var(--wb-bubble-bg)] p-1 text-[length:var(--wb-ui-text)] shadow-[0_8px_22px_rgba(0,0,0,0.28)]"
  >
    <button
      class="h-9 inline-flex items-center gap-2 rounded-full border-none bg-transparent px-4 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:text-[color:var(--wb-text-primary)]"
      type="button"
      @click="emit('resetAll')"
    >
      <Icon name="ph:arrow-u-up-left" class="h-[14px] w-[14px]" />
      <span class="font-medium">{{ resetLabel ?? 'Reset all' }}</span>
    </button>
    <span class="h-5 w-px bg-[color:var(--wb-divider)]" />
    <button
      class="h-9 inline-flex items-center gap-2 rounded-full border-none bg-transparent px-4 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:text-[color:var(--wb-text-primary)]"
      type="button"
      @click="emit('stageAll')"
    >
      <Icon name="ph:plus-bold" class="h-[14px] w-[14px]" />
      <span class="font-medium">{{ stageLabel ?? 'Stage all' }}</span>
    </button>
  </div>
</template>
