<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'
import ChatHeaderBar from '~/components/workbench/chat/ChatHeaderBar.vue'
import GitActionModal from '~/components/workbench/chat/GitActionModal.vue'
import WorktreeModal from '~/components/workbench/chat/WorktreeModal.vue'
import ChatWindow from '~/components/workbench/ChatWindow.vue'
import DiffDrawer from '~/components/workbench/DiffDrawer.vue'
import TerminalDrawer from '~/components/workbench/TerminalDrawer.vue'
import { workbenchMessagesByThread } from '~/data/workbench-chat-mock'
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

const props = defineProps<{
  payload: CodexThemePayload
  uiFontSize: number
  codeFontSize: number
  translucentSidebar: boolean
}>()

const modelOptions = [
  'GPT-5.4',
  'GPT-5.4-Mini',
  'GPT-5.3-Codex',
  'GPT-5.2-Codex',
  'GPT-5.2',
  'GPT-5.1-Codex-Max',
  'GPT-5.1-Codex-Mini',
]
const thinkingOptions = ['Low', 'Medium', 'High', 'Very high']

const selectedModel = ref(
  modelOptions.find(option => option === 'GPT-5.3-Codex')
  ?? modelOptions[0]
  ?? '',
)
const selectedThinking = ref(thinkingOptions[1] ?? thinkingOptions[0] ?? '')
const composeValue = ref('Ask for follow-up changes')
const activeThreadId = ref('thread-1')
const runEnabled = ref(false)
const isWorktreeModalOpen = ref(false)
const worktreeBranch = ref('codex/add-appearance-settings-view')
const isGitActionModalOpen = ref(false)
const gitActionType = ref<'commit' | 'push' | 'branch'>('commit')
const sidebarWidth = ref(296)
const minSidebarWidth = 260
const maxSidebarWidth = 420
const diffWidth = ref(520)
const minDiffWidth = 360
const maxDiffWidth = 760
const isDiffResizing = ref(false)

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

const activeMessages = computed(() => workbenchMessagesByThread[activeThreadId.value] || [])
const sidebarOccupiedWidth = computed(() => (isSidebarCollapsed.value ? 0 : sidebarWidth.value))
const bodyShiftPx = computed(() => 0)
const bodyFrameWidthBudget = computed(() => {
  return `calc(100vw - 28px - ${sidebarOccupiedWidth.value}px)`
})

const chatLaneDesktopInsetLeft = computed(() => {
  if (!isDiffOpen.value)
    return isSidebarCollapsed.value
      ? 'clamp(260px, 16vw, 420px)'
      : 'clamp(180px, 12vw, 320px)'
  if (!isSidebarCollapsed.value)
    return 'clamp(48px, 6vw, 112px)'
  return 'clamp(88px, 9vw, 168px)'
})

const chatLaneDesktopInsetRight = computed(() => chatLaneDesktopInsetLeft.value)

