<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

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
  { ...defaultThread, added: 0, removed: 0 },
  { id: 'thread-2', title: 'Open Vue-Bits Dither page', repo: 'codex-theme', time: '17 Std.', added: 2, removed: 9 },
  { id: 'thread-3', title: 'Load Codex controls refs', repo: 'codex-theme', time: '8 Std.', added: 7, removed: 9 },
  { id: 'thread-4', title: 'Add thread list examples', repo: 'codex-theme', time: '17 Std.', added: 9, removed: 6 },
  { id: 'thread-5', title: 'Create fix for collapse', repo: 'personal-page', time: '1 Tag(e)' },
  { id: 'thread-6', title: 'Review chat spacing', repo: 'personal-page', time: '5 Tag(e)' },
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
  <section class="grid gap-0 font-[var(--font-ui)] text-[var(--ui-font-size)] text-[color-mix(in_srgb,var(--theme-ink)_90%,#fff)]" :style="shellStyle">
    <header class="flex h-[30px] items-center justify-between rounded-t-[var(--wb-r-xl)] border border-b-0 border-[var(--wb-border-1)] bg-[rgba(10,12,16,0.46)] px-3 text-[12px] backdrop-blur-[14px] max-[1180px]:hidden">
      <div class="inline-flex items-center gap-3">
        <span class="opacity-90"></span>
        <span class="font-semibold opacity-90">Codex</span>
        <span class="opacity-90">File</span>
        <span class="opacity-90">Edit</span>
        <span class="opacity-90">View</span>
        <span class="opacity-90">Window</span>
        <span class="opacity-90">Help</span>
      </div>
      <div class="inline-flex items-center gap-3">
        <Icon name="ph:wifi-high-bold" class="h-3 w-3" />
        <Icon name="ph:battery-full-bold" class="h-3 w-3" />
        <Icon name="ph:clock-bold" class="h-3 w-3" />
      </div>
    </header>

    <section class="rounded-b-[var(--wb-r-xl)] border border-[var(--wb-border-2)] bg-[rgba(10,12,16,0.5)] p-2 backdrop-blur-[14px] shadow-[0_20px_52px_rgba(0,0,0,0.42)]">
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

      <section class="mt-2 grid max-[1180px]:grid-cols-1" :class="isSidebarCollapsed ? 'grid-cols-[0_1fr] gap-0' : 'grid-cols-[auto_1fr] gap-2'">
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

        <section class="min-w-0">
          <div class="flex items-stretch gap-2">
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
.sidebar-column {
  width: 286px;
  transition: width 220ms ease;
  overflow: hidden;
}

.sidebar-column--collapsed {
  width: 0;
}

@media (max-width: 1180px) {
  .sidebar-column,
  .sidebar-column--collapsed {
    width: 0;
  }
}
</style>
