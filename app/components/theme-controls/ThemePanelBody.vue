<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'
import type { CodexThemePayload } from '~/types/codex-theme'
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

function normalizeHex(value: string, fallback: string) {
  const next = value.trim()
  if (HEX_COLOR_RE.test(next))
    return next
  return fallback
}

function onHexInput(field: ColorField, event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return
  const next = target.value
  if (field === 'accent')
    emit('setAccent', normalizeHex(next, props.payload.theme.accent))
  if (field === 'surface')
    emit('setSurface', normalizeHex(next, props.payload.theme.surface))
  if (field === 'ink')
    emit('setInk', normalizeHex(next, props.payload.theme.ink))
  if (field === 'diffAdded')
    emit('setDiffAdded', normalizeHex(next, props.payload.theme.semanticColors.diffAdded))
  if (field === 'diffRemoved')
    emit('setDiffRemoved', normalizeHex(next, props.payload.theme.semanticColors.diffRemoved))
  if (field === 'skill')
    emit('setSkill', normalizeHex(next, props.payload.theme.semanticColors.skill))
}

function onColorInput(field: ColorField, event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return
  const map: Record<ColorField, () => void> = {
    accent: () => emit('setAccent', target.value),
    surface: () => emit('setSurface', target.value),
    ink: () => emit('setInk', target.value),
    diffAdded: () => emit('setDiffAdded', target.value),
    diffRemoved: () => emit('setDiffRemoved', target.value),
    skill: () => emit('setSkill', target.value),
  }
  map[field]()
}

const colorRows: Array<{ field: ColorField, label: string }> = [
  { field: 'accent', label: 'Accent' },
  { field: 'surface', label: 'Background' },
  { field: 'ink', label: 'Foreground' },
  { field: 'diffAdded', label: 'Diff +' },
  { field: 'diffRemoved', label: 'Diff −' },
  { field: 'skill', label: 'Skill' },
]

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
</script>

