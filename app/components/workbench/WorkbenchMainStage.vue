<script setup lang="ts">
import type { AssistantBlock, ChatMessage } from '~/types/workbench-chat'
import ChatComponentMention from '~/components/workbench/chat/ChatComponentMention.vue'
import ChatFileChangeCard from '~/components/workbench/chat/ChatFileChangeCard.vue'

defineProps<{
  messages: ChatMessage[]
}>()

const copiedMessageId = ref<string | null>(null)
let copiedResetTimer: ReturnType<typeof setTimeout> | undefined

function blockKey(block: AssistantBlock, index: number) {
  if (block.type === 'text')
    return `text-${index}-${block.text.slice(0, 12)}`
  if (block.type === 'component_mention')
    return `mention-${index}-${block.component}`
  return `change-${index}-${block.summaryLabel}`
}

function blockToPlainText(block: AssistantBlock) {
  if (block.type === 'text')
    return block.text
  if (block.type === 'component_mention')
    return `${block.lead} ${block.component}${block.trail ? ` ${block.trail}` : ''}\n${block.path}`
  return [
    `${block.summaryLabel} +${block.added} -${block.removed}`,
    ...block.files.map(file => `${file.path} +${file.added} -${file.removed}`),
  ].join('\n')
}

function messageToPlainText(message: ChatMessage) {
  if (message.blocks?.length)
    return message.blocks.map(blockToPlainText).join('\n\n')
  return message.text ?? ''
}

async function copyMessage(message: ChatMessage) {
  const payload = messageToPlainText(message).trim()
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
  <main class="grid grid-rows-[auto_1fr] min-h-0 min-w-0 flex-1 gap-2 px-[12.5%] max-[980px]:px-[20px] pb-[8px] pt-[8px]">
    <div class="flex items-center gap-3 px-1 text-[12px] text-[color:var(--wb-text-faint)]">
      <span class="h-px flex-1 bg-[var(--wb-divider)]" />
      <span class="font-medium">1 previous message</span>
      <span class="h-px flex-1 bg-[var(--wb-divider)]" />
    </div>

    <section class="wb-mainstage-scroll min-h-0 overflow-y-auto border border-[color:var(--wb-border-1)] rounded-[28px] bg-[var(--wb-bg-panel)] px-0 py-4">
      <div class="flex flex-col gap-3">
        <div
          v-for="message in messages"
          :key="message.id"
          class="group max-w-[78%] flex flex-col"
          :class="message.role === 'user' ? 'self-end' : ''"
        >
          <article
            class="rounded-[var(--wb-chat-bubble-radius)] p-[12px_14px] text-[color:var(--wb-text-primary)] leading-[1.45]"
            :class="message.role === 'user'
              ? 'border border-[color:var(--wb-border-3)] bg-[var(--wb-bubble-bg)]'
              : 'border-none bg-transparent'"
            :style="message.role === 'user' ? { borderColor: 'color-mix(in srgb, var(--theme-accent) 22%, var(--wb-border-3))' } : undefined"
          >
            <p v-if="message.role === 'user'" class="m-0 whitespace-pre-line">
              {{ message.text }}
            </p>
            <div v-else-if="message.blocks?.length" class="flex flex-col gap-[4px]">
              <template v-for="(block, index) in message.blocks" :key="blockKey(block, index)">
                <p v-if="block.type === 'text'" class="m-0 whitespace-pre-line text-[13px] leading-[1.5]">
                  {{ block.text }}
                </p>
                <ChatComponentMention v-else-if="block.type === 'component_mention'" :block="block" />
                <div v-else-if="block.type === 'file_change_card'" class="my-3">
                  <ChatFileChangeCard :block="block" />
                </div>
              </template>
            </div>
            <p v-else class="m-0 whitespace-pre-line">
              {{ message.text }}
            </p>
          </article>

          <button
            class="mt-1.5 inline-flex w-fit items-center gap-1 rounded-[8px] border-none bg-transparent px-1.5 py-1 text-[11px] text-[color:var(--wb-text-muted)] outline-none transition-[opacity,background-color,color] duration-150 hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
            :class="copiedMessageId === message.id ? 'opacity-100' : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'"
            @click="copyMessage(message)"
          >
            <Icon :name="copiedMessageId === message.id ? 'ph:check-bold' : 'ph:copy'" class="h-[13px] w-[13px]" />
            <span class="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-150 group-hover:max-w-[48px] group-hover:opacity-100">
              Copy
            </span>
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
