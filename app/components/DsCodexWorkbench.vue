<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'
import GitActionModal from '~/components/workbench/chat/GitActionModal.vue'
import WorktreeModal from '~/components/workbench/chat/WorktreeModal.vue'
import ChatWindow from '~/components/workbench/ChatWindow.vue'
import DiffDrawer from '~/components/workbench/DiffDrawer.vue'
import TerminalDrawer from '~/components/workbench/TerminalDrawer.vue'
import { codexWorkbenchCssVars } from '~/utils/codex-workbench-theme'
import { resolveThemeCodeFont, resolveThemeUiFont } from '~/utils/theme-font-stacks'

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

const modelOptions = ['GPT-5.3-Codex', 'GPT-5.2-Codex', 'o3']
const thinkingOptions = ['Low', 'Medium', 'High']

const selectedModel = ref(modelOptions[0] ?? '')
const selectedThinking = ref(thinkingOptions[1] ?? thinkingOptions[0] ?? '')
const composeValue = ref('Tune accent + semantic colors')
const activeThreadId = ref('thread-1')
const runEnabled = ref(false)
const isWorktreeModalOpen = ref(false)
const worktreeBranch = ref('codex/add-appearance-settings-view')
const isGitActionModalOpen = ref(false)
const gitActionType = ref<'commit' | 'push' | 'branch'>('commit')
const sidebarWidth = ref(296)
const minSidebarWidth = 260
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

const defaultThread: ThreadItem = { id: 'thread-1', title: 'Investigate Codex token mismatch', repo: 'codex-theme', time: '50 Min.' }

