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

const props = defineProps<{
  payload: CodexThemePayload
}>()

const defaultUiFont = '\'Geist\', ui-sans-serif, system-ui, -apple-system, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif'
const defaultCodeFont = '\'Geist Mono\', ui-monospace, \'SFMono-Regular\', Menlo, Monaco, Consolas, monospace'

const modelOptions = ['GPT-5.3-Codex', 'GPT-5.2-Codex', 'o3']
const thinkingOptions = ['Niedrig', 'Mittel', 'Hoch']

const navCollapsed = ref(false)
const activeThreadId = ref('thread-1')
const selectedModel = ref(modelOptions[0])
const selectedThinking = ref(thinkingOptions[1])
const composeValue = ref('Tune accent + semantic colors')
const pipEnabled = ref(true)
const terminalActive = ref(true)
const diffActive = ref(true)
const bannerState = ref('')

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

const shellStyle = computed(() => ({
  '--theme-surface': props.payload.theme.surface,
  '--theme-ink': props.payload.theme.ink,
  '--theme-accent': props.payload.theme.accent,
  '--theme-added': props.payload.theme.semanticColors.diffAdded,
  '--theme-removed': props.payload.theme.semanticColors.diffRemoved,
  '--theme-skill': props.payload.theme.semanticColors.skill,
  '--font-ui': props.payload.theme.fonts.ui || defaultUiFont,
  '--font-code': props.payload.theme.fonts.code || defaultCodeFont,
}))

function flashBanner(label: string) {
  bannerState.value = label
  setTimeout(() => {
    if (bannerState.value === label)
      bannerState.value = ''
  }, 1400)
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
  <section class="workbench-window" :style="shellStyle">
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

    <transition name="fade-slide">
      <p v-if="bannerState" class="banner-pill">
        {{ bannerState }}
      </p>
    </transition>

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
</template>

<style scoped>
.workbench-window {
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

.banner-pill {
  margin-top: 10px;
  display: inline-flex;
  border: 1px solid color-mix(in srgb, var(--theme-skill) 48%, rgba(255, 255, 255, 0.2));
  background: color-mix(in srgb, var(--theme-skill) 22%, transparent);
  color: color-mix(in srgb, var(--theme-skill) 82%, white);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 11px;
}

.menu-chip,
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
