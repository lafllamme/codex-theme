<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

interface ThreadItem {
  id: string
  title: string
  time: string
}

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  text: string
}

const defaultUiFont = '\'Geist\', ui-sans-serif, system-ui, -apple-system, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif'
const defaultCodeFont = '\'Geist Mono\', ui-monospace, \'SFMono-Regular\', Menlo, Monaco, Consolas, monospace'

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
const modelOptions = ['GPT-5.3-Codex', 'GPT-5.2-Codex', 'o3']
const thinkingOptions = ['Niedrig', 'Mittel', 'Hoch']

const payload = reactive<CodexThemePayload>(structuredClone(presetMap.oscurange))
const activePreset = ref('oscurange')
const importValue = ref('')
const importError = ref('')
const copyState = ref<'idle' | 'ok' | 'error'>('idle')
const bannerState = ref('')

const navCollapsed = ref(false)
const activeThreadId = ref('thread-1')
const selectedModel = ref(modelOptions[0])
const selectedThinking = ref(thinkingOptions[1])
const composeValue = ref('Tune accent + semantic colors')
const pipEnabled = ref(true)
const terminalActive = ref(true)
const diffActive = ref(true)

const threadItems: ThreadItem[] = [
  { id: 'thread-1', title: 'Öffne Vue-Bits Dither Seite', time: '1 Std.' },
  { id: 'thread-2', title: 'Make DsRing mobile friendly', time: '39 Min.' },
]

const messagesByThread: Record<string, ChatMessage[]> = {
  'thread-1': [
    { id: 'a1', role: 'assistant', text: 'Build ist erfolgreich. Ich habe die Header-Nähe und Abstände angeglichen.' },
    { id: 'u1', role: 'user', text: 'Kannst du das Logo noch snappier und weniger linear machen?' },
    { id: 'a2', role: 'assistant', text: 'Ja. Ich baue ein kurzes Overshoot-Movement mit sauberem Settling ein.' },
  ],
  'thread-2': [
    { id: 'a3', role: 'assistant', text: 'Mobile Layout für DsRing wurde stabilisiert und mit breakpoints abgesichert.' },
    { id: 'u2', role: 'user', text: 'Bitte näher an das Codex-Layout, ohne Misch-Panel.' },
    { id: 'a4', role: 'assistant', text: 'Verstanden. Ich setze einen kompletten Rebuild in zwei klaren Layern um.' },
  ],
}

const activeMessages = computed(() => messagesByThread[activeThreadId.value] || [])
const exportValue = computed(() => `codex-theme-v1:${JSON.stringify(payload)}`)

const shellStyle = computed(() => ({
  '--theme-surface': payload.theme.surface,
  '--theme-ink': payload.theme.ink,
  '--theme-accent': payload.theme.accent,
  '--theme-added': payload.theme.semanticColors.diffAdded,
  '--theme-removed': payload.theme.semanticColors.diffRemoved,
  '--theme-skill': payload.theme.semanticColors.skill,
  '--font-ui': payload.theme.fonts.ui || defaultUiFont,
  '--font-code': payload.theme.fonts.code || defaultCodeFont,
}))

function flashBanner(label: string) {
  bannerState.value = label
  setTimeout(() => {
    if (bannerState.value === label)
      bannerState.value = ''
  }, 1400)
}

function applyPreset(preset: string) {
  const selected = presetMap[preset]
  if (!selected)
    return

  activePreset.value = preset
  payload.codeThemeId = selected.codeThemeId
  payload.variant = selected.variant
  payload.theme.accent = selected.theme.accent
  payload.theme.contrast = selected.theme.contrast
  payload.theme.fonts.code = selected.theme.fonts.code
  payload.theme.fonts.ui = selected.theme.fonts.ui
  payload.theme.ink = selected.theme.ink
  payload.theme.opaqueWindows = selected.theme.opaqueWindows
  payload.theme.semanticColors.diffAdded = selected.theme.semanticColors.diffAdded
  payload.theme.semanticColors.diffRemoved = selected.theme.semanticColors.diffRemoved
  payload.theme.semanticColors.skill = selected.theme.semanticColors.skill
  payload.theme.surface = selected.theme.surface
}

