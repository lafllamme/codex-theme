<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'
import { useEventListener } from '@vueuse/core'
import ChatHeaderBar from '~/components/workbench/chat/ChatHeaderBar.vue'
import ComposerDropdownMenu from '~/components/workbench/chat/ComposerDropdownMenu.vue'
import GitActionModal from '~/components/workbench/chat/GitActionModal.vue'
import WorktreeModal from '~/components/workbench/chat/WorktreeModal.vue'
import ChatWindow from '~/components/workbench/ChatWindow.vue'
import DiffDrawer from '~/components/workbench/DiffDrawer.vue'
import MarketplaceToolbar from '~/components/workbench/marketplace/MarketplaceToolbar.vue'
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
  themeSwitching: boolean
  translucentSidebar: boolean
}>()

const modelOptions = [
  'GPT-5.4',
  'GPT-5.4-Mini',
  'GPT-5.3-Codex',
  'GPT-5.2',
]
const thinkingOptions = ['Low', 'Medium', 'High', 'Very high']

const selectedModel = ref(
  modelOptions.find(option => option === 'GPT-5.3-Codex')
  ?? modelOptions[0]
  ?? '',
)
const selectedThinking = ref(thinkingOptions[1] ?? thinkingOptions[0] ?? '')
const composeValue = ref('')
const activeThreadId = ref('thread-1')
const draftThreadRepo = ref('codex-theme')
const runEnabled = ref(false)
const isWorktreeModalOpen = ref(false)
const worktreeBranch = ref('codex/add-appearance-settings-view')
const isGitActionModalOpen = ref(false)
const gitActionType = ref<'commit' | 'push' | 'branch'>('commit')
const isSearchCommandOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
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
  toggleSidebar,
  closeSidebarMobile,
  toggleTerminal,
  toggleDiff,
} = useWorkbenchPanels()

const marketplaceStore = useWorkbenchMarketplaceStore()

const defaultThread: ThreadItem = { id: 'thread-1', title: 'Investigate Codex token mismatch', repo: 'codex-theme', time: '50 Min.' }

