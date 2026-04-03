<script setup lang="ts">
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
  openWorktree: []
  openGitAction: [action: 'commit' | 'push' | 'branch']
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
const selectedEditor = ref(
  editorOptions.find(option => option.label === 'Zed')?.label
  ?? editorOptions[0]?.label
  ?? 'Zed',
)

const commitActionMap: Record<string, CommitAction[]> = {
  commit: [
    { key: 'commit', label: 'Commit', icon: 'ph:git-commit' },
    { key: 'push', label: 'Push', icon: 'stash:cloud-arrow-up' },
    {
      key: 'pr',
      label: 'Create PR',
      icon: 'mdi:github-circle',
      disabled: true,
    },
    { key: 'branch', label: 'Create branch', icon: 'ph:git-branch' },
  ],
  push: [
    { key: 'push', label: 'Push', icon: 'stash:cloud-arrow-up' },
    { key: 'commit', label: 'Commit', icon: 'ph:git-commit' },
    {
      key: 'pr',
      label: 'Create PR',
      icon: 'mdi:github-circle',
      disabled: true,
    },
    { key: 'branch', label: 'Create branch', icon: 'ph:git-branch' },
  ],
  branch: [
    { key: 'branch', label: 'Create branch', icon: 'ph:git-branch' },
    { key: 'commit', label: 'Commit', icon: 'ph:git-commit' },
    { key: 'push', label: 'Push', icon: 'ph:cloud-arrow-up-bold' },
    {
      key: 'pr',
      label: 'Create PR',
      icon: 'mdi:github-circle',
      disabled: true,
    },
  ],
  pr: [
    {
      key: 'pr',
      label: 'Create PR',
      icon: 'mdi:github-circle',
      disabled: true,
    },
    { key: 'commit', label: 'Commit', icon: 'ph:git-commit' },
    { key: 'push', label: 'Push', icon: 'ph:cloud-arrow-up-bold' },
    { key: 'branch', label: 'Create branch', icon: 'ph:git-branch' },
  ],
}

const selectedCommitAction = ref('commit')

const commitOptions = computed(() => {
  return (
    commitActionMap[selectedCommitAction.value] ?? commitActionMap.commit
  )
})

const commitMenuTitle = 'Git Actions'

function handleCommitPrimaryAction(actionKey: string) {
  if (
    actionKey === 'commit'
    || actionKey === 'push'
    || actionKey === 'branch'
  ) {
    emit('openGitAction', actionKey)
  }
}
</script>

<template>
  <header
    class="chat-header-bar grid grid-cols-[minmax(0,1fr)_auto] h-[38px] items-center gap-2 px-0.5"
  >
    <div
      class="chat-header-left min-w-0 inline-flex items-center gap-1 overflow-hidden"
    >
      <div class="min-w-0 inline-flex items-center gap-3 overflow-hidden">
        <strong
          class="chat-header-title min-w-0 truncate text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] font-semibold leading-none"
        >{{ title }}</strong>
        <span
          class="chat-header-repo min-w-0 truncate text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-muted)] leading-none"
        >{{ repo }}</span>
      </div>
      <button
        class="chat-header-overflow-btn h-5 w-5 inline-flex shrink-0 appearance-none items-center justify-center rounded-[6px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
      >
        <Icon name="ph:dots-three-bold" class="h-[13px] w-[13px]" />
      </button>
    </div>

    <div class="chat-header-controls inline-flex items-center gap-2">
      <button
        class="h-7 w-7 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="
          runEnabled
            ? 'bg-[var(--wb-chip-ghost-bg-active)] text-[color:var(--wb-text-primary)]'
            : ''
        "
        @click="emit('toggleRun')"
      >
        <Icon name="ph:play-bold" class="size-5" />
      </button>

      <DsEditorSelection
        v-model="selectedEditor"
        class="chat-header-hide-mobile"
        :options="editorOptions"
      />

      <button
        class="chat-header-hide-mobile h-[26px] flex appearance-none items-center gap-1 border border-[color:var(--wb-chip-ghost-border)] rounded-[10px] bg-[var(--wb-chip-ghost-bg)] px-1.5 text-[11.5px] text-[color:var(--wb-text-primary)] leading-none font-[var(--font-ui)] outline-none transition-colors max-[1300px]:hidden hover:bg-[var(--wb-chip-ghost-bg-hover)]"
        @click="emit('openWorktree')"
      >
        <Icon name="ph:arrows-left-right" class="size-5" />
        Move to Worktree
      </button>

      <DsCommitSelection
        v-model="selectedCommitAction"
        :options="commitOptions"
        :menu-title="commitMenuTitle"
        @primary-action="handleCommitPrimaryAction"
      />

      <span class="chat-header-hide-mobile mx-1 h-[18px] w-px bg-[var(--wb-divider)]" />

      <button
        class="chat-header-hide-mobile h-7 w-7 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="
          isTerminalOpen ? 'text-[color:var(--wb-text-primary)]' : ''
        "
        @click="emit('toggleTerminal')"
      >
        <Icon
          name="hugeicons:computer-terminal-01"
          class="h-[14px] w-[14px]"
        />
      </button>

      <button
        class="chat-header-diff-btn h-7 inline-flex appearance-none items-center gap-[6px] rounded-[8px] border-none bg-transparent px-1.5 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="isDiffOpen ? 'text-[color:var(--wb-text-primary)]' : ''"
        @click="emit('toggleDiff')"
      >
        <Icon
          name="hugeicons:plus-minus-square-01"
          class="h-[14px] w-[14px]"
        />
        <span
          class="chat-header-diff-delta text-[length:var(--wb-ui-text-2xs)] leading-none font-[var(--font-ui)] tabular-nums"
        >
          <span class="text-[color:var(--wb-diff-delta-added)]">+836</span>
          <span class="mx-[1px] text-[color:var(--wb-text-muted)]">-</span>
          <span class="text-[color:var(--wb-diff-delta-removed)]">1.068</span>
        </span>
      </button>

      <button
        class="chat-header-hide-mobile h-7 w-7 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
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

.chat-header-left {
  padding-inline-start: var(--wb-header-left-safe-area, 0px);
  transform: translateX(var(--wb-header-title-shift, 0px));
  transition:
    transform 260ms var(--wb-sidebar-ease, cubic-bezier(0.22, 1, 0.36, 1)),
    padding-inline-start 220ms var(--wb-sidebar-ease, cubic-bezier(0.22, 1, 0.36, 1));
}

.chat-header-repo {
  max-width: min(24vw, 260px);
}

@media (max-width: 1180px) {
  .chat-header-title {
    max-width: min(50vw, 380px);
  }

  .chat-header-repo {
    max-width: min(30vw, 190px);
  }
}

@media (max-width: 768px) {
  .chat-header-bar {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 6px;
    min-height: 36px;
    height: 36px;
    padding-inline: 2px;
  }

  .chat-header-left {
    gap: 4px;
  }

  .chat-header-title {
    max-width: min(48vw, 220px);
  }

  .chat-header-controls {
    gap: 4px;
  }

  .chat-header-hide-mobile,
  .chat-header-overflow-btn,
  .chat-header-diff-delta {
    display: none !important;
  }

  .chat-header-diff-btn {
    width: 28px;
    min-width: 28px;
    padding-inline: 0;
    justify-content: center;
    gap: 0;
  }
}

@media (max-width: 640px) {
  .chat-header-repo {
    display: none;
  }

  .chat-header-title {
    max-width: min(56vw, 208px);
  }
}
</style>
