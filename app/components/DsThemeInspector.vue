<script setup lang="ts">
import type { CodexThemePayload, ThemeFieldPath } from '~/types/codex-theme'

const props = defineProps<{
  payload: CodexThemePayload
  codeThemeOptions: string[]
  importValue: string
  importError: string
  exportValue: string
  copyState: 'idle' | 'ok' | 'error'
  activePreset: string
  presetOptions: string[]
}>()

const emit = defineEmits<{
  setField: [path: ThemeFieldPath, value: unknown]
  updateImport: [value: string]
  applyImport: []
  copyTheme: []
  applyPreset: [value: string]
  resetPreset: []
}>()

const onInput = (event: Event, path: ThemeFieldPath) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement | null

  if (!target) return

  if (path === 'theme.contrast') {
    emit('setField', path, Number(target.value))
    return
  }

  if (path === 'theme.opaqueWindows') {
    emit('setField', path, (target as HTMLInputElement).checked)
    return
  }

  if (path === 'theme.fonts.code' || path === 'theme.fonts.ui') {
    emit('setField', path, target.value.trim() || null)
    return
  }

  emit('setField', path, target.value)
}

const onPresetInput = (event: Event) => {
  const target = event.target as HTMLSelectElement | null
  if (!target) return
  emit('applyPreset', target.value)
}

const onImportInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement | null
  if (!target) return
  emit('updateImport', target.value)
}
</script>

<template>
  <section class="inspector-shell border border-white/10 rounded-[16px] bg-black/70 p-3.5 lg:p-4">
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="font-geist-500 text-[10px] text-white/56 tracking-[0.14em] uppercase">
          Theme Inspector
        </p>
        <h2 class="font-geist-700 text-[20px] text-white/92">
          Tokens
        </h2>
      </div>

      <button class="action-chip" @click="emit('resetPreset')">
        Reset
      </button>
    </div>

    <div class="mt-3 grid gap-3">
      <label class="field-row">
        <span>Preset</span>
        <select class="field-input" :value="activePreset" @input="onPresetInput">
          <option v-for="preset in presetOptions" :key="preset" :value="preset">
            {{ preset }}
          </option>
        </select>
      </label>

      <label class="field-row">
        <span>Import codex-theme-v1</span>
        <textarea
          :value="importValue"
          rows="3"
          class="field-input min-h-[76px] resize-y"
          placeholder='codex-theme-v1:{"codeThemeId":"oscurange",...}'
          @input="onImportInput"
        />
        <p v-if="importError" class="text-[12px] text-[var(--un-preset-radix-red10)]">
          {{ importError }}
        </p>
      </label>

      <div class="grid grid-cols-2 gap-2">
        <button class="action-chip justify-center" @click="emit('applyImport')">
          Apply Import
        </button>
        <button class="action-chip action-primary justify-center" @click="emit('copyTheme')">
          {{ copyState === 'ok' ? 'Copied' : 'Copy Export' }}
        </button>
      </div>
    </div>

    <div class="mt-4 grid gap-2 sm:grid-cols-2">
      <label class="field-row">
        <span>Code Theme ID</span>
        <select class="field-input" :value="payload.codeThemeId" @input="onInput($event, 'codeThemeId')">
          <option v-for="option in codeThemeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>

      <label class="field-row">
        <span>Variant</span>
        <select class="field-input" :value="payload.variant" @input="onInput($event, 'variant')">
          <option value="dark">dark</option>
          <option value="light">light</option>
        </select>
      </label>

      <label class="field-row">
        <span>Accent</span>
        <input class="field-input color-input" type="color" :value="payload.theme.accent" @input="onInput($event, 'theme.accent')">
      </label>
      <label class="field-row">
        <span>Surface</span>
        <input class="field-input color-input" type="color" :value="payload.theme.surface" @input="onInput($event, 'theme.surface')">
      </label>
      <label class="field-row">
        <span>Ink</span>
        <input class="field-input color-input" type="color" :value="payload.theme.ink" @input="onInput($event, 'theme.ink')">
      </label>
      <label class="field-row">
        <span>Opaque Windows</span>
        <input class="h-5 w-5 accent-[var(--un-preset-radix-mint10)]" type="checkbox" :checked="payload.theme.opaqueWindows" @input="onInput($event, 'theme.opaqueWindows')">
      </label>

      <label class="field-row col-span-full">
        <span>Contrast {{ payload.theme.contrast }}</span>
        <input class="w-full accent-[var(--un-preset-radix-mint10)]" type="range" min="0" max="100" step="1" :value="payload.theme.contrast" @input="onInput($event, 'theme.contrast')">
      </label>

      <label class="field-row">
        <span>Diff Added</span>
        <input class="field-input color-input" type="color" :value="payload.theme.semanticColors.diffAdded" @input="onInput($event, 'theme.semanticColors.diffAdded')">
      </label>
      <label class="field-row">
        <span>Diff Removed</span>
        <input class="field-input color-input" type="color" :value="payload.theme.semanticColors.diffRemoved" @input="onInput($event, 'theme.semanticColors.diffRemoved')">
      </label>
      <label class="field-row">
        <span>Skill</span>
        <input class="field-input color-input" type="color" :value="payload.theme.semanticColors.skill" @input="onInput($event, 'theme.semanticColors.skill')">
      </label>
      <label class="field-row">
        <span>UI Font</span>
        <input class="field-input" :value="payload.theme.fonts.ui || ''" placeholder="optional" @input="onInput($event, 'theme.fonts.ui')">
      </label>
      <label class="field-row col-span-full">
        <span>Code Font</span>
        <input class="field-input" :value="payload.theme.fonts.code || ''" placeholder="optional" @input="onInput($event, 'theme.fonts.code')">
      </label>
    </div>

    <label class="mt-4 block">
      <span class="font-geist-500 text-[10px] text-white/56 tracking-[0.12em] uppercase">Export</span>
      <textarea class="field-input mt-1.5 min-h-[90px]" :value="exportValue" readonly rows="4" />
      <p class="mt-1 text-[11px] text-white/48">
        Strict output format: codex-theme-v1 JSON only.
      </p>
    </label>
  </section>
</template>

<style scoped>
.inspector-shell {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 18px 30px rgba(0, 0, 0, 0.24);
}

.field-row {
  display: grid;
  gap: 6px;
}

.field-row > span {
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.58);
}

.field-input {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 10px;
  font-size: 13px;
  font-family: var(--font-code);
  color: rgba(255, 255, 255, 0.9);
  outline: none;
}

.field-input:focus {
  border-color: rgba(130, 247, 231, 0.62);
}

.color-input {
  padding: 5px;
  min-height: 36px;
}

.action-chip {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.86);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  font-family: var(--font-ui);
  font-size: 12px;
}

.action-primary {
  border-color: rgba(130, 247, 231, 0.4);
  background: rgba(130, 247, 231, 0.18);
  color: rgba(130, 247, 231, 0.95);
}
</style>
