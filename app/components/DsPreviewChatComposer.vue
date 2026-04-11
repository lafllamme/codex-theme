<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

defineProps<{
  payload: CodexThemePayload
}>()
</script>

<template>
  <section class="preview-shell">
    <header class="preview-header">
      <p>Chat Composer</p>
      <p class="font-geist-mono-400 text-white/54 text-[11px]">
        GPT-5.3-Codex · Mittel
      </p>
    </header>

    <div class="chat-body" :style="{ background: payload.theme.surface }">
      <article class="msg-row">
        <span class="avatar" :style="{ background: payload.theme.semanticColors.skill }">A</span>
        <div class="msg-bubble" :style="{ color: payload.theme.ink }">
          Generated a codex-like workbench with live preview.
        </div>
      </article>

      <article class="msg-row justify-end">
        <div class="msg-bubble user" :style="{ color: payload.theme.ink, borderColor: `${payload.theme.accent}55` }">
          Compare diff colors and terminal readability.
        </div>
      </article>

      <div class="composer" :style="{ borderColor: `${payload.theme.accent}55` }">
        <input
          class="composer-input"
          type="text"
          value="Ask Codex anything, @ to add files, / for commands, $ for skills"
          readonly
          :style="{ color: payload.theme.ink }"
        >
        <button class="send-btn" :style="{ background: payload.theme.accent }">
          <Icon name="ph:arrow-up-bold" class="text-black h-4 w-4" />
        </button>
      </div>

      <div class="composer-footer">
        <div class="footer-left">
          <button class="footer-icon">
            <Icon name="ph:paperclip-bold" class="h-3.5 w-3.5" />
          </button>
          <button class="footer-icon">
            <Icon name="ph:sparkle-bold" class="h-3.5 w-3.5" />
          </button>
          <span class="footer-label">Lokal</span>
        </div>
        <div class="footer-right">
          <span class="footer-label">Mittel</span>
          <button class="footer-icon">
            <Icon name="ph:microphone-bold" class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preview-shell {
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  background: rgba(5, 6, 7, 0.92);
  overflow: hidden;
  backdrop-filter: blur(22px);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  padding: 10px 12px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.chat-body {
  min-height: 184px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.msg-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.84);
}

.msg-bubble {
  max-width: 85%;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 8px 10px;
  font-family: var(--font-ui);
  font-size: 13px;
  line-height: 1.4;
}

.msg-bubble.user {
  background: rgba(255, 255, 255, 0.01);
}

.composer {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.38);
  padding: 6px 6px 6px 10px;
}

.composer-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-ui);
  font-size: 13px;
}

.send-btn {
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left,
.footer-right {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.footer-icon {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.72);
}

.footer-label {
  font-size: 11px;
  font-family: var(--font-ui);
  color: rgba(255, 255, 255, 0.56);
}
</style>
