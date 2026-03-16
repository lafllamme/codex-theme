<script setup lang="ts">
import type { CodexThemePayload } from '~/types/codex-theme'

type ColorField = 'accent' | 'surface' | 'ink' | 'diffAdded' | 'diffRemoved' | 'skill'

const props = defineProps<{
  payload: CodexThemePayload
  jsonValue: string
  jsonError: string
  copyState: 'idle' | 'ok' | 'error'
  uiFontSize: number
  codeFontSize: number
  translucentSidebar: boolean
  scenarioId: string
  scenarioOptions: Array<{ id: string, label: string }>
}>()

const emit = defineEmits<{
  setJsonValue: [value: string]
  exportTheme: []
  copyExport: []
  setAccent: [value: string]
  setSurface: [value: string]
  setInk: [value: string]
  setDiffAdded: [value: string]
  setDiffRemoved: [value: string]
  setSkill: [value: string]
  setUiFont: [value: string]
  setCodeFont: [value: string]
  setContrast: [value: number]
  setTranslucentSidebar: [value: boolean]
  setUiFontSize: [value: number]
  setCodeFontSize: [value: number]
  setScenario: [value: string]
}>()

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i

function normalizeHex(value: string, fallback: string) {
  const next = value.trim()
  if (HEX_COLOR_RE.test(next))
    return next
  return fallback
}

function onHexInput(field: ColorField, event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return

  const next = target.value

  if (field === 'accent')
    emit('setAccent', normalizeHex(next, props.payload.theme.accent))
  if (field === 'surface')
    emit('setSurface', normalizeHex(next, props.payload.theme.surface))
  if (field === 'ink')
    emit('setInk', normalizeHex(next, props.payload.theme.ink))
  if (field === 'diffAdded')
    emit('setDiffAdded', normalizeHex(next, props.payload.theme.semanticColors.diffAdded))
  if (field === 'diffRemoved')
    emit('setDiffRemoved', normalizeHex(next, props.payload.theme.semanticColors.diffRemoved))
  if (field === 'skill')
    emit('setSkill', normalizeHex(next, props.payload.theme.semanticColors.skill))
}

function onColorInput(field: ColorField, event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return

  if (field === 'accent')
    emit('setAccent', target.value)
  if (field === 'surface')
    emit('setSurface', target.value)
  if (field === 'ink')
    emit('setInk', target.value)
  if (field === 'diffAdded')
    emit('setDiffAdded', target.value)
  if (field === 'diffRemoved')
    emit('setDiffRemoved', target.value)
  if (field === 'skill')
    emit('setSkill', target.value)
}

function onJsonInput(event: Event) {
  const target = event.target as HTMLTextAreaElement | null
  if (!target)
    return
  emit('setJsonValue', target.value)
}

function onUiFont(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return
  emit('setUiFont', target.value)
}

function onCodeFont(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return
  emit('setCodeFont', target.value)
}

function onTranslucent(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return
  emit('setTranslucentSidebar', target.checked)
}

function onContrast(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return
  emit('setContrast', Number(target.value))
}

function onUiSize(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return
  emit('setUiFontSize', Number(target.value))
}

function onCodeSize(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target)
    return
  emit('setCodeFontSize', Number(target.value))
}
</script>

