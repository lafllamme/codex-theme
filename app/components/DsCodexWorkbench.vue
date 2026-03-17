<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'
import ChatWindow from '~/components/workbench/ChatWindow.vue'

interface ThreadItem {
  id: string
  title: string
  repo: string
  time: string
  added?: number
  removed?: number
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

const selectedModel = ref(modelOptions[0])
const selectedThinking = ref(thinkingOptions[1])
const composeValue = ref('Tune accent + semantic colors')
const activeThreadId = ref('thread-1')
const runEnabled = ref(false)
const sidebarWidth = ref(286)
const minSidebarWidth = 248
const maxSidebarWidth = 420

const {
  isSidebarCollapsed,
  isSidebarOpenMobile,
  isTerminalOpen,
  isDiffOpen,
  isPipEnabled,
  toggleSidebar,
  closeSidebarMobile,
  toggleTerminal,
  toggleDiff,
  togglePip,
} = useWorkbenchPanels()

const defaultThread: ThreadItem = { id: 'thread-1', title: 'Make DsRing mobile friendly', repo: 'codex-theme', time: '54 Min.' }

const threadItems: ThreadItem[] = [
  { ...defaultThread, added: 0, removed: 0 },
  { id: 'thread-2', title: 'Open Vue-Bits Dither page', repo: 'codex-theme', time: '17 Std.', added: 2, removed: 9 },
  { id: 'thread-3', title: 'Load Codex controls refs', repo: 'codex-theme', time: '8 Std.', added: 7, removed: 9 },
  { id: 'thread-4', title: 'Add thread list examples', repo: 'codex-theme', time: '17 Std.', added: 9, removed: 6 },
  { id: 'thread-7', title: 'Review sidebar parity', repo: 'codex-theme', time: '11 Std.' },
  { id: 'thread-5', title: 'Create fix for collapse', repo: 'personal-page', time: '1 Tag(e)' },
  { id: 'thread-6', title: 'Review chat spacing', repo: 'personal-page', time: '5 Tag(e)' },
  { id: 'thread-8', title: 'Refine card hover states', repo: 'personal-page', time: '6 Std.', added: 4, removed: 3 },
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
  'thread-3': [
    { id: 'a5', role: 'assistant', text: 'Sidebar lane and row geometry updated for Codex-like density.' },
    { id: 'u3', role: 'user', text: 'Keep the section title subtle and keep active rows restrained.' },
    { id: 'a6', role: 'assistant', text: 'Applied: lower-contrast section label and softer active state.' },
  ],
  'thread-4': [
    { id: 'a7', role: 'assistant', text: 'Terminal and diff controls now use subtle ghost hover.' },
    { id: 'u4', role: 'user', text: 'Great, keep the hover understated.' },
    { id: 'a8', role: 'assistant', text: 'Confirmed. Hover remains low-intensity with no layout shift.' },
  ],
  'thread-7': [
    { id: 'a9', role: 'assistant', text: 'Codex-theme sidebar checks are in good shape for this pass.' },
    { id: 'u9', role: 'user', text: 'Looks good, keep this one without diff counters.' },
  ],
  'thread-8': [
    { id: 'a10', role: 'assistant', text: 'Personal-page card states updated with balanced hover contrast.' },
    { id: 'u10', role: 'user', text: 'Nice, keep plus/minus visible for this task.' },
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
  '--ui-font-size': `${props.uiFontSize}px`,
  '--code-font-size': `${props.codeFontSize}px`,
  '--sidebar-bg': props.translucentSidebar ? 'rgba(9, 10, 12, 0.58)' : 'rgba(9, 10, 12, 0.9)',
  '--wb-sidebar-width': `${sidebarWidth.value}px`,
  '--wb-sidebar-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
}))

function startNewThread() {
  activeThreadId.value = defaultThread.id
  closeSidebarMobile()
}

function selectThread(id: string) {
  activeThreadId.value = id
  closeSidebarMobile()
}

function beginSidebarResize(event: MouseEvent) {
  if (isSidebarCollapsed.value)
    return

  const startX = event.clientX
  const startWidth = sidebarWidth.value
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  function onMouseMove(moveEvent: MouseEvent) {
    const delta = moveEvent.clientX - startX
    sidebarWidth.value = Math.min(maxSidebarWidth, Math.max(minSidebarWidth, startWidth + delta))
  }

  function onMouseUp() {
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <section class="grid min-h-screen gap-0 font-[var(--font-ui)] text-[var(--ui-font-size)] text-[color-mix(in_srgb,var(--theme-ink)_90%,#fff)]" :style="shellStyle">
    <section class="flex min-h-0 flex-1 flex-col rounded-[var(--wb-r-xl)] border border-[var(--wb-border-2)] bg-[rgba(10,12,16,0.5)] p-2 backdrop-blur-[14px] shadow-[0_20px_52px_rgba(0,0,0,0.42)]">
      <section class="relative flex min-h-0 flex-1">
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
        <div
          v-if="!isSidebarCollapsed"
          class="sidebar-resize-handle"
          @mousedown="beginSidebarResize"
        />

        <section class="min-h-0 min-w-0 flex flex-1 flex-col" :class="isSidebarCollapsed ? '' : '-ml-px'">
          <div class="flex min-h-0 min-w-0 w-full flex-1 items-stretch gap-2">
            <ChatWindow
              v-model:selected-model="selectedModel"
              v-model:selected-thinking="selectedThinking"
              v-model:compose-value="composeValue"
              title="Open Vue-Bits Dither Sei..."
              repo="codex-theme"
              :run-enabled="runEnabled"
              :is-terminal-open="isTerminalOpen"
              :is-diff-open="isDiffOpen"
              :is-pip-enabled="isPipEnabled"
              :model-options="modelOptions"
              :thinking-options="thinkingOptions"
              :messages="activeMessages"
              @toggle-run="runEnabled = !runEnabled"
              @toggle-terminal="toggleTerminal"
              @toggle-diff="toggleDiff"
              @toggle-pip="togglePip"
            />
            <DiffDrawer
              :open="isDiffOpen"
              :accent="payload.theme.accent"
              :contrast="payload.theme.contrast"
            />
          </div>

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
.sidebar-column {
  width: var(--wb-sidebar-width);
  height: 100%;
  min-height: 0;
  display: flex;
  margin-right: 0;
  flex-shrink: 0;
  position: relative;
  overflow: visible;
  transition:
    width 260ms var(--wb-sidebar-ease),
    margin-right 220ms var(--wb-sidebar-ease);
}

.sidebar-resize-handle {
  position: relative;
  width: 0;
  margin-right: 0;
  background: transparent;
}

.sidebar-resize-handle::before {
  content: '';
  position: absolute;
  top: 0;
  right: -4px;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
}

.sidebar-column--collapsed {
  width: 0;
  margin-right: 0;
}

@media (max-width: 1180px) {
  .sidebar-column {
    width: 0;
    margin-right: 0;
  }

  .sidebar-resize-handle {
    display: none;
  }
}
</style>
