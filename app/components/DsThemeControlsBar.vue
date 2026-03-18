<script setup lang="ts">
import type { ThemePresetEntry } from '~/data/theme-preset-catalog'
import type { CodexThemePayload } from '~/types/codex-theme'
import { templateRef, useEventListener, usePreferredReducedMotion } from '@vueuse/core'
import { Motion } from 'motion-v'
import ThemeFabButton from '~/components/theme-controls/ThemeFabButton.vue'
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

const MORPH_MS = 460
const prefersReducedMotion = usePreferredReducedMotion()
const reduceMotion = computed(() => prefersReducedMotion.value === 'reduce')

const portalVisible = ref(false)
const fabHidden = ref(false)
const backdropVisible = ref(false)
const contentVisible = ref(false)
const morph = reactive({
  left: 0,
  top: 0,
  w: 80,
  h: 56,
  br: '9999px',
})
const storedFabRect = ref<DOMRect | null>(null)
const panelRef = templateRef<HTMLElement>('panelRef')

function panelMetrics() {
  if (!import.meta.client)
    return { left: 0, top: 0, w: 480, h: 800 }
  const w = Math.min(520, Math.max(320, window.innerWidth * 0.92))
  return {
    left: window.innerWidth - w,
    top: 0,
    w,
    h: window.innerHeight,
  }
}

function applyFabRect(r: DOMRect) {
  morph.left = r.left
  morph.top = r.top
  morph.w = r.width
  morph.h = r.height
  morph.br = '9999px'
}

async function openPanel() {
  if (!import.meta.client)
    return
  const el = document.getElementById('theme-fab-trigger')
  storedFabRect.value = el?.getBoundingClientRect() ?? null

  fabHidden.value = true
  portalVisible.value = true
  await nextTick()

  if (reduceMotion.value) {
    const m = panelMetrics()
    morph.left = m.left
    morph.top = m.top
    morph.w = m.w
    morph.h = m.h
    morph.br = '14px 0 0 14px'
    backdropVisible.value = true
    contentVisible.value = true
    await nextTick()
    panelRef.value?.querySelector<HTMLButtonElement>('.theme-morph__close')?.focus()
    return
  }

  if (storedFabRect.value) {
    applyFabRect(storedFabRect.value)
  }
  else {
    const m = panelMetrics()
    morph.w = 72
    morph.h = 56
    morph.left = m.left + m.w - 72
    morph.top = window.innerHeight - 120
    morph.br = '9999px'
  }

  backdropVisible.value = false
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      backdropVisible.value = true
      const m = panelMetrics()
      morph.left = m.left
      morph.top = m.top
      morph.w = m.w
      morph.h = m.h
      morph.br = '16px 0 0 16px'
    })
  })

  setTimeout(() => {
    contentVisible.value = true
    panelRef.value?.querySelector<HTMLButtonElement>('.theme-morph__close')?.focus()
  }, reduceMotion.value ? 0 : MORPH_MS)
}

function finishClose() {
  portalVisible.value = false
  fabHidden.value = false
  backdropVisible.value = false
  contentVisible.value = false
  document.body.style.overflow = ''
  nextTick(() => {
    document.getElementById('theme-fab-trigger')?.focus()
  })
}

function closePanel() {
  if (!portalVisible.value)
    return

  contentVisible.value = false

  if (reduceMotion.value || !storedFabRect.value) {
    document.body.style.overflow = ''
    finishClose()
    return
  }

  backdropVisible.value = false
  applyFabRect(storedFabRect.value)

  setTimeout(() => {
    finishClose()
  }, MORPH_MS)
}

watch(portalVisible, (v) => {
  if (!import.meta.client)
    return
  document.body.style.overflow = v ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (import.meta.client)
    document.body.style.overflow = ''
})

onMounted(() => {
  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && portalVisible.value) {
      e.preventDefault()
      closePanel()
    }
  })
})

const morphStyle = computed(() => ({
  left: `${morph.left}px`,
  top: `${morph.top}px`,
  width: `${morph.w}px`,
  height: `${morph.h}px`,
  borderRadius: morph.br,
  transition: reduceMotion.value
    ? 'none'
    : `left ${MORPH_MS}ms cubic-bezier(0.22, 1, 0.36, 1), top ${MORPH_MS}ms cubic-bezier(0.22, 1, 0.36, 1), width ${MORPH_MS}ms cubic-bezier(0.22, 1, 0.36, 1), height ${MORPH_MS}ms cubic-bezier(0.22, 1, 0.36, 1), border-radius ${MORPH_MS * 0.85}ms cubic-bezier(0.33, 1, 0.68, 1)`,
}))
</script>

<template>
  <div class="theme-controls-anchor">
    <ThemeFabButton
      :visually-hidden="fabHidden"
      @click="openPanel"
    />

    <Teleport to="body">
      <div
        v-show="portalVisible"
        class="theme-morph-portal pointer-events-none fixed inset-0 z-[10000]"
      >
        <Motion
          as="div"
          class="theme-morph-backdrop pointer-events-auto absolute inset-0 bg-black/28 backdrop-blur-[3px]"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: backdropVisible ? 1 : 0 }"
          :transition="{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }"
          aria-hidden="true"
          @click="closePanel"
        />

        <aside
          id="theme-controls-panel"
          ref="panelRef"
          class="theme-morph-shell pointer-events-auto fixed z-[10001] flex flex-col overflow-hidden border shadow-[-20px_0_60px_rgba(0,0,0,0.5)] text-pureWhite/92 bg-pureBlack border-pureWhite/10"
          :style="morphStyle"
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-controls-heading"
          tabindex="-1"
        >
          <div
            class="theme-morph__content min-h-0 flex flex-1 flex-col transition-all duration-400 ease-out"
            :class="contentVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-[0.98]'"
          >
            <header class="theme-morph__head flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 font-[var(--font-ui)] border-pureWhite/8">
              <div>
                <p id="theme-controls-heading" class="text-[15px] font-semibold tracking-tight text-pureWhite/95">
                  Theme
                </p>
                <p class="mt-0.5 text-[11px] text-pureWhite/40">
                  Presets, colors, display, export
                </p>
              </div>
              <button
                type="button"
                class="theme-morph__close h-10 w-10 inline-flex items-center justify-center border rounded-xl font-[inherit] transition-colors text-pureWhite/80 bg-pureWhite/6 border-pureWhite/10 hover:text-pureWhite hover:bg-pureWhite/10 hover:border-pureWhite/18"
                aria-label="Close theme panel"
                @click="closePanel"
              >
                <Icon name="ph:x-bold" class="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div class="[scrollbar-width:thin] min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4">
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
        </aside>
      </div>
    </Teleport>
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
