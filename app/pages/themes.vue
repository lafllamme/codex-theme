<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'
import { themePresetEntries } from '~/data/theme-preset-catalog'
import { isOfficialCodeThemeId, OFFICIAL_CODE_THEME_IDS } from '~/utils/code-theme-registry'
import { recommendCodeThemeId } from '~/utils/code-theme-syntax'
import { resolveThemeCodeFont, resolveThemeUiFont } from '~/utils/theme-font-stacks'

definePageMeta({
  layout: 'default',
  pageTransition: {
    name: 'theme-page',
    mode: 'out-in',
  },
})

const presetMap: Record<string, CodexThemePayload> = {
  'oscurange': {
    codeThemeId: 'oscurange',
    variant: 'dark',
    theme: {
      accent: '#f9b98c',
      contrast: 60,
      fonts: { code: null, ui: null },
      ink: '#e6e6e6',
      opaqueWindows: false,
      semanticColors: {
        diffAdded: '#40c977',
        diffRemoved: '#fa423e',
        skill: '#479ffa',
      },
      surface: '#0b0b0f',
    },
  },
  'adventure-black': {
    codeThemeId: 'oscurange',
    variant: 'dark',
    theme: {
      accent: '#FFB670',
      contrast: 60,
      fonts: { code: null, ui: null },
      ink: '#FEFFFF',
      opaqueWindows: false,
      semanticColors: {
        diffAdded: '#99B52C',
        diffRemoved: '#D84A33',
        skill: '#417AB3',
      },
      surface: '#040404',
    },
  },
  'night-owl': {
    codeThemeId: 'night-owl',
    variant: 'dark',
    theme: {
      accent: '#7bdff6',
      contrast: 68,
      fonts: { code: null, ui: null },
      ink: '#d5e8f7',
      opaqueWindows: false,
      semanticColors: {
        diffAdded: '#57d16e',
        diffRemoved: '#ff6b87',
        skill: '#71b7ff',
      },
      surface: '#071019',
    },
  },
  'rose-pine': {
    codeThemeId: 'rose-pine',
    variant: 'dark',
    theme: {
      accent: '#ea9a97',
      contrast: 60,
      fonts: { code: null, ui: null },
      ink: '#e0def4',
      opaqueWindows: false,
      semanticColors: {
        diffAdded: '#9ccfd8',
        diffRemoved: '#908caa',
        skill: '#c4a7e7',
      },
      surface: '#232136',
    },
  },
}

const payload = reactive<CodexThemePayload>(structuredClone(presetMap['adventure-black']))
const jsonValue = ref('')
const jsonError = ref('')
const copyState = ref<'idle' | 'ok' | 'error'>('idle')
const isApplyingJson = ref(false)
const scenarioId = ref('neutral')
const activePresetId = ref<string | null>(null)

const scenarioOptions = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'diff-stress', label: 'Diff stress' },
  { id: 'high-contrast', label: 'High contrast' },
  { id: 'panel-combo', label: 'Panel combo' },
]
const codeThemeOptions = [...OFFICIAL_CODE_THEME_IDS]

const knownTopLevelKeys = new Set(['codeThemeId', 'theme', 'variant'])
const knownThemeKeys = new Set(['accent', 'contrast', 'fonts', 'ink', 'opaqueWindows', 'semanticColors', 'surface'])
const knownSemanticKeys = new Set(['diffAdded', 'diffRemoved', 'skill'])
const knownFontKeys = new Set(['ui', 'code'])

const extraTopLevel = ref<Record<string, unknown>>({})
const extraTheme = ref<Record<string, unknown>>({})
const extraSemantic = ref<Record<string, unknown>>({})
const extraFonts = ref<Record<string, unknown>>({})
const neutralSnapshot = ref<CodexThemePayload | null>(null)

const uiFontSize = ref(16)
const codeFontSize = ref(18)

