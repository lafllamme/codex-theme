<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

const props = defineProps<{
  payload: CodexThemePayload
}>()

const panelStyle = computed(() => ({
  background: props.payload.theme.surface,
  color: props.payload.theme.ink,
}))
</script>

<template>
  <section class="preview-shell">
    <header class="preview-header">
      <p>Terminal</p>
      <p class="font-geist-mono-400 text-[11px] text-white/54">/Users/flame/Developer/Projects/codex-theme</p>
    </header>

    <div class="terminal-body" :style="panelStyle">
      <p><span class="text-white/56">$</span> pnpm dev</p>
      <p><span :style="{ color: payload.theme.semanticColors.skill }">info</span> Nuxt ready at http://localhost:3000</p>
      <p><span :style="{ color: payload.theme.semanticColors.diffAdded }">+ added</span> app/components/DsThemeInspector.vue</p>
      <p><span :style="{ color: payload.theme.semanticColors.diffRemoved }">- removed</span> old/theme-panel.vue</p>
      <p><span :style="{ color: payload.theme.accent }">accent</span> {{ payload.theme.accent }}</p>
      <p><span class="text-white/56">contrast:</span> {{ payload.theme.contrast }} · opaqueWindows: {{ payload.theme.opaqueWindows }}</p>
    </div>
  </section>
</template>

<style scoped>
.preview-shell {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 12px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.terminal-body {
  min-height: 184px;
  padding: 14px;
  font-family: var(--font-code);
  font-size: 13px;
  line-height: 1.68;
}
</style>