function resetPreset() {
  applyPreset(activePreset.value)
  flashBanner('Preset zurückgesetzt')
}

function setThemeId(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  payload.codeThemeId = target.value
}

function setVariant(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  payload.variant = target.value === 'light' ? 'light' : 'dark'
}

function setImportValue(event: Event) {
  const target = event.target as HTMLTextAreaElement | null
  if (!target)
    return
  importValue.value = target.value
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

    payload.codeThemeId = String(next.codeThemeId || payload.codeThemeId)
    payload.variant = next.variant === 'light' ? 'light' : 'dark'
    payload.theme.accent = String(next.theme.accent || payload.theme.accent)
    payload.theme.contrast = Number.isFinite(next.theme.contrast) ? Number(next.theme.contrast) : payload.theme.contrast
    payload.theme.fonts.code = next.theme.fonts.code ? String(next.theme.fonts.code) : null
    payload.theme.fonts.ui = next.theme.fonts.ui ? String(next.theme.fonts.ui) : null
    payload.theme.ink = String(next.theme.ink || payload.theme.ink)
    payload.theme.opaqueWindows = Boolean(next.theme.opaqueWindows)
    payload.theme.semanticColors.diffAdded = String(next.theme.semanticColors.diffAdded || payload.theme.semanticColors.diffAdded)
    payload.theme.semanticColors.diffRemoved = String(next.theme.semanticColors.diffRemoved || payload.theme.semanticColors.diffRemoved)
    payload.theme.semanticColors.skill = String(next.theme.semanticColors.skill || payload.theme.semanticColors.skill)
    payload.theme.surface = String(next.theme.surface || payload.theme.surface)

    flashBanner('Import angewendet')
  }
  catch {
    importError.value = 'Ungültiges Format. Bitte codex-theme-v1 JSON verwenden.'
  }
}

async function copyTheme() {
  copyState.value = 'idle'
  if (!process.client || !navigator.clipboard) {
    copyState.value = 'error'
    return
  }

  try {
    await navigator.clipboard.writeText(exportValue.value)
    copyState.value = 'ok'
    flashBanner('Export kopiert')
  }
  catch {
    copyState.value = 'error'
  }
}

function startNewThread() {
  activeThreadId.value = threadItems[0].id
  flashBanner('Neuer Thread gestartet')
}

function commitMock() {
  flashBanner('Commit ausgeführt')
}
</script>

