<script setup lang="ts">
import type { CodexThemePayload, ThemeFieldPath } from '~/types/codex-theme'

type MobileTab = 'terminal' | 'diff' | 'chat'

interface QualityCheck {
  id: string
  label: string
  status: 'ok' | 'warn'
  detail: string
}

const presetMap: Record<string, CodexThemePayload> = {
  oscurange: {
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
}

const codeThemeOptions = ['oscurange', 'night-owl', 'tokyo-night', 'catppuccin', 'one-dark']

const payload = reactive<CodexThemePayload>(structuredClone(presetMap.oscurange))
const activePreset = ref('oscurange')
const importValue = ref('')
const importError = ref('')
const copyState = ref<'idle' | 'ok' | 'error'>('idle')
const mobileTab = ref<MobileTab>('terminal')
const sidebarCollapsed = ref(false)

const exportValue = computed(() => `codex-theme-v1:${JSON.stringify(payload)}`)

const previewBaseStyle = computed(() => ({
  '--theme-surface': payload.theme.surface,
  '--theme-ink': payload.theme.ink,
  '--theme-accent': payload.theme.accent,
}))

const checkContrast = (hexA: string, hexB: string) => {
  const toRgb = (hex: string) => {
    const clean = hex.replace('#', '').trim()
    const chunk = clean.length === 3
      ? clean.split('').map(char => char + char).join('')
      : clean

    if (chunk.length !== 6) return null

    const value = Number.parseInt(chunk, 16)
    if (Number.isNaN(value)) return null

    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    }
  }

  const luminance = (hex: string) => {
    const rgb = toRgb(hex)
    if (!rgb) return null

    const channels = [rgb.r, rgb.g, rgb.b].map((item) => {
      const c = item / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })

    return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2])
  }

  const l1 = luminance(hexA)
  const l2 = luminance(hexB)
  if (l1 === null || l2 === null) return null

  const bright = Math.max(l1, l2)
  const dark = Math.min(l1, l2)
  return (bright + 0.05) / (dark + 0.05)
}

const colorDistance = (hexA: string, hexB: string) => {
  const toRgb = (hex: string) => {
    const clean = hex.replace('#', '').trim()
    const chunk = clean.length === 3
      ? clean.split('').map(char => char + char).join('')
      : clean

    if (chunk.length !== 6) return null

    const value = Number.parseInt(chunk, 16)
    if (Number.isNaN(value)) return null

    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    }
  }

  const rgbA = toRgb(hexA)
  const rgbB = toRgb(hexB)

  if (!rgbA || !rgbB) return null

  const dr = rgbA.r - rgbB.r
  const dg = rgbA.g - rgbB.g
  const db = rgbA.b - rgbB.b

  return Math.sqrt((dr * dr) + (dg * dg) + (db * db))
}

const qualityChecks = computed<QualityCheck[]>(() => {
  const contrast = checkContrast(payload.theme.surface, payload.theme.ink)
  const accentDist = colorDistance(payload.theme.surface, payload.theme.accent)
  const diffDist = colorDistance(payload.theme.semanticColors.diffAdded, payload.theme.semanticColors.diffRemoved)
  const skillDist = colorDistance(payload.theme.accent, payload.theme.semanticColors.skill)

  return [
    {
      id: 'contrast',
      label: 'Ink vs Surface Contrast',
      status: contrast !== null && contrast >= 4.5 ? 'ok' : 'warn',
      detail: contrast !== null
        ? `Current ratio ${contrast.toFixed(2)} (target >= 4.5)`
        : 'Could not compute contrast from current values.',
    },
    {
      id: 'accent-gap',
      label: 'Accent Separation from Surface',
      status: accentDist !== null && accentDist >= 58 ? 'ok' : 'warn',
      detail: accentDist !== null
        ? `Color distance ${Math.round(accentDist)} (target >= 58)`
        : 'Could not compute accent separation.',
    },
    {
      id: 'diff-gap',
      label: 'Diff Added / Removed Distinction',
      status: diffDist !== null && diffDist >= 90 ? 'ok' : 'warn',
      detail: diffDist !== null
        ? `Color distance ${Math.round(diffDist)} (target >= 90)`
        : 'Could not compute diff distinction.',
    },
    {
      id: 'skill-gap',
      label: 'Skill vs Accent Clarity',
      status: skillDist !== null && skillDist >= 50 ? 'ok' : 'warn',
      detail: skillDist !== null
        ? `Color distance ${Math.round(skillDist)} (target >= 50)`
        : 'Could not compute skill color clarity.',
    },
  ]
})

