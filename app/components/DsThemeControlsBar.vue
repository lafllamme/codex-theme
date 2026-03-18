<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'
import type { CodexThemePayload } from '~/types/codex-theme'
import { onClickOutside, templateRef, useEventListener } from '@vueuse/core'
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

const open = ref(false)
const contentVisible = ref(false)
const panelHeight = ref<number | 'auto'>('auto')

const panelRef = templateRef<HTMLElement>('panelRef')
const containerRef = templateRef<HTMLElement>('containerRef')

let contentTimer: ReturnType<typeof setTimeout> | null = null

onClickOutside(containerRef, () => {
  if (open.value) {
    open.value = false
  }
})

watch(open, (isOpen) => {
  if (contentTimer) {
    clearTimeout(contentTimer)
    contentTimer = null
  }

  if (isOpen) {
    contentTimer = setTimeout(() => {
      contentVisible.value = true
    }, MORPH_MS + 20)
  }
  else {
    contentVisible.value = false
  }
})

watch([contentVisible, open], ([visible, isOpen]) => {
  if (visible && panelRef.value) {
    panelHeight.value = panelRef.value.scrollHeight
  }
  if (!isOpen) {
    panelHeight.value = 'auto'
  }
})

onBeforeUnmount(() => {
  if (contentTimer) {
    clearTimeout(contentTimer)
  }
})

onMounted(() => {
  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open.value) {
      e.preventDefault()
      open.value = false
    }
  })
})

const morphStyle = computed(() => ({
  transitionProperty: 'border-radius, width, height, max-height',
  transitionDuration: `${MORPH_MS}ms`,
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: open.value ? '1.25rem' : '9999px',
  width: open.value ? 'min(420px, calc(100vw - 3rem))' : '132px',
  height: open.value
    ? (typeof panelHeight.value === 'number' ? `${panelHeight.value}px` : 'auto')
    : '44px',
  maxHeight: open.value ? '85vh' : '44px',
  overflow: open.value && contentVisible.value ? 'visible' : 'hidden',
}))
</script>

<template>
  <div class="theme-controls-anchor">
    <!-- Morphing FAB/Panel container (always visible) -->
    <div class="fixed bottom-35 right-6 z-50">
      <div
        ref="containerRef"
        class="relative border shadow-2xl shadow-black/60 transition-all bg-pureBlack border-pureWhite/10"
        :style="morphStyle"
        :role="open ? 'dialog' : undefined"
        :aria-modal="open ? 'true' : undefined"
        aria-label="Theme panel"
      >
        <!-- FAB label (visible when closed) -->
        <div
          class="absolute inset-0 flex cursor-pointer select-none items-center justify-center gap-2 transition-opacity"
          :class="open ? 'opacity-0 pointer-events-none' : 'opacity-100'"
          :style="{ transitionDuration: '120ms' }"
          role="button"
          tabindex="0"
          aria-label="Open theme panel"
          @click="open = true"
          @keydown.enter="open = true"
        >
          <Icon name="ph:palette-bold" class="size-[18px] text-pureWhite/80" aria-hidden="true" />
          <span class="text-[14px] font-medium text-pureWhite/90">Theme</span>
        </div>

        <!-- Panel content wrapper (ref for height measurement) -->
        <div ref="panelRef" class="font-geist">
          <div
            class="transition-opacity"
            :class="contentVisible && open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            :style="{ transitionDuration: '160ms' }"
            :aria-hidden="!open"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-5 pb-3 pt-5">
              <div>
                <h2 class="text-[14px] font-semibold text-pureWhite/95">
                  Theme
                </h2>
                <p class="mt-0.5 text-[10px] text-pureWhite/40">
                  Presets, colors, display, export
                </p>
              </div>
              <button
                type="button"
                class="theme-morph__close h-6 w-6 flex shrink-0 items-center justify-center rounded-full border-none bg-transparent text-pureWhite/40 transition-colors hover:bg-pureWhite/8 hover:text-pureWhite/90"
                aria-label="Close theme panel"
                @click="open = false"
              >
                <Icon name="ph:x-bold" class="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <!-- Scrollable body -->
            <div class="space-y-4 overflow-y-auto px-5 pb-5" style="max-height: calc(85vh - 72px);">
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
  </div>
</template>

<style scoped>
.theme-controls-anchor {
  position: relative;
  width: 0;
  height: 0;
  flex-shrink: 0;
}
</style>
