<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'

const props = defineProps<{
  preset: ThemePresetEntry
  active: boolean
}>()

defineEmits<{
  select: []
}>()

const colors = computed(() => {
  const t = props.preset.payload.theme
  return [
    t.surface,
    t.ink,
    t.accent,
    t.semanticColors.diffAdded,
    t.semanticColors.skill,
  ]
})

const isDark = computed(() => props.preset.payload.variant === 'dark')
</script>

<template>
  <button
    type="button"
    class="theme-preset-card group relative flex flex-col overflow-hidden rounded-lg border p-2 text-left transition-all"
    :class="[
      active
        ? 'border-pureBlack/40 bg-pureBlack/8 ring-1 ring-pureBlack/20'
        : 'border-pureBlack/10 bg-pureBlack/2 hover:border-pureBlack/20 hover:bg-pureBlack/5',
    ]"
    :title="preset.label"
    @click="$emit('select')"
  >
    <!-- Color swatches -->
    <div class="mb-1.5 flex gap-1">
      <span
        v-for="(color, i) in colors"
        :key="i"
        class="h-3 w-3 rounded-full border shadow-sm"
        :class="isDark ? 'border-white/20' : 'border-black/10'"
        :style="{ backgroundColor: color }"
      />
    </div>

    <!-- Theme name -->
    <span
      class="line-clamp-1 text-[11px] leading-tight"
      :class="active ? 'text-pureBlack/90 font-medium' : 'text-pureBlack/70'"
    >
      {{ preset.label }}
    </span>

    <!-- Active indicator -->
    <span
      v-if="active"
      class="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-pureBlack/60"
    />
  </button>
</template>

<style scoped>
.theme-preset-card {
  min-width: 0;
}
</style>
