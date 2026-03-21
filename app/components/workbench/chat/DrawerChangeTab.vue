<script setup lang="ts">
const props = defineProps<{
  count: number
  icon?: string
}>()

const emit = defineEmits<{
  toggle: []
}>()

const label = computed(() => `${props.count} unmodified ${props.count === 1 ? 'line' : 'lines'}`)
</script>

<template>
  <button
    type="button"
    class="relative z-[2] mx-[12px] my-0.5 w-[calc(100%-24px)] inline-flex items-stretch gap-px rounded-[8px] border-none bg-[var(--wb-card-surface)] p-px text-left text-[color:var(--wb-text-secondary)] transition-colors hover:text-[color:var(--wb-text-primary)]"
    @click="emit('toggle')"
  >
    <span class="h-8 w-[38px] inline-flex shrink-0 items-center justify-center rounded-l-[7px] bg-[var(--wb-unmodified-strip-bg)]">
      <Icon :name="props.icon || 'ph:caret-up-down'" class="h-[11px] w-[11px]" />
    </span>
    <span class="h-8 min-w-0 inline-flex flex-1 items-center truncate rounded-r-[7px] bg-[var(--wb-unmodified-strip-bg)] px-4 text-[length:var(--wb-ui-text)] leading-none font-[var(--font-ui)]">
      {{ label }}
    </span>
  </button>
</template>
