<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

defineProps<{
  payload: CodexThemePayload
  activePreset: string
  presetOptions: string[]
  codeThemeOptions: string[]
  importValue: string
  importError: string
  copyState: 'idle' | 'ok' | 'error'
}>()

const emit = defineEmits<{
  applyPreset: [preset: string]
  setThemeId: [value: string]
  setVariant: [value: 'dark' | 'light']
  setImport: [value: string]
  applyImport: []
  copyExport: []
  resetPreset: []
}>()

function onPresetInput(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  emit('applyPreset', target.value)
}

function onThemeInput(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  emit('setThemeId', target.value)
}

function onVariantInput(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  emit('setVariant', target.value === 'light' ? 'light' : 'dark')
}

function onImportInput(event: Event) {
  const target = event.target as HTMLTextAreaElement | null
  if (!target)
    return
  emit('setImport', target.value)
}
</script>

<template>
  <section class="theme-controls-layer">
    <p class="theme-controls-layer__title">
      INSTALL THEME CONTROLS
    </p>

    <div class="theme-controls-layer__grid">
      <select class="ctrl-input" :value="activePreset" @input="onPresetInput">
        <option v-for="preset in presetOptions" :key="preset" :value="preset">
          {{ preset }}
        </option>
      </select>

      <select class="ctrl-input" :value="payload.codeThemeId" @input="onThemeInput">
        <option v-for="option in codeThemeOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <textarea
        class="ctrl-input ctrl-textarea"
        rows="1"
        :value="importValue"
        placeholder="codex-theme-v1:{&quot;codeThemeId&quot;:&quot;oscurange&quot;,...}"
        @input="onImportInput"
      />

      <select class="ctrl-input" :value="payload.variant" @input="onVariantInput">
        <option value="dark">
          dark
        </option>
        <option value="light">
          light
        </option>
      </select>
    </div>

    <div class="theme-controls-layer__actions">
      <button class="ctrl-btn" @click="emit('applyImport')">
        Apply Import
      </button>
      <button class="ctrl-btn ctrl-btn--accent" @click="emit('copyExport')">
        {{ copyState === 'ok' ? 'Copied' : 'Copy Export' }}
      </button>
      <button class="ctrl-btn" @click="emit('resetPreset')">
        Reset
      </button>
      <span v-if="importError" class="ctrl-error">{{ importError }}</span>
    </div>
  </section>
</template>

<style scoped>
.theme-controls-layer {
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 14px;
  background: rgba(8, 9, 12, 0.82);
  padding: 12px;
}

.theme-controls-layer__title {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.theme-controls-layer__grid {
  margin-top: 10px;
  display: grid;
  gap: 8px;
  grid-template-columns: 170px 170px 1fr 110px;
}

.ctrl-input {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.9);
  padding: 8px 10px;
  font-size: 13px;
  font-family: var(--font-code);
}

.ctrl-textarea {
  min-height: 42px;
  resize: vertical;
}

.theme-controls-layer__actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ctrl-btn {
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.88);
  padding: 7px 12px;
  font-family: var(--font-ui);
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ctrl-btn--accent {
  border-color: rgba(130, 247, 231, 0.44);
  background: rgba(130, 247, 231, 0.16);
  color: rgba(130, 247, 231, 0.95);
}

.ctrl-error {
  color: #ff8b8b;
  font-size: 12px;
}

@media (max-width: 960px) {
  .theme-controls-layer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