const threadItems: ThreadItem[] = [
  { ...defaultThread, added: 28, removed: 7 },
  {
    id: 'thread-working-demo',
    title: 'Codex SVG sidebar toggle mock',
    repo: 'codex-theme',
    time: 'Just now',
    added: 10,
    removed: 0,
  },
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
const activeThread = computed(() =>
  threadItems.find(thread => thread.id === activeThreadId.value) ?? null,
)
const activeThreadTitle = computed(() => activeThread.value?.title ?? 'New Thread')
const activeThreadRepo = computed(() => activeThread.value?.repo ?? draftThreadRepo.value)
const bodyShiftPx = computed(() => 0)

const chatLaneDesktopInsetLeft = computed(() => {
  if (!isDiffOpen.value) {
    return isSidebarCollapsed.value
      ? 'clamp(260px, 16vw, 420px)'
      : 'clamp(180px, 12vw, 320px)'
  }
  if (!isSidebarCollapsed.value)
    return 'clamp(48px, 6vw, 112px)'
  return 'clamp(88px, 9vw, 168px)'
})

const chatLaneDesktopInsetRight = computed(() => chatLaneDesktopInsetLeft.value)

/**
 * Header title/repo inset: driven only by sidebar collapse, not diff — opening the diff drawer must not shift the chat header text.
 * Chat lane (`chatLaneDesktopInsetLeft`) still reacts to diff for message column width.
 */
const headerLeftSafeArea = computed(() => {
  if (isSidebarCollapsed.value) {
    return 'max(0px, calc(clamp(260px, 16vw, 420px) - 14px))'
  }
  return 'max(0px, calc(clamp(14px, 2vw, 32px) - 14px))'
})

const wbSidebarEase = 'ease-[var(--wb-sidebar-ease,cubic-bezier(0.2,0.8,0.2,1))]'
const wbOverlayEase = 'max-[1081px]:ease-[var(--wb-sidebar-ease,cubic-bezier(0.2,0.8,0.2,1))]'

const topControlBtnClass
  = 'h-[22px] w-[22px] inline-flex appearance-none items-center justify-center border-none rounded-[5px] bg-transparent p-0 text-[color:var(--wb-text-faint)] shadow-none outline-none transition-[color,background-color] duration-[140ms] ease-in-out hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-secondary)]'

const topControlSecondaryClass = `${topControlBtnClass} max-[768px]:hidden`

const sidebarColumnClass = computed(() =>
  [
    'relative z-[42] min-h-0 mr-0 self-stretch flex shrink-0 flex-col overflow-hidden',
    'transition-[width] duration-[340ms]',
    wbSidebarEase,
    isSidebarCollapsed.value ? 'w-0' : 'w-[var(--wb-sidebar-width)]',
    'max-[1180px]:!w-0',
  ].join(' '),
)

const diffColumnClass = computed(() => {
  const mobileShell = [
    'max-[1081px]:fixed max-[1081px]:top-2 max-[1081px]:right-2 max-[1081px]:bottom-2 max-[1081px]:left-auto max-[1081px]:z-46',
    'max-[1081px]:ml-0 max-[1081px]:w-[min(var(--wb-diff-size),calc(100vw-16px))]',
    'max-[1081px]:rounded-none max-[1081px]:border-0 max-[1081px]:bg-[var(--wb-bg-panel)]',
    'max-[1081px]:shadow-[0_18px_40px_rgba(0,0,0,0.28)]',
    'max-[1081px]:transition-[transform,opacity] max-[1081px]:duration-[280ms]',
    wbOverlayEase,
  ]
  if (isDiffOpen.value) {
    return [
      'theme-switch-surface min-h-0 flex shrink-0 flex-col overflow-hidden',
      'min-w-0 flex-[0_0_auto] pointer-events-auto',
      'min-[1082px]:will-change-[width] min-[1082px]:w-[var(--wb-diff-size)] min-[1082px]:-ml-px',
      'min-[1082px]:transition-[width] min-[1082px]:duration-[340ms] min-[1082px]:ease-[var(--wb-sidebar-ease,cubic-bezier(0.2,0.8,0.2,1))]',
      'max-[1081px]:will-change-[transform,opacity]',
      ...mobileShell,
      'max-[1081px]:translate-x-0 max-[1081px]:opacity-100',
    ].join(' ')
  }
  return [
    'theme-switch-surface min-h-0 flex shrink-0 flex-col overflow-hidden',
    'min-w-0 flex-[0_0_auto] pointer-events-none',
    'min-[1082px]:will-change-[width] min-[1082px]:ml-0 min-[1082px]:w-0',
    'min-[1082px]:transition-[width] min-[1082px]:duration-[340ms] min-[1082px]:ease-[var(--wb-sidebar-ease,cubic-bezier(0.2,0.8,0.2,1))]',
    ...mobileShell,
    'max-[1081px]:translate-x-[104%] max-[1081px]:opacity-0',
  ].join(' ')
})

const searchSections = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const sections = [
    {
      id: 'suggested',
      title: 'Suggested',
      items: [
        { id: 'new-thread', label: 'New Thread', shortcut: '⌘N', icon: 'heroicons-outline:pencil-alt', action: () => startNewThread() },
        { id: 'open-folder', label: 'Open folder', shortcut: '⌘O', icon: 'ph:folder-open', action: () => openFolderCommand() },
        { id: 'settings', label: 'Settings', shortcut: '⌘,', icon: 'ph:gear-six', action: () => undefined },
        { id: 'search-files', label: 'Search files', shortcut: '⌘P', icon: 'ph:magnifying-glass', action: () => undefined },
      ],
    },
    {
      id: 'thread',
      title: 'Thread',
      items: [
        { id: 'search-chats', label: 'Search chats', shortcut: '⌘G', icon: 'ph:magnifying-glass', action: () => undefined },
        { id: 'new-quick-chat', label: 'New quick chat', shortcut: '⇧⌘N', icon: 'heroicons-outline:pencil-alt', action: () => startNewThread(activeThreadRepo.value) },
        { id: 'expand-thread', label: 'Expand thread', shortcut: '⌘]', icon: 'ph:arrows-out-simple', action: () => undefined },
      ],
    },
  ]

  if (!query)
    return sections

  return sections
    .map(section => ({
      ...section,
      items: section.items.filter(item => item.label.toLowerCase().includes(query)),
    }))
    .filter(section => section.items.length > 0)
})

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
  '--wb-body-shift': `${bodyShiftPx.value}px`,
  '--wb-top-chrome-height': '38px',
  '--wb-header-left-safe-area': headerLeftSafeArea.value,
  '--wb-header-title-shift': '0px',
  '--wb-sidebar-ease': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
}))