const themePageFontStyle = computed(() => ({
  '--font-ui': resolveThemeUiFont(payload.theme.fonts.ui),
  '--font-code': resolveThemeCodeFont(payload.theme.fonts.code, payload.theme.fonts.ui),
  '--ui-font-size': `${uiFontSize.value}px`,
  '--code-font-size': `${codeFontSize.value}px`,
}))

function toExportObject() {
  const exportCodeThemeId = isOfficialCodeThemeId(payload.codeThemeId)
    ? payload.codeThemeId
    : recommendCodeThemeId(payload)
  return {
    ...extraTopLevel.value,
    codeThemeId: exportCodeThemeId,
    theme: {
      ...extraTheme.value,
      accent: payload.theme.accent,
      contrast: payload.theme.contrast,
      fonts: {
        ...extraFonts.value,
        code: payload.theme.fonts.code,
        ui: payload.theme.fonts.ui,
      },
      ink: payload.theme.ink,
      opaqueWindows: payload.theme.opaqueWindows,
      semanticColors: {
        ...extraSemantic.value,
        diffAdded: payload.theme.semanticColors.diffAdded,
        diffRemoved: payload.theme.semanticColors.diffRemoved,
        skill: payload.theme.semanticColors.skill,
      },
      surface: payload.theme.surface,
    },
    variant: payload.variant,
  }
}

function toExportString() {
  return JSON.stringify(toExportObject(), null, 2)
}

function toCodexThemeString() {
  // Force variant: "dark" for Codex compatibility (Codex doesn't support light variant)
  const exportObj = { ...toExportObject(), variant: 'dark' }
  return `codex-theme-v1:${JSON.stringify(exportObj)}`
}

function collectUnknownKeys(raw: Record<string, unknown>, allowed: Set<string>) {
  return Object.fromEntries(
    Object.entries(raw).filter(([key]) => !allowed.has(key),
    ),
  )
}

function parsePayload(rawValue: string): {
  payload: CodexThemePayload
  extraTopLevel: Record<string, unknown>
  extraTheme: Record<string, unknown>
  extraSemantic: Record<string, unknown>
  extraFonts: Record<string, unknown>
} | null {
  try {
    const raw = rawValue.trim()
    if (!raw)
      return null

    const normalized = raw.startsWith('codex-theme-v1:')
      ? raw.slice('codex-theme-v1:'.length)
      : raw

    const next = JSON.parse(normalized) as Partial<CodexThemePayload> & Record<string, unknown>
    if (!next || typeof next !== 'object' || !next.theme || !next.theme.semanticColors || !next.theme.fonts)
      return null

    const nextTheme = next.theme as Record<string, unknown>
    const nextSemantic = next.theme.semanticColors as Record<string, unknown>
    const nextFonts = next.theme.fonts as Record<string, unknown>

    return {
      payload: {
        codeThemeId: String(next.codeThemeId || payload.codeThemeId),
        variant: next.variant === 'light' ? 'light' : 'dark',
        theme: {
          accent: String(next.theme.accent || payload.theme.accent),
          contrast: Number.isFinite(next.theme.contrast) ? Number(next.theme.contrast) : payload.theme.contrast,
          fonts: {
            code: next.theme.fonts.code ? String(next.theme.fonts.code) : null,
            ui: next.theme.fonts.ui ? String(next.theme.fonts.ui) : null,
          },
          ink: String(next.theme.ink || payload.theme.ink),
          opaqueWindows: Boolean(next.theme.opaqueWindows),
          semanticColors: {
            diffAdded: String(next.theme.semanticColors.diffAdded || payload.theme.semanticColors.diffAdded),
            diffRemoved: String(next.theme.semanticColors.diffRemoved || payload.theme.semanticColors.diffRemoved),
            skill: String(next.theme.semanticColors.skill || payload.theme.semanticColors.skill),
          },
          surface: String(next.theme.surface || payload.theme.surface),
        },
      },
      extraTopLevel: collectUnknownKeys(next, knownTopLevelKeys),
      extraTheme: collectUnknownKeys(nextTheme, knownThemeKeys),
      extraSemantic: collectUnknownKeys(nextSemantic, knownSemanticKeys),
      extraFonts: collectUnknownKeys(nextFonts, knownFontKeys),
    }
  }
  catch {
    return null
  }
}

