<script setup lang="ts">
import { ref, watch } from 'vue'
import DrawerChangeCard from './chat/DrawerChangeCard.vue'

const props = defineProps<{
  open: boolean
}>()

interface DiffLine {
  kind: 'added' | 'removed' | 'context'
  left: string
  right: string
  text: string
}

interface DiffSection {
  path: string
  delta: string
  showDot?: boolean
  lines: DiffLine[]
}

const diffSections: DiffSection[] = [
  {
    path: 'docs/codex-theme-scheme.md',
    delta: '+146 -0',
    lines: [
      { kind: 'context', left: '136', right: '136', text: '`codex-theme-v1`: {"codeThemeId":"rose-...' },
      { kind: 'added', left: '', right: '139', text: '- **All fields** in the app export align with the schema' },
      { kind: 'added', left: '', right: '140', text: '- **No extra keys** appear in the app copy payload' },
      { kind: 'context', left: '142', right: '142', text: '### Conclusion' },
      { kind: 'added', left: '', right: '145', text: '- The **concepts** in this schema map to the current UI' },
      { kind: 'added', left: '', right: '146', text: '- The **exact structure** has been validated against export' },
    ],
  },
  {
    path: 'docs/index.md',
    delta: '+6 -0',
    showDot: true,
    lines: [
      { kind: 'context', left: '1', right: '1', text: '# Codex Theme Docs' },
      { kind: 'added', left: '', right: '3', text: '## Codex theme scheme (`codex-theme-v1`)' },
      { kind: 'added', left: '', right: '5', text: 'For the full structure of theme options, use this doc.' },
      { kind: 'added', left: '', right: '7', text: '↩ Alle zurücksetzen   + Alle stagen' },
    ],
  },
]

// Default: sections are open. State persists while drawer stays mounted.
const collapsedSections = ref<Set<string>>(new Set())
const suspendAccordionMotion = ref(false)

function isSectionCollapsed(path: string) {
  return collapsedSections.value.has(path)
}

function toggleSection(path: string) {
  const next = new Set(collapsedSections.value)
  if (next.has(path))
    next.delete(path)
  else
    next.add(path)
  collapsedSections.value = next
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen)
      return
    // Prevent replayed accordion transitions when drawer itself animates in.
    suspendAccordionMotion.value = true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        suspendAccordionMotion.value = false
      })
    })
  },
)
</script>

<template>
  <aside class="diff-drawer max-w-full overflow-hidden border-l border-l-[color:color-mix(in_srgb,var(--wb-divider)_86%,transparent)] rounded-none bg-[var(--wb-bg-panel)]" :class="open ? 'diff-drawer--open' : ''">
    <header class="relative z-10 h-[34px] flex shrink-0 items-center justify-between border-b border-[color:var(--wb-border-2)] px-3 text-[12px] text-[color:var(--wb-text-primary)]">
      <div class="inline-flex items-center gap-2">
        <span class="font-medium">Nicht gestagt</span>
        <span class="h-5 min-w-5 inline-flex items-center justify-center border border-[color:var(--wb-border-2)] rounded-full px-1.5 text-[11px] font-[var(--font-ui)] tabular-nums">3</span>
        <Icon name="ph:caret-down-bold" class="h-[10px] w-[10px] text-[color:var(--wb-text-muted)]" />
      </div>
      <div class="inline-flex items-center gap-2 text-[color:var(--wb-text-secondary)]">
        <button class="h-5 w-5 inline-flex appearance-none items-center justify-center border-none bg-transparent p-0 outline-none transition-colors hover:text-[color:var(--wb-text-primary)]">
          <Icon name="ph:dots-three" class="h-[12px] w-[12px]" />
        </button>
        <button class="h-5 w-5 inline-flex appearance-none items-center justify-center border-none bg-transparent p-0 outline-none transition-colors hover:text-[color:var(--wb-text-primary)]">
          <Icon name="ph:arrows-out-simple" class="h-[12px] w-[12px]" />
        </button>
      </div>
    </header>
    <div class="diff-scroll relative z-20 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-2 pt-8 text-[13px] font-[var(--font-code)]">
      <DrawerChangeCard
        v-for="section in diffSections"
        :key="section.path"
        :section="section"
        :show-status-dot="section.showDot"
        :collapsed="isSectionCollapsed(section.path)"
        :suspend-accordion-motion="suspendAccordionMotion"
        @toggle="toggleSection(section.path)"
      />
    </div>
  </aside>
</template>

<style scoped>
.diff-drawer {
  width: var(--wb-diff-size, min(41vw, 520px));
  flex: 0 0 auto;
  min-width: 0;
  max-width: min(520px, 100%);
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateX(12px);
  pointer-events: none;
  transition:
    opacity 220ms ease,
    transform 260ms var(--wb-sidebar-ease, cubic-bezier(0.22, 1, 0.36, 1)),
    border-color 180ms ease;
  will-change: opacity, transform;
}

.diff-drawer--open {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
  border-color: var(--wb-border-1);
}

@media (max-width: 1180px) {
  .diff-drawer {
    position: fixed;
    inset: 104px 8px 8px;
    z-index: 42;
    width: auto;
    max-width: none;
    opacity: 0;
    transform: translateX(105%);
    pointer-events: none;
    transition:
      opacity 220ms ease,
      transform 260ms var(--wb-sidebar-ease, cubic-bezier(0.22, 1, 0.36, 1)),
      border-color 180ms ease;
  }

  .diff-drawer--open {
    opacity: 1;
    width: auto;
    transform: translateX(0);
    pointer-events: auto;
  }
}
</style>
