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
  uiFontSize: number
  codeFontSize: number
  translucentSidebar: boolean
}>()

const defaultUiFont = '\'Geist\', ui-sans-serif, system-ui, -apple-system, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif'
const defaultCodeFont = '\'Geist Mono\', ui-monospace, \'SFMono-Regular\', Menlo, Monaco, Consolas, monospace'

const modelOptions = ['GPT-5.3-Codex', 'GPT-5.2-Codex', 'o3']
const thinkingOptions = ['Low', 'Medium', 'High']

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
  { id: 'thread-2', title: 'Open Vue-Bits Dither page', repo: 'codex-theme', time: '2 Hr.' },
]

const messagesByThread: Record<string, ChatMessage[]> = {
  'thread-1': [
    { id: 'a1', role: 'assistant', text: '1 file changed\napp/components/DsCodexWorkbench.vue +94 -34' },
    { id: 'u1', role: 'user', text: 'Can you make a clean mismatch list and rebuild the header 1:1?' },
    { id: 'a2', role: 'assistant', text: 'Yes. I will isolate the chat header and align the full top hierarchy.' },
  ],
  'thread-2': [
    { id: 'a3', role: 'assistant', text: 'Build is successful. Header spacing and hierarchy are now closer to Codex.' },
    { id: 'u2', role: 'user', text: 'Please keep theme controls outside the replica layer.' },
    { id: 'a4', role: 'assistant', text: 'Done. Theme controls are now detached and remain above the replica.' },
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
  '--ui-font-size': `${props.uiFontSize}px`,
  '--code-font-size': `${props.codeFontSize}px`,
  '--sidebar-bg': props.translucentSidebar ? 'rgba(9, 10, 12, 0.58)' : 'rgba(9, 10, 12, 0.9)',
}))

