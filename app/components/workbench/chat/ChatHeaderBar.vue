<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'

defineProps<{
  title: string
  repo: string
  runEnabled: boolean
  isTerminalOpen: boolean
  isDiffOpen: boolean
  isPipEnabled: boolean
}>()

const emit = defineEmits<{
  toggleRun: []
  toggleTerminal: []
  toggleDiff: []
  togglePip: []
}>()

interface EditorOption {
  label: string
  icon: string
}

interface CommitOption {
  label: string
  icon: string
  disabled?: boolean
}

const isEditorMenuOpen = ref(false)
const isCommitMenuOpen = ref(false)
const editorMenuRef = ref<HTMLElement | null>(null)
const commitMenuRef = ref<HTMLElement | null>(null)

const editorOptions: EditorOption[] = [
  { label: 'Cursor', icon: '🧊' },
  { label: 'Zed', icon: '🧩' },
  { label: 'Windsurf', icon: '🌊' },
  { label: 'Finder', icon: '🗂️' },
  { label: 'Terminal', icon: '⌨️' },
  { label: 'Ghostty', icon: '👻' },
  { label: 'Xcode', icon: '🛠️' },
  { label: 'Android Studio', icon: '🤖' },
  { label: 'IntelliJ IDEA', icon: '💡' },
]

const commitOptions: CommitOption[] = [
  { label: 'Commit', icon: 'ph:git-commit' },
  { label: 'Push', icon: 'ph:git-pull-request-bold' },
  { label: 'PR erstellen', icon: 'ph:github-logo-fill', disabled: true },
  { label: 'Create branch', icon: 'ph:git-branch-bold' },
]

function toggleEditorMenu() {
  isEditorMenuOpen.value = !isEditorMenuOpen.value
  if (isEditorMenuOpen.value)
    isCommitMenuOpen.value = false
}

function toggleCommitMenu() {
  isCommitMenuOpen.value = !isCommitMenuOpen.value
  if (isCommitMenuOpen.value)
    isEditorMenuOpen.value = false
}

function closeMenus() {
  isEditorMenuOpen.value = false
  isCommitMenuOpen.value = false
}

onClickOutside(editorMenuRef, () => {
  isEditorMenuOpen.value = false
})

onClickOutside(commitMenuRef, () => {
  isCommitMenuOpen.value = false
})

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape')
    closeMenus()
})
</script>

