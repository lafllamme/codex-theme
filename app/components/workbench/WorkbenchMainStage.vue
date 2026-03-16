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
  <main class="grid h-full min-h-[480px] min-w-0 flex-1 grid-rows-[auto_auto_1fr] gap-2 rounded-[var(--wb-r-lg)] border border-[var(--wb-border-1)] bg-[var(--wb-panel-bg-1)] p-2 max-[1180px]:min-h-[420px]">
    <header class="flex justify-end">
      <CommitChip />
    </header>

    <div class="flex items-center gap-3 px-1 text-[12px] text-pureWhite/52">
      <span class="h-px flex-1 bg-pureWhite/10" />
      <span class="font-medium">5m 56s lang bearbeitet</span>
      <span class="h-px flex-1 bg-pureWhite/10" />
    </div>

    <section class="min-h-[380px] rounded-[var(--wb-r-md)] border border-[var(--wb-border-1)] bg-[color-mix(in_srgb,var(--theme-surface)_91%,black_9%)] p-2.5">
      <div class="flex flex-col gap-2.5">
        <article
          v-for="message in messages"
          :key="message.id"
          class="max-w-[84%] whitespace-pre-line rounded-[12px] border border-[var(--wb-border-2)] p-[12px_14px] leading-[1.45]"
          :class="message.role === 'user' ? 'self-end bg-white/[0.02]' : 'bg-white/[0.04]'"
          :style="message.role === 'user' ? { borderColor: 'color-mix(in srgb, var(--theme-accent) 42%, rgba(255, 255, 255, 0.14))' } : undefined"
        >
          {{ message.text }}
        </article>
      </div>
    </section>
  </main>
</template>
