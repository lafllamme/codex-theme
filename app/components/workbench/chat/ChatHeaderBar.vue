<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'

defineProps<{
  title: string
  repo: string
  runEnabled: boolean
  isTerminalOpen: boolean
  isDiffOpen: boolean
}>()

const emit = defineEmits<{
  toggleRun: []
  toggleTerminal: []
  toggleDiff: []
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
const diffAdded = 836
const diffRemoved = 1068
const animatedDiffAdded = ref(0)
const animatedDiffRemoved = ref(0)
let diffDeltaAnimationScheduled = false
let stopDiffFallback = () => {}

const { start: startDiffReveal, stop: stopDiffReveal } = useTimeoutFn(() => {
  animatedDiffAdded.value = diffAdded
  animatedDiffRemoved.value = diffRemoved
}, 40, { immediate: false })

function scheduleDiffDeltaAnimation() {
  if (diffDeltaAnimationScheduled)
    return
  diffDeltaAnimationScheduled = true
  stopDiffFallback()
  stopDiffReveal()
  startDiffReveal()
}

const fallbackDiffAnimation = useTimeoutFn(
  scheduleDiffDeltaAnimation,
  800,
  { immediate: false },
)
stopDiffFallback = fallbackDiffAnimation.stop
const startDiffFallback = fallbackDiffAnimation.start

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

onMounted(() => {
  // Run if `numberFlowReady` never fires (e.g. failed dynamic import).
  startDiffFallback()
})
</script>

<template>
  <header
    class="chat-header-bar grid grid-cols-[minmax(0,1fr)_auto] h-[38px] items-center gap-2 px-0.5"
  >
    <div
      class="chat-header-left min-w-0 w-full flex items-center gap-1 overflow-hidden"
    >
      <div
        class="chat-header-text-cluster min-h-0 min-w-0 flex flex-1 items-center gap-2 overflow-hidden"
      >
        <div
          class="chat-header-title-repo max-w-full min-h-0 min-w-0 inline-flex items-baseline gap-1.5 overflow-hidden"
        >
          <strong
            class="chat-header-title max-w-[min(100%,42rem)] min-h-0 min-w-0 truncate text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] font-semibold leading-none"
          >{{ title }}</strong>
          <span
            class="chat-header-repo max-w-[min(40%,12rem)] min-h-0 shrink-0 truncate text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-muted)] leading-none"
          >{{ repo }}</span>
        </div>
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
        <Icon name="ph:play-bold" class="size-3" />
      </button>

      <DsEditorSelection
        v-model="selectedEditor"
        class="chat-header-hide-mobile"
        :options="editorOptions"
      />

      <!-- Move to Worktree: hidden for now — not in current Codex chrome; may restore later. -->
      <!--
      <button
        class="chat-header-hide-mobile h-[26px] flex appearance-none items-center gap-1 border border-[color:var(--wb-chip-ghost-border)] rounded-[10px] bg-[var(--wb-chip-ghost-bg)] px-1.5 text-[11.5px] text-[color:var(--wb-text-primary)] leading-none font-[var(--font-ui)] outline-none transition-colors max-[1300px]:hidden hover:bg-[var(--wb-chip-ghost-bg-hover)]"
        @click="emit('openWorktree')"
      >
        <Icon name="ph:arrows-left-right" class="size-5" />
        Move to Worktree
      </button>
      -->

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
          name="mynaui:terminal"
          class="size-4"
        />
      </button>

      <button
        type="button"
        class="chat-header-diff-btn h-7 inline-flex appearance-none items-center gap-2 rounded-[8px] border-none bg-transparent px-1.5 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
        :class="isDiffOpen ? 'text-[color:var(--wb-text-primary)]' : ''"
        aria-label="Toggle side panel"
        @click="emit('toggleDiff')"
      >
        <span
          class="chat-header-diff-delta inline-flex items-baseline gap-1.5 text-[length:var(--wb-ui-text-2xs)] leading-none font-[var(--font-ui)] tabular-nums"
        >
          <span class="text-[color:var(--wb-diff-delta-added)]">
            <DsNumberFlow
              :value="animatedDiffAdded"
              :stable-width-value="diffAdded"
              prefix="+"
              locales="de-DE"
              :transform-timing="{ duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }"
              :spin-timing="{ duration: 1020, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }"
              :opacity-timing="{ duration: 420, easing: 'ease-out' }"
              :will-change="true"
              @number-flow-ready="scheduleDiffDeltaAnimation"
            />
          </span>
          <span class="text-[color:var(--wb-diff-delta-removed)]">
            <DsNumberFlow
              :value="animatedDiffRemoved"
              :stable-width-value="diffRemoved"
              prefix="-"
              locales="de-DE"
              :transform-timing="{ duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }"
              :spin-timing="{ duration: 1020, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }"
              :opacity-timing="{ duration: 420, easing: 'ease-out' }"
              :will-change="true"
            />
          </span>
        </span>
        <span class="relative inline-block size-4 shrink-0" aria-hidden="true">
          <Icon
            name="cuida:sidebar-collapse-outline"
            class="absolute inset-0 size-4 -scale-x-100"
            :class="isDiffOpen ? '' : 'hidden'"
          />
          <Icon
            name="cuida:sidebar-expand-outline"
            class="absolute inset-0 size-4 -scale-x-100"
            :class="isDiffOpen ? 'hidden' : ''"
          />
        </span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.chat-header-left {
  padding-inline-start: var(--wb-header-left-safe-area, 0px);
  transform: translateX(var(--wb-header-title-shift, 0px));
  transition: padding-inline-start 220ms var(--wb-sidebar-ease, cubic-bezier(0.22, 1, 0.36, 1));
}

@container wb-chat-header (max-width: 400px) {
  .chat-header-repo {
    display: none;
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
</style>