function startNewThread(repo?: string) {
  marketplaceStore.setMainStageView('chat')
  activeThreadId.value = `thread-new-${Date.now()}`
  draftThreadRepo.value = repo ?? activeThreadRepo.value ?? defaultThread.repo
  composeValue.value = ''
  closeSidebarMobile()
}

function selectThread(id: string) {
  marketplaceStore.setMainStageView('chat')
  activeThreadId.value = id
  closeSidebarMobile()
}

function openFolderCommand() {
  if (!process.client)
    return

  const tryDirectoryPicker = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        await (window as Window & { showDirectoryPicker?: () => Promise<unknown> }).showDirectoryPicker?.()
        return
      }
      const input = document.createElement('input')
      input.type = 'file'
      input.setAttribute('webkitdirectory', '')
      input.style.display = 'none'
      document.body.appendChild(input)
      input.click()
      input.remove()
    }
    catch {
      // Ignore browser security blocks in restricted environments.
    }
  }

  void tryDirectoryPicker()
}

async function openSearchCommand() {
  isSearchCommandOpen.value = true
  await nextTick()
  searchInputRef.value?.focus()
}

function closeSearchCommand() {
  isSearchCommandOpen.value = false
  searchQuery.value = ''
}

function executeSearchCommand(action: () => void) {
  action()
  closeSearchCommand()
}

function isEditableEventTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement))
    return false
  const tagName = target.tagName.toLowerCase()
  return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select'
}

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (event.defaultPrevented || event.altKey)
    return

  if (!(event.metaKey || event.ctrlKey))
    return

  const key = event.key.toLowerCase()

  if (key === 'k' && !event.shiftKey) {
    event.preventDefault()
    void openSearchCommand()
    return
  }

  if (key === 'n' && !event.shiftKey && !isEditableEventTarget(event.target)) {
    event.preventDefault()
    startNewThread()
  }
})

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
  <section
    class="relative h-full min-h-0 w-full flex flex-col overflow-hidden text-[length:var(--ui-font-size)] text-[color:var(--wb-text-primary)] font-[var(--font-ui)]"
    :class="{ 'wb-theme-switching': props.themeSwitching }"
    :style="shellStyle"
  >
    <div class="pointer-events-auto absolute left-[26px] top-2 z-48 inline-flex items-center gap-4 max-[1180px]:left-2 max-[768px]:left-1.5 max-[768px]:top-1.5 max-[768px]:gap-2">
      <div class="hidden items-center gap-[9px] min-[1181px]:inline-flex">
        <span class="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span class="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span class="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div class="inline-flex translate-x-[12px] translate-y-[2px] items-center gap-1.5">
        <button
          type="button"
          :class="topControlBtnClass"
          aria-label="Toggle Sidebar"
          @click="toggleSidebar"
        >
          <span class="relative inline-block size-4">
            <Icon
              name="cuida:sidebar-collapse-outline"
              class="absolute inset-0 size-4"
              :class="isSidebarCollapsed ? '' : 'hidden'"
            />
            <Icon
              name="cuida:sidebar-expand-outline"
              class="absolute inset-0 size-4"
              :class="isSidebarCollapsed ? 'hidden' : ''"
            />
          </span>
        </button>
        <button
          type="button"
          :class="topControlSecondaryClass"
          aria-label="Back"
        >
          <Icon name="ph:arrow-left-light" class="size-4" />
        </button>
        <button
          type="button"
          :class="topControlSecondaryClass"
          aria-label="Forward"
        >
          <Icon name="ph:arrow-right-light" class="size-4" />
        </button>
        <button
          v-if="isSidebarCollapsed"
          type="button"
          :class="topControlSecondaryClass"
          aria-label="New Thread"
          @click="startNewThread"
        >
          <Icon name="heroicons-outline:pencil-alt" class="size-4" />
        </button>
      </div>
    </div>
    <section class="absolute inset-0 box-border min-h-0 flex flex-row items-stretch overflow-hidden">
      <div :class="sidebarColumnClass">
        <WorkbenchSidebar
          :threads="threadItems"
          :active-thread-id="activeThreadId"
          :collapsed="isSidebarCollapsed"
          :mobile-open="isSidebarOpenMobile"
          @new-thread="startNewThread"
          @open-search-command="openSearchCommand"
          @new-thread-for-repo="startNewThread"
          @open-folder-command="openFolderCommand"
          @select-thread="selectThread"
          @close-mobile="closeSidebarMobile"
          @toggle-collapsed="toggleSidebar"
        />
      </div>
      <div
        v-if="!isSidebarCollapsed"
        class="relative z-[43] w-0 flex-shrink-0 bg-transparent before:absolute before:bottom-0 before:top-0 max-[1180px]:hidden before:w-2 before:cursor-col-resize before:content-[''] before:-right-1"
        @mousedown="beginSidebarResize"
      />

      <section
        class="theme-switch-surface relative z-10 min-h-0 min-w-0 flex flex-1 flex-col overflow-hidden bg-[var(--wb-bg-panel)] px-0 pt-0.5 max-[1180px]:[--wb-header-left-safe-area:clamp(128px,32vw,168px)] max-[1180px]:[--wb-header-title-shift:0px] max-[768px]:[--wb-header-left-safe-area:clamp(52px,16vw,72px)]"
        :class="!isSidebarCollapsed ? 'min-[1181px]:border-l min-[1181px]:border-solid min-[1181px]:border-[color:var(--wb-border-1)]' : ''"
      >
        <div class="theme-switch-surface relative z-24 min-h-0 min-w-0 w-full flex flex-col">
          <section
            class="theme-switch-surface min-h-0 min-w-0 w-full overflow-visible border-0 border-b border-[color:var(--wb-chrome-hairline)] rounded-t-[28px] border-solid bg-[var(--wb-bg-panel)] pb-1"
          >
            <div
              class="[container-name:wb-chat-header] [container-type:inline-size] w-full px-3.5 pt-0 max-[1180px]:px-2.5 max-[768px]:px-1.5"
            >
              <MarketplaceToolbar v-if="marketplaceStore.mainStageView === 'marketplace'" />
              <ChatHeaderBar
                v-else
                :title="activeThreadTitle"
                :repo="activeThreadRepo"
                :run-enabled="runEnabled"
                :is-terminal-open="isTerminalOpen"
                :is-diff-open="isDiffOpen"
                @toggle-run="runEnabled = !runEnabled"
                @toggle-terminal="toggleTerminal"
                @toggle-diff="toggleDiff"
                @open-worktree="isWorktreeModalOpen = true"
                @open-git-action="openGitActionModal"
              />
            </div>
          </section>
        </div>

        <div
          class="will-change-[width] theme-switch-surface relative z-10 box-border min-h-0 min-w-0 w-full flex flex-1 flex-col overflow-hidden px-3.5 transition-[width] duration-[340ms] max-[1180px]:px-2.5 max-[768px]:px-1.5"
          :class="wbSidebarEase"
        >
          <div
            class="backface-hidden min-h-0 min-w-0 w-full flex flex-1 flex-col origin-center translate-x-[var(--wb-body-shift)] overflow-hidden transition-transform duration-[340ms] will-change-transform max-[1180px]:translate-x-0"
            :class="wbSidebarEase"
          >
            <section
              class="theme-switch-surface min-h-0 min-w-0 flex flex-1 flex-col overflow-hidden rounded-b-[28px] border-none bg-[var(--wb-bg-panel)]"
            >
              <div class="max-w-full min-h-0 min-w-0 w-full flex flex-1 flex-row items-stretch overflow-x-hidden">
                <div class="min-h-0 min-w-0 flex flex-1 basis-0 flex-col">
                  <ChatWindow
                    v-model:selected-model="selectedModel"
                    v-model:selected-thinking="selectedThinking"
                    v-model:compose-value="composeValue"
                    v-model:worktree-modal-open="isWorktreeModalOpen"
                    v-model:worktree-branch="worktreeBranch"
                    class="min-h-0 flex-1"
                    :active-thread-id="activeThreadId"
                    :show-header="false"
                    :repo="activeThreadRepo"
                    :code-theme-id="payload.codeThemeId"
                    :is-diff-resizing="isDiffResizing"
                    :chat-lane-desktop-inset-left="chatLaneDesktopInsetLeft"
                    :chat-lane-desktop-inset-right="chatLaneDesktopInsetRight"
                    :model-options="modelOptions"
                    :thinking-options="thinkingOptions"
                    :messages="activeMessages"
                    :empty-state-repo="activeThreadRepo"
                  />
                </div>
                <div
                  v-if="isDiffOpen"
                  class="relative z-[44] ml-[-1px] hidden w-0 flex-shrink-0 cursor-col-resize before:absolute before:bottom-0 before:top-0 before:w-2 min-[1082px]:flex before:cursor-col-resize before:content-[''] before:-right-1"
                  @mousedown="beginDiffResize"
                />
                <div
                  v-if="isDiffOpen"
                  class="pointer-events-auto fixed bottom-2 top-2 z-[47] hidden w-2 cursor-col-resize before:absolute before:inset-y-0 min-[1082px]:hidden before:w-2 max-[1081px]:flex before:content-[''] before:-right-1"
                  :style="{ left: 'calc(100vw - 8px - var(--wb-diff-size))' }"
                  aria-hidden="true"
                  @mousedown="beginDiffResize"
                />
                <div :class="diffColumnClass">
                  <DiffDrawer
                    class="min-h-0 min-w-0 flex-1"
                    :open="isDiffOpen"
                    :code-theme-id="payload.codeThemeId"
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

    <div
      v-if="isSearchCommandOpen"
      class="fixed inset-0 z-[67] bg-[rgba(0,0,0,0.42)] backdrop-blur-[1px]"
      @click="closeSearchCommand"
    />

    <ComposerDropdownMenu
      :open="isSearchCommandOpen"
      root-class="fixed inset-0 z-[68] flex items-center justify-center p-4 pointer-events-none"
      panel-position-class="relative"
      menu-class="w-[min(92vw,640px)]"
      panel-padding-class="p-2"
      panel-class="pointer-events-auto rounded-[20px] border border-solid border-[color:color-mix(in_srgb,var(--wb-border-2)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_96%,transparent)] shadow-[0_20px_52px_rgba(0,0,0,0.45)] backdrop-blur-[16px]"
      @close="closeSearchCommand"
    >
      <template #trigger>
        <span class="hidden" />
      </template>

      <div class="grid gap-2">
        <label class="h-11 flex items-center gap-2 border border-[color:var(--wb-border-2)] rounded-[12px] border-solid bg-[var(--wb-bg-panel)] px-3">
          <Icon name="ph:magnifying-glass" class="h-[15px] w-[15px] text-[color:var(--wb-text-muted)]" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Search commands"
            class="min-w-0 w-full border-none bg-transparent p-0 text-[17px] text-[color:var(--wb-text-primary)] font-normal leading-none outline-none placeholder:text-[color:var(--wb-text-muted)]"
          >
        </label>

        <div class="max-h-[350px] overflow-y-auto">
          <div v-if="searchSections.length === 0" class="px-2 py-5 text-center text-[14px] text-[color:var(--wb-text-muted)]">
            No matching commands
          </div>

          <div v-for="section in searchSections" :key="section.id" class="grid gap-1 pb-1">
            <p class="mb-0 mt-1.5 px-2 text-[12px] text-[color:var(--wb-text-muted)] font-semibold leading-none">
              {{ section.title }}
            </p>
            <button
              v-for="(item, index) in section.items"
              :key="item.id"
              class="h-[38px] w-full inline-flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[14px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
              :class="index === 0 && section.id === searchSections[0]?.id ? 'bg-[var(--wb-hover-bg)]' : ''"
              @click="executeSearchCommand(item.action)"
            >
              <span class="inline-flex items-center gap-2">
                <Icon :name="item.icon" class="h-[14px] w-[14px] text-[color:var(--wb-text-secondary)]" />
                <span class="truncate">{{ item.label }}</span>
              </span>
              <span v-if="item.shortcut" class="rounded-[8px] bg-[color:var(--wb-hover-bg)] px-1.5 py-[3px] text-[11px] text-[color:var(--wb-text-muted)] font-medium leading-none">
                {{ item.shortcut }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </ComposerDropdownMenu>
  </section>
</template>

<style scoped>
/* Theme cross-fade: no single utility for :deep() multi-selectors. */
.wb-theme-switching .theme-switch-surface,
.wb-theme-switching :deep(.sidebar),
.wb-theme-switching :deep(.wb-chat-window),
.wb-theme-switching :deep(.wb-mainstage-scroll),
.wb-theme-switching :deep(.diff-drawer),
.wb-theme-switching :deep(.terminal-drawer),
.wb-theme-switching :deep(.chat-header-bar),
.wb-theme-switching :deep(button),
.wb-theme-switching :deep(input),
.wb-theme-switching :deep(select),
.wb-theme-switching :deep(textarea),
.wb-theme-switching :deep(svg),
.wb-theme-switching :deep(path) {
  transition-duration: 250ms;
  transition-property:
    background-color, border-color, box-shadow, color, fill, outline-color, stroke, text-decoration-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
