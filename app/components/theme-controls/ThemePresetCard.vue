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
    class="theme-preset-card group flex flex-col gap-2.5 cursor-pointer select-none"
    :title="preset.label"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter="$emit('select')"
    @keydown.space.prevent="$emit('select')"
  >
    <!-- Preview container -->
    <div
      class="relative h-[120px] rounded-2xl p-3.5 flex flex-col gap-2.5 overflow-hidden transition-all group-active:scale-[0.98]"
      :class="[
        active
          ? 'border-2 border-pureBlack/80'
          : 'border border-pureBlack/10 group-hover:border-pureBlack/30',
      ]"
      :style="{ backgroundColor: theme.surface }"
    >
      <!-- Top row: circle + skeleton -->
      <div
        class="w-full h-8 rounded-lg flex items-center px-2.5 gap-2"
        :style="{ backgroundColor: skeletonBg }"
      >
        <div
          class="w-4 h-4 rounded-full shrink-0"
          :style="{ backgroundColor: theme.accent }"
        />
        <div
          class="w-14 h-1.5 rounded-full"
          :style="{ backgroundColor: inkWithOpacity }"
        />
      </div>

      <!-- Skeleton content lines -->
      <div
        class="w-3/4 h-2 rounded-full mt-1"
        :style="{ backgroundColor: inkWithOpacity }"
      />
      <div
        class="w-1/2 h-2 rounded-full"
        :style="{ backgroundColor: inkWithOpacity }"
      />

      <!-- Bottom button -->
      <div
        class="mt-auto w-full h-7 rounded-lg flex items-center justify-center"
        :style="{ backgroundColor: theme.accent }"
      >
        <div
          class="w-8 h-1 rounded-full"
          :style="{ backgroundColor: buttonTextColor }"
        />
      </div>

      <!-- Active checkmark -->
      <div
        v-if="active"
        class="absolute -top-1 -right-1 w-6 h-6 rounded-bl-xl rounded-tr-2xl flex items-center justify-center shadow-sm"
        :style="{ backgroundColor: theme.accent }"
      >
        <Icon name="ph:check-bold" class="w-2.5 h-2.5 text-white" />
      </div>
    </div>

    <!-- Theme name -->
    <div class="text-center">
      <p
        class="text-[14px] truncate"
        :class="active ? 'font-semibold text-pureBlack/90' : 'font-medium text-pureBlack/70'"
      >
        {{ preset.label }}
      </p>
      <p
        class="text-[12px] mt-0.5 transition-opacity"
        :class="active ? 'text-pureBlack/50' : 'text-pureBlack/40 opacity-0 group-hover:opacity-100'"
      >
        {{ active ? 'Active' : 'Preview' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.theme-preset-card {
  min-width: 0;
}
</style>