function applyPayload(next: CodexThemePayload) {
  payload.codeThemeId = next.codeThemeId
  payload.variant = next.variant
  payload.theme.accent = next.theme.accent
  payload.theme.contrast = next.theme.contrast
  payload.theme.fonts.code = next.theme.fonts.code
  payload.theme.fonts.ui = next.theme.fonts.ui
  payload.theme.ink = next.theme.ink
  payload.theme.opaqueWindows = next.theme.opaqueWindows
  payload.theme.semanticColors.diffAdded = next.theme.semanticColors.diffAdded
  payload.theme.semanticColors.diffRemoved = next.theme.semanticColors.diffRemoved
  payload.theme.semanticColors.skill = next.theme.semanticColors.skill
  payload.theme.surface = next.theme.surface
}

function setExtraFromParsed(next: {
  extraTopLevel: Record<string, unknown>
  extraTheme: Record<string, unknown>
  extraSemantic: Record<string, unknown>
  extraFonts: Record<string, unknown>
}) {
  extraTopLevel.value = next.extraTopLevel
  extraTheme.value = next.extraTheme
  extraSemantic.value = next.extraSemantic
  extraFonts.value = next.extraFonts
}

function syncJsonFromPayload() {
  if (isApplyingJson.value)
    return
  jsonValue.value = toExportString()
}

function setJsonValue(value: string) {
  jsonValue.value = value
  jsonError.value = ''

  const parsed = parsePayload(value)
  if (!parsed) {
    jsonError.value = 'Invalid theme JSON. Keep codex-theme-v1 format.'
    return
  }

  isApplyingJson.value = true
  applyPayload(parsed.payload)
  setExtraFromParsed(parsed)
  queueMicrotask(() => {
    isApplyingJson.value = false
  })
}

function exportTheme() {
  jsonError.value = ''
  jsonValue.value = toExportString()
}

async function copyExport() {
  copyState.value = 'idle'
  if (!process.client || !navigator.clipboard) {
    copyState.value = 'error'
    return
  }

  try {
    await navigator.clipboard.writeText(toCodexThemeString())
    copyState.value = 'ok'
  }
  catch {
    copyState.value = 'error'
  }
}

function setAccent(value: string) {
  payload.theme.accent = value
}

function setSurface(value: string) {
  payload.theme.surface = value
}

function setInk(value: string) {
  payload.theme.ink = value
}

function setDiffAdded(value: string) {
  payload.theme.semanticColors.diffAdded = value
}

function setDiffRemoved(value: string) {
  payload.theme.semanticColors.diffRemoved = value
}

function setSkill(value: string) {
  payload.theme.semanticColors.skill = value
}

function setCodeThemeId(value: string) {
  payload.codeThemeId = value.trim()
}

function setUiFont(value: string) {
  payload.theme.fonts.ui = value.trim() ? value.trim() : null
}

function setCodeFont(value: string) {
  payload.theme.fonts.code = value.trim() ? value.trim() : null
}

function setContrast(value: number) {
  payload.theme.contrast = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 60))
}

function setTranslucentSidebar(value: boolean) {
  payload.theme.opaqueWindows = !value
}

function setUiFontSize(value: number) {
  uiFontSize.value = Math.max(12, Math.min(22, Math.round(value)))
}

function setCodeFontSize(value: number) {
  codeFontSize.value = Math.max(12, Math.min(24, Math.round(value)))
}