function startNewThread() {
  activeThreadId.value = threadItems[0].id
  activeView.value = 'chat'
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function showView(next: MainView) {
  activeView.value = next
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

          <button class="sidebar-toggle" @click="toggleSidebar">
            <Icon name="ph:sidebar-simple-bold" class="icon-14" />
          </button>

          <div class="title-line">
            <strong>{{ activeThread.title }}</strong>
            <span>{{ activeThread.repo }}</span>
          </div>
        </div>

        <div class="app-topbar__actions">
          <button class="run-btn" :class="runEnabled ? 'run-btn--active' : ''" @click="toggleRun">
            <Icon name="ph:play-bold" class="icon-14" />
          </button>

          <button class="light-chip">
            <Icon name="ph:caret-down-bold" class="icon-12" />
            <Icon name="ph:wave-sine-bold" class="icon-12" />
          </button>

          <button class="light-chip">
            <Icon name="ph:arrows-left-right-bold" class="icon-14" /> In Worktree verschieben
          </button>

          <button class="light-chip">
            <Icon name="ph:cloud-arrow-up-bold" class="icon-14" /> Push
            <Icon name="ph:caret-down-bold" class="icon-12" />
          </button>

          <span class="toolbar-divider" />

          <button class="ghost-icon" :class="activeView === 'terminal' ? 'ghost-icon--active' : ''" @click="showView('terminal')">
            <Icon name="ph:terminal-window-bold" class="icon-14" />
          </button>
          <button class="ghost-icon" :class="activeView === 'diff' ? 'ghost-icon--active' : ''" @click="showView('diff')">
            <Icon name="ph:file-diff-bold" class="icon-14" />
            <span class="count">9</span>
          </button>
          <button class="ghost-icon" :class="pipEnabled ? 'ghost-icon--active' : ''" @click="togglePip">
            <Icon name="ph:rectangle-bold" class="icon-14" />
          </button>
        </div>
      </header>

      <div class="app-grid">
        <aside class="sidebar" :class="sidebarCollapsed ? 'sidebar--collapsed' : ''">
          <button class="nav-row" @click="startNewThread">
            <Icon name="ph:pencil-simple-line-bold" class="icon-16" />
            <span class="sidebar-label">New Thread</span>
          </button>

          <button class="nav-row">
            <Icon name="ph:clock-counter-clockwise-bold" class="icon-16" />
            <span class="sidebar-label">Automations</span>
          </button>

          <button class="nav-row">
            <Icon name="ph:circles-four-bold" class="icon-16" />
            <span class="sidebar-label">Skills</span>
          </button>

          <div class="thread-head">
            <span class="sidebar-label">Threads</span>
            <div class="thread-head__icons">
              <button class="tiny-icon">
                <Icon name="ph:folder-plus-bold" class="icon-12" />
              </button>
              <button class="tiny-icon">
                <Icon name="ph:funnel-simple-bold" class="icon-12" />
              </button>
              <button class="tiny-icon" @click="toggleSidebar">
                <Icon :name="sidebarCollapsed ? 'ph:caret-right-bold' : 'ph:caret-left-bold'" class="icon-12" />
              </button>
            </div>
          </div>

          <button
            v-for="thread in threadItems"
            :key="thread.id"
            class="thread-row"
            :class="thread.id === activeThreadId ? 'thread-row--active' : ''"
            @click="activeThreadId = thread.id; showView('chat')"
          >
            <span class="thread-row__title sidebar-label">{{ thread.title }}</span>
            <span class="thread-row__time sidebar-label">{{ thread.time }}</span>
            <span class="thread-dot" />
          </button>

          <button class="settings-row">
            <Icon name="ph:gear-six-bold" class="icon-16" />
            <span class="sidebar-label">Settings</span>
          </button>
        </aside>

        <main class="chat-window">
          <header class="chat-header">
            <button class="commit-pill">
              commit
            </button>
          </header>

          <Transition name="slide-view" mode="out-in">
            <section :key="activeView" class="view-stage">
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
                <p class="term-line">
                  contrast: {{ payload.theme.contrast }} · opaqueWindows: {{ payload.theme.opaqueWindows }}
                </p>
              </div>

              <div v-else class="diff-view">
                <div class="diff-column diff-column--remove">
                  <p class="diff-line">
                    <span class="line-no">2</span> surface: "sidebar",
                  </p>
                  <p class="diff-line">
                    <span class="line-no">3</span> accent: "#2563eb",
                  </p>
                  <p class="diff-line">
                    <span class="line-no">4</span> contrast: 42,
                  </p>
                </div>
                <div class="diff-column diff-column--add">
                  <p class="diff-line">
                    <span class="line-no">2</span> surface: "sidebar-elevated",
                  </p>
                  <p class="diff-line">
                    <span class="line-no">3</span> accent: "{{ payload.theme.accent }}",
                  </p>
                  <p class="diff-line">
                    <span class="line-no">4</span> contrast: {{ payload.theme.contrast }},
                  </p>
                </div>
              </div>
            </section>
          </Transition>

          <footer class="composer-wrap">
            <div class="composer-row">
              <button class="composer-icon">
                <Icon name="ph:plus-bold" class="icon-14" />
              </button>

              <select v-model="selectedModel" class="composer-select">
                <option v-for="model in modelOptions" :key="model" :value="model">
                  {{ model }}
                </option>
              </select>

              <select v-model="selectedThinking" class="composer-select composer-select--small">
                <option v-for="thinking in thinkingOptions" :key="thinking" :value="thinking">
                  {{ thinking }}
                </option>
              </select>

              <input v-model="composeValue" class="composer-input" type="text">

              <button class="composer-icon">
                <Icon name="ph:microphone-bold" class="icon-14" />
              </button>
              <button class="send-btn">
                <Icon name="ph:arrow-up-bold" class="icon-14" />
              </button>
            </div>

            <div class="status-row">
              <div class="status-left">
                <span><Icon name="ph:laptop-bold" class="icon-12" /> Local</span>
                <span><Icon name="ph:lock-key-bold" class="icon-12" /> Full access</span>
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
  gap: 0;
  font-family: var(--font-ui);
  color: color-mix(in srgb, var(--theme-ink) 90%, #fff);
  font-size: var(--ui-font-size);
}

.os-menu {
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom: none;
  border-radius: 16px 16px 0 0;
  background: rgba(4, 5, 7, 0.95);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 16px 16px;
  background: rgba(4, 5, 7, 0.95);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.42);
  padding: 10px;
}

.app-topbar {
  min-height: 56px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  background: rgba(8, 9, 11, 0.86);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.app-topbar__left,
.app-topbar__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 14px;
  height: 14px;
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

.sidebar-toggle {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.86);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.title-line {
  margin-left: 6px;
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
}

.title-line strong {
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
}

.title-line span {
  font-family: var(--font-code);
  font-size: var(--code-font-size);
  opacity: 0.6;
}

.run-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.82);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.run-btn--active {
  color: #fff;
}

.light-chip {
  height: 34px;
  padding: 0 12px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.14);
}

