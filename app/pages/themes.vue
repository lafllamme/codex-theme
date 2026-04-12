<script setup lang="ts">
import type { CodexThemePayload, ThemeVariant } from '~/types/codex-theme'
import { themePresetEntries } from '~/data/theme-preset-catalog'
import { isOfficialCodeThemeId, OFFICIAL_CODE_THEME_IDS } from '~/utils/code-theme-registry'
import { recommendCodeThemeId } from '~/utils/code-theme-syntax'
import { downloadTextFile } from '~/utils/download-text-file'
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
const exportState = ref<'idle' | 'ok'>('idle')
const applyState = ref<'idle' | 'ok' | 'error'>('idle')
const isApplyingJson = ref(false)
const scenarioId = ref('neutral')
const activePresetId = ref<string | null>(null)
let copyStateResetTimer: ReturnType<typeof setTimeout> | null = null
let exportStateResetTimer: ReturnType<typeof setTimeout> | null = null
let applyStateResetTimer: ReturnType<typeof setTimeout> | null = null
let jsonSyncRaf: number | null = null

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
const SAFE_FILENAME_RE = /[^a-z0-9-]/gi

const extraTopLevel = ref<Record<string, unknown>>({})
const extraTheme = ref<Record<string, unknown>>({})
const extraSemantic = ref<Record<string, unknown>>({})
const extraFonts = ref<Record<string, unknown>>({})
const neutralSnapshot = ref<CodexThemePayload | null>(null)

const uiFontSize = ref(16)
const codeFontSize = ref(18)
const themeSwitching = ref(false)
let themeSwitchTimer: ReturnType<typeof setTimeout> | null = null
const THEME_SWITCH_MS = 250

function triggerThemeSwitch() {
  if (themeSwitchTimer) {
    clearTimeout(themeSwitchTimer)
    themeSwitchTimer = null
  }

  // Must be active before payload mutations so color changes are captured by CSS transitions.
  themeSwitching.value = true
  themeSwitchTimer = setTimeout(() => {
    themeSwitching.value = false
    themeSwitchTimer = null
  }, THEME_SWITCH_MS)
}

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
  return `codex-theme-v1:${JSON.stringify(toExportObject())}`
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
  payload.theme = structuredClone(next.theme)
}

function snapshotPayload(): CodexThemePayload {
  return {
    codeThemeId: payload.codeThemeId,
    variant: payload.variant,
    theme: structuredClone(payload.theme),
  }
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

function scheduleJsonSync() {
  if (isApplyingJson.value)
    return

  if (!import.meta.client) {
    syncJsonFromPayload()
    return
  }

  if (jsonSyncRaf != null)
    cancelAnimationFrame(jsonSyncRaf)

  jsonSyncRaf = requestAnimationFrame(() => {
    jsonSyncRaf = null
    syncJsonFromPayload()
  })
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
  triggerThemeSwitch()
  applyPayload(parsed.payload)
  setExtraFromParsed(parsed)
  queueMicrotask(() => {
    isApplyingJson.value = false
  })
}

function exportTheme() {
  jsonError.value = ''
  const exportString = toExportString()
  jsonValue.value = exportString

  const safeThemeId = (isOfficialCodeThemeId(payload.codeThemeId) ? payload.codeThemeId : recommendCodeThemeId(payload))
    .replace(SAFE_FILENAME_RE, '-')
    .toLowerCase()
  const filename = `codex-theme-v1-${safeThemeId}-${payload.variant}.json`
  downloadTextFile({
    filename,
    text: exportString,
    mimeType: 'application/json;charset=utf-8',
  })

  exportState.value = 'ok'
  if (exportStateResetTimer)
    clearTimeout(exportStateResetTimer)
  exportStateResetTimer = setTimeout(() => {
    exportState.value = 'idle'
    exportStateResetTimer = null
  }, 3000)
}

async function copyExport() {
  copyState.value = 'idle'
  if (copyStateResetTimer) {
    clearTimeout(copyStateResetTimer)
    copyStateResetTimer = null
  }
  if (!process.client || !navigator.clipboard) {
    copyState.value = 'error'
    return
  }

  try {
    await navigator.clipboard.writeText(toCodexThemeString())
    copyState.value = 'ok'
    copyStateResetTimer = setTimeout(() => {
      copyState.value = 'idle'
      copyStateResetTimer = null
    }, 3000)
  }
  catch {
    copyState.value = 'error'
  }
}

async function applyExport() {
  applyState.value = 'idle'
  if (applyStateResetTimer) {
    clearTimeout(applyStateResetTimer)
    applyStateResetTimer = null
  }
  if (!process.client || !navigator.clipboard) {
    applyState.value = 'error'
    return
  }

  try {
    await navigator.clipboard.writeText(toCodexThemeString())
    openCodexSettingsFromBrowser()
    applyState.value = 'ok'
    applyStateResetTimer = setTimeout(() => {
      applyState.value = 'idle'
      applyStateResetTimer = null
    }, 3000)
  }
  catch {
    applyState.value = 'error'
  }
}

function openCodexSettingsFromBrowser() {
  if (!process.client)
    return

  // Codex currently deep-links reliably to settings root only.
  // Section-level routing (e.g. appearance) falls back to "general" in current app builds.
  const codexSettingsUrl = 'codex://settings'
  const anchor = document.createElement('a')
  anchor.href = codexSettingsUrl
  anchor.rel = 'noopener noreferrer'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
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

function setVariant(value: ThemeVariant) {
  payload.variant = value
}

function setUiFont(value: string) {
  payload.theme.fonts.ui = value.trim() ? value.trim() : null
}

function setCodeFont(value: string) {
  payload.theme.fonts.code = value.trim() ? value.trim() : null
}

function randomInt(min: number, max: number) {
  const lower = Math.ceil(min)
  const upper = Math.floor(max)
  return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

function pickRandom<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)] as T
}

