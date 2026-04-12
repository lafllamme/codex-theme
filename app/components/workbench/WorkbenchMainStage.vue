<script setup lang="ts">
import type { AssistantBlock, ChatMessage } from '~/types/workbench-chat'
import DsMessageHeader from '~/components/DsMessageHeader.vue'
import ChatComponentMention from '~/components/workbench/chat/ChatComponentMention.vue'
import ChatFileChangeCard from '~/components/workbench/chat/ChatFileChangeCard.vue'
import WorkbenchEmptyState from '~/components/workbench/chat/WorkbenchEmptyState.vue'
import ChatWorkbenchDemoMessage from '~/components/workbench/chat/ChatWorkbenchDemoMessage.vue'
import { useDiffStore } from '~/stores/diff'
import { chatMessageToPlainText } from '~/utils/workbench-chat-plain-text'

const props = defineProps<{
  activeThreadId: string
  messages: ChatMessage[]
  codeThemeId: string
  isDiffOpen?: boolean
  emptyStateRepo?: string
}>()

const diffStore = useDiffStore()
const copiedMessageId = ref<string | null>(null)
let copiedResetTimer: ReturnType<typeof setTimeout> | undefined
const previousMessageMeta = computed(() => diffStore.previousMessageMeta(props.activeThreadId))
const previousMessageExpanded = computed({
  get: () => diffStore.isPreviousMessageExpanded(props.activeThreadId),
  set: (next: boolean) => {
    const current = diffStore.isPreviousMessageExpanded(props.activeThreadId)
    if (next !== current)
      diffStore.togglePreviousMessage(props.activeThreadId)
  },
})
const previousMessageLabel = computed(() => {
  const count = previousMessageMeta.value.count
  return `${count} previous message${count === 1 ? '' : 's'}`
})

function blockKey(block: AssistantBlock, index: number) {
  if (block.type === 'text')
    return `text-${index}-${block.text.slice(0, 12)}`
  if (block.type === 'component_mention')
    return `mention-${index}-${block.component}`
  return `change-${index}-${block.summaryLabel}`
}

function firstFileChangeCardIndex(message: ChatMessage) {
  if (!message.blocks?.length)
    return -1
  return message.blocks.findIndex(block => block.type === 'file_change_card')
}

function hasInlineCopyBeforeCard(message: ChatMessage) {
  const firstCardIndex = firstFileChangeCardIndex(message)
  return message.role === 'assistant' && firstCardIndex > 0
}

async function copyMessage(message: ChatMessage) {
  const payload = chatMessageToPlainText(message).trim()
  if (!payload)
    return
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload)
      copiedMessageId.value = message.id
      if (copiedResetTimer)
        clearTimeout(copiedResetTimer)
      copiedResetTimer = setTimeout(() => {
        copiedMessageId.value = null
      }, 2200)
    }
  }
  catch {
    copiedMessageId.value = null
  }
}

onBeforeUnmount(() => {
  if (copiedResetTimer)
    clearTimeout(copiedResetTimer)
})
</script>