<template>
  <header class="chat-header-bar h-[34px] flex items-center justify-between gap-1 px-1">
    <div class="min-w-0 inline-flex items-center gap-1">
      <strong class="truncate text-[13px] text-[color:var(--wb-text-primary)] font-semibold leading-none">{{ title }}</strong>
      <span class="truncate text-[13px] text-[color:var(--wb-text-muted)] leading-none">{{ repo }}</span>
      <button class="h-5 w-5 inline-flex appearance-none items-center justify-center rounded-[6px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]">
        <Icon name="ph:dots-three-bold" class="h-[13px] w-[13px]" />
      </button>
    </div>

    <div class="inline-flex items-center gap-1">
      <button
        class="h-6 w-6 inline-flex appearance-none items-center justify-center rounded-[6px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="runEnabled ? 'bg-[var(--wb-hover-bg-strong)] text-[color:var(--wb-text-primary)]' : ''"
        @click="emit('toggleRun')"
      >
        <Icon name="ph:play-bold" class="h-[10px] w-[10px]" />
      </button>

      <div ref="editorMenuRef" class="relative">
        <button class="h-6 inline-flex appearance-none items-center gap-1 rounded-[8px] border-none bg-[var(--wb-chip-bg)] px-1.5 text-[10px] text-[color:var(--wb-text-primary)] font-[var(--font-ui)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--wb-border-2)_80%,transparent)_inset] outline-none transition-colors hover:bg-[var(--wb-hover-bg-strong)]" @click.stop="toggleEditorMenu">
          <span class="text-[10px] leading-none">🧩</span>
          <Icon name="ph:caret-down-bold" class="h-[9px] w-[9px]" />
        </button>
        <div v-if="isEditorMenuOpen" class="absolute right-0 top-full z-30 mt-2 w-[410px] border border-[color:var(--wb-border-2)] rounded-[22px] bg-[var(--wb-popover-bg)] p-3 shadow-[0_26px_48px_rgba(0,0,0,0.45)] backdrop-blur-[16px]">
          <ul class="grid gap-0.5">
            <li v-for="option in editorOptions" :key="option.label">
              <button class="h-11 w-full flex appearance-none items-center gap-3 rounded-[12px] border-none px-3 text-left text-[12px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]">
                <span class="h-6 w-6 inline-flex items-center justify-center border border-[color:var(--wb-border-2)] rounded-[7px] bg-[var(--wb-input-bg)] text-[12px]">{{ option.icon }}</span>
                <span class="truncate font-medium">{{ option.label }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <button class="h-6 inline-flex appearance-none items-center gap-1 rounded-[8px] border-none bg-[var(--wb-chip-bg)] px-2 text-[10px] text-[color:var(--wb-text-primary)] font-[var(--font-ui)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--wb-border-2)_80%,transparent)_inset] outline-none transition-colors max-[1300px]:hidden hover:bg-[var(--wb-hover-bg-strong)]">
        <Icon name="ph:arrows-left-right-bold" class="h-[10px] w-[10px]" />
        Move to Worktree
      </button>

      <div ref="commitMenuRef" class="relative">
        <button class="h-6 inline-flex appearance-none items-center gap-1 rounded-[8px] border-none bg-[var(--wb-chip-bg)] px-2 text-[10px] text-[color:var(--wb-text-primary)] font-[var(--font-ui)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--wb-border-2)_80%,transparent)_inset] outline-none transition-colors hover:bg-[var(--wb-hover-bg-strong)]" @click.stop="toggleCommitMenu">
          <Icon name="ph:git-commit" class="h-[10px] w-[10px]" />
          Commit
          <Icon name="ph:caret-down-bold" class="h-[9px] w-[9px]" />
        </button>
        <div v-if="isCommitMenuOpen" class="absolute right-0 top-full z-30 mt-2 w-[250px] border border-[color:var(--wb-border-2)] rounded-[22px] bg-[var(--wb-popover-bg)] p-3 shadow-[0_26px_48px_rgba(0,0,0,0.45)] backdrop-blur-[16px]">
          <p class="mb-2 px-2 text-[11px] text-[color:var(--wb-popover-muted)] font-semibold">
            Git-Aktionen
          </p>
          <ul class="grid gap-0.5">
            <li v-for="option in commitOptions" :key="option.label">
              <button class="h-10 w-full flex appearance-none items-center gap-3 rounded-[11px] border-none px-2.5 text-left text-[11.5px] outline-none transition-colors" :class="option.disabled ? 'cursor-not-allowed text-[color:var(--wb-text-faint)]' : 'text-[color:var(--wb-text-primary)] hover:bg-[var(--wb-hover-bg)]'">
                <Icon :name="option.icon" class="h-[14px] w-[14px]" />
                <span class="truncate font-medium">{{ option.label }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <span class="mx-[2px] h-[14px] w-px bg-[var(--wb-divider)]" />

      <button
        class="h-6 w-6 inline-flex appearance-none items-center justify-center rounded-[6px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="isTerminalOpen ? 'text-[color:var(--wb-text-primary)]' : ''"
        @click="emit('toggleTerminal')"
      >
        <Icon name="ph:terminal-window-bold" class="h-[10px] w-[10px]" />
      </button>

      <button
        class="h-6 inline-flex appearance-none items-center gap-[2px] rounded-[6px] border-none bg-transparent px-1 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="isDiffOpen ? 'text-[color:var(--wb-text-primary)]' : ''"
        @click="emit('toggleDiff')"
      >
        <Icon name="ph:square-split-vertical-bold" class="h-[10px] w-[10px]" />
        <span class="text-[10px] leading-none font-[var(--font-ui)] tabular-nums">
          <span class="text-[color:var(--wb-diff-delta-added)]">+836</span>
          <span class="mx-[1px] text-[color:var(--wb-text-muted)]">-</span>
          <span class="text-[color:var(--wb-diff-delta-removed)]">1.068</span>
        </span>
      </button>

      <button
        class="h-6 w-6 inline-flex appearance-none items-center justify-center rounded-[6px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        @click="emit('togglePip')"
      >
        <Icon :name="isPipEnabled ? 'ph:arrow-square-out-bold' : 'ph:square-bold'" class="h-[10px] w-[10px]" />
      </button>
    </div>
  </header>
</template>
