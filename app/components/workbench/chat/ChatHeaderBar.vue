<script setup lang="ts">
defineProps<{
  title: string
  repo: string
  isSidebarCollapsed: boolean
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
  openWorktree: []
  openGitAction: [action: 'commit' | 'push']
}>()

interface CommitAction {
  key: string
  label: string
  icon: string
  disabled?: boolean
}

const editorOptions = [
  { label: 'Cursor', icon: 'simple-icons:cursor' },
  { label: 'Zed', icon: 'simple-icons:zedindustries' },
  { label: 'Windsurf', icon: 'simple-icons:windsurf' },
  { label: 'Finder', icon: 'ph:folder-simple-fill' },
  { label: 'Terminal', icon: 'simple-icons:gnometerminal' },
  { label: 'Ghostty', icon: 'simple-icons:ghostty' },
  { label: 'Xcode', icon: 'simple-icons:xcode' },
  { label: 'Android Studio', icon: 'simple-icons:androidstudio' },
  { label: 'IntelliJ IDEA', icon: 'simple-icons:intellijidea' },
]
const selectedEditor = ref(editorOptions[0]?.label ?? 'Cursor')

const commitActionMap: Record<string, CommitAction[]> = {
  commit: [
    { key: 'commit', label: 'Commit', icon: 'ph:git-commit' },
    { key: 'push', label: 'Push', icon: 'ph:cloud-arrow-up-bold' },
    { key: 'pr', label: 'Create PR', icon: 'ph:github-logo-fill', disabled: true },
    { key: 'branch', label: 'Create branch', icon: 'ph:git-branch-bold' },
  ],
  push: [
    { key: 'push', label: 'Push', icon: 'ph:cloud-arrow-up-bold' },
    { key: 'commit', label: 'Commit', icon: 'ph:git-commit' },
    { key: 'pr', label: 'Create PR', icon: 'ph:github-logo-fill', disabled: true },
    { key: 'branch', label: 'Create branch', icon: 'ph:git-branch-bold' },
  ],
  branch: [
    { key: 'branch', label: 'Create branch', icon: 'ph:git-branch-bold' },
    { key: 'commit', label: 'Commit', icon: 'ph:git-commit' },
    { key: 'push', label: 'Push', icon: 'ph:cloud-arrow-up-bold' },
    { key: 'pr', label: 'Create PR', icon: 'ph:github-logo-fill', disabled: true },
  ],
  pr: [
    { key: 'pr', label: 'Create PR', icon: 'ph:github-logo-fill', disabled: true },
    { key: 'commit', label: 'Commit', icon: 'ph:git-commit' },
    { key: 'push', label: 'Push', icon: 'ph:cloud-arrow-up-bold' },
    { key: 'branch', label: 'Create branch', icon: 'ph:git-branch-bold' },
  ],
}

const selectedCommitAction = ref('commit')

const commitOptions = computed(() => {
  return commitActionMap[selectedCommitAction.value] ?? commitActionMap.commit
})

const commitMenuTitle = 'Git Actions'

function handleCommitPrimaryAction(actionKey: string) {
  if (actionKey === 'commit' || actionKey === 'push')
    emit('openGitAction', actionKey)
}
</script>

