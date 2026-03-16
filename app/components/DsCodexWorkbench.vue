<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

type MainView = 'chat' | 'terminal' | 'diff'

interface ThreadItem {
  id: string
  title: string
  repo: string
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

const sidebarCollapsed = ref(false)
const activeThreadId = ref('thread-1')
const activeView = ref<MainView>('chat')
const pipEnabled = ref(true)
const runEnabled = ref(false)

const selectedModel = ref(modelOptions[0])
const selectedThinking = ref(thinkingOptions[1])
const composeValue = ref('Tune accent + semantic colors')

const threadItems: ThreadItem[] = [
  { id: 'thread-1', title: 'Make DsRing mobile friendly', repo: 'codex-theme', time: '54 Min.' },
  { id: 'thread-2', title: 'Öffne Vue-Bits Dither Seite', repo: 'codex-theme', time: '2 Std.' },
]

const messagesByThread: Record<string, ChatMessage[]> = {
  'thread-1': [
    { id: 'a1', role: 'assistant', text: '1 Datei geändert\napp/components/DsCodexWorkbench.vue +94 -34' },
    { id: 'u1', role: 'user', text: 'Kannst du eine saubere Mismatch-Liste machen und den Header 1:1 nachbauen?' },
    { id: 'a2', role: 'assistant', text: 'Ja. Ich baue den Chat-Header als eigenen Block und setze die Top-Hierarchie korrekt um.' },
  ],
  'thread-2': [
    { id: 'a3', role: 'assistant', text: 'Build ist erfolgreich. Ich habe die Header-Nähe und Abstände angeglichen.' },
    { id: 'u2', role: 'user', text: 'Bitte den Theme-Selector oberhalb und nicht im Codex-Lookalike.' },
    { id: 'a4', role: 'assistant', text: 'Erledigt. Theme Controls sind jetzt ein separates Layer über der Replica.' },
  ],
}

const activeThread = computed(() => {
  return threadItems.find(thread => thread.id === activeThreadId.value) ?? threadItems[0]
})

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

function startNewThread() {
  activeThreadId.value = threadItems[0].id
  activeView.value = 'chat'
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function showTerminal() {
  activeView.value = 'terminal'
}

function showDiff() {
  activeView.value = 'diff'
}

function showChat() {
  activeView.value = 'chat'
}

function togglePip() {
  pipEnabled.value = !pipEnabled.value
}

function toggleRun() {
  runEnabled.value = !runEnabled.value
}
</script>

<template>
  <section class="replica-root" :style="shellStyle">
    <header class="os-menu">
      <div class="os-menu__left">
        <span class="os-item"></span>
        <span class="os-item os-item--strong">Codex</span>
        <span class="os-item">File</span>
        <span class="os-item">Edit</span>
        <span class="os-item">View</span>
        <span class="os-item">Window</span>
        <span class="os-item">Help</span>
      </div>
      <div class="os-menu__right">
        <Icon name="ph:wifi-high-bold" class="icon-12" />
        <Icon name="ph:battery-full-bold" class="icon-12" />
        <Icon name="ph:clock-bold" class="icon-12" />
      </div>
    </header>

    <section class="window-shell">
      <header class="app-topbar">
        <div class="app-topbar__left">
          <span class="dot dot-red" />
          <span class="dot dot-yellow" />
          <span class="dot dot-green" />
          <button class="top-icon" @click="toggleSidebar">
            <Icon name="ph:sidebar-simple-bold" class="icon-14" />
          </button>

          <div class="title-stack">
            <strong>{{ activeThread.title }}</strong>
            <span>{{ activeThread.repo }}</span>
          </div>
        </div>

        <div class="app-topbar__actions">
          <button class="toolbar-chip" :class="runEnabled ? 'toolbar-chip--active' : ''" @click="toggleRun">
            <Icon name="ph:play-bold" class="icon-12" />
          </button>
          <button class="toolbar-chip">
            <Icon name="ph:caret-down-bold" class="icon-12" />
          </button>
          <button class="toolbar-chip">
            In Worktree verschieben
          </button>
          <button class="toolbar-chip">
            <Icon name="ph:git-pull-request-bold" class="icon-14" /> Push
            <Icon name="ph:caret-down-bold" class="icon-12" />
          </button>

          <button class="toolbar-chip icon-only" :class="activeView === 'terminal' ? 'toolbar-chip--active' : ''" @click="showTerminal">
            <Icon name="ph:terminal-window-bold" class="icon-14" />
          </button>
          <button class="toolbar-chip icon-only" :class="activeView === 'diff' ? 'toolbar-chip--active' : ''" @click="showDiff">
            <Icon name="ph:file-diff-bold" class="icon-14" />
            <span class="count">9</span>
          </button>
          <button class="toolbar-chip icon-only" :class="pipEnabled ? 'toolbar-chip--active' : ''" @click="togglePip">
            <Icon name="ph:picture-in-picture-bold" class="icon-14" />
          </button>
        </div>
      </header>

      <div class="app-grid">
        <aside class="sidebar" :class="sidebarCollapsed ? 'sidebar--collapsed' : ''">
          <button class="nav-row" @click="startNewThread">
            <Icon name="ph:pencil-simple-line-bold" class="icon-16" />
            <span v-if="!sidebarCollapsed">Neuer Thread</span>
          </button>
          <button class="nav-row">
            <Icon name="ph:clock-counter-clockwise-bold" class="icon-16" />
            <span v-if="!sidebarCollapsed">Automatisierungen</span>
          </button>
          <button class="nav-row">
            <Icon name="ph:circles-four-bold" class="icon-16" />
            <span v-if="!sidebarCollapsed">Fähigkeiten</span>
          </button>

          <div class="thread-head">
            <span v-if="!sidebarCollapsed">Threads</span>
            <div class="thread-head__icons">
              <button class="tiny-btn">
                <Icon name="ph:plus-bold" class="icon-12" />
              </button>
              <button class="tiny-btn">
                <Icon name="ph:funnel-simple-bold" class="icon-12" />
              </button>
              <button class="tiny-btn" @click="toggleSidebar">
                <Icon :name="sidebarCollapsed ? 'ph:caret-right-bold' : 'ph:caret-left-bold'" class="icon-12" />
              </button>
            </div>
          </div>

          <button
            v-for="thread in threadItems"
            :key="thread.id"
            class="thread-row"
            :class="thread.id === activeThreadId ? 'thread-row--active' : ''"
            @click="activeThreadId = thread.id; showChat()"
          >
            <span v-if="!sidebarCollapsed" class="thread-row__title">{{ thread.title }}</span>
            <span v-if="!sidebarCollapsed" class="thread-row__time">{{ thread.time }}</span>
            <span v-else class="thread-dot" />
          </button>

          <button class="settings-row">
            <Icon name="ph:gear-six-bold" class="icon-16" />
            <span v-if="!sidebarCollapsed">Einstellungen</span>
          </button>
        </aside>

        <main class="chat-window">
          <header class="chat-header">
            <div>
              <p class="chat-header__title">
                {{ activeThread.title }}
              </p>
              <p class="chat-header__sub">
                {{ activeThread.repo }}
              </p>
            </div>
            <button class="commit-pill">
              commit
            </button>
          </header>

          <section class="view-stage">
            <div v-if="activeView === 'chat'" class="history-view">
              <article
                v-for="message in activeMessages"
                :key="message.id"
                class="chat-bubble"
                :class="message.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--assistant'"
              >
                {{ message.text }}
              </article>
            </div>

            <div v-else-if="activeView === 'terminal'" class="terminal-view">
              <p class="term-line">
                <span class="term-dim">$</span> pnpm dev
              </p>
              <p class="term-line">
                <span class="term-info">info</span> Nuxt ready at http://localhost:3000
              </p>
              <p class="term-line">
                <span class="term-add">+ added</span> app/components/DsCodexWorkbench.vue
              </p>
              <p class="term-line">
                <span class="term-del">- removed</span> old/theme-panel.vue
              </p>
            </div>

            <div v-else class="diff-view">
              <p class="diff-line">
                <span class="line-no">451</span> &lt;input v-model="composeValue" class="composer-input" /&gt;
              </p>
              <p class="diff-line diff-line--remove">
                <span class="line-no">407</span> - &lt;button class="icon-chip"&gt;&lt;Icon name="ph:microphone-bold" /&gt;&lt;/button&gt;
              </p>
              <p class="diff-line diff-line--add">
                <span class="line-no">453</span> + &lt;button class="icon-chip"&gt;&lt;Icon name="ph:microphone-bold" class="icon-14" /&gt;&lt;/button&gt;
              </p>
            </div>
          </section>

          <footer class="composer-wrap">
            <div class="composer-row">
              <button class="icon-chip">
                <Icon name="ph:plus-bold" class="icon-14" />
              </button>

              <select v-model="selectedModel" class="select-chip">
                <option v-for="model in modelOptions" :key="model" :value="model">
                  {{ model }}
                </option>
              </select>

              <select v-model="selectedThinking" class="select-chip select-chip--small">
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
              <div class="status-left">
                <span><Icon name="ph:laptop-bold" class="icon-12" /> Lokal</span>
                <span><Icon name="ph:lock-key-bold" class="icon-12" /> Vollzugriff</span>
              </div>
              <div class="status-right">
                <span><Icon name="ph:git-branch-bold" class="icon-12" /> main</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </section>
  </section>
</template>

<style scoped>
.replica-root {
  display: grid;
  gap: 10px;
  font-family: var(--font-ui);
  color: color-mix(in srgb, var(--theme-ink) 88%, #fff);
}

.os-menu {
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(5, 6, 8, 0.92);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 12px;
}

.os-menu__left,
.os-menu__right {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.os-item {
  opacity: 0.9;
}

.os-item--strong {
  font-weight: 600;
}

.window-shell {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  background: rgba(3, 4, 6, 0.94);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 26px 60px rgba(0, 0, 0, 0.5);
  padding: 12px;
}

.app-topbar {
  height: 56px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 14px;
  background: rgba(8, 9, 12, 0.9);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.app-topbar__left,
.app-topbar__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.top-icon,
.toolbar-chip,
.nav-row,
.thread-row,
.settings-row,
.tiny-btn,
.icon-chip,
.select-chip,
.composer-input,
.commit-pill {
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.9);
}

.top-icon,
.tiny-btn,
.icon-chip {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.title-stack {
  margin-left: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-stack strong {
  font-size: 15px;
  line-height: 1;
  font-weight: 550;
}

.title-stack span {
  font-family: var(--font-code);
  font-size: 13px;
  opacity: 0.65;
}

.toolbar-chip {
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.toolbar-chip--active {
  border-color: color-mix(in srgb, var(--theme-accent) 70%, rgba(255, 255, 255, 0.24));
  background: color-mix(in srgb, var(--theme-accent) 22%, transparent);
}

.toolbar-chip.icon-only {
  width: 40px;
  padding: 0;
  justify-content: center;
}

.count {
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  padding: 0 5px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 286px 1fr;
  gap: 12px;
}

.sidebar {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(8, 9, 12, 0.86);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar--collapsed {
  width: 78px;
}

.nav-row,
.thread-row,
.settings-row {
  width: 100%;
  min-height: 42px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  text-align: left;
}

.thread-head {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.55);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.thread-head__icons {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tiny-btn {
  width: 24px;
  height: 24px;
}

.thread-row {
  justify-content: space-between;
  font-size: 14px;
}

.thread-row--active {
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.12);
}

.thread-row__title {
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.thread-row__time {
  font-size: 12px;
  opacity: 0.65;
}

.thread-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  margin: 0 auto;
}

.chat-window {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(6, 7, 9, 0.9);
  padding: 10px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 10px;
}

.chat-header {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(10, 11, 14, 0.82);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.chat-header__sub {
  margin: 2px 0 0;
  font-size: 13px;
  font-family: var(--font-code);
  opacity: 0.6;
}

.commit-pill {
  height: 46px;
  padding: 0 16px;
  font-size: 15px;
}

.view-stage {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: color-mix(in srgb, var(--theme-surface) 90%, black 10%);
  min-height: 560px;
  padding: 12px;
}

.history-view,
.terminal-view,
.diff-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-bubble {
  max-width: 78%;
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  line-height: 1.45;
  white-space: pre-line;
  font-size: 14px;
}

.chat-bubble--assistant {
  background: rgba(255, 255, 255, 0.06);
}

.chat-bubble--user {
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.03);
  border-color: color-mix(in srgb, var(--theme-accent) 44%, rgba(255, 255, 255, 0.16));
}

.terminal-view,
.diff-view {
  font-family: var(--font-code);
  font-size: 13px;
}

.term-line,
.diff-line {
  margin: 0;
  line-height: 1.45;
}

.term-dim {
  opacity: 0.7;
}
.term-info {
  color: #56a7ff;
}
.term-add {
  color: var(--theme-added);
}
.term-del {
  color: var(--theme-removed);
}

.diff-line {
  padding: 6px 8px;
  border-radius: 8px;
}

.diff-line--remove {
  background: rgba(250, 66, 62, 0.16);
}
.diff-line--add {
  background: rgba(64, 201, 119, 0.16);
}

.line-no {
  display: inline-block;
  width: 44px;
  opacity: 0.5;
}

.composer-wrap {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(8, 9, 11, 0.92);
  padding: 10px;
}

.composer-row {
  display: grid;
  grid-template-columns: 36px 170px 120px 1fr 36px 36px;
  gap: 8px;
  align-items: center;
}

.select-chip,
.composer-input {
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  font-family: var(--font-ui);
}

.select-chip--small {
  width: 120px;
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--theme-accent) 60%, rgba(255, 255, 255, 0.2));
  background: color-mix(in srgb, var(--theme-accent) 82%, black 18%);
  color: black;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.status-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  opacity: 0.75;
}

.status-left,
.status-right {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.status-row span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
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

@media (max-width: 1360px) {
  .app-grid {
    grid-template-columns: 1fr;
  }

  .sidebar--collapsed {
    width: 100%;
  }
}

@media (max-width: 980px) {
  .os-menu {
    display: none;
  }

  .app-topbar {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
  }

  .app-topbar__actions {
    flex-wrap: wrap;
  }

  .composer-row {
    grid-template-columns: 36px 1fr 1fr;
    grid-auto-rows: 36px;
  }

  .composer-input {
    grid-column: 1 / -1;
  }

  .chat-bubble {
    max-width: 100%;
  }

  .status-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