<template>
  <main class="rebuild-shell" :style="shellStyle">
    <div class="rebuild-shell__glow" />

    <section class="workbench-window">
      <header class="window-header">
        <div class="window-header__left">
          <span class="dot dot-red" />
          <span class="dot dot-yellow" />
          <span class="dot dot-green" />
          <span class="window-title"><Icon name="ph:command-bold" class="icon-12" /> CODEX THEME WORKBENCH</span>
        </div>

        <div class="window-header__center">
          <button class="menu-chip">
            File
          </button>
          <button class="menu-chip">
            Edit
          </button>
          <button class="menu-chip">
            View
          </button>
          <button class="menu-chip">
            Window
          </button>
        </div>

        <div class="window-header__right">
          <button class="icon-btn" @click="terminalActive = !terminalActive">
            <Icon name="ph:terminal-window-bold" class="icon-14" />
          </button>
          <button class="icon-btn" @click="diffActive = !diffActive">
            <Icon name="ph:git-diff-bold" class="icon-14" />
          </button>
          <button class="icon-btn" @click="pipEnabled = !pipEnabled">
            <Icon name="ph:picture-in-picture-bold" class="icon-14" />
          </button>
          <button class="icon-btn">
            <Icon name="ph:gear-six-bold" class="icon-14" />
          </button>
        </div>
      </header>

      <section class="theme-controls">
        <div class="theme-controls__head">
          <p>INSTALL THEME CONTROLS</p>
          <transition name="fade-slide">
            <span v-if="bannerState" class="banner-pill">{{ bannerState }}</span>
          </transition>
        </div>

        <div class="theme-controls__grid">
          <select class="ctrl-input" :value="activePreset" @input="applyPreset(($event.target as HTMLSelectElement).value)">
            <option v-for="preset in Object.keys(presetMap)" :key="preset" :value="preset">
              {{ preset }}
            </option>
          </select>

          <select class="ctrl-input" :value="payload.codeThemeId" @input="setThemeId">
            <option v-for="option in codeThemeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>

          <textarea
            class="ctrl-input ctrl-textarea"
            rows="1"
            :value="importValue"
            placeholder="codex-theme-v1:{&quot;codeThemeId&quot;:&quot;oscurange&quot;,...}"
            @input="setImportValue"
          />

          <select class="ctrl-input" :value="payload.variant" @input="setVariant">
            <option value="dark">
              dark
            </option>
            <option value="light">
              light
            </option>
          </select>
        </div>

        <div class="theme-controls__actions">
          <button class="ctrl-btn" @click="applyImport">
            Apply Import
          </button>
          <button class="ctrl-btn ctrl-btn--accent" @click="copyTheme">
            {{ copyState === 'ok' ? 'Copied' : 'Copy Export' }}
          </button>
          <button class="ctrl-btn" @click="resetPreset">
            Reset
          </button>
          <span v-if="importError" class="ctrl-error">{{ importError }}</span>
        </div>
      </section>

      <section class="codex-app">
        <aside class="left-rail" :class="navCollapsed ? 'left-rail--collapsed' : ''">
          <button class="section-link" @click="startNewThread">
            <Icon name="ph:pencil-simple-line-bold" class="icon-18" />
            <span v-if="!navCollapsed">Neuer Thread</span>
          </button>
          <button class="section-link">
            <Icon name="ph:clock-counter-clockwise-bold" class="icon-18" />
            <span v-if="!navCollapsed">Automatisierungen</span>
          </button>
          <button class="section-link">
            <Icon name="ph:circles-four-bold" class="icon-18" />
            <span v-if="!navCollapsed">Fähigkeiten</span>
          </button>

          <div v-if="!navCollapsed" class="thread-header">
            <span>Threads</span>
            <div class="thread-header__icons">
              <button class="tiny-icon">
                <Icon name="ph:plus-bold" class="icon-12" />
              </button>
              <button class="tiny-icon">
                <Icon name="ph:funnel-simple-bold" class="icon-12" />
              </button>
              <button class="tiny-icon" @click="navCollapsed = true">
                <Icon name="ph:caret-left-bold" class="icon-12" />
              </button>
            </div>
          </div>
          <div v-else class="thread-header">
            <button class="tiny-icon" @click="navCollapsed = false">
              <Icon name="ph:caret-right-bold" class="icon-12" />
            </button>
          </div>

          <button
            v-for="thread in threadItems"
            :key="thread.id"
            class="thread-row"
            :class="activeThreadId === thread.id ? 'thread-row--active' : ''"
            @click="activeThreadId = thread.id"
          >
            <span v-if="!navCollapsed" class="thread-row__title">{{ thread.title }}</span>
            <span v-if="!navCollapsed" class="thread-row__time">{{ thread.time }}</span>
            <span v-else class="thread-dot" />
          </button>

          <button class="settings-row">
            <Icon name="ph:gear-six-bold" class="icon-16" />
            <span v-if="!navCollapsed">Einstellungen</span>
          </button>
        </aside>

        <section class="main-pane">
          <header class="main-toolbar">
            <div class="toolbar-title">
              <strong>Öffne Vue-Bits Dither Seite</strong>
              <div class="toolbar-sub">
                codex-theme
              </div>
            </div>

            <div class="toolbar-actions">
              <button class="toolbar-chip">
                <Icon name="ph:caret-down-bold" class="icon-12" /> Editor
              </button>
              <button class="toolbar-chip">
                In Worktree verschieben
              </button>
              <button class="toolbar-chip" @click="commitMock">
                <Icon name="ph:git-commit-bold" class="icon-14" /> Commit
              </button>

              <button class="icon-chip" :class="terminalActive ? 'icon-chip--active' : ''">
                <Icon name="ph:terminal-window-bold" class="icon-14" />
              </button>
              <button class="icon-chip" :class="diffActive ? 'icon-chip--active' : ''">
                <Icon name="ph:git-diff-bold" class="icon-14" />
                <span class="count-pill">9</span>
              </button>
              <button class="icon-chip" :class="pipEnabled ? 'icon-chip--active' : ''">
                <Icon name="ph:picture-in-picture-bold" class="icon-14" />
              </button>
            </div>
          </header>

          <div class="history-panel">
            <article v-for="message in activeMessages" :key="message.id" class="bubble" :class="message.role === 'user' ? 'bubble--user' : 'bubble--assistant'">
              <p>{{ message.text }}</p>
            </article>
          </div>

          <div class="composer-panel">
            <div class="composer-row">
              <button class="icon-chip">
                <Icon name="ph:plus-bold" class="icon-14" />
              </button>

              <select v-model="selectedModel" class="composer-select">
                <option v-for="model in modelOptions" :key="model" :value="model">
                  {{ model }}
                </option>
              </select>

              <select v-model="selectedThinking" class="composer-select">
                <option v-for="thinking in thinkingOptions" :key="thinking" :value="thinking">
                  {{ thinking }}
                </option>
              </select>

              <input v-model="composeValue" class="composer-input" type="text">

              <button class="icon-chip">
                <Icon name="ph:microphone-bold" class="icon-14" />
              </button>
              <button class="send-btn">
                <Icon name="ph:arrow-up-bold" class="icon-14" />
              </button>
            </div>

            <div class="status-row">
              <div class="status-row__left">
                <span><Icon name="ph:laptop-bold" class="icon-12" /> Lokal</span>
                <span><Icon name="ph:lock-key-bold" class="icon-12" /> Vollzugriff</span>
                <span><Icon name="ph:gear-six-bold" class="icon-12" /> Settings</span>
              </div>
              <div class="status-row__right">
                <span><Icon name="ph:git-branch-bold" class="icon-12" /> main</span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>

