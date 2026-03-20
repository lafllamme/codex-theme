<script setup lang="ts">
import type { AssistantBlock, ChatMessage } from '~/types/workbench-chat'
import ChatComponentMention from '~/components/workbench/chat/ChatComponentMention.vue'
import ChatFileChangeCard from '~/components/workbench/chat/ChatFileChangeCard.vue'

defineProps<{
  messages: ChatMessage[]
}>()

function blockKey(block: AssistantBlock, index: number) {
  if (block.type === 'text')
    return `text-${index}-${block.text.slice(0, 12)}`
  if (block.type === 'component_mention')
    return `mention-${index}-${block.component}`
  return `change-${index}-${block.summaryLabel}`
}
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
        <article
          v-for="message in messages"
          :key="message.id"
          class="max-w-[78%] rounded-[var(--wb-chat-bubble-radius)] p-[12px_14px] text-[color:var(--wb-text-primary)] leading-[1.45]"
          :class="message.role === 'user'
            ? 'self-end border border-[color:var(--wb-border-3)] bg-[var(--wb-bubble-bg)]'
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
              <div v-else-if="block.type === 'file_change_card'" class="my-2">
                <ChatFileChangeCard :block="block" />
              </div>
            </template>
          </div>
          <p v-else class="whitespace-pre-line">
            {{ message.text }}
          </p>
        </article>
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
