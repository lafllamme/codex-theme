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

function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const num = Number.parseInt(hex.replace('#', ''), 16)
  return {
    r: (num >> 16) & 0xFF,
    g: (num >> 8) & 0xFF,
    b: num & 0xFF,
  }
}

function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function adjustColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex)
  const clamp = (v: number) => Math.min(255, Math.max(0, v + amount))
  return `#${((clamp(r) << 16) | (clamp(g) << 8) | clamp(b)).toString(16).padStart(6, '0')}`
}

const surfaceLum = computed(() => getLuminance(theme.value.surface))
const accentLum = computed(() => getLuminance(theme.value.accent))
const inkLum = computed(() => getLuminance(theme.value.ink))

const skeletonBg = computed(() => {
  const surface = theme.value.surface
  const lum = surfaceLum.value
  const shift = lum < 0.15 ? 20 : lum > 0.85 ? -20 : lum < 0.5 ? 15 : -12
  return adjustColor(surface, shift)
})

const inkWithOpacity = computed(() => {
  const ink = theme.value.ink
  const contrast = Math.abs(inkLum.value - surfaceLum.value)
  const opacity = contrast < 0.3 ? '60' : contrast < 0.5 ? '50' : '40'
  return `${ink}${opacity}`
})

const contrastColor = computed(() => {
  return accentLum.value > 0.5 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)'
})

const checkColor = computed(() => {
  return accentLum.value > 0.5 ? '#000000' : '#ffffff'
})

const borderColor = computed(() => {
  const lum = surfaceLum.value
  if (lum < 0.1)
    return 'rgba(255, 255, 255, 0.15)'
  if (lum > 0.9)
    return 'rgba(0, 0, 0, 0.12)'
  return 'rgba(0, 0, 0, 0.10)'
})

const borderHoverColor = computed(() => {
  const lum = surfaceLum.value
  if (lum < 0.1)
    return 'rgba(255, 255, 255, 0.30)'
  if (lum > 0.9)
    return 'rgba(0, 0, 0, 0.25)'
  return 'rgba(0, 0, 0, 0.30)'
})

const activeBorderColor = computed(() => {
  const lum = surfaceLum.value
  return lum < 0.3 ? 'rgba(255, 255, 255, 0.70)' : 'rgba(0, 0, 0, 0.80)'
})
</script>

<template>
  <div
    class="theme-preset-card group flex flex-col cursor-pointer select-none gap-2.5"
    :title="preset.label"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter="$emit('select')"
    @keydown.space.prevent="$emit('select')"
  >
    <!-- Preview container -->
    <div
      class="relative h-[120px] flex flex-col gap-2 overflow-hidden rounded-2xl p-3 transition-all group-active:scale-[0.98]"
      :style="{
        backgroundColor: theme.surface,
        border: active ? `2px solid ${activeBorderColor}` : `1px solid ${borderColor}`,
      }"
      @mouseenter="($event.currentTarget as HTMLElement).style.borderColor = active ? activeBorderColor : borderHoverColor"
      @mouseleave="($event.currentTarget as HTMLElement).style.borderColor = active ? activeBorderColor : borderColor"
    >
      <!-- Top row: circle + skeleton -->
      <div
        class="h-8 flex items-center gap-2 rounded-xl px-2.5"
        :style="{ backgroundColor: skeletonBg }"
      >
        <div
          class="h-4 w-4 shrink-0 rounded-full"
          :style="{ backgroundColor: theme.accent }"
        />
        <div
          class="h-1.5 w-14 rounded-full"
          :style="{ backgroundColor: inkWithOpacity }"
        />
      </div>

      <!-- Skeleton content lines -->
      <div
        class="mt-1 h-2 w-3/4 rounded-full"
        :style="{ backgroundColor: inkWithOpacity }"
      />
      <div
        class="h-2 w-1/2 rounded-full"
        :style="{ backgroundColor: inkWithOpacity }"
      />

      <!-- Bottom button -->
      <div
        class="mt-auto h-7 w-full flex items-center justify-center rounded-xl"
        :style="{ backgroundColor: theme.accent }"
      >
        <div
          class="h-1 w-8 rounded-full"
          :style="{ backgroundColor: contrastColor }"
        />
      </div>

      <!-- Active checkmark -->
      <div
        v-if="active"
        class="absolute h-6 w-6 flex items-center justify-center rounded-bl-xl rounded-tr-2xl shadow-sm -right-0.5 -top-0.5"
        :style="{ backgroundColor: theme.accent }"
      >
        <Icon name="ph:check-bold" class="h-2.5 w-2.5" :style="{ color: checkColor }" />
      </div>
    </div>

    <!-- Theme name -->
    <div class="text-center">
      <p
        class="truncate text-[14px]"
        :class="active ? 'font-semibold text-pureBlack/90' : 'font-medium text-pureBlack/70'"
      >
        {{ preset.label }}
      </p>
      <p
        class="mt-0.5 text-[12px] transition-opacity"
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