<template>
  <section class="appearance-shell">
    <p class="appearance-shell__title">
      THEME CONTROLS
    </p>

    <div class="controls-layout">
      <article class="panel panel-main">
        <header class="panel-header">
          <strong>Appearance</strong>
          <div class="header-actions">
            <button class="action-btn" @click="emit('exportTheme')">
              Export theme
            </button>
            <button class="action-btn" @click="emit('copyExport')">
              {{ copyState === 'ok' ? 'Copied' : 'Copy theme' }}
            </button>
          </div>
        </header>

        <div class="rows">
          <div class="row">
            <label>Scenario</label>
            <div class="chips">
              <button
                v-for="scenario in scenarioOptions"
                :key="scenario.id"
                class="chip"
                :class="scenario.id === scenarioId ? 'chip--active' : ''"
                @click="emit('setScenario', scenario.id)"
              >
                {{ scenario.label }}
              </button>
            </div>
          </div>

          <div class="row">
            <label>UI font</label>
            <input class="text-input" type="text" :value="payload.theme.fonts.ui || ''" placeholder="Geist" @input="onUiFont">
          </div>

          <div class="row">
            <label>Code font</label>
            <input class="text-input" type="text" :value="payload.theme.fonts.code || ''" placeholder="Geist Mono" @input="onCodeFont">
          </div>

          <div class="row">
            <label>Translucent sidebar</label>
            <label class="toggle">
              <input type="checkbox" :checked="translucentSidebar" @change="onTranslucent">
              <span class="toggle__track"><span class="toggle__thumb" /></span>
            </label>
          </div>

          <div class="row">
            <label>Contrast</label>
            <div class="slider-wrap">
              <input class="slider" type="range" min="0" max="100" :value="payload.theme.contrast" @input="onContrast">
              <span>{{ payload.theme.contrast }}</span>
            </div>
          </div>

          <div class="row">
            <label>UI font size</label>
            <div class="size-wrap">
              <input class="size-input" type="number" min="12" max="22" :value="uiFontSize" @input="onUiSize">
              <span>px</span>
            </div>
          </div>

          <div class="row">
            <label>Code font size</label>
            <div class="size-wrap">
              <input class="size-input" type="number" min="12" max="24" :value="codeFontSize" @input="onCodeSize">
              <span>px</span>
            </div>
          </div>
        </div>
      </article>

      <div class="panel-stack">
        <article class="panel panel-colors">
          <header class="panel-header panel-header--simple">
            <strong>Colors</strong>
          </header>

          <div class="rows">
            <div class="row row--compact">
              <label>Accent</label>
              <div class="value-stack color-stack">
                <input class="swatch" type="color" :value="payload.theme.accent" @input="onColorInput('accent', $event)">
                <input class="hex" type="text" :value="payload.theme.accent" @change="onHexInput('accent', $event)">
              </div>
            </div>

            <div class="row row--compact">
              <label>Background</label>
              <div class="value-stack color-stack">
                <input class="swatch" type="color" :value="payload.theme.surface" @input="onColorInput('surface', $event)">
                <input class="hex" type="text" :value="payload.theme.surface" @change="onHexInput('surface', $event)">
              </div>
            </div>

            <div class="row row--compact">
              <label>Foreground</label>
              <div class="value-stack color-stack">
                <input class="swatch" type="color" :value="payload.theme.ink" @input="onColorInput('ink', $event)">
                <input class="hex" type="text" :value="payload.theme.ink" @change="onHexInput('ink', $event)">
              </div>
            </div>

            <div class="row row--compact">
              <label>Diff added</label>
              <div class="value-stack color-stack">
                <input class="swatch" type="color" :value="payload.theme.semanticColors.diffAdded" @input="onColorInput('diffAdded', $event)">
                <input class="hex" type="text" :value="payload.theme.semanticColors.diffAdded" @change="onHexInput('diffAdded', $event)">
              </div>
            </div>

            <div class="row row--compact">
              <label>Diff removed</label>
              <div class="value-stack color-stack">
                <input class="swatch" type="color" :value="payload.theme.semanticColors.diffRemoved" @input="onColorInput('diffRemoved', $event)">
                <input class="hex" type="text" :value="payload.theme.semanticColors.diffRemoved" @change="onHexInput('diffRemoved', $event)">
              </div>
            </div>

            <div class="row row--compact">
              <label>Skill</label>
              <div class="value-stack color-stack">
                <input class="swatch" type="color" :value="payload.theme.semanticColors.skill" @input="onColorInput('skill', $event)">
                <input class="hex" type="text" :value="payload.theme.semanticColors.skill" @change="onHexInput('skill', $event)">
              </div>
            </div>
          </div>
        </article>

        <article class="panel panel-json">
          <header class="panel-header panel-header--simple">
            <strong>Live theme JSON</strong>
          </header>

          <div class="json-body">
            <textarea
              class="json-editor"
              rows="12"
              :value="jsonValue"
              @input="onJsonInput"
            />
            <p v-if="jsonError" class="json-error">
              {{ jsonError }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.appearance-shell {
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.9);
  padding: 12px;
  font-family: var(
    --font-ui,
    'Geist',
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif
  );
}

