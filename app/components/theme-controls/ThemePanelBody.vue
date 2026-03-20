<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'
import type { CodexThemePayload } from '~/types/codex-theme'
import DsSwitch from '~/components/ui/DsSwitch.vue'
import ThemePresetBrowser from './ThemePresetBrowser.vue'

type ColorField = 'accent' | 'surface' | 'ink' | 'diffAdded' | 'diffRemoved' | 'skill'

const props = defineProps<{
  payload: CodexThemePayload
  jsonValue: string
  jsonError: string
  copyState: 'idle' | 'ok' | 'error'
  uiFontSize: number
  codeFontSize: number
  translucentSidebar: boolean
  scenarioId: string
  scenarioOptions: Array<{ id: string, label: string }>
  themePresets: ThemePresetEntry[]
  activePresetId: string | null
}>()

const emit = defineEmits<{
  setJsonValue: [value: string]
  exportTheme: []
  copyExport: []
  setAccent: [value: string]
  setSurface: [value: string]
  setInk: [value: string]
  setDiffAdded: [value: string]
  setDiffRemoved: [value: string]
  setSkill: [value: string]
  setUiFont: [value: string]
  setCodeFont: [value: string]
  setContrast: [value: number]
  setTranslucentSidebar: [value: boolean]
  setUiFontSize: [value: number]
  setCodeFontSize: [value: number]
  setScenario: [value: string]
  applyThemePreset: [entry: ThemePresetEntry]
}>()

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i
const jsonOpen = ref(false)
const expandedColor = ref<ColorField | null>(null)

const colorRows: Array<{ field: ColorField, label: string, icon: string }> = [
  { field: 'surface', label: 'Background', icon: 'ph:squares-four' },
  { field: 'ink', label: 'Foreground', icon: 'ph:text-t' },
  { field: 'accent', label: 'Accent', icon: 'ph:drop' },
  { field: 'diffAdded', label: 'Diff Added', icon: 'ph:plus-circle' },
  { field: 'diffRemoved', label: 'Diff Removed', icon: 'ph:minus-circle' },
  { field: 'skill', label: 'Skill', icon: 'ph:sparkle' },
]

function normalizeHex(value: string, fallback: string) {
  let next = value.trim()
  if (!next.startsWith('#'))
    next = `#${next}`
  if (HEX_COLOR_RE.test(next))
    return next
  return fallback
}

function swatchValue(field: ColorField) {
  const t = props.payload.theme
  if (field === 'accent')
    return t.accent
  if (field === 'surface')
    return t.surface
  if (field === 'ink')
    return t.ink
  if (field === 'diffAdded')
    return t.semanticColors.diffAdded
  if (field === 'diffRemoved')
    return t.semanticColors.diffRemoved
  return t.semanticColors.skill
}

function setColor(field: ColorField, value: string) {
  const map: Record<ColorField, () => void> = {
    accent: () => emit('setAccent', value),
    surface: () => emit('setSurface', value),
    ink: () => emit('setInk', value),
    diffAdded: () => emit('setDiffAdded', value),
    diffRemoved: () => emit('setDiffRemoved', value),
    skill: () => emit('setSkill', value),
  }
  map[field]()
}

function onHexSubmit(field: ColorField, event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return
  const normalized = normalizeHex(target.value, swatchValue(field))
  setColor(field, normalized)
  target.value = normalized.replace('#', '')
}

function toggleColorExpand(field: ColorField) {
  expandedColor.value = expandedColor.value === field ? null : field
}

const hexInputValue = computed(() => {
  if (!expandedColor.value)
    return ''
  return swatchValue(expandedColor.value).replace('#', '')
})

