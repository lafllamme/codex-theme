<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'
import ThemePresetCard from './ThemePresetCard.vue'

const props = defineProps<{
  presets: ThemePresetEntry[]
  activePresetId: string | null
}>()

const emit = defineEmits<{
  select: [entry: ThemePresetEntry]
}>()

type FilterMode = 'all' | 'dark' | 'light'

const filterMode = ref<FilterMode>('all')
const isExpanded = ref(false)

const filteredPresets = computed(() => {
  if (filterMode.value === 'all') {
    return props.presets
  }
  return props.presets.filter(p => p.payload.variant === filterMode.value)
})

const displayedPresets = computed(() => {
  if (isExpanded.value)
    return filteredPresets.value
  return filteredPresets.value.slice(0, 4)
})

const counts = computed(() => ({
  all: props.presets.length,
  dark: props.presets.filter(p => p.payload.variant === 'dark').length,
  light: props.presets.filter(p => p.payload.variant === 'light').length,
}))

function handleSelect(entry: ThemePresetEntry) {
  emit('select', entry)
}
</script>

<template>
  <div class="theme-preset-browser">
    <!-- Filter badges -->
    <div class="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
      <button
        type="button"
        class="shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95"
        :class="[
          filterMode === 'all'
            ? 'bg-pureBlack text-pureWhite shadow-sm'
            : 'bg-pureWhite border border-pureBlack/10 text-pureBlack/60 hover:bg-pureBlack/5',
        ]"
        @click="filterMode = 'all'"
      >
        All <span class="ml-1 opacity-50">{{ counts.all }}</span>
      </button>
      <button
        type="button"
        class="shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95"
        :class="[
          filterMode === 'dark'
            ? 'bg-pureBlack text-pureWhite shadow-sm'
            : 'bg-pureWhite border border-pureBlack/10 text-pureBlack/60 hover:bg-pureBlack/5',
        ]"
        @click="filterMode = 'dark'"
      >
        Dark <span class="ml-1 opacity-50">{{ counts.dark }}</span>
      </button>
      <button
        type="button"
        class="shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95"
        :class="[
          filterMode === 'light'
            ? 'bg-pureBlack text-pureWhite shadow-sm'
            : 'bg-pureWhite border border-pureBlack/10 text-pureBlack/60 hover:bg-pureBlack/5',
        ]"
        @click="filterMode = 'light'"
      >
        Light <span class="ml-1 opacity-50">{{ counts.light }}</span>
      </button>
    </div>

    <!-- Header with Show all -->
    <div class="flex justify-between items-baseline mb-4">
      <h3 class="text-[22px] font-semibold tracking-tight text-pureBlack/90">
        Presets
      </h3>
      <button
        v-if="filteredPresets.length > 4"
        type="button"
        class="text-[14px] text-pureBlack/50 hover:text-pureBlack/80 font-medium transition-colors"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? 'Show less' : 'Show all' }}
      </button>
    </div>

    <!-- Theme grid -->
    <div
      class="grid grid-cols-2 gap-4 transition-all"
      :class="isExpanded ? 'max-h-[500px] overflow-y-auto pr-1' : ''"
    >
      <ThemePresetCard
        v-for="preset in displayedPresets"
        :key="preset.id"
        :preset="preset"
        :active="preset.id === activePresetId"
        @select="handleSelect(preset)"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredPresets.length === 0"
      class="py-8 text-center text-[13px] text-pureBlack/40"
    >
      No {{ filterMode }} themes found
    </div>
  </div>
</template>

<style scoped>
.theme-preset-browser {
  font-family: 'Geist', ui-sans-serif, system-ui, sans-serif !important;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
