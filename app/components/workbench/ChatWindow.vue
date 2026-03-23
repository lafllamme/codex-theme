<script setup lang="ts">
import type { ChatMessage } from '~/types/workbench-chat'
import { computed } from 'vue'
import ChatHeaderBar from '~/components/workbench/chat/ChatHeaderBar.vue'
import ComposerBar from '~/components/workbench/ComposerBar.vue'
import WorkbenchMainStage from '~/components/workbench/WorkbenchMainStage.vue'

const props = defineProps<{
  title: string
  repo: string
  showHeader?: boolean
  runEnabled: boolean
  isTerminalOpen: boolean
  isDiffOpen: boolean
  isPipEnabled: boolean
  modelOptions: string[]
  thinkingOptions: string[]
  messages: ChatMessage[]
}>()

const emit = defineEmits<{
  toggleRun: []
  toggleTerminal: []
  toggleDiff: []
  togglePip: []
  openGitAction: [action: 'commit' | 'push' | 'branch']
}>()

const laneVars = computed(() => {
  const openInset = 'calc(var(--wb-chat-lane-inset) * 0.15)'

  return {
    '--wb-chat-lane-inset-left': props.isDiffOpen ? openInset : 'var(--wb-chat-lane-inset)',
    '--wb-chat-lane-inset-right': props.isDiffOpen ? openInset : 'var(--wb-chat-lane-inset)',
  }
})

const selectedModel = defineModel<string>('selectedModel', { required: true })
const selectedThinking = defineModel<string>('selectedThinking', { required: true })
const composeValue = defineModel<string>('composeValue', { required: true })
const isWorktreeModalOpen = defineModel<boolean>('worktreeModalOpen', { required: true })
const _worktreeBranch = defineModel<string>('worktreeBranch', { required: true })
</script>

<template>
  <section
    class="wb-chat-window min-h-0 min-w-0 flex flex-1 flex-col"
    :style="laneVars"
    :class="showHeader !== false
      ? 'border border-[color:var(--wb-border-1)] rounded-[28px] bg-[var(--wb-bg-panel)]'
      : 'bg-transparent'"
  >
    <div v-if="showHeader !== false" class="px-[8px] pt-0">
      <ChatHeaderBar
        :title="title"
        :repo="repo"
        :run-enabled="runEnabled"
        :is-terminal-open="isTerminalOpen"
        :is-diff-open="isDiffOpen"
        :is-pip-enabled="isPipEnabled"
        @toggle-run="emit('toggleRun')"
        @toggle-terminal="emit('toggleTerminal')"
        @toggle-diff="emit('toggleDiff')"
        @toggle-pip="emit('togglePip')"
        @open-worktree="isWorktreeModalOpen = true"
        @open-git-action="emit('openGitAction', $event)"
      />
    </div>

    <WorkbenchMainStage :messages="messages" :is-diff-open="isDiffOpen" />

    <div class="[padding-inline-end:var(--wb-chat-lane-inset-right,var(--wb-chat-lane-inset))] [padding-inline-start:var(--wb-chat-lane-inset-left,var(--wb-chat-lane-inset))] mb-[10px] mt-2">
      <ComposerBar
        v-model:selected-model="selectedModel"
        v-model:selected-thinking="selectedThinking"
        v-model:compose-value="composeValue"
        :model-options="modelOptions"
        :thinking-options="thinkingOptions"
      />
    </div>
  </section>
</template>

<style scoped>
.wb-chat-window {
  --wb-chat-lane-inset: 15%;
  --wb-chat-lane-inset-left: var(--wb-chat-lane-inset);
  --wb-chat-lane-inset-right: var(--wb-chat-lane-inset);
}

@media (max-width: 980px) {
  .wb-chat-window {
    --wb-chat-lane-inset: 24px;
    --wb-chat-lane-inset-left: var(--wb-chat-lane-inset);
    --wb-chat-lane-inset-right: var(--wb-chat-lane-inset);
  }
}
</style>