.appearance-shell__title {
  margin: 0;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.74);
}

.controls-layout {
  margin-top: 10px;
  display: grid;
  grid-template-columns: minmax(520px, 1fr) minmax(420px, 0.82fr);
  gap: 10px;
}

.panel {
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  background: rgba(5, 5, 6, 0.96);
  overflow: hidden;
}

.panel-stack {
  display: grid;
  grid-template-rows: auto minmax(300px, 1fr);
  gap: 10px;
}

.panel-header {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.panel-header strong {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.98);
}

.panel-header--simple {
  justify-content: flex-start;
}

.header-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-btn,
.text-input,
.hex,
.size-input {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(2, 2, 3, 0.95);
  color: rgba(255, 255, 255, 0.98);
  border-radius: 10px;
  font-family: var(
    --font-ui,
    'Geist',
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif
  );
}

.action-btn {
  height: 34px;
  padding: 0 11px;
  font-size: 12px;
}

.rows {
  display: grid;
}

.row {
  min-height: 56px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.row:last-child {
  border-bottom: none;
}

.row--compact {
  min-height: 52px;
}

.row label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.98);
}

.text-input {
  width: 240px;
  height: 36px;
  padding: 0 11px;
  font-size: 14px;
}

.value-stack {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.chips {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.chip {
  height: 30px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(2, 2, 3, 0.95);
  color: rgba(255, 255, 255, 0.92);
  font-size: 12px;
  padding: 0 10px;
}

.chip--active {
  border-color: rgba(255, 182, 112, 0.78);
  box-shadow: 0 0 0 2px rgba(255, 182, 112, 0.2) inset;
}

.color-stack {
  min-width: 250px;
}

.swatch {
  width: 32px;
  height: 32px;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: transparent;
  overflow: hidden;
  cursor: pointer;
}

.swatch::-webkit-color-swatch-wrapper {
  padding: 0;
}

.swatch::-webkit-color-swatch {
  border: none;
  border-radius: 999px;
}

.swatch::-moz-color-swatch {
  border: none;
  border-radius: 999px;
}

.hex {
  width: 150px;
  height: 36px;
  padding: 0 10px;
  font-family: var(--font-code, 'Geist Mono', ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace);
  font-size: 14px;
}

.toggle {
  cursor: pointer;
}

.toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.toggle__track {
  width: 52px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  display: inline-flex;
  align-items: center;
  padding: 3px;
  transition: background-color 180ms ease;
}

.toggle__thumb {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #fefefe;
  transform: translateX(0);
  transition: transform 180ms ease;
}

.toggle input:checked + .toggle__track {
  background: rgba(255, 182, 112, 0.85);
}

.toggle input:checked + .toggle__track .toggle__thumb {
  transform: translateX(21px);
}

.slider-wrap {
  min-width: 300px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.slider {
  width: 220px;
  accent-color: #ffb670;
}

.size-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.size-input {
  width: 76px;
  height: 36px;
  padding: 0 10px;
  text-align: right;
  font-size: 14px;
}

.json-body {
  padding: 10px 12px;
}

.json-editor {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: rgba(1, 1, 1, 0.98);
  color: rgba(255, 255, 255, 0.95);
  padding: 9px 10px;
  font-family: var(--font-code, 'Geist Mono', ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace);
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
  min-height: 240px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  outline: none;
}

.json-error {
  margin: 6px 0 0;
  color: #ff8f8f;
  font-size: 12px;
}

.json-editor:focus,
.text-input:focus,
.hex:focus,
.size-input:focus {
  border-color: rgba(255, 182, 112, 0.78);
  box-shadow: 0 0 0 2px rgba(255, 182, 112, 0.24);
}

@media (max-width: 1320px) {
  .controls-layout {
    grid-template-columns: 1fr;
  }

  .panel-stack {
    grid-template-rows: auto auto;
  }
}

@media (max-width: 900px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .row {
    min-height: 68px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 10px 12px;
  }

  .color-stack,
  .slider-wrap,
  .text-input {
    min-width: 0;
    width: 100%;
  }

  .hex,
  .text-input,
  .slider {
    width: 100%;
  }
}
</style>