const UI_FONT_OPTIONS: Array<{ label: string, value: string }> = [
  { label: 'Default (Codex/System)', value: '' },
  { label: 'Inter (Codex preset)', value: 'Inter' },
  { label: 'Satoshi (Codex preset)', value: 'Satoshi' },
  { label: 'System Mono UI (Codex preset)', value: 'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' },
  { label: 'System Sans (recommended)', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { label: 'Arial / Helvetica', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Segoe UI stack', value: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' },
  { label: 'Helvetica stack', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Verdana stack', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma stack', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Trebuchet stack', value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Georgia stack', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Times New Roman stack', value: '"Times New Roman", Times, serif' },
]

const CODE_FONT_OPTIONS: Array<{ label: string, value: string }> = [
  { label: 'Default (Codex/System)', value: '' },
  { label: 'System Mono (Codex preset)', value: 'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' },
  { label: 'System Mono (recommended)', value: 'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", "Courier New", monospace' },
  { label: 'Consolas stack', value: 'Consolas, "Courier New", monospace' },
  { label: 'Menlo / Monaco stack', value: 'Menlo, Monaco, "Courier New", monospace' },
  { label: 'Courier New stack', value: '"Courier New", Courier, monospace' },
  { label: 'Lucida Console stack', value: '"Lucida Console", Monaco, monospace' },
]

function onUiFontSelect(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  emit('setUiFont', target.value)
}

function onCodeFontSelect(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  emit('setCodeFont', target.value)
}
</script>

<template>
  <div class="theme-panel-body pb-6 pt-4 space-y-6">
    <!-- Presets -->
    <section>
      <ThemePresetBrowser
        :presets="themePresets"
        :active-preset-id="activePresetId"
        @select="emit('applyThemePreset', $event)"
      />
    </section>

    <div class="bg-pureBlack/8 h-px" />

    <!-- Colors -->
    <section>
      <h3 class="text-[22px] font-semibold tracking-tight text-pureBlack/90 mb-4">
        Colors
      </h3>
      <div class="bg-pureWhite rounded-3xl border border-pureBlack/8 overflow-hidden shadow-sm">
        <div
          v-for="(row, index) in colorRows"
          :key="row.field"
          class="relative transition-colors"
          :class="[
            index !== colorRows.length - 1 ? 'border-b border-pureBlack/6' : '',
            expandedColor === row.field ? 'bg-pureBlack/6' : '',
          ]"
        >
          <!-- Left indicator for expanded -->
          <div
            v-if="expandedColor === row.field"
            class="absolute left-0 top-0 bottom-0 w-[3px] bg-pureBlack rounded-r-full"
          />

          <!-- Color row -->
          <div
            class="flex items-center justify-between p-4 px-5 cursor-pointer transition-colors"
            :class="expandedColor !== row.field ? 'hover:bg-pureBlack/6' : ''"
            @click="toggleColorExpand(row.field)"
          >
            <div class="flex items-center gap-3.5">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="expandedColor === row.field ? 'bg-pureBlack text-pureWhite shadow-sm' : 'bg-pureBlack/6 text-pureBlack/50'"
              >
                <Icon :name="row.icon" class="w-[18px] h-[18px]" />
              </div>
              <span
                class="text-[15px]"
                :class="expandedColor === row.field ? 'font-semibold text-pureBlack/90' : 'font-medium text-pureBlack/80'"
              >
                {{ row.label }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <span class="hex-value text-[13px] text-pureBlack/40 tracking-wider uppercase">
                {{ swatchValue(row.field) }}
              </span>
              <div
                class="w-7 h-7 rounded-full shadow-inner ring-1 ring-black/5"
                :style="{ backgroundColor: swatchValue(row.field) }"
              />
              <Icon
                :name="expandedColor === row.field ? 'ph:caret-up' : 'ph:caret-down'"
                class="w-4 h-4 text-pureBlack/40"
              />
            </div>
          </div>

          <!-- Expanded color picker -->
          <div
            v-if="expandedColor === row.field"
            class="px-5 pb-5 pl-14"
          >
            <div class="flex items-center gap-3 mt-2">
              <div class="flex-1 flex items-center px-3.5 py-2.5 bg-pureWhite border border-pureBlack/10 rounded-xl shadow-sm focus-within:border-pureBlack/30 focus-within:ring-1 focus-within:ring-pureBlack/10 transition-all">
                <span class="hex-value text-pureBlack/40 text-[14px] mr-2">#</span>
                <input
                  type="text"
                  class="hex-input bg-transparent border-none outline-none w-full text-[14px] uppercase text-pureBlack/80 tracking-wider placeholder-pureBlack/30"
                  :value="hexInputValue"
                  placeholder="000000"
                  maxlength="6"
                  @keydown.enter="onHexSubmit(row.field, $event)"
                  @blur="onHexSubmit(row.field, $event)"
                >
              </div>
              <label
                class="w-11 h-11 flex items-center justify-center bg-pureBlack text-pureWhite rounded-xl shadow-sm hover:bg-pureBlack/80 transition-colors cursor-pointer active:scale-95"
              >
                <input
                  type="color"
                  class="sr-only"
                  :value="swatchValue(row.field)"
                  @input="setColor(row.field, ($event.target as HTMLInputElement).value)"
                >
                <Icon name="ph:eyedropper-bold" class="w-5 h-5" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="bg-pureBlack/8 h-px" />

    <!-- Display -->
    <section>
      <h3 class="text-[22px] font-semibold tracking-tight text-pureBlack/90 mb-4">
        Display
      </h3>
      <div class="flex flex-col gap-5">
        <!-- Font inputs -->
        <div>
          <div class="grid w-full grid-cols-2 gap-0 mb-1.5">
            <span class="px-1 text-[13px] text-pureBlack/50">UI font</span>
            <span class="px-1 text-[13px] text-pureBlack/50">Code font</span>
          </div>
          <div class="flex w-full min-w-0 overflow-hidden rounded-xl border border-pureBlack/14 bg-pureWhite shadow-sm divide-x divide-pureBlack/12">
            <div class="flex-1 min-w-0 bg-pureWhite transition-colors hover:bg-pureBlack/8 focus-within:bg-pureBlack/8">
              <select
                class="block w-full min-w-0 border-0 bg-transparent px-4 py-3 pr-8 text-[15px] font-medium text-pureBlack/90 outline-none ring-0 focus:ring-0"
                :value="payload.theme.fonts.ui || ''"
                @change="onUiFontSelect"
              >
                <option
                  v-for="option in UI_FONT_OPTIONS"
                  :key="option.label"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="flex-1 min-w-0 bg-pureWhite transition-colors hover:bg-pureBlack/8 focus-within:bg-pureBlack/8">
              <select
                class="block w-full min-w-0 border-0 bg-transparent px-4 py-3 pr-8 text-[15px] font-medium text-pureBlack/90 outline-none ring-0 focus:ring-0"
                :value="payload.theme.fonts.code || ''"
                @change="onCodeFontSelect"
              >
                <option
                  v-for="option in CODE_FONT_OPTIONS"
                  :key="option.label"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Translucent sidebar toggle -->
        <div class="flex items-center justify-between py-1">
          <span class="text-[15px] font-medium text-pureBlack/80">Translucent sidebar</span>
          <DsSwitch
            :model-value="translucentSidebar"
            @update:model-value="emit('setTranslucentSidebar', $event)"
          />
        </div>

        <!-- Contrast slider -->
        <div class="flex items-center gap-4 py-1">
          <span class="text-[15px] font-medium text-pureBlack/80 w-[70px] shrink-0">Contrast</span>
          <div class="flex-1 relative flex items-center h-6 group">
            <div class="absolute w-full h-[3px] bg-pureBlack/12 rounded-full" />
            <div
              class="absolute h-[3px] bg-[#0066FF] rounded-full"
              :style="{ width: `${payload.theme.contrast}%` }"
            />
            <input
              type="range"
              min="0"
              max="100"
              :value="payload.theme.contrast"
              class="absolute w-full h-6 opacity-0 cursor-pointer"
              @input="emit('setContrast', Number(($event.target as HTMLInputElement).value))"
            >
            <div
              class="absolute w-4 h-4 bg-[#0066FF] rounded-full shadow-sm transform -translate-x-1/2 transition-transform group-hover:scale-110"
              :style="{ left: `${payload.theme.contrast}%` }"
            />
          </div>
          <span class="hex-value text-[14px] text-pureBlack/55 w-8 text-right">{{ payload.theme.contrast }}</span>
        </div>

        <!-- Size inputs -->
        <div>
          <div class="grid w-full grid-cols-2 gap-0 mb-1.5">
            <span class="px-1 text-[13px] text-pureBlack/50">UI size (px)</span>
            <span class="px-1 text-[13px] text-pureBlack/50">Code size (px)</span>
          </div>
          <div class="flex w-full min-w-0 overflow-hidden rounded-xl border border-pureBlack/14 bg-pureWhite shadow-sm divide-x divide-pureBlack/12">
            <div class="flex-1 min-w-0 bg-pureWhite transition-colors hover:bg-pureBlack/8 focus-within:bg-pureBlack/8">
              <input
                class="block w-full min-w-0 border-0 bg-transparent px-4 py-3 appearance-none text-[15px] font-medium text-pureBlack/90 outline-none ring-0 focus:ring-0"
                :value="uiFontSize"
                type="number"
                min="12"
                max="22"
                @input="emit('setUiFontSize', Number(($event.target as HTMLInputElement).value))"
              >
            </div>
            <div class="flex-1 min-w-0 bg-pureWhite transition-colors hover:bg-pureBlack/8 focus-within:bg-pureBlack/8">
              <input
                class="block w-full min-w-0 border-0 bg-transparent px-4 py-3 appearance-none text-[15px] font-medium text-pureBlack/90 outline-none ring-0 focus:ring-0"
                :value="codeFontSize"
                type="number"
                min="12"
                max="24"
                @input="emit('setCodeFontSize', Number(($event.target as HTMLInputElement).value))"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="bg-pureBlack/8 h-px" />

    <!-- Export -->
    <section class="space-y-4">
      <div class="flex gap-3">
        <button
          type="button"
          class="flex-1 py-3 bg-pureWhite border border-pureBlack/10 text-pureBlack/80 rounded-xl text-[14px] font-medium hover:bg-pureBlack/5 shadow-sm active:scale-[0.98] transition-all"
          @click="emit('exportTheme')"
        >
          Export
        </button>
        <button
          type="button"
          class="flex-1 py-3 bg-pureWhite border border-pureBlack/10 text-pureBlack/60 rounded-xl text-[14px] font-medium hover:bg-pureBlack/5 shadow-sm active:scale-[0.98] transition-all"
          @click="emit('copyExport')"
        >
          {{ copyState === 'ok' ? 'Copied!' : 'Copy string' }}
        </button>
      </div>

      <!-- Advanced JSON -->
      <button
        type="button"
        class="w-full flex items-center justify-between p-4 bg-pureWhite border border-pureBlack/10 rounded-xl shadow-sm hover:bg-pureBlack/3 transition-colors"
        @click="jsonOpen = !jsonOpen"
      >
        <span class="text-[14px] font-medium text-pureBlack/70">Advanced · Live JSON</span>
        <Icon :name="jsonOpen ? 'ph:caret-up' : 'ph:caret-down'" class="w-4 h-4 text-pureBlack/40" />
      </button>

      <div v-show="jsonOpen" class="space-y-2">
        <textarea
          class="border border-pureBlack/10 bg-pureWhite text-pureBlack/80 focus:border-pureBlack/20 min-h-52 w-full resize-y rounded-xl p-3 text-[12px] font-mono leading-relaxed outline-none shadow-sm"
          rows="10"
          :value="jsonValue"
          @input="emit('setJsonValue', ($event.target as HTMLTextAreaElement).value)"
        />
        <p v-if="jsonError" class="text-red-600/90 text-[12px]">
          {{ jsonError }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
