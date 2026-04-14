<script setup lang="ts">
import type { ChatMessage } from '~/types/workbench-chat'
import { computed } from 'vue'
import ChatHeaderBar from '~/components/workbench/chat/ChatHeaderBar.vue'
import ComposerBar from '~/components/workbench/ComposerBar.vue'
import WorkbenchMainStage from '~/components/workbench/WorkbenchMainStage.vue'
import { useWorkbenchMarketplaceStore } from '~/stores/workbench-marketplace'

const props = defineProps<{
  activeThreadId: string
  title: string
  repo: string
  codeThemeId: string
  showHeader?: boolean
  runEnabled: boolean
  isTerminalOpen: boolean
  isDiffOpen: boolean
  isDiffResizing?: boolean
  chatLaneDesktopInsetLeft?: number | string
  chatLaneDesktopInsetRight?: number | string
  modelOptions: string[]
  thinkingOptions: string[]
  messages: ChatMessage[]
  emptyStateRepo?: string
}>()

const emit = defineEmits<{
  toggleRun: []
  toggleTerminal: []
  toggleDiff: []
  openGitAction: [action: 'commit' | 'push' | 'branch']
}>()

function toCssLength(value: number | string | undefined, fallback: string) {
  if (typeof value === 'number')
    return `${value}px`
  return value ?? fallback
}

const laneVars = computed(() => ({
  '--wb-chat-lane-desktop-inset-left': toCssLength(props.chatLaneDesktopInsetLeft, '180px'),
  '--wb-chat-lane-desktop-inset-right': toCssLength(props.chatLaneDesktopInsetRight, '180px'),
}))

const composerPlaceholder = computed(() =>
  props.messages.length === 0
    ? 'Ask Codex anything, @ to add files, / for commands, $ for skills'
    : 'Ask for follow-up changes',
)

const selectedModel = defineModel<string>('selectedModel', { required: true })
const selectedThinking = defineModel<string>('selectedThinking', { required: true })
const composeValue = defineModel<string>('composeValue', { required: true })
const isWorktreeModalOpen = defineModel<boolean>('worktreeModalOpen', { required: true })
const _worktreeBranch = defineModel<string>('worktreeBranch', { required: true })

const marketplaceStore = useWorkbenchMarketplaceStore()
const { mainStageView } = storeToRefs(marketplaceStore)
const showComposer = computed(() => mainStageView.value !== 'marketplace')
</script>

<template>
  <section
    class="wb-chat-window min-h-0 min-w-0 flex flex-1 flex-col"
    :style="laneVars"
    :class="[
      showHeader !== false
        ? 'border border-[color:var(--wb-border-1)] rounded-[28px] bg-[var(--wb-bg-panel)]'
        : 'bg-transparent',
      isDiffResizing ? 'wb-chat-window--diff-resizing' : '',
    ]"
  >
    <div v-if="showHeader !== false" class="wb-chat-header-wrap relative px-[8px] pt-0">
      <ChatHeaderBar
        :title="title"
        :repo="repo"
        :run-enabled="runEnabled"
        :is-terminal-open="isTerminalOpen"
        :is-diff-open="isDiffOpen"
        @toggle-run="emit('toggleRun')"
        @toggle-terminal="emit('toggleTerminal')"
        @toggle-diff="emit('toggleDiff')"
        @open-worktree="isWorktreeModalOpen = true"
        @open-git-action="emit('openGitAction', $event)"
      />
    </div>

    <WorkbenchMainStage
      :active-thread-id="activeThreadId"
      :messages="messages"
      :code-theme-id="codeThemeId"
      :empty-state-repo="emptyStateRepo ?? repo"
    />

    <div
      v-if="showComposer"
      class="wb-chat-composer-lane [padding-inline-end:var(--wb-chat-lane-inset-right,var(--wb-chat-lane-inset))] [padding-inline-start:var(--wb-chat-lane-inset-left,var(--wb-chat-lane-inset))] mb-[10px] mt-2"
    >
      <ComposerBar
        v-model:selected-model="selectedModel"
        v-model:selected-thinking="selectedThinking"
        v-model:compose-value="composeValue"
        :composer-placeholder="composerPlaceholder"
        :model-options="modelOptions"
        :thinking-options="thinkingOptions"
      />
    </div>
  </section>
</template>

<style scoped>
.wb-chat-window {
  --wb-chat-lane-desktop-inset-left: 180px;
  --wb-chat-lane-desktop-inset-right: 180px;
  --wb-chat-lane-inset-left: var(--wb-chat-lane-desktop-inset-left);
  --wb-chat-lane-inset-right: var(--wb-chat-lane-desktop-inset-right);
}

.wb-chat-header-wrap {
  z-index: 18;
  background: var(--wb-bg-panel);
  box-shadow: 0 10px 20px -18px color-mix(in srgb, var(--wb-text-primary) 58%, transparent);
}

.wb-chat-window :deep(main),
.wb-chat-composer-lane {
  transition:
    padding-inline-start 340ms var(--wb-sidebar-ease, cubic-bezier(0.2, 0.8, 0.2, 1)),
    padding-inline-end 340ms var(--wb-sidebar-ease, cubic-bezier(0.2, 0.8, 0.2, 1));
}

.wb-chat-window--diff-resizing :deep(main),
.wb-chat-window--diff-resizing .wb-chat-composer-lane {
  transition: none;
}

@media (max-width: 980px) {
  .wb-chat-window {
    --wb-chat-lane-inset-left: 24px;
    --wb-chat-lane-inset-right: 24px;
  }
}

@media (max-width: 768px) {
  .wb-chat-window {
    --wb-chat-lane-inset-left: 16px;
    --wb-chat-lane-inset-right: 16px;
  }
}
</style>