<style scoped>
.rebuild-shell {
  position: relative;
  min-height: 100vh;
  padding: 14px;
  color: var(--theme-ink);
}

.rebuild-shell__glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 14% 0%, color-mix(in srgb, var(--theme-skill) 18%, transparent), transparent 34%),
    radial-gradient(circle at 90% 0%, color-mix(in srgb, var(--theme-accent) 16%, transparent), transparent 30%);
}

.workbench-window {
  position: relative;
  z-index: 2;
  margin: 0 auto;
  max-width: 1720px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  background: rgba(4, 5, 7, 0.92);
  backdrop-filter: blur(20px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 60px rgba(0, 0, 0, 0.52);
  padding: 14px;
}

.window-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: rgba(8, 9, 12, 0.8);
  padding: 8px 12px;
}

.window-header__left,
.window-header__center,
.window-header__right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.window-header__center {
  justify-content: center;
}

.window-header__right {
  justify-content: flex-end;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
}

.dot-red {
  background: #ff5f57;
}
.dot-yellow {
  background: #febc2e;
}
.dot-green {
  background: #28c840;
}

.window-title {
  margin-left: 8px;
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.menu-chip,
.ctrl-btn,
.toolbar-chip,
.icon-btn,
.icon-chip,
.section-link,
.thread-row,
.settings-row,
.tiny-icon {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.86);
  border-radius: 10px;
  font-family: var(--font-ui);
}

