<script setup lang="ts">
import type { CodexThemePayload, ThemeFieldPath } from '~/types/codex-theme'

defineProps<{
  payload: CodexThemePayload
  codeThemeOptions: string[]
  importValue: string
  importError: string
  exportValue: string
  copyState: 'idle' | 'ok' | 'error'
  activePreset: string
  presetOptions: string[]
  presetPayload: CodexThemePayload
}>()

const emit = defineEmits<{
  setField: [path: ThemeFieldPath, value: unknown]
  updateImport: [value: string]
  applyImport: []
  copyTheme: []
  applyPreset: [value: string]
  resetPreset: []
}>()

const uiFontOptions = [
  { label: 'Geist (default)', value: null },
  { label: 'Geist', value: '\'Geist\', ui-sans-serif, system-ui' },
  { label: 'SF Pro / system', value: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', sans-serif' },
]

const codeFontOptions = [
  { label: 'Geist Mono (default)', value: null },
  { label: 'Geist Mono', value: '\'Geist Mono\', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  { label: 'JetBrains Mono', value: '\'JetBrains Mono\', \'Geist Mono\', ui-monospace, monospace' },
]

const colorPresets = {
  accent: ['#F9B98C', '#7BDFF6', '#E7A8FF', '#8CEABF', '#FFC972', '#F5788B'],
  surface: ['#040405', '#06070A', '#0A0B0F', '#0E1117', '#101117', '#0B0B0F'],
  ink: ['#FEFFFF', '#E8EAEE', '#DBDFE8', '#CFD8E6', '#D5E8F7', '#F1F4FA'],
  diffAdded: ['#40C977', '#57D16E', '#66D39E', '#99B52C', '#7FDFA7', '#68C468'],
  diffRemoved: ['#FA423E', '#FF6B87', '#D84A33', '#FF5E6E', '#F06969', '#CC5353'],
  skill: ['#479FFA', '#71B7FF', '#4EA9F2', '#417AB3', '#6FB6D9', '#89A2FF'],
} as const

function onInput(event: Event, path: ThemeFieldPath) {
  const target = event.target as HTMLInputElement | HTMLSelectElement | null
  if (!target)
    return

  if (path === 'theme.contrast') {
    emit('setField', path, Number(target.value))
    return
  }

  if (path === 'theme.opaqueWindows') {
    emit('setField', path, (target as HTMLInputElement).checked)
    return
  }

  emit('setField', path, target.value)
}

function onPresetInput(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  emit('applyPreset', target.value)
}

function onImportInput(event: Event) {
  const target = event.target as HTMLTextAreaElement | null
  if (!target)
    return
  emit('updateImport', target.value)
}
</script>

