<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

const props = defineProps<{
  payload: CodexThemePayload
}>()

const diffBg = computed(() => ({
  background: props.payload.theme.surface,
  color: props.payload.theme.ink,
}))
</script>

<template>
  <section class="preview-shell">
    <header class="preview-header">
      <p>Diff</p>
      <p class="font-geist-mono-400 text-white/54 text-[11px]">
        app/components/DsHeader.vue
      </p>
    </header>

    <div class="diff-body" :style="diffBg">
      <div class="diff-line">
        <span class="ln">12</span>
        <span class="code text-white/64">&lt;template&gt;</span>
      </div>
      <div class="diff-line added" :style="{ background: `${payload.theme.semanticColors.diffAdded}24` }">
        <span class="ln">13</span>
        <span class="code" :style="{ color: payload.theme.semanticColors.diffAdded }">+ &lt;NuxtLink to="/themes"&gt;Themes&lt;/NuxtLink&gt;</span>
      </div>
      <div class="diff-line removed" :style="{ background: `${payload.theme.semanticColors.diffRemoved}22` }">
        <span class="ln">14</span>
        <span class="code" :style="{ color: payload.theme.semanticColors.diffRemoved }">- &lt;NuxtLink to="/old.view"&gt;Theme&lt;/NuxtLink&gt;</span>
      </div>
      <div class="diff-line">
        <span class="ln">15</span>
        <span class="code text-white/64">&lt;/template&gt;</span>
      </div>
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

.diff-body {
  min-height: 184px;
  padding: 8px 0;
}

.diff-line {
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
}

.ln {
  font-family: var(--font-code);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.42);
}

.code {
  font-family: var(--font-code);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
