<script setup lang="ts">
const props = defineProps<{
  count: number
}>()

const emit = defineEmits<{
  toggle: []
}>()

const label = computed(() => `${props.count} unmodified ${props.count === 1 ? 'line' : 'lines'}`)
</script>

<template>
  <button
    type="button"
    class="relative border-none z-[2] w-[max(100%,calc(var(--wb-gutter-width)+var(--wb-line-columns)*1ch+28px))] inline-flex items-stretch gap-px rounded-[8px] bg-[color:var(--wb-border-2)] p-px text-left text-[color:var(--wb-text-secondary)] transition-colors hover:text-[color:var(--wb-text-primary)]"
    @click="emit('toggle')"
  >
    <span class="h-8 w-[36px] inline-flex shrink-0 items-center justify-center rounded-l-[7px] bg-[var(--wb-unmodified-strip-bg)]">
      <Icon name="ph:caret-up-down" class="h-[11px] w-[11px]" />
    </span>
    <span class="h-8 min-w-0 inline-flex flex-1 items-center truncate rounded-r-[7px] bg-[var(--wb-unmodified-strip-bg)] px-3 text-[length:var(--wb-ui-text)] leading-none font-[var(--font-ui)]">
      {{ label }}
    </span>
  </button>
</template>
