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
  <main class="chat-window">
    <header class="chat-header">
      <button class="commit-pill">
        commit
      </button>
    </header>

    <section class="view-stage">
      <div class="history-view">
        <article
          v-for="message in messages"
          :key="message.id"
          class="chat-bubble"
          :class="message.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--assistant'"
        >
          {{ message.text }}
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.chat-window {
  border: 1px solid var(--wb-border-1);
  border-radius: var(--wb-r-lg);
  background: var(--wb-panel-bg-1);
  padding: 8px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 8px;
  min-height: 480px;
}

.chat-header {
  display: flex;
  justify-content: flex-end;
}

.commit-pill {
  height: 42px;
  padding: 0 16px;
  border-radius: 11px;
  border: 1px solid var(--wb-border-2);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
}

.view-stage {
  border: 1px solid var(--wb-border-1);
  border-radius: var(--wb-r-md);
  background: color-mix(in srgb, var(--theme-surface) 91%, black 9%);
  min-height: 380px;
  padding: 10px;
}

.history-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-bubble {
  max-width: 84%;
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid var(--wb-border-2);
  white-space: pre-line;
  line-height: 1.45;
}

.chat-bubble--assistant {
  background: rgba(255, 255, 255, 0.04);
}

.chat-bubble--user {
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.02);
  border-color: color-mix(in srgb, var(--theme-accent) 42%, rgba(255, 255, 255, 0.14));
}

@media (max-width: 1180px) {
  .chat-window {
    min-height: 420px;
  }
}
</style>
