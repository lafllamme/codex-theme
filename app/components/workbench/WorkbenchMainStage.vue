<script setup lang="ts">
interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  text: string
}

defineProps<{
  messages: ChatMessage[]
}>()
</script>

<template>
  <main class="grid grid-rows-[auto_1fr] min-h-0 min-w-0 flex-1 gap-2 px-[12.5%] max-[980px]:px-[20px] pb-[8px] pt-[8px]">
    <div class="flex items-center gap-3 px-1 text-[12px] text-[color:var(--wb-text-faint)]">
      <span class="h-px flex-1 bg-[var(--wb-divider)]" />
      <span class="font-medium">1 previous message</span>
      <span class="h-px flex-1 bg-[var(--wb-divider)]" />
    </div>

    <section class="min-h-0 overflow-y-auto border border-[color:var(--wb-border-1)] rounded-[28px] bg-[var(--wb-bg-panel)] px-0 py-4">
      <div class="flex flex-col gap-3">
        <article
          v-for="message in messages"
          :key="message.id"
          class="max-w-[78%] whitespace-pre-line border rounded-[var(--wb-chat-bubble-radius)] bg-[var(--wb-bubble-bg)] p-[12px_14px] text-[color:var(--wb-text-primary)] leading-[1.45]"
          :class="message.role === 'user' ? 'self-end border-[color:var(--wb-border-3)]' : 'border-[color:var(--wb-border-2)]'"
          :style="message.role === 'user' ? { borderColor: 'color-mix(in srgb, var(--theme-accent) 22%, var(--wb-border-3))' } : undefined"
        >
          {{ message.text }}
        </article>
      </div>
    </section>
  </main>
</template>
