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
const gridRef = ref<HTMLElement | null>(null)

const debouncedSearch = useDebounceFn((value: string) => {
  searchQuery.value = value
}, 150)

function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  debouncedSearch(target.value)
}

function toggleExpanded() {
  if (isExpanded.value) {
    const grid = gridRef.value
    if (grid && grid.scrollTop > 0) {
      grid.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => {
        isExpanded.value = false
      }, 200)
    }
    else {
      isExpanded.value = false
    }
  }
  else {
    isExpanded.value = true
  }
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
    <!-- Search bar -->
    <div class="relative mb-4">
      <Icon
        name="ph:magnifying-glass"
        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pureBlack/40 z-10"
      />
      <input
        type="text"
        placeholder="Search themes..."
        class="w-full rounded-xl border border-pureBlack/10 bg-pureWhite py-2.5 pl-10 pr-4 text-[14px] text-pureBlack/90 outline-none transition-all placeholder:text-pureBlack/40 focus:border-pureBlack/20 focus:ring-1 focus:ring-pureBlack/10 box-border"
        :value="searchQuery"
        @input="onSearchInput"
      >
    </div>

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
        class="show-all-btn text-[14px] text-pureBlack/50 hover:text-pureBlack/80 font-medium transition-colors"
        @click="toggleExpanded"
      >
        {{ isExpanded ? 'Show less' : 'Show all' }}
      </button>
    </div>

    <!-- Theme grid -->
    <div
      ref="gridRef"
      class="preset-grid grid grid-cols-2 gap-4"
      :class="isExpanded ? 'preset-grid--expanded' : ''"
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
      <template v-if="searchQuery">
        No themes found matching "{{ searchQuery }}"
      </template>
      <template v-else>
        No {{ filterMode }} themes found
      </template>
    </div>
  </div>
</template>

<style scoped>
.theme-preset-browser {
  font-family: 'Geist', ui-sans-serif, system-ui, sans-serif !important;
  overflow: hidden;
}

.theme-preset-browser input {
  font-family: 'Geist', ui-sans-serif, system-ui, sans-serif !important;
}

.show-all-btn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}

.preset-grid {
  scrollbar-gutter: stable;
}

.preset-grid--expanded {
  max-height: 500px;
  overflow-y: auto;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
