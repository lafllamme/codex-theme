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
  <header class="flex h-[34px] items-center justify-between gap-1 px-1">
    <div class="inline-flex min-w-0 items-center gap-1">
      <strong class="truncate text-[13px] leading-none font-semibold text-pureWhite/95">{{ title }}</strong>
      <span class="truncate text-[13px] leading-none text-pureWhite/42">{{ repo }}</span>
      <button class="inline-flex h-5 w-5 items-center justify-center appearance-none border-none rounded-[6px] bg-transparent text-pureWhite/54 outline-none transition-colors hover:bg-pureWhite/8">
        <Icon name="ph:dots-three-bold" class="h-[13px] w-[13px]" />
      </button>
    </div>

    <div class="inline-flex items-center gap-1">
      <button
        class="inline-flex h-6 w-6 items-center justify-center appearance-none border-none rounded-[6px] bg-transparent text-pureWhite/60 outline-none transition-colors hover:bg-pureWhite/8"
        :class="runEnabled ? 'bg-pureWhite/11 text-pureWhite/94' : ''"
        @click="emit('toggleRun')"
      >
        <Icon name="ph:play-bold" class="h-[10px] w-[10px]" />
      </button>

      <div ref="editorMenuRef" class="relative">
        <button class="inline-flex h-6 items-center gap-1 appearance-none border-none rounded-[8px] bg-pureBlack/56 px-1.5 text-[10px] text-pureWhite/84 outline-none shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition-colors hover:bg-pureWhite/8" @click.stop="toggleEditorMenu">
          <span class="text-[10px] leading-none">🧩</span>
          <Icon name="ph:caret-down-bold" class="h-[9px] w-[9px]" />
        </button>
        <div v-if="isEditorMenuOpen" class="absolute top-full right-0 z-30 mt-2 w-[410px] rounded-[22px] border border-pureWhite/10 bg-[rgba(18,20,26,0.96)] p-3 shadow-[0_26px_48px_rgba(0,0,0,0.54)] backdrop-blur-[16px]">
          <ul class="grid gap-0.5">
            <li v-for="option in editorOptions" :key="option.label">
              <button class="flex h-11 w-full items-center gap-3 appearance-none border-none rounded-[12px] px-3 text-left text-[12px] text-pureWhite/94 outline-none transition-colors hover:bg-pureWhite/8">
                <span class="inline-flex h-6 w-6 items-center justify-center rounded-[7px] border border-pureWhite/12 bg-pureBlack/45 text-[12px]">{{ option.icon }}</span>
                <span class="truncate font-medium">{{ option.label }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <button class="inline-flex h-6 items-center gap-1 appearance-none border-none rounded-[8px] bg-pureBlack/56 px-2 text-[10px] text-pureWhite/89 outline-none shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition-colors hover:bg-pureWhite/8 max-[1300px]:hidden">
        <Icon name="ph:arrows-left-right-bold" class="h-[10px] w-[10px]" />
        Move to Worktree
      </button>

      <div ref="commitMenuRef" class="relative">
        <button class="inline-flex h-6 items-center gap-1 appearance-none border-none rounded-[8px] bg-pureBlack/56 px-2 text-[10px] text-pureWhite/90 outline-none shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition-colors hover:bg-pureWhite/8" @click.stop="toggleCommitMenu">
          <Icon name="ph:git-commit" class="h-[10px] w-[10px]" />
          Commit
          <Icon name="ph:caret-down-bold" class="h-[9px] w-[9px]" />
        </button>
        <div v-if="isCommitMenuOpen" class="absolute top-full right-0 z-30 mt-2 w-[250px] rounded-[22px] border border-pureWhite/10 bg-[rgba(18,20,26,0.96)] p-3 shadow-[0_26px_48px_rgba(0,0,0,0.54)] backdrop-blur-[16px]">
          <p class="mb-2 px-2 text-[11px] font-semibold text-pureWhite/44">
            Git-Aktionen
          </p>
          <ul class="grid gap-0.5">
            <li v-for="option in commitOptions" :key="option.label">
              <button class="flex h-10 w-full items-center gap-3 appearance-none border-none rounded-[11px] px-2.5 text-left text-[11.5px] outline-none transition-colors" :class="option.disabled ? 'cursor-not-allowed text-pureWhite/34' : 'text-pureWhite/95 hover:bg-pureWhite/8'">
                <Icon :name="option.icon" class="h-[14px] w-[14px]" />
                <span class="truncate font-medium">{{ option.label }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <span class="mx-[2px] h-[14px] w-px bg-pureWhite/12" />

      <button
        class="inline-flex h-6 w-6 items-center justify-center appearance-none border-none rounded-[6px] bg-transparent text-pureWhite/56 outline-none transition-colors hover:bg-pureWhite/8"
        :class="isTerminalOpen ? 'text-pureWhite/92' : ''"
        @click="emit('toggleTerminal')"
      >
        <Icon name="ph:terminal-window-bold" class="h-[10px] w-[10px]" />
      </button>

      <button
        class="inline-flex h-6 items-center gap-[2px] appearance-none border-none rounded-[6px] bg-transparent px-1 text-pureWhite/56 outline-none transition-colors hover:bg-pureWhite/8"
        :class="isDiffOpen ? 'text-pureWhite/92' : ''"
        @click="emit('toggleDiff')"
      >
        <Icon name="ph:square-split-vertical-bold" class="h-[10px] w-[10px]" />
        <span class="font-[var(--font-code)] text-[10px] leading-none">
          <span class="text-[#30d07d]">+836</span>
          <span class="mx-[1px] text-pureWhite/40">-</span>
          <span class="text-[#ef4f5f]">1.068</span>
        </span>
      </button>

      <button
        class="inline-flex h-6 w-6 items-center justify-center appearance-none border-none rounded-[6px] bg-transparent text-pureWhite/56 outline-none transition-colors hover:bg-pureWhite/8"
        @click="emit('togglePip')"
      >
        <Icon :name="isPipEnabled ? 'ph:arrow-square-out-bold' : 'ph:square-bold'" class="h-[10px] w-[10px]" />
      </button>
    </div>
  </header>
</template>