function pickRandomDifferent<T>(items: readonly T[], current: T): T {
  if (items.length < 2)
    return items[0] as T

  let next = pickRandom(items)
  while (next === current) {
    next = pickRandom(items)
  }
  return next
}

function hslToHex(h: number, s: number, l: number) {
  const sat = s / 100
  const light = l / 100
  const c = (1 - Math.abs((2 * light) - 1)) * sat
  const hh = h / 60
  const x = c * (1 - Math.abs((hh % 2) - 1))
  let r = 0
  let g = 0
  let b = 0

  if (hh >= 0 && hh < 1) {
    r = c
    g = x
  }
  else if (hh >= 1 && hh < 2) {
    r = x
    g = c
  }
  else if (hh >= 2 && hh < 3) {
    g = c
    b = x
  }
  else if (hh >= 3 && hh < 4) {
    g = x
    b = c
  }
  else if (hh >= 4 && hh < 5) {
    r = x
    b = c
  }
  else {
    r = c
    b = x
  }

  const m = light - c / 2
  const toHex = (value: number) => {
    return Math.round((value + m) * 255).toString(16).padStart(2, '0')
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function randomizeTheme() {
  triggerThemeSwitch()
  const next = snapshotPayload()
  const randomUiFont = pickRandomDifferent<string | null>([
    null,
    'Inter',
    'Satoshi',
    'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    'Arial, Helvetica, sans-serif',
    '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    'Helvetica, Arial, sans-serif',
    'Verdana, Geneva, sans-serif',
    'Tahoma, Geneva, sans-serif',
    '"Trebuchet MS", Helvetica, sans-serif',
    'Georgia, "Times New Roman", serif',
    '"Times New Roman", Times, serif',
  ], next.theme.fonts.ui)
  const randomCodeFont = pickRandomDifferent<string | null>([
    null,
    'Inter',
    'Satoshi',
    'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    'Arial, Helvetica, sans-serif',
    '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    'Helvetica, Arial, sans-serif',
    'Verdana, Geneva, sans-serif',
    'Tahoma, Geneva, sans-serif',
    '"Trebuchet MS", Helvetica, sans-serif',
    'Georgia, "Times New Roman", serif',
    '"Times New Roman", Times, serif',
  ], next.theme.fonts.code)
  const baseHue = randomInt(0, 359)
  const accentHue = (baseHue + randomInt(18, 168)) % 360
  const skillHue = (baseHue + randomInt(170, 285)) % 360
  const diffRemovedHue = Math.random() < 0.5 ? randomInt(345, 359) : randomInt(0, 12)

  next.variant = 'dark'
  next.theme.surface = hslToHex(baseHue, randomInt(12, 34), randomInt(5, 14))
  next.theme.ink = hslToHex((baseHue + randomInt(-12, 12) + 360) % 360, randomInt(16, 52), randomInt(82, 95))
  next.theme.accent = hslToHex(accentHue, randomInt(56, 88), randomInt(62, 76))
  next.theme.semanticColors.diffAdded = hslToHex(randomInt(105, 152), randomInt(46, 82), randomInt(56, 74))
  next.theme.semanticColors.diffRemoved = hslToHex(diffRemovedHue, randomInt(62, 90), randomInt(62, 76))
  next.theme.semanticColors.skill = hslToHex(skillHue, randomInt(52, 86), randomInt(60, 76))
  next.theme.contrast = randomInt(54, 86)
  next.theme.opaqueWindows = true
  next.theme.fonts.ui = randomUiFont
  next.theme.fonts.code = randomCodeFont
  next.codeThemeId = pickRandomDifferent(OFFICIAL_CODE_THEME_IDS, next.codeThemeId)
  applyPayload(next)

  activePresetId.value = null
  scenarioId.value = 'neutral'
  neutralSnapshot.value = null
  jsonError.value = ''
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
  triggerThemeSwitch()
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
    triggerThemeSwitch()
    applyPayload(structuredClone(neutralSnapshot.value))
    neutralSnapshot.value = null
    scenarioId.value = next
    return
  }

  if (!neutralSnapshot.value)
    neutralSnapshot.value = structuredClone(payload)

  triggerThemeSwitch()
  const scenarioPayload = snapshotPayload()
  if (next === 'diff-stress') {
    scenarioPayload.theme.semanticColors.diffAdded = '#00ff8f'
    scenarioPayload.theme.semanticColors.diffRemoved = '#ff4f78'
    scenarioPayload.theme.contrast = 74
  }
  else if (next === 'high-contrast') {
    scenarioPayload.theme.ink = '#ffffff'
    scenarioPayload.theme.surface = '#050505'
    scenarioPayload.theme.contrast = 94
  }
  else if (next === 'panel-combo') {
    scenarioPayload.theme.opaqueWindows = false
    scenarioPayload.theme.contrast = 66
    scenarioPayload.theme.semanticColors.skill = '#8ec9ff'
  }

  applyPayload(scenarioPayload)
  scenarioId.value = next
}

watch(
  payload,
  () => {
    scheduleJsonSync()
  },
  { deep: true },
)

onMounted(() => {
  syncJsonFromPayload()
})

onBeforeUnmount(() => {
  if (jsonSyncRaf != null)
    cancelAnimationFrame(jsonSyncRaf)
  if (themeSwitchTimer)
    clearTimeout(themeSwitchTimer)
  if (copyStateResetTimer)
    clearTimeout(copyStateResetTimer)
  if (exportStateResetTimer)
    clearTimeout(exportStateResetTimer)
  if (applyStateResetTimer)
    clearTimeout(applyStateResetTimer)
})
</script>

<template>
  <main data-lenis-prevent class="themes-shell theme-color-smooth">
    <div class="themes-shell__glow" />

    <div class="themes-shell__content">
      <div class="themes-shell__themed" :style="themePageFontStyle">
        <DsCodexWorkbench
          class="themes-shell__workbench"
          :payload="payload"
          :ui-font-size="uiFontSize"
          :code-font-size="codeFontSize"
          :theme-switching="themeSwitching"
          :translucent-sidebar="!payload.theme.opaqueWindows"
        />
        <DsThemeControlsBar
          :payload="payload"
          :code-theme-options="codeThemeOptions"
          :json-value="jsonValue"
          :json-error="jsonError"
          :copy-state="copyState"
          :export-state="exportState"
          :apply-state="applyState"
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
          @apply-export="applyExport"
          @set-accent="setAccent"
          @set-surface="setSurface"
          @set-ink="setInk"
          @set-diff-added="setDiffAdded"
          @set-diff-removed="setDiffRemoved"
          @set-skill="setSkill"
          @set-code-theme-id="setCodeThemeId"
          @set-variant="setVariant"
          @set-ui-font="setUiFont"
          @set-code-font="setCodeFont"
          @set-contrast="setContrast"
          @set-translucent-sidebar="setTranslucentSidebar"
          @set-ui-font-size="setUiFontSize"
          @set-code-font-size="setCodeFontSize"
          @set-scenario="setScenario"
          @randomize-theme="randomizeTheme"
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