const applyPayload = (next: CodexThemePayload) => {
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

const setField = (path: ThemeFieldPath, value: unknown) => {
  switch (path) {
    case 'codeThemeId':
      payload.codeThemeId = String(value)
      return
    case 'variant':
      payload.variant = value === 'light' ? 'light' : 'dark'
      return
    case 'theme.accent':
      payload.theme.accent = String(value)
      return
    case 'theme.surface':
      payload.theme.surface = String(value)
      return
    case 'theme.ink':
      payload.theme.ink = String(value)
      return
    case 'theme.contrast':
      payload.theme.contrast = Number(value)
      return
    case 'theme.opaqueWindows':
      payload.theme.opaqueWindows = Boolean(value)
      return
    case 'theme.semanticColors.diffAdded':
      payload.theme.semanticColors.diffAdded = String(value)
      return
    case 'theme.semanticColors.diffRemoved':
      payload.theme.semanticColors.diffRemoved = String(value)
      return
    case 'theme.semanticColors.skill':
      payload.theme.semanticColors.skill = String(value)
      return
    case 'theme.fonts.ui':
      payload.theme.fonts.ui = value ? String(value) : null
      return
    case 'theme.fonts.code':
      payload.theme.fonts.code = value ? String(value) : null
  }
}

const applyPreset = (preset: string) => {
  const next = presetMap[preset]
  if (!next) return

  activePreset.value = preset
  applyPayload(structuredClone(next))
}

const resetPreset = () => {
  applyPreset(activePreset.value)
}

const applyImport = () => {
  importError.value = ''

  try {
    const raw = importValue.value.trim()
    if (!raw) {
      importError.value = 'Paste a codex-theme-v1 string first.'
      return
    }

    const normalized = raw.startsWith('codex-theme-v1:')
      ? raw.slice('codex-theme-v1:'.length)
      : raw

    const next = JSON.parse(normalized) as Partial<CodexThemePayload>

    if (!next || typeof next !== 'object' || !next.theme || !next.theme.semanticColors || !next.theme.fonts) {
      throw new Error('Invalid payload shape.')
    }

    applyPayload({
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
    })
  }
  catch {
    importError.value = 'Invalid format. Use a valid codex-theme-v1 string.'
  }
}

const copyTheme = async () => {
  copyState.value = 'idle'

  if (!process.client || !navigator.clipboard) {
    copyState.value = 'error'
    return
  }

  try {
    await navigator.clipboard.writeText(exportValue.value)
    copyState.value = 'ok'
  }
  catch {
    copyState.value = 'error'
  }
}
</script>

<template>
  <main class="relative min-h-screen p-3 sm:p-5 lg:p-7">
    <div class="absolute inset-0 z-0 pointer-events-none [background-image:radial-gradient(circle_at_10%_0%,rgba(130,247,231,0.09),transparent_34%),radial-gradient(circle_at_94%_0%,rgba(249,185,140,0.11),transparent_30%)]" />

    <div class="relative z-10 mx-auto max-w-[1700px] pb-6">
      <DsMacChrome />

      <section class="workbench-shell mt-3 rounded-[26px] border border-white/10 bg-black/82 p-3 backdrop-blur-2xl sm:p-4">
        <div class="grid gap-3 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_420px]">
          <DsCodexSidebar
            :collapsed="sidebarCollapsed"
            :class="[
              'row-span-full',
              sidebarCollapsed ? 'hidden lg:block' : 'block',
            ]"
          />

          <div class="space-y-3" :style="previewBaseStyle">
            <DsCodexTopbar :code-theme-id="payload.codeThemeId" :variant="payload.variant" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

            <div class="block md:hidden">
              <div class="mb-2 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
                <button class="tab-chip" :class="mobileTab === 'terminal' ? 'tab-chip--active' : ''" @click="mobileTab = 'terminal'">
                  Terminal
                </button>
                <button class="tab-chip" :class="mobileTab === 'diff' ? 'tab-chip--active' : ''" @click="mobileTab = 'diff'">
                  Diff
                </button>
                <button class="tab-chip" :class="mobileTab === 'chat' ? 'tab-chip--active' : ''" @click="mobileTab = 'chat'">
                  Chat
                </button>
              </div>

              <DsPreviewTerminal v-if="mobileTab === 'terminal'" :payload="payload" />
              <DsPreviewDiff v-else-if="mobileTab === 'diff'" :payload="payload" />
              <DsPreviewChatComposer v-else :payload="payload" />
            </div>

            <div class="hidden md:grid md:gap-3 md:grid-cols-1 xl:grid-cols-2">
              <DsPreviewTerminal :payload="payload" />
              <DsPreviewDiff :payload="payload" />
              <div class="xl:col-span-2 grid gap-3 2xl:grid-cols-[1fr_380px]">
                <DsPreviewChatComposer :payload="payload" />
                <DsThemeQualityChecks :checks="qualityChecks" />
              </div>
            </div>
          </div>

          <DsThemeInspector
            class="xl:sticky xl:top-5"
            :payload="payload"
            :code-theme-options="codeThemeOptions"
            :import-value="importValue"
            :import-error="importError"
            :export-value="exportValue"
            :copy-state="copyState"
            :active-preset="activePreset"
            :preset-options="Object.keys(presetMap)"
            @set-field="setField"
            @update-import="importValue = $event"
            @apply-import="applyImport"
            @copy-theme="copyTheme"
            @apply-preset="applyPreset"
            @reset-preset="resetPreset"
          />

          <div class="md:hidden">
            <DsThemeQualityChecks :checks="qualityChecks" />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.workbench-shell {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 45px 95px rgba(0, 0, 0, 0.45);
}

.tab-chip {
  border: 1px solid transparent;
  border-radius: 9px;
  padding: 6px 10px;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  font-family: var(--font-ui);
  font-size: 12px;
}

.tab-chip--active {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.94);
}
</style>