const threadItems: ThreadItem[] = [
  { ...defaultThread, added: 28, removed: 7 },
  { id: 'thread-2', title: 'Open Vue-Bits Dither page', repo: 'codex-theme', time: '3 Day(s)', added: 71, removed: 24 },
  { id: 'thread-3', title: 'Verify Geist font weight parity', repo: 'codex-theme', time: '19 Hrs.' },
  { id: 'thread-4', title: 'Add appearance settings sections', repo: 'codex-theme', time: '23 Hrs.' },
  { id: 'thread-7', title: 'Load Codex icon references', repo: 'codex-theme', time: '3 Day(s)' },
  { id: 'thread-9', title: 'Add theme picker side panel', repo: 'codex-theme', time: '3 Day(s)' },
  { id: 'thread-10', title: 'Make DsRing mobile friendly', repo: 'codex-theme', time: '3 Day(s)' },
  { id: 'thread-5', title: 'Create fix strategy draft', repo: 'personal-page', time: '4 Day(s)' },
  { id: 'thread-6', title: 'Review Storybook divider spacing', repo: 'personal-page', time: '4 Day(s)' },
  { id: 'thread-8', title: 'Resolve icon alignment drift', repo: 'personal-page', time: '4 Day(s)' },
  { id: 'thread-11', title: 'Configure Codex full-access state', repo: 'personal-page', time: '4 Day(s)' },
  { id: 'thread-12', title: 'Audit animate.css access path', repo: 'personal-page', time: '1 Wk.' },
  { id: 'thread-13', title: 'Create fix-strategy notes', repo: 'personal-page', time: '4 Day(s)' },
  { id: 'thread-14', title: 'Add Storybook snapshot script', repo: 'personal-page', time: '4 Day(s)' },
  { id: 'thread-15', title: 'Create GitHub pipeline proposal', repo: 'personal-page', time: '4 Day(s)' },
  { id: 'thread-16', title: 'Analyze design-system checkboxes', repo: 'personal-page', time: '1 Wk.' },
  { id: 'thread-17', title: 'Review checkbox behavior in layout', repo: 'personal-page', time: '1 Wk.' },
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
  ...codexWorkbenchCssVars(props.payload, props.translucentSidebar),
  '--font-ui': resolveThemeUiFont(props.payload.theme.fonts.ui),
  '--font-code': resolveThemeCodeFont(props.payload.theme.fonts.code, props.payload.theme.fonts.ui),
  '--ui-font-size': `${props.uiFontSize}px`,
  '--code-font-size': `${props.codeFontSize}px`,
  '--wb-chat-bubble-radius': '18px',
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

function openGitActionModal(action: 'commit' | 'push' | 'branch') {
  gitActionType.value = action
  isGitActionModalOpen.value = true
}
</script>

<template>
  <section class="relative h-full min-h-0 w-full flex flex-col overflow-hidden text-[length:var(--ui-font-size)] text-[color:var(--wb-text-primary)] font-[var(--font-ui)]" :style="shellStyle">
    <div class="wb-control-lane">
      <div class="inline-flex items-center gap-[9px]">
        <span class="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span class="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span class="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div class="inline-flex items-center gap-[6px]">
        <button
          class="wb-top-control-btn"
          aria-label="Toggle Sidebar"
          @click="toggleSidebar"
        >
          <Icon name="ph:sidebar-simple-light" class="h-[13px] w-[13px]" />
        </button>
        <button
          class="wb-top-control-btn"
          aria-label="Back"
        >
          <Icon name="ph:arrow-left-bold" class="h-[11px] w-[11px]" />
        </button>
        <button
          class="wb-top-control-btn"
          aria-label="Forward"
        >
          <Icon name="ph:arrow-right-bold" class="h-[11px] w-[11px]" />
        </button>
        <button
          v-if="isSidebarCollapsed"
          class="wb-top-control-btn"
          aria-label="New Thread"
          @click="startNewThread"
        >
          <Icon name="ph:note-pencil" class="h-[12px] w-[12px]" />
        </button>
      </div>
    </div>
    <section class="absolute inset-0 box-border min-h-0 flex flex-row items-stretch overflow-hidden">
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

      <section class="wb-main-area min-h-0 min-w-0 flex flex-1 flex-col overflow-hidden" :class="isSidebarCollapsed ? 'wb-main-area--collapsed' : 'wb-main-area--open'">
        <div class="wb-main-frame min-h-0 min-w-0 w-full flex flex-1 flex-col overflow-hidden">
          <div class="workbench-main-row max-w-full min-h-0 min-w-0 w-full flex flex-1 flex-row items-stretch overflow-x-hidden">
            <div class="chat-main-column min-h-0 min-w-0 flex flex-1 basis-0 flex-col">
              <ChatWindow
                v-model:selected-model="selectedModel"
                v-model:selected-thinking="selectedThinking"
                v-model:compose-value="composeValue"
                v-model:worktree-modal-open="isWorktreeModalOpen"
                v-model:worktree-branch="worktreeBranch"
                class="min-h-0 flex-1 transition-[border-radius,border-color] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                :class="isDiffOpen ? 'rounded-r-none border-r-0' : ''"
                title="Open Vue-Bits Dither Sei..."
                repo="codex-theme"
                :is-sidebar-collapsed="isSidebarCollapsed"
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
                @open-git-action="openGitActionModal"
              />
            </div>
            <div
              class="diff-column min-h-0 flex shrink-0 flex-col overflow-hidden"
              :class="isDiffOpen ? 'diff-column--open' : ''"
            >
              <DiffDrawer
                class="min-h-0 min-w-0 flex-1"
                :open="isDiffOpen"
                :accent="payload.theme.accent"
                :contrast="payload.theme.contrast"
              />
            </div>
          </div>

          <TerminalDrawer
            :open="isTerminalOpen"
            :contrast="payload.theme.contrast"
            :opaque-windows="payload.theme.opaqueWindows"
          />
        </div>
      </section>

      <WorktreeModal
        v-model:open="isWorktreeModalOpen"
        v-model:branch="worktreeBranch"
      />
      <GitActionModal
        v-model:open="isGitActionModalOpen"
        v-model:action="gitActionType"
      />
    </section>
  </section>
</template>

<style scoped>
.sidebar-column {
  width: var(--wb-sidebar-width);
  min-height: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  margin-right: 0;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
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

.wb-main-area {
  position: relative;
  background: var(--wb-bg-panel);
  transition: padding 260ms var(--wb-sidebar-ease);
}

.wb-main-area--open {
  padding: 8px 14px 10px 14px;
}

.wb-main-area--collapsed {
  padding: 8px 14px 10px 126px;
}

.wb-main-frame {
  max-width: 1540px;
  margin-inline: auto;
}

.wb-control-lane {
  position: absolute;
  top: 14px;
  left: 26px;
  z-index: 48;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  pointer-events: auto;
}

.wb-top-control-btn {
  height: 22px;
  width: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  appearance: none;
  border: none;
  border-radius: 5px;
  background: transparent;
  padding: 0;
  color: var(--wb-text-faint);
  outline: none;
  box-shadow: none;
  transition:
    color 140ms ease,
    background-color 140ms ease;
}

.wb-top-control-btn:hover {
  background: var(--wb-hover-bg);
  color: var(--wb-text-secondary);
}

.diff-column {
  width: 0;
  min-width: 0;
  max-width: 100%;
  margin-left: 0;
  flex-shrink: 0;
  transition:
    width 260ms var(--wb-sidebar-ease),
    margin-left 220ms var(--wb-sidebar-ease);
}

.diff-column--open {
  width: min(41vw, 520px);
  max-width: min(520px, 100%);
  flex: 0 0 min(41vw, 520px);
  margin-left: -1px;
}

@media (max-width: 1180px) {
  .wb-main-area--open {
    padding: 7px 10px 8px 10px;
  }

  .wb-main-area--collapsed {
    padding: 7px 10px 8px 98px;
  }

  .wb-control-lane {
    top: 13px;
    left: 8px;
  }

  .sidebar-column {
    width: 0;
    margin-right: 0;
  }

  .sidebar-resize-handle {
    display: none;
  }
}
</style>
