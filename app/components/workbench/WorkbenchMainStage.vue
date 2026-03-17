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
  <main class="grid min-h-0 min-w-0 flex-1 grid-rows-[auto_1fr] gap-2 px-2 pt-2 pb-1">
    <div class="flex items-center gap-3 px-1 text-[12px] text-pureWhite/48">
      <span class="h-px flex-1 bg-pureWhite/10" />
      <span class="font-medium">1 previous message</span>
      <span class="h-px flex-1 bg-pureWhite/10" />
    </div>

    <section class="min-h-0 overflow-y-auto rounded-[var(--wb-r-md)] border border-[var(--wb-border-1)] bg-[color-mix(in_srgb,var(--theme-surface)_91%,black_9%)] p-[12px_14px]">
      <div class="flex flex-col gap-3">
        <article
          v-for="message in messages"
          :key="message.id"
          class="max-w-[78%] whitespace-pre-line rounded-[12px] border border-[var(--wb-border-2)] p-[12px_14px] leading-[1.45]"
          :class="message.role === 'user' ? 'self-end bg-pureWhite/2' : 'bg-pureWhite/4'"
          :style="message.role === 'user' ? { borderColor: 'color-mix(in srgb, var(--theme-accent) 42%, rgba(255, 255, 255, 0.14))' } : undefined"
        >
          {{ message.text }}
        </article>
      </div>
    </section>
  </main>
</template>
