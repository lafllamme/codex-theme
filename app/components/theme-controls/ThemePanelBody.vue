<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'
import type { CodexThemePayload } from '~/types/codex-theme'
import DsSwitch from '~/components/ui/DsSwitch.vue'
import SyntaxBlock from '~/components/workbench/code/SyntaxBlock.vue'
import ThemePresetBrowser from './ThemePresetBrowser.vue'

type ColorField = 'accent' | 'surface' | 'ink' | 'diffAdded' | 'diffRemoved' | 'skill'

const props = defineProps<{
  payload: CodexThemePayload
  codeThemeOptions: string[]
  jsonValue: string
  jsonError: string
  copyState: 'idle' | 'ok' | 'error'
  exportState: 'idle' | 'ok'
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
  setCodeThemeId: [value: string]
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
const jsonOpen = ref(true)
const expandedColor = ref<ColorField | null>(null)
const codeThemeInfoOpen = ref(false)
const uiSizeInputRef = ref<HTMLInputElement | null>(null)
const codeSizeInputRef = ref<HTMLInputElement | null>(null)
let codeThemeInfoCloseTimer: ReturnType<typeof setTimeout> | null = null

const colorRows: Array<{ field: ColorField, label: string, icon: string }> = [
  { field: 'surface', label: 'Background', icon: 'ph:squares-four' },
  { field: 'ink', label: 'Foreground', icon: 'ph:text-t' },
  { field: 'accent', label: 'Accent', icon: 'ph:drop' },
  { field: 'diffAdded', label: 'Diff Added', icon: 'ph:plus-circle' },
  { field: 'diffRemoved', label: 'Diff Removed', icon: 'ph:minus-circle' },
  { field: 'skill', label: 'Skill', icon: 'ph:cube' },
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

const CODE_FONT_OPTIONS: Array<{ label: string, value: string }> = [...UI_FONT_OPTIONS]

function optionLabel(options: Array<{ label: string, value: string }>, value: string, fallbackLabel: string) {
  const match = options.find(opt => opt.value === value)
  if (!match)
    return value || fallbackLabel
  return match.label.replace(/\s*\(.*\)\s*$/, '')
}

const uiFontLabel = computed(() => optionLabel(UI_FONT_OPTIONS, props.payload.theme.fonts.ui || '', 'Geist'))
const codeFontLabel = computed(() => optionLabel(CODE_FONT_OPTIONS, props.payload.theme.fonts.code || '', 'Geist Mono'))

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

function onCodeThemeSelect(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  emit('setCodeThemeId', target.value)
}

function clampSize(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function stepUiSize(delta: number) {
  const next = clampSize(props.uiFontSize + delta, 12, 22)
  emit('setUiFontSize', next)
}

function stepCodeSize(delta: number) {
  const next = clampSize(props.codeFontSize + delta, 12, 24)
  emit('setCodeFontSize', next)
}

function focusSizeInput(which: 'ui' | 'code', event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('button') || target?.closest('input'))
    return

  const inputEl = which === 'ui' ? uiSizeInputRef.value : codeSizeInputRef.value
  inputEl?.focus()
  inputEl?.select()
}

function openCodeThemeInfo() {
  if (codeThemeInfoCloseTimer) {
    clearTimeout(codeThemeInfoCloseTimer)
    codeThemeInfoCloseTimer = null
  }
  codeThemeInfoOpen.value = true
}

function closeCodeThemeInfo() {
  if (codeThemeInfoCloseTimer)
    clearTimeout(codeThemeInfoCloseTimer)

  // Small delay so users can move from the icon to the tooltip/link.
  codeThemeInfoCloseTimer = setTimeout(() => {
    codeThemeInfoOpen.value = false
    codeThemeInfoCloseTimer = null
  }, 140)
}

onBeforeUnmount(() => {
  if (codeThemeInfoCloseTimer)
    clearTimeout(codeThemeInfoCloseTimer)
})
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
            expandedColor === row.field ? 'bg-pureBlack/6' : '',
          ]"
        >
          <div
            v-if="index !== colorRows.length - 1"
            class="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-sand-12"
          />

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
                class="w-7 h-7 rounded-full shadow-inner"
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
      <h3 class="mb-4 text-[22px] font-semibold tracking-tight text-pureBlack/90">
        Display
      </h3>
      <div class="space-y-5">
        <div>
          <p class="mb-2 px-1 text-[12px] font-semibold text-pureBlack/38">
            Typography
          </p>
          <div class="overflow-hidden rounded-[20px] border border-pureBlack/10 bg-pureWhite shadow-sm">
            <div class="relative border-b border-pureBlack/8 px-5 py-4 transition-colors hover:bg-pureBlack/6">
              <div class="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-pureBlack/38">
                UI Font
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[15px] font-medium text-pureBlack/90">{{ uiFontLabel }}</span>
                <Icon name="ph:caret-down" class="h-3.5 w-3.5 text-pureBlack/35" />
              </div>
              <select
                class="absolute inset-0 cursor-pointer opacity-0"
                :value="payload.theme.fonts.ui || ''"
                aria-label="UI font family"
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

            <div class="relative px-5 py-4 transition-colors hover:bg-pureBlack/6">
              <div class="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-pureBlack/38">
                Code Font
              </div>
              <div class="flex items-center justify-between">
                <span class="font-mono text-[15px] font-medium text-pureBlack/90">{{ codeFontLabel }}</span>
                <Icon name="ph:caret-down" class="h-3.5 w-3.5 text-pureBlack/35" />
              </div>
              <select
                class="absolute inset-0 cursor-pointer opacity-0"
                :value="payload.theme.fonts.code || ''"
                aria-label="Code font family"
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

        <div>
          <p class="mb-2 px-1 text-[12px] font-semibold text-pureBlack/38">
            Interface
          </p>
          <div class="overflow-hidden rounded-[20px] border border-pureBlack/10 bg-pureWhite shadow-sm">
            <div class="flex items-center justify-between border-b border-pureBlack/8 px-5 py-4">
              <span class="text-[15px] font-medium text-pureBlack/90">Translucent Sidebar</span>
              <DsSwitch
                :model-value="translucentSidebar"
                @update:model-value="emit('setTranslucentSidebar', $event)"
              />
            </div>
            <div class="flex items-center justify-between gap-4 px-5 py-4">
              <span class="text-[15px] font-medium text-pureBlack/90">Contrast</span>
              <div class="ml-4 flex flex-1 items-center gap-3">
                <div class="relative h-4 flex-1">
                  <div class="absolute top-1/2 h-[4px] w-full -translate-y-1/2 rounded-full bg-pureBlack/12" />
                  <div
                    class="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-pureBlack/90"
                    :style="{ width: `${payload.theme.contrast}%` }"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    :value="payload.theme.contrast"
                    class="absolute inset-0 h-4 w-full cursor-pointer opacity-0"
                    aria-label="Contrast"
                    @input="emit('setContrast', Number(($event.target as HTMLInputElement).value))"
                  >
                  <div
                    class="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pureBlack/22 bg-sand-6 shadow-sm"
                    :style="{ left: `${payload.theme.contrast}%` }"
                  />
                </div>
                <span class="hex-value rounded-md border border-pureBlack/10 bg-pureBlack/5 px-2 py-0.5 text-[12px] font-medium text-pureBlack/60">
                  {{ payload.theme.contrast }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p class="mb-2 px-1 text-[12px] font-semibold text-pureBlack/38">
            Advanced
          </p>
          <div class="overflow-visible rounded-[20px] border border-pureBlack/10 bg-pureWhite shadow-sm">
            <div class="flex items-center justify-between gap-3 border-b border-pureBlack/8 px-5 py-4">
              <div
                class="relative flex items-center gap-1.5"
                @mouseenter="openCodeThemeInfo"
                @mouseleave="closeCodeThemeInfo"
              >
                <span class="text-[15px] font-medium text-pureBlack/90">Code Theme</span>
                <Icon
                  name="ph:info"
                  class="h-4 w-4 cursor-help text-pureBlack/42 transition-colors hover:text-pureBlack/65"
                  aria-label="Code theme limitation info"
                  @focus="openCodeThemeInfo"
                  @blur="closeCodeThemeInfo"
                />
                <div
                  class="absolute left-0 top-full z-30 mt-2 w-[230px] rounded-xl border border-pureBlack/12 bg-pureWhite p-3 text-[11px] leading-relaxed text-pureBlack/70 shadow-lg transition-all"
                  :class="codeThemeInfoOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0 pointer-events-none'"
                  @mouseenter="openCodeThemeInfo"
                  @mouseleave="closeCodeThemeInfo"
                >
                  <p>
                    Codex currently enforces built-in syntax highlighting mappings for some code themes.
                  </p>
                  <p class="mt-1.5">
                    Until this is fixed upstream, fully custom syntax highlighting cannot always be applied.
                  </p>
                  <a
                    href="https://github.com/openai/codex/issues/14766"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-2 block w-fit text-[11px] text-[#0056d6] hover:underline"
                  >
                    GitHub issue #14766
                    <Icon name="ph:arrow-up-right-bold" class="h-3 w-3" />
                  </a>
                </div>
              </div>
              <div class="relative min-w-[166px]">
                <select
                  class="w-full appearance-none rounded-xl border border-pureBlack/10 bg-pureBlack/3 py-2 pl-3.5 pr-8 text-[14px] font-medium text-pureBlack/75 outline-none transition-colors hover:bg-pureBlack/6 focus:border-pureBlack/24"
                  :value="payload.codeThemeId"
                  aria-label="Code theme"
                  @change="onCodeThemeSelect"
                >
                  <option
                    v-for="option in codeThemeOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
                <Icon name="ph:caret-down" class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-pureBlack/40" />
              </div>
            </div>

            <div class="grid grid-cols-2">
              <div class="border-r border-pureBlack/8 px-5 py-4">
                <div class="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-pureBlack/38">
                  UI Size
                </div>
                <div class="group flex items-center justify-between gap-2 cursor-text" @click="focusSizeInput('ui', $event)">
                  <div class="inline-flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors group-hover:bg-pureBlack/6 group-focus-within:bg-pureBlack/6">
                    <input
                      ref="uiSizeInputRef"
                      class="size-input w-[2.2ch] border-none bg-transparent p-0 text-[15px] font-semibold text-pureBlack/90 outline-none"
                      :value="uiFontSize"
                      type="number"
                      min="12"
                      max="22"
                      step="1"
                      aria-label="UI size in pixels"
                      @input="emit('setUiFontSize', Number(($event.target as HTMLInputElement).value))"
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex w-6 flex-col overflow-hidden rounded-sm bg-pureBlack/8 opacity-0 translate-y-0.5 pointer-events-none transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto">
                      <button
                        type="button"
                        class="flex h-3 items-center justify-center border-none bg-transparent text-pureBlack/55 transition-colors hover:bg-pureBlack/10 hover:text-pureBlack/80"
                        aria-label="Increase UI size"
                        @click="stepUiSize(1)"
                      >
                        <Icon name="ph:caret-up-fill" class="h-2.5 w-2.5" />
                      </button>
                      <button
                        type="button"
                        class="flex h-3 items-center justify-center border-none bg-transparent text-pureBlack/55 transition-colors hover:bg-pureBlack/10 hover:text-pureBlack/80"
                        aria-label="Decrease UI size"
                        @click="stepUiSize(-1)"
                      >
                        <Icon name="ph:caret-down-fill" class="h-2.5 w-2.5" />
                      </button>
                    </div>
                    <span class="text-[12px] font-semibold uppercase tracking-[0.08em] text-pureBlack/36">PX</span>
                  </div>
                </div>
              </div>
              <div class="px-5 py-4">
                <div class="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-pureBlack/38">
                  Code Size
                </div>
                <div class="group flex items-center justify-between gap-2 cursor-text" @click="focusSizeInput('code', $event)">
                  <div class="inline-flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors group-hover:bg-pureBlack/6 group-focus-within:bg-pureBlack/6">
                    <input
                      ref="codeSizeInputRef"
                      class="size-input hex-value w-[2.2ch] border-none bg-transparent p-0 text-[15px] font-semibold text-pureBlack/90 outline-none"
                      :value="codeFontSize"
                      type="number"
                      min="12"
                      max="24"
                      step="1"
                      aria-label="Code size in pixels"
                      @input="emit('setCodeFontSize', Number(($event.target as HTMLInputElement).value))"
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex w-6 flex-col overflow-hidden rounded-sm bg-pureBlack/8 opacity-0 translate-y-0.5 pointer-events-none transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto">
                      <button
                        type="button"
                        class="flex h-3 items-center justify-center border-none bg-transparent text-pureBlack/55 transition-colors hover:bg-pureBlack/10 hover:text-pureBlack/80"
                        aria-label="Increase code size"
                        @click="stepCodeSize(1)"
                      >
                        <Icon name="ph:caret-up-fill" class="h-2.5 w-2.5" />
                      </button>
                      <button
                        type="button"
                        class="flex h-3 items-center justify-center border-none bg-transparent text-pureBlack/55 transition-colors hover:bg-pureBlack/10 hover:text-pureBlack/80"
                        aria-label="Decrease code size"
                        @click="stepCodeSize(-1)"
                      >
                        <Icon name="ph:caret-down-fill" class="h-2.5 w-2.5" />
                      </button>
                    </div>
                    <span class="hex-value text-[12px] font-semibold uppercase tracking-[0.08em] text-pureBlack/36">PX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-[20px] border border-pureBlack/14 bg-pureBlack shadow-[0_12px_24px_-16px_rgba(0,0,0,0.5)]">
          <button
            type="button"
            class="flex w-full items-center justify-between border-none bg-transparent px-5 py-4 text-left shadow-none outline-none"
            @click="jsonOpen = !jsonOpen"
          >
            <div class="flex items-center gap-3">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sand-3 text-pureWhite">
                <Icon name="ph:brackets-curly-bold" class="size-5" />
              </span>
              <span class="text-[15px] font-semibold text-pureWhite">JSON Preview</span>
            </div>
            <Icon :name="jsonOpen ? 'ph:caret-up' : 'ph:caret-down'" class="h-4 w-4 text-pureWhite/60" />
          </button>

          <div v-show="jsonOpen" class="space-y-2 px-5 pb-5">
            <div class="json-editor-shell relative overflow-hidden rounded-2xl border border-pureWhite/12 bg-pureWhite/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div class="json-editor-viewer h-56 overflow-auto p-5">
                <SyntaxBlock
                  class="hex-value text-[12px] leading-relaxed"
                  :text="jsonValue"
                  language="json"
                  :code-theme-id="payload.codeThemeId"
                  fallback-color="rgba(255,255,255,0.9)"
                />
              </div>
              <div class="pointer-events-none absolute inset-0 rounded-2xl" />
            </div>
            <p v-if="jsonError" class="text-[12px] text-red-300">
              {{ jsonError }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Export -->
    <section class="space-y-4">
      <div class="flex gap-3 my-4">
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-pureBlack/10 bg-pureWhite py-3 text-[14px] font-semibold text-pureBlack/80 shadow-sm transition-all hover:bg-pureBlack/5 active:scale-[0.98]"
          @click="emit('exportTheme')"
        >
          <Icon name="ph:export-bold" class="h-4.5 w-4.5" />
          {{ exportState === 'ok' ? 'Exported!' : 'Export' }}
        </button>
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-pureBlack/10 bg-pureWhite py-3 text-[14px] font-semibold text-pureBlack/80 shadow-sm transition-all hover:bg-pureBlack/5 active:scale-[0.98]"
          @click="emit('copyExport')"
        >
          <Icon name="ph:copy-bold" class="h-4.5 w-4.5" />
          {{ copyState === 'ok' ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.size-input::-webkit-inner-spin-button,
.size-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.size-input {
  -moz-appearance: textfield;
}

.json-editor-shell {
  isolation: isolate;
  contain: paint;
  transform: translateZ(0);
  backface-visibility: hidden;
  /* Reinforces clipping at rounded corners during momentum scroll. */
  clip-path: inset(0 round 1rem);
}

.json-editor-viewer {
  border-radius: inherit;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.json-editor-viewer::-webkit-scrollbar {
  display: none;
}
</style>