<template>
  <section class="inspector-shell p-3.5 lg:p-4">
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="font-geist-500 text-white/58 text-[10px] tracking-[0.14em] uppercase">
          Theme Inspector
        </p>
        <h2 class="font-geist-700 text-white/92 text-[20px]">
          Tokens
        </h2>
      </div>

      <button class="action-chip" @click="emit('resetPreset')">
        Reset
      </button>
    </div>

    <div class="grid mt-3 gap-3">
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
          class="field-input min-h-[78px] resize-y"
          placeholder="codex-theme-v1:{&quot;codeThemeId&quot;:&quot;oscurange&quot;,...}"
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

    <div class="grid mt-4 gap-2 sm:grid-cols-2">
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

      <DsColorField
        label="Accent"
        :model-value="payload.theme.accent"
        :presets="colorPresets.accent"
        :reset-value="presetPayload.theme.accent"
        @update:model-value="emit('setField', 'theme.accent', $event)"
      />
      <DsColorField
        label="Surface"
        :model-value="payload.theme.surface"
        :presets="colorPresets.surface"
        :reset-value="presetPayload.theme.surface"
        @update:model-value="emit('setField', 'theme.surface', $event)"
      />
      <DsColorField
        label="Ink"
        :model-value="payload.theme.ink"
        :presets="colorPresets.ink"
        :reset-value="presetPayload.theme.ink"
        @update:model-value="emit('setField', 'theme.ink', $event)"
      />

      <label class="field-row">
        <span>Opaque Windows</span>
        <button
          type="button"
          class="toggle-chip"
          :class="payload.theme.opaqueWindows ? 'toggle-chip--on' : ''"
          @click="emit('setField', 'theme.opaqueWindows', !payload.theme.opaqueWindows)"
        >
          <span class="toggle-dot" />
          <span>{{ payload.theme.opaqueWindows ? 'On' : 'Off' }}</span>
        </button>
      </label>

      <label class="field-row col-span-full">
        <span>Contrast {{ payload.theme.contrast }}</span>
        <input class="w-full accent-[var(--un-preset-radix-mint10)]" type="range" min="0" max="100" step="1" :value="payload.theme.contrast" @input="onInput($event, 'theme.contrast')">
      </label>

      <DsColorField
        label="Diff Added"
        :model-value="payload.theme.semanticColors.diffAdded"
        :presets="colorPresets.diffAdded"
        :reset-value="presetPayload.theme.semanticColors.diffAdded"
        @update:model-value="emit('setField', 'theme.semanticColors.diffAdded', $event)"
      />
      <DsColorField
        label="Diff Removed"
        :model-value="payload.theme.semanticColors.diffRemoved"
        :presets="colorPresets.diffRemoved"
        :reset-value="presetPayload.theme.semanticColors.diffRemoved"
        @update:model-value="emit('setField', 'theme.semanticColors.diffRemoved', $event)"
      />
      <DsColorField
        label="Skill"
        :model-value="payload.theme.semanticColors.skill"
        :presets="colorPresets.skill"
        :reset-value="presetPayload.theme.semanticColors.skill"
        @update:model-value="emit('setField', 'theme.semanticColors.skill', $event)"
      />

      <DsFontField
        label="UI Font"
        :model-value="payload.theme.fonts.ui"
        :preset-options="uiFontOptions"
        @update:model-value="emit('setField', 'theme.fonts.ui', $event)"
      />
      <div class="col-span-full">
        <DsFontField
          label="Code Font"
          :model-value="payload.theme.fonts.code"
          :preset-options="codeFontOptions"
          @update:model-value="emit('setField', 'theme.fonts.code', $event)"
        />
      </div>
    </div>

    <label class="mt-4 block">
      <span class="font-geist-500 text-white/56 text-[10px] tracking-[0.12em] uppercase">Export</span>
      <textarea class="field-input mt-1.5 min-h-[90px]" :value="exportValue" readonly rows="4" />
      <p class="text-white/48 mt-1 text-[11px]">
        Strict output format: codex-theme-v1 JSON only.
      </p>
    </label>
  </section>
</template>

<style scoped>
.inspector-shell {
  border: 1px solid var(--panel-border, rgba(255, 255, 255, 0.14));
  border-radius: 16px;
  background: var(--panel-bg, rgba(5, 6, 7, 0.9));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 28px 42px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(var(--panel-blur, 24px));
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

.action-chip {
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.88);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  font-family: var(--font-ui);
  font-size: 12px;
}

.action-primary {
  border-color: rgba(130, 247, 231, 0.5);
  background: rgba(130, 247, 231, 0.24);
  color: rgba(130, 247, 231, 0.97);
}

.toggle-chip {
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.82);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  width: fit-content;
  transition: all 180ms ease;
}

.toggle-chip--on {
  border-color: rgba(130, 247, 231, 0.42);
  background: rgba(130, 247, 231, 0.15);
  color: rgba(130, 247, 231, 0.98);
}

.toggle-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.toggle-chip--on .toggle-dot {
  border-color: rgba(130, 247, 231, 0.75);
  background: rgba(130, 247, 231, 0.9);
}
</style>
