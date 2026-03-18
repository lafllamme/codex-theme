<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'
import { useDebounceFn } from '@vueuse/core'
import ThemePresetCard from './ThemePresetCard.vue'

const props = defineProps<{
  presets: ThemePresetEntry[]
  activePresetId: string | null
}>()

const emit = defineEmits<{
  select: [entry: ThemePresetEntry]
}>()

type FilterMode = 'all' | 'dark' | 'light'

const searchQuery = ref('')
const filterMode = ref<FilterMode>('all')
const isExpanded = ref(false)

const debouncedSearch = useDebounceFn((value: string) => {
  searchQuery.value = value
}, 150)

function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  debouncedSearch(target.value)
}

const filteredPresets = computed(() => {
  let result = props.presets

  if (filterMode.value !== 'all') {
    result = result.filter(p => p.payload.variant === filterMode.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(p =>
      p.label.toLowerCase().includes(query)
      || p.id.toLowerCase().includes(query),
    )
  }

  return result
})

const displayedPresets = computed(() => {
  if (isExpanded.value)
    return filteredPresets.value
  return filteredPresets.value.slice(0, 6)
})

const hasMore = computed(() =>
  !isExpanded.value && filteredPresets.value.length > 6,
)

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
    <!-- Search and filters -->
    <div class="mb-3 flex items-center gap-2">
      <div class="relative flex-1">
        <Icon
          name="ph:magnifying-glass"
          class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-pureBlack/40"
        />
        <input
          type="text"
          placeholder="Search themes..."
          class="w-full rounded-lg border bg-pureBlack/4 py-1.5 pl-8 pr-3 text-[12px] text-pureBlack/90 outline-none transition-colors border-pureBlack/10 placeholder:text-pureBlack/40 focus:border-pureBlack/25"
          style="font-family: 'Geist', ui-sans-serif, system-ui, sans-serif !important;"
          :value="searchQuery"
          @input="onSearchInput"
        >
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="mb-3 flex gap-1">
      <button
        v-for="mode in (['all', 'dark', 'light'] as const)"
        :key="mode"
        type="button"
        class="rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors"
        :class="[
          filterMode === mode
            ? 'bg-pureBlack/10 text-pureBlack/90'
            : 'text-pureBlack/50 hover:bg-pureBlack/5 hover:text-pureBlack/70',
        ]"
        @click="filterMode = mode"
      >
        {{ mode === 'all' ? 'All' : mode === 'dark' ? 'Dark' : 'Light' }}
        <span class="ml-1 text-pureBlack/40">{{ counts[mode] }}</span>
      </button>
    </div>

    <!-- Theme grid -->
    <div
      class="grid grid-cols-2 gap-3 transition-all"
      :class="isExpanded ? 'max-h-[400px] overflow-y-auto pr-1' : ''"
    >
      <ThemePresetCard
        v-for="preset in displayedPresets"
        :key="preset.id"
        :preset="preset"
        :active="preset.id === activePresetId"
        @select="handleSelect(preset)"
      />
    </div>

    <!-- Show more / less -->
    <div v-if="filteredPresets.length > 6" class="mt-3 flex justify-center">
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-full border border-pureBlack/10 bg-pureBlack/4 px-3.5 py-1.5 text-[11px] font-medium text-pureBlack/60 transition-colors hover:bg-pureBlack/8 hover:text-pureBlack/80"
        @click="isExpanded = !isExpanded"
      >
        <span>{{ isExpanded ? 'Show less' : `Show all ${filteredPresets.length}` }}</span>
        <Icon
          :name="isExpanded ? 'ph:caret-up' : 'ph:caret-down'"
          class="h-3 w-3"
        />
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredPresets.length === 0"
      class="py-6 text-center text-[12px] text-pureBlack/40"
    >
      No themes found matching "{{ searchQuery }}"
    </div>
  </div>
</template>

<style scoped>
.theme-preset-browser {
  font-family: 'Geist', ui-sans-serif, system-ui, sans-serif !important;
}
</style>