<template>
  <div class="theme-panel-body pb-6 pt-2 space-y-8">
    <!-- Presets -->
    <section>
      <p class="text-pureBlack/50 mb-3 text-[10px] font-medium tracking-[0.14em] uppercase">
        Presets
      </p>
      <ThemePresetBrowser
        :presets="themePresets"
        :active-preset-id="activePresetId"
        @select="emit('applyThemePreset', $event)"
      />
    </section>

    <div class="bg-pureBlack/10 h-px" />

    <!-- Colors -->
    <section>
      <p class="text-pureBlack/50 mb-3 text-[10px] font-medium tracking-[0.14em] uppercase">
        Colors
      </p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          v-for="row in colorRows"
          :key="row.field"
          class="flex items-center gap-2.5"
        >
          <label class="text-pureBlack/60 w-20 shrink-0 text-[13px]">{{ row.label }}</label>
          <input
            class="tc-swatch border-pureBlack/16 h-9 w-9 shrink-0 cursor-pointer border rounded-full"
            type="color"
            :value="swatchValue(row.field)"
            @input="onColorInput(row.field, $event)"
          >
          <input
            class="tc-hex border-pureBlack/12 bg-pureBlack/4 text-pureBlack/90 focus:border-pureBlack/30 min-w-0 flex-1 border rounded-lg px-2.5 py-2 text-[13px] outline-none"
            type="text"
            :value="swatchValue(row.field)"
            @change="onHexInput(row.field, $event)"
          >
        </div>
      </div>
    </section>

    <div class="bg-pureBlack/10 h-px" />

    <!-- Display -->
    <section>
      <p class="text-pureBlack/50 mb-3 text-[10px] font-medium tracking-[0.14em] uppercase">
        Display
      </p>
      <div class="space-y-4">
        <div>
          <span class="text-pureBlack/55 mb-2 block text-[12px]">Scenario</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="scenario in scenarioOptions"
              :key="scenario.id"
              type="button"
              class="border-pureBlack/12 text-pureBlack/75 hover:border-pureBlack/20 border rounded-full px-3 py-1.5 text-[12px] font-[inherit] transition-colors"
              :class="scenario.id === scenarioId ? 'border-pureBlack/28 bg-pureBlack/8 text-pureBlack' : ''"
              @click="emit('setScenario', scenario.id)"
            >
              {{ scenario.label }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label class="block">
            <span class="text-pureBlack/55 mb-1.5 block text-[12px]">UI font</span>
            <input
              class="tc-input border-pureBlack/12 bg-pureBlack/4 text-pureBlack/90 focus:border-pureBlack/30 w-full border rounded-lg px-3 py-2.5 text-[14px] font-[inherit] outline-none"
              type="text"
              :value="payload.theme.fonts.ui || ''"
              placeholder="Geist"
              @input="emit('setUiFont', ($event.target as HTMLInputElement).value)"
            >
          </label>
          <label class="block">
            <span class="text-pureBlack/55 mb-1.5 block text-[12px]">Code font</span>
            <input
              class="tc-input border-pureBlack/12 bg-pureBlack/4 text-pureBlack/90 focus:border-pureBlack/30 w-full border rounded-lg px-3 py-2.5 text-[14px] font-[inherit] outline-none"
              type="text"
              :value="payload.theme.fonts.code || ''"
              placeholder="Geist Mono"
              @input="emit('setCodeFont', ($event.target as HTMLInputElement).value)"
            >
          </label>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-pureBlack/70 text-[13px]">Translucent sidebar</span>
            <button
              type="button"
              role="switch"
              :aria-checked="translucentSidebar"
              class="border-pureBlack/14 relative h-7 w-12 border rounded-full font-[inherit] transition-colors"
              :class="translucentSidebar ? 'bg-pureBlack/20' : 'bg-pureBlack/6'"
              @click="emit('setTranslucentSidebar', !translucentSidebar)"
            >
              <span
                class="bg-pureBlack absolute top-1 h-5 w-5 rounded-full shadow transition-transform"
                :class="translucentSidebar ? 'left-[26px]' : 'left-1'"
              />
            </button>
          </div>
          <label class="min-w-[200px] flex flex-1 items-center gap-3">
            <span class="text-pureBlack/70 shrink-0 text-[13px]">Contrast</span>
            <input
              class="accent-pureBlack h-1.5 min-w-0 flex-1"
              type="range"
              min="0"
              max="100"
              :value="payload.theme.contrast"
              @input="emit('setContrast', Number(($event.target as HTMLInputElement).value))"
            >
            <span class="text-pureBlack/55 w-8 text-[13px] tabular-nums">{{ payload.theme.contrast }}</span>
          </label>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-pureBlack/55 mb-1.5 block text-[12px]">UI size (px)</span>
            <input
              class="tc-input border-pureBlack/12 bg-pureBlack/4 text-pureBlack/90 focus:border-pureBlack/30 w-full border rounded-lg px-3 py-2 text-[14px] tabular-nums outline-none"
              type="number"
              min="12"
              max="22"
              :value="uiFontSize"
              @input="emit('setUiFontSize', Number(($event.target as HTMLInputElement).value))"
            >
          </label>
          <label class="block">
            <span class="text-pureBlack/55 mb-1.5 block text-[12px]">Code size (px)</span>
            <input
              class="tc-input border-pureBlack/12 bg-pureBlack/4 text-pureBlack/90 focus:border-pureBlack/30 w-full border rounded-lg px-3 py-2 text-[14px] tabular-nums outline-none"
              type="number"
              min="12"
              max="24"
              :value="codeFontSize"
              @input="emit('setCodeFontSize', Number(($event.target as HTMLInputElement).value))"
            >
          </label>
        </div>
      </div>
    </section>

    <div class="bg-pureBlack/10 h-px" />

    <!-- Export -->
    <section class="flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="border-pureBlack/12 bg-pureBlack/6 text-pureBlack/85 hover:bg-pureBlack/10 border rounded-lg px-4 py-2 text-[13px] font-medium font-[inherit] transition-colors"
        @click="emit('exportTheme')"
      >
        Export
      </button>
      <button
        type="button"
        class="text-pureBlack/50 hover:text-pureBlack/75 border border-transparent rounded-lg px-4 py-2 text-[13px] font-[inherit] underline-offset-2 transition-colors"
        @click="emit('copyExport')"
      >
        {{ copyState === 'ok' ? 'Copied' : 'Copy string' }}
      </button>
    </section>

    <!-- Advanced JSON -->
    <section>
      <button
        type="button"
        class="border-pureBlack/10 bg-pureBlack/4 text-pureBlack/65 hover:border-pureBlack/16 hover:text-pureBlack/85 w-full flex items-center justify-between border rounded-lg px-3 py-2.5 text-left text-[13px] font-[inherit] transition-colors"
        @click="jsonOpen = !jsonOpen"
      >
        <span>Advanced · Live JSON</span>
        <Icon :name="jsonOpen ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" class="text-pureBlack/45 h-4 w-4" />
      </button>
      <div v-show="jsonOpen" class="mt-3 space-y-2">
        <textarea
          class="border-pureBlack/12 bg-pureBlack/4 text-pureBlack/85 focus:border-pureBlack/25 min-h-52 w-full resize-y border rounded-lg p-3 text-[12px] leading-relaxed outline-none"
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
.tc-swatch {
  appearance: none;
  padding: 0;
}
.tc-swatch::-webkit-color-swatch-wrapper {
  padding: 2px;
}
.tc-swatch::-webkit-color-swatch {
  border: none;
  border-radius: 999px;
}
.tc-swatch::-moz-color-swatch {
  border: none;
  border-radius: 999px;
}
</style>