.menu-chip,
.ctrl-btn,
.toolbar-chip {
  padding: 7px 12px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.icon-btn,
.icon-chip,
.tiny-icon {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-chip--active {
  border-color: color-mix(in srgb, var(--theme-accent) 60%, rgba(255, 255, 255, 0.2));
  background: color-mix(in srgb, var(--theme-accent) 18%, rgba(255, 255, 255, 0.02));
}

.count-pill {
  margin-left: 4px;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  padding: 0 4px;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.14);
}

.theme-controls {
  margin-top: 12px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 14px;
  background: rgba(8, 9, 12, 0.82);
  padding: 12px;
}

.theme-controls__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.theme-controls__head p {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.banner-pill {
  border: 1px solid color-mix(in srgb, var(--theme-skill) 48%, rgba(255, 255, 255, 0.2));
  background: color-mix(in srgb, var(--theme-skill) 22%, transparent);
  color: color-mix(in srgb, var(--theme-skill) 82%, white);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 11px;
}

.theme-controls__grid {
  margin-top: 10px;
  display: grid;
  gap: 8px;
  grid-template-columns: 170px 170px 1fr 110px;
}

.ctrl-input,
.composer-select,
.composer-input {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.9);
  padding: 8px 10px;
  font-size: 13px;
  font-family: var(--font-code);
}

.ctrl-textarea {
  min-height: 42px;
  resize: vertical;
}

.theme-controls__actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ctrl-btn--accent {
  border-color: color-mix(in srgb, var(--theme-skill) 45%, rgba(255, 255, 255, 0.2));
  background: color-mix(in srgb, var(--theme-skill) 18%, rgba(255, 255, 255, 0.05));
  color: color-mix(in srgb, var(--theme-skill) 85%, white);
}

.ctrl-error {
  color: #ff8b8b;
  font-size: 12px;
}

.codex-app {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 12px;
}

.left-rail {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(7, 8, 10, 0.86);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.left-rail--collapsed {
  width: 76px;
}

.section-link,
.settings-row,
.thread-row {
  width: 100%;
  padding: 9px 10px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.thread-header {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.thread-header__icons {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tiny-icon {
  width: 24px;
  height: 24px;
}

.thread-row {
  justify-content: space-between;
}

.thread-row--active {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.13);
}

.thread-row__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.thread-row__time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.thread-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  margin: 0 auto;
}

.main-pane {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(6, 7, 9, 0.84);
  padding: 10px;
  display: grid;
  gap: 10px;
}

.main-toolbar {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(10, 11, 14, 0.84);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toolbar-title strong {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.95);
}

.toolbar-sub {
  margin-top: 2px;
  font-family: var(--font-code);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.56);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: wrap;
}

.history-panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: color-mix(in srgb, var(--theme-surface) 86%, black 14%);
  min-height: 360px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bubble {
  max-width: 72%;
  border-radius: 12px;
  padding: 10px 12px;
  font-family: var(--font-ui);
  font-size: 14px;
  line-height: 1.45;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bubble--assistant {
  background: rgba(255, 255, 255, 0.06);
}

.bubble--user {
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.02);
  border-color: color-mix(in srgb, var(--theme-accent) 38%, rgba(255, 255, 255, 0.12));
}

.composer-panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(6, 7, 9, 0.94);
  padding: 10px;
}

.composer-row {
  display: grid;
  grid-template-columns: 36px 170px 120px 1fr 36px 36px;
  gap: 8px;
  align-items: center;
}

.composer-input {
  font-family: var(--font-ui);
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--theme-accent) 55%, rgba(255, 255, 255, 0.2));
  background: color-mix(in srgb, var(--theme-accent) 80%, black 20%);
  color: black;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.status-row {
  margin-top: 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-family: var(--font-ui);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}

.status-row__left,
.status-row__right {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.status-row span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.icon-18 {
  width: 18px;
  height: 18px;
}

.icon-16 {
  width: 16px;
  height: 16px;
}

.icon-14 {
  width: 14px;
  height: 14px;
}

.icon-12 {
  width: 12px;
  height: 12px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 180ms ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

@media (max-width: 1200px) {
  .codex-app {
    grid-template-columns: 1fr;
  }

  .left-rail {
    min-height: auto;
  }

  .left-rail--collapsed {
    width: 100%;
  }

  .main-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 960px) {
  .window-header {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .window-header__center,
  .window-header__right {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .theme-controls__grid {
    grid-template-columns: 1fr;
  }

  .composer-row {
    grid-template-columns: 36px 1fr 1fr;
    grid-auto-rows: 36px;
  }

  .composer-input {
    grid-column: 1 / -1;
  }

  .status-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .status-row__left,
  .status-row__right {
    flex-wrap: wrap;
  }
}
</style>
