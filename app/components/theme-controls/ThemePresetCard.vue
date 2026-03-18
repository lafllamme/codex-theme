<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'

const props = defineProps<{
  preset: ThemePresetEntry
  active: boolean
}>()

defineEmits<{
  select: []
}>()

const theme = computed(() => props.preset.payload.theme)
const isDark = computed(() => props.preset.payload.variant === 'dark')

const skeletonBg = computed(() => {
  if (isDark.value) {
    return 'rgba(255, 255, 255, 0.06)'
  }
  return 'rgba(0, 0, 0, 0.04)'
})

const inkWithOpacity = computed(() => {
  const ink = theme.value.ink
  if (isDark.value) {
    return `${ink}40`
  }
  return `${ink}30`
})

const buttonTextColor = computed(() => {
  if (isDark.value) {
    return 'rgba(255, 255, 255, 0.5)'
  }
  return 'rgba(255, 255, 255, 0.7)'
})
</script>

<template>
  <div
    class="theme-preset-card group flex flex-col gap-2 cursor-pointer select-none"
    :class="active ? '' : 'opacity-75 hover:opacity-100'"
    :title="preset.label"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter="$emit('select')"
    @keydown.space.prevent="$emit('select')"
  >
    <!-- Preview container -->
    <div
      class="relative h-[90px] rounded-xl p-2.5 flex flex-col gap-1.5 overflow-hidden transition-all group-active:scale-[0.98]"
      :class="active ? 'ring-2 ring-pureBlack/50' : ''"
      :style="{ backgroundColor: theme.surface }"
    >
      <!-- Top row: circle + skeleton -->
      <div
        class="w-full h-6 rounded-md flex items-center px-1.5 gap-1.5"
        :style="{ backgroundColor: skeletonBg }"
      >
        <div
          class="w-3 h-3 rounded-full shrink-0"
          :style="{ backgroundColor: theme.accent }"
        />
        <div
          class="w-10 h-1 rounded-full"
          :style="{ backgroundColor: inkWithOpacity }"
        />
      </div>

      <!-- Skeleton content lines (use ink color to represent text) -->
      <div
        class="w-3/4 h-1.5 rounded-full mt-0.5"
        :style="{ backgroundColor: inkWithOpacity }"
      />
      <div
        class="w-1/2 h-1.5 rounded-full"
        :style="{ backgroundColor: inkWithOpacity }"
      />

      <!-- Bottom button -->
      <div
        class="mt-auto w-full h-5 rounded-md flex items-center justify-center"
        :style="{ backgroundColor: theme.accent }"
      >
        <div
          class="w-5 h-0.5 rounded-full"
          :style="{ backgroundColor: buttonTextColor }"
        />
      </div>

      <!-- Active checkmark -->
      <div
        v-if="active"
        class="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-bl-lg rounded-tr-xl flex items-center justify-center"
        :style="{ backgroundColor: theme.accent }"
      >
        <Icon name="ph:check-bold" class="w-2.5 h-2.5 text-white" />
      </div>
    </div>

    <!-- Theme name -->
    <div class="text-center px-1">
      <p
        class="text-[11px] leading-tight truncate"
        :class="active ? 'font-semibold text-pureBlack/90' : 'font-medium text-pureBlack/70'"
      >
        {{ preset.label }}
      </p>
      <p
        v-if="active"
        class="text-[10px] text-pureBlack/50 mt-0.5"
      >
        Active
      </p>
    </div>
  </div>
</template>

<style scoped>
.theme-preset-card {
  min-width: 0;
  transition: opacity 0.15s ease;
}
</style>
