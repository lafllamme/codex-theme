<script setup lang="ts">
import ChatHeaderBar from '~/components/workbench/chat/ChatHeaderBar.vue'
import ComposerBar from '~/components/workbench/ComposerBar.vue'
import WorkbenchMainStage from '~/components/workbench/WorkbenchMainStage.vue'

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  text: string
}

defineProps<{
  title: string
  repo: string
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
}>()

const selectedModel = defineModel<string>('selectedModel', { required: true })
const selectedThinking = defineModel<string>('selectedThinking', { required: true })
const composeValue = defineModel<string>('composeValue', { required: true })
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col rounded-[var(--wb-r-lg)] border border-[var(--wb-border-1)] bg-[var(--wb-panel-bg-1)]">
    <div class="px-[7px] pt-[7px]">
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
      />
    </div>

    <WorkbenchMainStage :messages="messages" />

    <ComposerBar
      v-model:selected-model="selectedModel"
      v-model:selected-thinking="selectedThinking"
      v-model:compose-value="composeValue"
      :model-options="modelOptions"
      :thinking-options="thinkingOptions"
      class="mx-[7px] mt-1 mb-[7px]"
    />
  </section>
</template>
