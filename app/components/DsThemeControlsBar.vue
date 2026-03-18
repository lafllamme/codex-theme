<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'
import type { CodexThemePayload } from '~/types/codex-theme'
import { onClickOutside, templateRef, useEventListener, usePreferredReducedMotion } from '@vueuse/core'
import ThemePanelBody from '~/components/theme-controls/ThemePanelBody.vue'

defineProps<{
  payload: CodexThemePayload
  jsonValue: string
  jsonError: string
  copyState: 'idle' | 'ok' | 'error'
  uiFontSize: number
  codeFontSize: number
  translucentSidebar: boolean
  scenarioId: string
  scenarioOptions: Array<{ id: string, label: string }>
  themePresets: ThemePresetEntry[]
  activePresetId: string | null
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
  applyThemePreset: [entry: ThemePresetEntry]
}>()

const MORPH_MS = 380
const prefersReducedMotion = usePreferredReducedMotion()
const reduceMotion = computed(() => prefersReducedMotion.value === 'reduce')

const open = ref(false)
const contentVisible = ref(false)
const panelHeight = ref<number | 'auto'>('auto')

const panelRef = templateRef<HTMLElement>('panelRef')
const contentRef = templateRef<HTMLElement>('contentRef')

function openPanel() {
  if (!import.meta.client)
    return

  open.value = true

  if (reduceMotion.value) {
    contentVisible.value = true
    nextTick(() => {
      panelRef.value?.querySelector<HTMLButtonElement>('.theme-morph__close')?.focus()
    })
    return
  }

  setTimeout(() => {
    contentVisible.value = true
    if (contentRef.value) {
      panelHeight.value = contentRef.value.scrollHeight
    }
    nextTick(() => {
      panelRef.value?.querySelector<HTMLButtonElement>('.theme-morph__close')?.focus()
    })
  }, MORPH_MS + 20)
}

function closePanel() {
  if (!open.value)
    return

  contentVisible.value = false

  if (reduceMotion.value) {
    open.value = false
    panelHeight.value = 'auto'
    return
  }

  setTimeout(() => {
    open.value = false
    panelHeight.value = 'auto'
  }, MORPH_MS)
}


onClickOutside(panelRef, () => {
  if (open.value) {
    closePanel()
  }
})

onMounted(() => {
  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open.value) {
      e.preventDefault()
      closePanel()
    }
  })
})

const morphStyle = computed(() => ({
  borderRadius: open.value ? '1.25rem' : '9999px',
  width: open.value ? 'min(420px, calc(100vw - 3rem))' : '126px',
  height: open.value
    ? (typeof panelHeight.value === 'number' ? `${panelHeight.value}px` : 'auto')
    : '40px',
  maxHeight: open.value ? '85vh' : '40px',
  overflow: 'hidden',
  transition: reduceMotion.value
    ? 'none'
    : `border-radius ${MORPH_MS}ms cubic-bezier(0.4, 0, 0.2, 1), width ${MORPH_MS}ms cubic-bezier(0.4, 0, 0.2, 1), height ${MORPH_MS}ms cubic-bezier(0.4, 0, 0.2, 1), max-height ${MORPH_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
}))
</script>

<template>
  <div class="theme-controls-anchor">
    <!-- Single morphing element: FAB → Panel -->
    <div
      class="fixed z-[10000]"
      style="bottom: max(1.5rem, env(safe-area-inset-bottom, 0px)); right: max(1.5rem, env(safe-area-inset-right, 0px));"
    >
      <div
        id="theme-controls-panel"
        ref="panelRef"
        class="theme-morph-shell relative border shadow-2xl shadow-black/60 text-pureWhite/92 bg-pureBlack border-pureWhite/10"
        :style="morphStyle"
        :role="open ? 'dialog' : undefined"
        :aria-modal="open ? 'true' : undefined"
        :aria-labelledby="open ? 'theme-controls-heading' : undefined"
        :tabindex="open ? -1 : undefined"
      >
        <!-- FAB Label (visible when closed) -->
        <div
          class="fab-label absolute inset-0 flex cursor-pointer select-none items-center justify-center gap-2 transition-opacity"
          :class="open ? 'opacity-0 pointer-events-none' : 'opacity-100'"
          :style="{ transitionDuration: '120ms' }"
          role="button"
          tabindex="0"
          aria-label="Open theme panel"
          @click="openPanel"
          @keydown.enter="openPanel"
        >
          <Icon name="ph:palette-bold" class="size-[15px] shrink-0 text-pureWhite/74" aria-hidden="true" />
          <span class="text-[13px] font-medium text-pureWhite/88">Theme</span>
        </div>

        <!-- Panel Content (visible after morph) -->
        <div
          ref="contentRef"
          class="theme-morph__content flex flex-col transition-opacity"
          :class="contentVisible && open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          :style="{ transitionDuration: '160ms', maxHeight: '85vh' }"
          :aria-hidden="!open"
        >
          <header class="theme-morph__head flex shrink-0 items-center justify-between gap-3 border-b px-5 pb-3 pt-5 font-[var(--font-ui)] border-pureWhite/8">
            <div>
              <p id="theme-controls-heading" class="text-[14px] font-semibold text-pureWhite/95">
                Theme
              </p>
              <p class="mt-0.5 text-[10px] text-pureWhite/40">
                Presets, colors, display, export
              </p>
            </div>
            <button
              type="button"
              class="theme-morph__close h-6 w-6 inline-flex items-center justify-center rounded-full font-[inherit] transition-colors text-pureWhite/50 hover:text-pureWhite hover:bg-pureWhite/10"
              aria-label="Close theme panel"
              @click="closePanel"
            >
              <Icon name="ph:x-bold" class="h-3 w-3" aria-hidden="true" />
            </button>
          </header>

          <div class="[scrollbar-width:thin] min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5 pb-5" style="max-height: calc(85vh - 72px);">
            <ThemePanelBody
              :payload="payload"
              :json-value="jsonValue"
              :json-error="jsonError"
              :copy-state="copyState"
              :ui-font-size="uiFontSize"
              :code-font-size="codeFontSize"
              :translucent-sidebar="translucentSidebar"
              :scenario-id="scenarioId"
              :scenario-options="scenarioOptions"
              :theme-presets="themePresets"
              :active-preset-id="activePresetId"
              @set-json-value="emit('setJsonValue', $event)"
              @export-theme="emit('exportTheme')"
              @copy-export="emit('copyExport')"
              @set-accent="emit('setAccent', $event)"
              @set-surface="emit('setSurface', $event)"
              @set-ink="emit('setInk', $event)"
              @set-diff-added="emit('setDiffAdded', $event)"
              @set-diff-removed="emit('setDiffRemoved', $event)"
              @set-skill="emit('setSkill', $event)"
              @set-ui-font="emit('setUiFont', $event)"
              @set-code-font="emit('setCodeFont', $event)"
              @set-contrast="emit('setContrast', $event)"
              @set-translucent-sidebar="emit('setTranslucentSidebar', $event)"
              @set-ui-font-size="emit('setUiFontSize', $event)"
              @set-code-font-size="emit('setCodeFontSize', $event)"
              @set-scenario="emit('setScenario', $event)"
              @apply-theme-preset="emit('applyThemePreset', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-controls-anchor {
  position: relative;
  width: 0;
  height: 0;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .theme-morph-shell {
    transition: none !important;
  }
}
</style>
