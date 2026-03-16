<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

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

const runEnabled = ref(false)
const selectedModel = ref(modelOptions[0])
const selectedThinking = ref(thinkingOptions[1])
const composeValue = ref('Tune accent + semantic colors')
const activeThreadId = ref('thread-1')

const {
  isSidebarCollapsed,
  isSidebarOpenMobile,
  isTerminalOpen,
  isDiffOpen,
  isPipEnabled,
  toggleSidebar,
  openSidebarMobile,
  closeSidebarMobile,
  toggleTerminal,
  toggleDiff,
  togglePip,
} = useWorkbenchPanels()

const defaultThread: ThreadItem = { id: 'thread-1', title: 'Make DsRing mobile friendly', repo: 'codex-theme', time: '54 Min.' }

const threadItems: ThreadItem[] = [
  defaultThread,
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

const activeThread = computed<ThreadItem>(() => threadItems.find(thread => thread.id === activeThreadId.value) ?? defaultThread)
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
  activeThreadId.value = defaultThread.id
  closeSidebarMobile()
}

function selectThread(id: string) {
  activeThreadId.value = id
  closeSidebarMobile()
}

function toggleRun() {
  runEnabled.value = !runEnabled.value
}

function toggleSidebarMobile() {
  if (isSidebarOpenMobile.value)
    closeSidebarMobile()
  else
    openSidebarMobile()
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
      <WorkbenchTopbar
        :title="activeThread.title"
        :repo="activeThread.repo"
        :run-enabled="runEnabled"
        :pip-enabled="isPipEnabled"
        :is-terminal-open="isTerminalOpen"
        :is-diff-open="isDiffOpen"
        :mobile-sidebar-open="isSidebarOpenMobile"
        @toggle-sidebar="toggleSidebar"
        @toggle-sidebar-mobile="toggleSidebarMobile"
        @toggle-run="toggleRun"
        @toggle-terminal="toggleTerminal"
        @toggle-diff="toggleDiff"
        @toggle-pip="togglePip"
      />

      <section class="workspace-shell">
        <div class="sidebar-column" :class="isSidebarCollapsed ? 'sidebar-column--collapsed' : ''">
          <WorkbenchSidebar
            :threads="threadItems"
            :active-thread-id="activeThreadId"
            :collapsed="isSidebarCollapsed"
            :mobile-open="isSidebarOpenMobile"
            @new-thread="startNewThread"
            @select-thread="selectThread"
            @close-mobile="closeSidebarMobile"
            @toggle-collapsed="toggleSidebar"
          />
        </div>

        <section class="workspace-area">
          <div class="workspace-row">
            <WorkbenchMainStage :messages="activeMessages" />
            <DiffDrawer
              :open="isDiffOpen"
              :accent="payload.theme.accent"
              :contrast="payload.theme.contrast"
            />
          </div>

          <ComposerBar
            v-model:selected-model="selectedModel"
            v-model:selected-thinking="selectedThinking"
            v-model:compose-value="composeValue"
            :model-options="modelOptions"
            :thinking-options="thinkingOptions"
          />

          <TerminalDrawer
            :open="isTerminalOpen"
            :contrast="payload.theme.contrast"
            :opaque-windows="payload.theme.opaqueWindows"
          />
        </section>
      </section>
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
  border: 1px solid var(--wb-border-1);
  border-bottom: none;
  border-radius: var(--wb-r-xl) var(--wb-r-xl) 0 0;
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

.os-item { opacity: 0.9; }
.os-item--strong { font-weight: 600; }

.window-shell {
  border: 1px solid var(--wb-border-2);
  border-radius: 0 0 var(--wb-r-xl) var(--wb-r-xl);
  background: rgba(4, 5, 7, 0.95);
  box-shadow: 0 20px 52px rgba(0, 0, 0, 0.42);
  padding: 8px;
}

.workspace-shell {
  margin-top: 8px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
}

.sidebar-column {
  width: 286px;
  transition: width 220ms ease;
}

.sidebar-column--collapsed {
  width: 88px;
}

.workspace-area {
  min-width: 0;
}

.workspace-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.icon-12 {
  width: 12px;
  height: 12px;
}

@media (max-width: 1180px) {
  .os-menu {
    display: none;
  }

  .workspace-shell {
    grid-template-columns: 1fr;
  }

  .sidebar-column,
  .sidebar-column--collapsed {
    width: 0;
  }
}
</style>