.ghost-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ghost-icon--active {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.count {
  position: absolute;
  top: -3px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  padding: 0 4px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 10px;
}

.sidebar {
  border-radius: 14px;
  background: var(--sidebar-bg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  overflow: hidden;
  transition:
    width 260ms ease,
    padding 220ms ease,
    background-color 220ms ease;
}

.sidebar--collapsed {
  width: 92px;
  padding-inline: 8px;
}

.nav-row,
.thread-row,
.settings-row {
  min-height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
}

.sidebar-label {
  white-space: nowrap;
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.sidebar--collapsed .sidebar-label {
  opacity: 0;
  transform: translateX(-10px);
  width: 0;
  overflow: hidden;
}

.thread-head {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.58);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.thread-head__icons {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tiny-icon {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.thread-row {
  justify-content: space-between;
}

.thread-row__title {
  max-width: 74%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thread-row__time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.thread-dot {
  display: none;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
}

.sidebar--collapsed .thread-dot {
  display: inline-block;
}

.thread-row--active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.22);
}

.chat-window {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: rgba(6, 7, 9, 0.84);
  padding: 10px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 10px;
}

.chat-header {
  display: flex;
  justify-content: flex-end;
}

.commit-pill {
  height: 52px;
  padding: 0 18px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.92);
  font-size: 17px;
}

.view-stage {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: color-mix(in srgb, var(--theme-surface) 90%, black 10%);
  min-height: 560px;
  padding: 12px;
}

.history-view,
.terminal-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-bubble {
  max-width: 84%;
  border-radius: 14px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: pre-line;
  line-height: 1.5;
}

.chat-bubble--assistant {
  background: rgba(255, 255, 255, 0.05);
}

.chat-bubble--user {
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.02);
  border-color: color-mix(in srgb, var(--theme-accent) 44%, rgba(255, 255, 255, 0.14));
}

.terminal-view,
.diff-view {
  font-family: var(--font-code);
  font-size: var(--code-font-size);
}

.term-line,
.diff-line {
  margin: 0;
  line-height: 1.5;
}

.term-dim {
  opacity: 0.65;
}
.term-info {
  color: #59a8ff;
}
.term-add {
  color: var(--theme-added);
}
.term-del {
  color: var(--theme-removed);
}

.diff-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.diff-column {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.diff-column--remove {
  background: rgba(216, 74, 51, 0.2);
}

.diff-column--add {
  background: rgba(153, 181, 44, 0.2);
}

.diff-line {
  padding: 10px 12px;
}

.line-no {
  display: inline-block;
  width: 26px;
  opacity: 0.55;
}

.composer-wrap {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(8, 9, 11, 0.92);
  padding: 10px;
}

.composer-row {
  display: grid;
  grid-template-columns: 36px 180px 120px 1fr 36px 36px;
  gap: 8px;
  align-items: center;
}

.composer-icon,
.composer-select,
.composer-input {
  height: 36px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.92);
}

.composer-icon {
  width: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.composer-select,
.composer-input {
  padding: 0 12px;
  font-size: 14px;
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--theme-accent) 62%, rgba(255, 255, 255, 0.18));
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
  color: rgba(255, 255, 255, 0.66);
  font-size: 13px;
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
  gap: 6px;
}

.slide-view-enter-active,
.slide-view-leave-active {
  transition: all 240ms ease;
}

.slide-view-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-view-leave-to {
  opacity: 0;
  transform: translateX(-20px);
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

  .sidebar,
  .sidebar--collapsed {
    width: 100%;
  }

  .sidebar--collapsed .sidebar-label {
    opacity: 1;
    transform: none;
    width: auto;
  }

  .sidebar--collapsed .thread-dot {
    display: none;
  }
}

@media (max-width: 1000px) {
  .os-menu {
    display: none;
  }

  .app-topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .app-topbar__actions {
    flex-wrap: wrap;
  }

  .title-line {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .composer-row {
    grid-template-columns: 36px 1fr 1fr;
    grid-auto-rows: 36px;
  }

  .composer-input {
    grid-column: 1 / -1;
  }

  .diff-view {
    grid-template-columns: 1fr;
  }

  .status-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