const shellStyle = computed(() => ({
  ...codexWorkbenchCssVars(props.payload, props.translucentSidebar),
  '--font-ui': resolveThemeUiFont(props.payload.theme.fonts.ui),
  '--font-code': resolveThemeCodeFont(props.payload.theme.fonts.code, props.payload.theme.fonts.ui),
  '--ui-font-size': `${props.uiFontSize}px`,
  '--code-font-size': `${props.codeFontSize}px`,
  '--wb-ui-text': 'var(--ui-font-size)',
  '--wb-ui-text-sm': 'calc(var(--ui-font-size) - 1px)',
  '--wb-ui-text-xs': 'calc(var(--ui-font-size) - 2px)',
  '--wb-ui-text-2xs': 'calc(var(--ui-font-size) - 3px)',
  '--wb-code-text': 'var(--code-font-size)',
  '--wb-code-text-sm': 'calc(var(--code-font-size) - 1px)',
  '--wb-chat-message-size': 'var(--ui-font-size)',
  '--wb-chat-bubble-radius': '18px',
  '--wb-sidebar-width': `${sidebarWidth.value}px`,
  '--wb-diff-size': `${diffWidth.value}px`,
  '--wb-body-frame-width-budget': bodyFrameWidthBudget.value,
  '--wb-body-shift': `${bodyShiftPx.value}px`,
  '--wb-header-left-safe-area': isSidebarCollapsed.value
    ? 'clamp(244px, 16vw, 320px)'
    : 'clamp(150px, 10.5vw, 224px)',
  '--wb-header-title-shift': isSidebarCollapsed.value ? '18px' : '-4px',
  '--wb-sidebar-ease': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
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

function beginDiffResize(event: MouseEvent) {
  if (!isDiffOpen.value)
    return

  const startX = event.clientX
  const startWidth = diffWidth.value
  isDiffResizing.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  function onMouseMove(moveEvent: MouseEvent) {
    const delta = startX - moveEvent.clientX
    diffWidth.value = Math.min(maxDiffWidth, Math.max(minDiffWidth, startWidth + delta))
  }

  function onMouseUp() {
    isDiffResizing.value = false
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
  <section class="relative h-full min-h-0 w-full flex flex-col overflow-hidden text-[length:var(--ui-font-size)] text-[color:var(--wb-text-primary)] font-[var(--font-ui)]" :style="shellStyle">
    <div class="wb-control-lane">
      <div class="inline-flex items-center gap-[9px]">
        <span class="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span class="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span class="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div class="inline-flex translate-y-[2px] translate-x-[12px] items-center gap-1.5">
        <button
          class="wb-top-control-btn"
          aria-label="Toggle Sidebar"
          @click="toggleSidebar"
        >
          <Icon name="cuida:sidebar-collapse-outline" class="size-4" />
        </button>
        <button
          class="wb-top-control-btn wb-top-control-secondary"
          aria-label="Back"
        >
          <Icon name="ph:arrow-left-light" class="size-4" />
        </button>
        <button
          class="wb-top-control-btn wb-top-control-secondary"
          aria-label="Forward"
        >
          <Icon name="ph:arrow-right-light" class="size-4" />
        </button>
        <button
          v-if="isSidebarCollapsed"
          class="wb-top-control-btn wb-top-control-secondary"
          aria-label="New Thread"
          @click="startNewThread"
        >
          <Icon name="heroicons-outline:pencil-alt" class="size-4" />
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

      <section class="wb-main-area min-h-0 min-w-0 flex flex-1 flex-col overflow-hidden">
        <div class="wb-header-frame min-h-0 min-w-0 w-full flex flex-col">
          <section class="wb-chat-header-shell min-h-0 min-w-0 overflow-hidden bg-[var(--wb-bg-panel)]">
            <div class="px-[8px] pt-0">
              <ChatHeaderBar
                title="Open Vue-Bits Dither Sei..."
                repo="codex-theme"
                :run-enabled="runEnabled"
                :is-terminal-open="isTerminalOpen"
                :is-diff-open="isDiffOpen"
                :is-pip-enabled="isPipEnabled"
                @toggle-run="runEnabled = !runEnabled"
                @toggle-terminal="toggleTerminal"
                @toggle-diff="toggleDiff"
                @toggle-pip="togglePip"
                @open-worktree="isWorktreeModalOpen = true"
                @open-git-action="openGitActionModal"
              />
            </div>
          </section>
        </div>

        <div class="wb-body-frame min-h-0 min-w-0 w-full flex flex-1 flex-col overflow-hidden">
          <div class="wb-body-motion min-h-0 min-w-0 w-full flex flex-1 flex-col overflow-hidden">
            <section class="wb-chat-body-shell min-h-0 min-w-0 flex flex-1 flex-col overflow-hidden bg-[var(--wb-bg-panel)]">
              <div class="workbench-main-row max-w-full min-h-0 min-w-0 w-full flex flex-1 flex-row items-stretch overflow-x-hidden">
                <div class="chat-main-column min-h-0 min-w-0 flex flex-1 basis-0 flex-col">
                  <ChatWindow
                    v-model:selected-model="selectedModel"
                    v-model:selected-thinking="selectedThinking"
                    v-model:compose-value="composeValue"
                    v-model:worktree-modal-open="isWorktreeModalOpen"
                    v-model:worktree-branch="worktreeBranch"
                    class="min-h-0 flex-1"
                    :show-header="false"
                    title="Open Vue-Bits Dither Sei..."
                    repo="codex-theme"
                    :code-theme-id="payload.codeThemeId"
                    :run-enabled="runEnabled"
                    :is-terminal-open="isTerminalOpen"
                    :is-diff-open="isDiffOpen"
                    :is-diff-resizing="isDiffResizing"
                    :chat-lane-desktop-inset-left="chatLaneDesktopInsetLeft"
                    :chat-lane-desktop-inset-right="chatLaneDesktopInsetRight"
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
                  v-if="isDiffOpen"
                  class="diff-resize-handle"
                  @mousedown="beginDiffResize"
                />
                <div
                  class="diff-column min-h-0 flex shrink-0 flex-col overflow-hidden"
                  :class="isDiffOpen ? 'diff-column--open' : ''"
                >
                  <DiffDrawer
                    class="min-h-0 min-w-0 flex-1"
                    :open="isDiffOpen"
                    :code-theme-id="payload.codeThemeId"
                    :accent="payload.theme.accent"
                    :contrast="payload.theme.contrast"
                  />
                </div>
              </div>
            </section>

            <TerminalDrawer
              :open="isTerminalOpen"
              :code-theme-id="payload.codeThemeId"
              :contrast="payload.theme.contrast"
              :opaque-windows="payload.theme.opaqueWindows"
            />
          </div>
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
  z-index: 42;
  overflow: hidden;
  transition:
    width 340ms var(--wb-sidebar-ease),
    margin-right 340ms var(--wb-sidebar-ease);
}

.sidebar-resize-handle {
  position: relative;
  z-index: 43;
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
  z-index: 10;
  background: var(--wb-bg-panel);
  padding: 2px 14px 0 14px;
}

.wb-header-frame {
  position: relative;
  z-index: 24;
  width: min(1540px, 100%);
  max-width: 1540px;
  margin-inline: auto;
}

.wb-chat-header-shell {
  border: none;
  border-radius: 28px 28px 0 0;
  overflow: visible;
}

.wb-body-frame {
  position: relative;
  z-index: 10;
  width: min(1540px, var(--wb-body-frame-width-budget, calc(100vw - 28px)));
  max-width: 1540px;
  margin-inline: auto;
  will-change: width;
  transition: width 340ms var(--wb-sidebar-ease);
}

.wb-body-motion {
  transform: translateX(var(--wb-body-shift));
  will-change: transform;
  backface-visibility: hidden;
  transition: transform 340ms var(--wb-sidebar-ease);
  transform-origin: center;
}

.wb-chat-body-shell {
  border: none;
  border-radius: 0 0 28px 28px;
}

.wb-control-lane {
  position: absolute;
  top: 8px;
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
  flex: 0 0 auto;
  min-width: 0;
  margin-left: 0;
  flex-shrink: 0;
  opacity: 0;
  will-change: width, opacity;
  pointer-events: none;
  transition:
    width 340ms var(--wb-sidebar-ease),
    margin-left 340ms var(--wb-sidebar-ease),
    opacity 240ms ease;
}

.diff-column--open {
  width: var(--wb-diff-size);
  flex: 0 0 auto;
  margin-left: -1px;
  opacity: 1;
  pointer-events: auto;
}

.diff-resize-handle {
  position: relative;
  z-index: 44;
  width: 0;
  flex: 0 0 auto;
  margin-left: -1px;
  cursor: col-resize;
}

.diff-resize-handle::before {
  content: '';
  position: absolute;
  top: 0;
  right: -4px;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
}

@media (max-width: 1180px) {
  .wb-main-area {
    --wb-header-left-safe-area: 16px;
    --wb-header-title-shift: 0px;
    padding: 2px 10px 0 10px;
  }

  .wb-header-frame {
    width: 100%;
  }

  .wb-body-frame {
    width: 100%;
  }

  .wb-body-motion {
    transform: translateX(0);
  }

  .wb-control-lane {
    top: 8px;
    left: 8px;
  }

  .sidebar-column {
    width: 0;
    margin-right: 0;
  }

  .sidebar-resize-handle {
    display: none;
  }

  .diff-resize-handle {
    display: none;
  }
}

@media (max-width: 768px) {
  .wb-main-area {
    --wb-header-left-safe-area: 12px;
    padding: 2px 6px 0 6px;
  }

  .wb-control-lane {
    top: 6px;
    left: 6px;
    gap: 8px;
  }

  .wb-top-control-secondary {
    display: none;
  }

  .diff-column {
    position: fixed;
    top: 56px;
    right: 8px;
    bottom: 10px;
    width: min(92vw, 460px);
    max-width: calc(100vw - 16px);
    margin-left: 0;
    border-radius: 18px;
    border: 1px solid var(--wb-border-1);
    background: var(--wb-bg-panel);
    transform: translateX(104%);
    opacity: 0;
    z-index: 46;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
    transition:
      transform 280ms var(--wb-sidebar-ease),
      opacity 200ms ease;
  }

  .diff-column--open {
    width: min(92vw, 460px);
    margin-left: 0;
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