function applyThemePreset(entry: (typeof themePresetEntries)[number]) {
  applyPayload(structuredClone(entry.payload))
  setExtraFromParsed({
    extraTopLevel: {},
    extraTheme: {},
    extraSemantic: {},
    extraFonts: {},
  })
  activePresetId.value = entry.id
  scenarioId.value = 'neutral'
  neutralSnapshot.value = null
  jsonError.value = ''
  queueMicrotask(() => {
    syncJsonFromPayload()
  })
}

function setScenario(next: string) {
  if (next === scenarioId.value)
    return

  if (next === 'neutral' && neutralSnapshot.value) {
    applyPayload(structuredClone(neutralSnapshot.value))
    neutralSnapshot.value = null
    scenarioId.value = next
    return
  }

  if (!neutralSnapshot.value)
    neutralSnapshot.value = structuredClone(payload)

  if (next === 'diff-stress') {
    payload.theme.semanticColors.diffAdded = '#00ff8f'
    payload.theme.semanticColors.diffRemoved = '#ff4f78'
    payload.theme.contrast = 74
  }
  else if (next === 'high-contrast') {
    payload.theme.ink = '#ffffff'
    payload.theme.surface = '#050505'
    payload.theme.contrast = 94
  }
  else if (next === 'panel-combo') {
    payload.theme.opaqueWindows = false
    payload.theme.contrast = 66
    payload.theme.semanticColors.skill = '#8ec9ff'
  }

  scenarioId.value = next
}

watch(
  payload,
  () => {
    syncJsonFromPayload()
  },
  { deep: true },
)

onMounted(() => {
  syncJsonFromPayload()
})
</script>

<template>
  <main class="themes-shell">
    <div class="themes-shell__glow" />

    <div class="themes-shell__content">
      <div class="themes-shell__themed" :style="themePageFontStyle">
        <DsCodexWorkbench
          class="themes-shell__workbench"
          :payload="payload"
          :ui-font-size="uiFontSize"
          :code-font-size="codeFontSize"
          :translucent-sidebar="!payload.theme.opaqueWindows"
        />
        <DsThemeControlsBar
          :payload="payload"
          :code-theme-options="codeThemeOptions"
          :json-value="jsonValue"
          :json-error="jsonError"
          :copy-state="copyState"
          :ui-font-size="uiFontSize"
          :code-font-size="codeFontSize"
          :translucent-sidebar="!payload.theme.opaqueWindows"
          :scenario-id="scenarioId"
          :scenario-options="scenarioOptions"
          :theme-presets="themePresetEntries"
          :active-preset-id="activePresetId"
          @set-json-value="setJsonValue"
          @apply-theme-preset="applyThemePreset"
          @export-theme="exportTheme"
          @copy-export="copyExport"
          @set-accent="setAccent"
          @set-surface="setSurface"
          @set-ink="setInk"
          @set-diff-added="setDiffAdded"
          @set-diff-removed="setDiffRemoved"
          @set-skill="setSkill"
          @set-code-theme-id="setCodeThemeId"
          @set-ui-font="setUiFont"
          @set-code-font="setCodeFont"
          @set-contrast="setContrast"
          @set-translucent-sidebar="setTranslucentSidebar"
          @set-ui-font-size="setUiFontSize"
          @set-code-font-size="setCodeFontSize"
          @set-scenario="setScenario"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.themes-shell {
  position: relative;
  display: flex;
  height: 100dvh;
  max-height: 100dvh;
  min-height: 100dvh;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.themes-shell__glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 14% 0%, rgba(130, 247, 231, 0.11), transparent 34%),
    radial-gradient(circle at 90% 0%, rgba(249, 185, 140, 0.12), transparent 30%);
}

.themes-shell__content {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 0;
  flex: 1 1 0;
  flex-direction: column;
  overflow: hidden;
}

.themes-shell__themed {
  display: flex;
  min-height: 0;
  flex: 1 1 0;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-ui);
}

.themes-shell__workbench {
  min-height: 0;
  min-width: 0;
  flex: 1 1 0;
  width: 100%;
}
</style>