<template>
  <header
    class="chat-header-bar grid grid-cols-[minmax(0,1fr)_auto] h-[42px] items-center gap-2 px-1"
    :class="isSidebarCollapsed ? 'chat-header-bar--collapsed' : 'chat-header-bar--expanded'"
  >
    <div class="chat-header-left min-w-0 inline-flex items-center gap-1 overflow-hidden">
      <div class="min-w-0 inline-flex items-center gap-1 overflow-hidden">
        <strong class="chat-header-title min-w-0 truncate text-[13px] text-[color:var(--wb-text-primary)] font-semibold leading-none">{{ title }}</strong>
        <span class="chat-header-repo min-w-0 truncate text-[13px] text-[color:var(--wb-text-muted)] leading-none">{{ repo }}</span>
      </div>
      <button class="h-5 w-5 inline-flex shrink-0 appearance-none items-center justify-center rounded-[6px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]">
        <Icon name="ph:dots-three-bold" class="h-[13px] w-[13px]" />
      </button>
    </div>

    <div class="chat-header-controls inline-flex items-center gap-1">
      <button
        class="h-7 w-7 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="runEnabled ? 'bg-[var(--wb-hover-bg-strong)] text-[color:var(--wb-text-primary)]' : ''"
        @click="emit('toggleRun')"
      >
        <Icon name="ph:play-bold" class="h-[14px] w-[14px]" />
      </button>

      <DsEditorSelection v-model="selectedEditor" :options="editorOptions" />

      <button class="h-8 inline-flex appearance-none items-center gap-1 border border-[color:var(--wb-border-2)] rounded-[11px] bg-[var(--wb-chip-bg)] px-2 text-[11px] text-[color:var(--wb-text-primary)] font-[var(--font-ui)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--wb-border-2)_38%,transparent)_inset] outline-none transition-colors max-[1300px]:hidden hover:bg-[var(--wb-hover-bg-strong)]" @click="emit('openWorktree')">
        <Icon name="ph:arrows-left-right" class="h-[14px] w-[14px]" />
        Move to Worktree
      </button>

      <DsCommitSelection
        v-model="selectedCommitAction"
        :options="commitOptions"
        :menu-title="commitMenuTitle"
        @primary-action="handleCommitPrimaryAction"
      />

      <span class="mx-[3px] h-[18px] w-px bg-[var(--wb-divider)]" />

      <button
        class="h-7 w-7 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="isTerminalOpen ? 'text-[color:var(--wb-text-primary)]' : ''"
        @click="emit('toggleTerminal')"
      >
        <Icon name="hugeicons:computer-terminal-01" class="h-[14px] w-[14px]" />
      </button>

      <button
        class="h-7 inline-flex appearance-none items-center gap-[6px] rounded-[8px] border-none bg-transparent px-1.5 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="isDiffOpen ? 'text-[color:var(--wb-text-primary)]' : ''"
        @click="emit('toggleDiff')"
      >
        <Icon name="hugeicons:plus-minus-square-01" class="h-[14px] w-[14px]" />
        <span class="text-[11px] leading-none font-[var(--font-ui)] tabular-nums">
          <span class="text-[color:var(--wb-diff-delta-added)]">+836</span>
          <span class="mx-[1px] text-[color:var(--wb-text-muted)]">-</span>
          <span class="text-[color:var(--wb-diff-delta-removed)]">1.068</span>
        </span>
      </button>

      <button
        class="h-7 w-7 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        @click="emit('togglePip')"
      >
        <Icon name="hugeicons:copy-02" class="h-[14px] w-[14px]" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.chat-header-title {
  max-width: min(44vw, 540px);
}

.chat-header-repo {
  max-width: min(24vw, 260px);
}

.chat-header-bar--collapsed .chat-header-title {
  max-width: min(28vw, 320px);
}

.chat-header-bar--collapsed .chat-header-repo {
  max-width: min(11vw, 124px);
}

.chat-header-bar--expanded {
  padding-left: 4px;
  transition: padding-left 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.chat-header-bar--collapsed {
  padding-left: 18px;
  transition: padding-left 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (max-width: 1180px) {
  .chat-header-title {
    max-width: min(50vw, 380px);
  }

  .chat-header-repo {
    max-width: min(30vw, 190px);
  }

  .chat-header-bar--collapsed .chat-header-title {
    max-width: min(39vw, 250px);
  }

  .chat-header-bar--collapsed .chat-header-repo {
    max-width: min(19vw, 92px);
  }

  .chat-header-bar--expanded {
    padding-left: 2px;
  }

  .chat-header-bar--collapsed {
    padding-left: 12px;
  }
}
</style>