<template>
  <main
    class="[padding-inline-end:var(--wb-chat-lane-inset-right,var(--wb-chat-lane-inset))] [padding-inline-start:var(--wb-chat-lane-inset-left,var(--wb-chat-lane-inset))] grid min-h-0 min-w-0 flex-1 gap-2 pb-[8px] pt-[8px]"
    :class="messages.length > 0 ? 'grid-rows-[1fr]' : 'grid-rows-[minmax(0,1fr)]'"
  >
    <section class="wb-mainstage-scroll relative min-h-0 overflow-x-auto overflow-y-auto rounded-[28px] border-none bg-[var(--wb-bg-panel)] px-0 py-4">
      <WorkbenchEmptyState v-if="messages.length === 0" :repo="props.emptyStateRepo" />

      <div
        v-else
        class="[transition-timing-function:var(--wb-sidebar-ease)] flex flex-col transform-gpu gap-3 transition-[transform,opacity] duration-220"
        :class="props.isDiffOpen ? 'opacity-[0.985] translate-x-[-1px]' : 'opacity-100 translate-x-0'"
      >
        <DsMessageHeader
          v-model:expanded="previousMessageExpanded"
          :title="previousMessageLabel"
          :content="previousMessageMeta.details"
        />

        <div
          v-for="message in messages"
          :key="message.id"
          class="group flex flex-col"
          :class="message.role === 'user' ? 'max-w-[78%] self-end' : 'w-full max-w-none self-start'"
        >
          <article
            class="rounded-[var(--wb-chat-bubble-radius)] p-[12px_14px] text-[length:var(--wb-chat-message-size)] text-[color:var(--wb-text-primary)] leading-[1.45]"
            :class="message.role === 'user'
              ? 'border border-[color:var(--wb-border-3)] bg-[var(--wb-bubble-bg)]'
              : 'border-none bg-transparent'"
            :style="message.role === 'user' ? { borderColor: 'color-mix(in srgb, var(--theme-accent) 22%, var(--wb-border-3))' } : undefined"
          >
            <p v-if="message.role === 'user'" class="m-0 whitespace-pre-line">
              {{ message.text }}
            </p>
            <ChatWorkbenchDemoMessage
              v-else-if="message.role === 'assistant' && message.workbenchDemo"
              :message="message"
              :code-theme-id="codeThemeId"
            />
            <div v-else-if="message.blocks?.length" class="flex flex-col gap-1.5">
              <template v-for="(block, index) in message.blocks" :key="blockKey(block, index)">
                <p v-if="block.type === 'text'" class="m-0 max-w-[min(78ch,100%)] whitespace-pre-line leading-[1.5]">
                  {{ block.text }}
                </p>
                <div v-else-if="block.type === 'component_mention'" class="max-w-[min(78ch,100%)]">
                  <ChatComponentMention :block="block" />
                </div>
                <div v-else-if="block.type === 'file_change_card'" class="mt-3">
                  <button
                    v-if="index === firstFileChangeCardIndex(message)"
                    class="pointer-events-none w-fit inline-flex items-center rounded-[8px] border-none bg-transparent px-1.5 py-1 text-[length:var(--wb-ui-text-2xs)] text-[color:var(--wb-text-muted)] opacity-0 outline-none transition-[opacity,background-color,color] duration-150 group-hover:pointer-events-auto hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)] group-hover:opacity-100"
                    @click="copyMessage(message)"
                  >
                    <Icon :name="copiedMessageId === message.id ? 'ph:check-bold' : 'ph:copy'" class="h-[13px] w-[13px]" />
                  </button>
                  <ChatFileChangeCard class="my-1.5 w-full" :block="block" :code-theme-id="codeThemeId" />
                </div>
              </template>
            </div>
            <p
              v-else
              class="m-0 whitespace-pre-line"
              :class="message.role === 'assistant' ? 'max-w-[min(78ch,100%)]' : ''"
            >
              {{ message.text }}
            </p>
          </article>

          <button
            v-if="!hasInlineCopyBeforeCard(message)"
            class="pointer-events-none w-fit inline-flex items-center gap-1 rounded-[8px] border-none bg-transparent px-1.5 py-1 text-[length:var(--wb-ui-text-2xs)] text-[color:var(--wb-text-muted)] opacity-0 outline-none transition-[opacity,background-color,color] duration-150 group-hover:pointer-events-auto hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)] group-hover:opacity-100"
            :class="[
              message.role === 'user' ? 'self-end' : 'self-start',
              message.role === 'user' ? 'mt-0.5' : 'mt-0',
            ]"
            @click="copyMessage(message)"
          >
            <Icon :name="copiedMessageId === message.id ? 'ph:check-bold' : 'ph:copy'" class="h-[13px] w-[13px]" />
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.wb-mainstage-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.wb-mainstage-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
</style>
