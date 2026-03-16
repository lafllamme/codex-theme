<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

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
}

const codeThemeOptions = ['oscurange', 'night-owl', 'tokyo-night', 'catppuccin', 'one-dark']

const payload = reactive<CodexThemePayload>(structuredClone(presetMap.oscurange))
const activePreset = ref('oscurange')
const importValue = ref('')
const importError = ref('')
const copyState = ref<'idle' | 'ok' | 'error'>('idle')

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

function applyPreset(preset: string) {
  const selected = presetMap[preset]
  if (!selected)
    return

  activePreset.value = preset
  applyPayload(structuredClone(selected))
}

function setThemeId(value: string) {
  payload.codeThemeId = value
}

function setVariant(value: 'dark' | 'light') {
  payload.variant = value
}

function setImport(value: string) {
  importValue.value = value
}

function resetPreset() {
  applyPreset(activePreset.value)
}

function applyImport() {
  importError.value = ''

  try {
    const raw = importValue.value.trim()
    if (!raw) {
      importError.value = 'Bitte erst einen codex-theme-v1 String einfügen.'
      return
    }

    const normalized = raw.startsWith('codex-theme-v1:')
      ? raw.slice('codex-theme-v1:'.length)
      : raw

    const next = JSON.parse(normalized) as Partial<CodexThemePayload>
    if (!next || typeof next !== 'object' || !next.theme || !next.theme.semanticColors || !next.theme.fonts)
      throw new Error('Invalid payload')

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
    importError.value = 'Ungültiges Format. Bitte codex-theme-v1 JSON verwenden.'
  }
}

async function copyExport() {
  copyState.value = 'idle'
  if (!process.client || !navigator.clipboard) {
    copyState.value = 'error'
    return
  }

  try {
    await navigator.clipboard.writeText(`codex-theme-v1:${JSON.stringify(payload)}`)
    copyState.value = 'ok'
  }
  catch {
    copyState.value = 'error'
  }
}
</script>

<template>
  <main class="themes-shell">
    <div class="themes-shell__glow" />

    <div class="themes-shell__content">
      <DsThemeControlsBar
        :payload="payload"
        :active-preset="activePreset"
        :preset-options="Object.keys(presetMap)"
        :code-theme-options="codeThemeOptions"
        :import-value="importValue"
        :import-error="importError"
        :copy-state="copyState"
        @apply-preset="applyPreset"
        @set-theme-id="setThemeId"
        @set-variant="setVariant"
        @set-import="setImport"
        @apply-import="applyImport"
        @copy-export="copyExport"
        @reset-preset="resetPreset"
      />

      <DsCodexWorkbench :payload="payload" />
    </div>
  </main>
</template>

<style scoped>
.themes-shell {
  position: relative;
  min-height: 100vh;
  padding: 14px;
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
  margin: 0 auto;
  max-width: 1720px;
  display: grid;
  gap: 12px;
}
</style>

<style>
.theme-page-enter-active,
.theme-page-leave-active {
  transition: all 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.theme-page-enter-from,
.theme-page-leave-to {
  opacity: 0;
  filter: blur(18px);
  transform: translateY(16px) scale(0.985);
}
</style>
