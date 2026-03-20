<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  open: boolean
  accent: string
  contrast: number
}>()
const RE_MD_HEADING = /^#+\s/
const RE_STAGING = /zurücksetzen|stagen/i

interface DiffLine {
  kind: 'added' | 'removed' | 'context'
  left: string
  right: string
  text: string
}

interface DiffSection {
  path: string
  delta: string
  lines: DiffLine[]
}

const collapsedSections = ref<Set<string>>(new Set())

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
    lines: [
      { kind: 'context', left: '1', right: '1', text: '# Codex Theme Docs' },
      { kind: 'added', left: '', right: '3', text: '## Codex theme scheme (`codex-theme-v1`)' },
      { kind: 'added', left: '', right: '5', text: 'For the full structure of theme options, use this doc.' },
      { kind: 'added', left: '', right: '7', text: '↩ Alle zurücksetzen   + Alle stagen' },
    ],
  },
]

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

/** Rough syntax roles for demo lines; with real tokenColors per codeThemeId this becomes data-driven. */
function lineSyntaxVar(text: string) {
  const t = text.trim()
  if (RE_MD_HEADING.test(t))
    return 'var(--syntax-keyword)'
  if (t.startsWith('- ') || t.startsWith('`'))
    return 'var(--syntax-string)'
  if (RE_STAGING.test(t))
    return 'var(--syntax-comment)'
  return 'var(--syntax-default)'
}

function lineMarkerClass(line: DiffLine) {
  if (line.kind === 'added')
    return 'border-l-2 border-l-[color:var(--theme-added)]'
  if (line.kind === 'removed')
    return 'border-l-2 border-l-[color:var(--theme-removed)]'
  return 'border-l-2 border-l-transparent'
}

function lineMarkerStyle(line: DiffLine) {
  if (line.kind === 'added')
    return { borderLeftStyle: 'solid' }
  if (line.kind === 'removed')
    return { borderLeftStyle: 'dashed' }
  return { borderLeftStyle: 'solid' }
}
</script>

<template>
  <aside class="diff-drawer max-w-full overflow-hidden border border-transparent rounded-[var(--wb-r-md)] bg-[var(--wb-bg-diff-chrome)]" :class="open ? 'diff-drawer--open' : ''">
    <header class="h-[34px] flex shrink-0 items-center justify-between border-b border-[color:var(--wb-border-2)] px-3 text-[12px] text-[color:var(--wb-text-primary)]">
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
    <div class="diff-scroll min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto p-2 text-[13px] font-[var(--font-code)]">
      <section v-for="section in diffSections" :key="section.path" class="mb-3 max-w-full min-w-0 overflow-hidden border border-[color:var(--wb-border-2)] rounded-[12px] bg-[var(--wb-bg-diff-section)] last:mb-0">
        <button
          class="w-full flex items-center justify-between border-b border-[color:var(--wb-border-2)] border-none bg-[var(--wb-bg-diff-header)] px-3 py-2 text-left outline-none"
          @click="toggleSection(section.path)"
        >
          <div class="min-w-0 inline-flex items-center gap-2">
            <Icon
              :name="isSectionCollapsed(section.path) ? 'ph:caret-right-bold' : 'ph:caret-down-bold'"
              class="h-[11px] w-[11px] shrink-0 text-[color:var(--wb-text-secondary)]"
            />
            <span class="truncate text-[12px] text-[color:var(--wb-text-primary)]">{{ section.path }}</span>
            <span class="text-[12px] text-[var(--theme-added)] font-[var(--font-code)]">{{ section.delta }}</span>
            <span class="h-1.5 w-1.5 rounded-full bg-[color:var(--wb-text-secondary)]" />
          </div>
          <div class="inline-flex items-center gap-2 text-[color:var(--wb-text-secondary)]">
            <span class="h-4 w-4 inline-flex items-center justify-center">
              <Icon name="ph:arrow-counter-clockwise-bold" class="h-[11px] w-[11px]" />
            </span>
            <span class="h-4 w-4 inline-flex items-center justify-center">
              <Icon name="ph:plus-bold" class="h-[11px] w-[11px]" />
            </span>
          </div>
        </button>

        <div class="diff-section-body min-w-0 divide-y divide-[color:var(--wb-divider)]" :class="isSectionCollapsed(section.path) ? 'diff-section-body--collapsed' : 'diff-section-body--expanded'">
          <div
            v-for="line in section.lines"
            :key="`${section.path}-${line.left}-${line.right}-${line.text}`"
            class="diff-line-row grid gap-0 px-0 text-[13px] leading-[1.65]"
            :class="line.kind === 'added'
              ? 'bg-[color:color-mix(in_srgb,var(--theme-added)_17%,transparent)]'
              : line.kind === 'removed'
                ? 'bg-[color:color-mix(in_srgb,var(--theme-removed)_16%,transparent)]'
                : 'bg-transparent'"
            :style="lineMarkerStyle(line)"
          >
            <span class="diff-line-gutter border-r border-[color:var(--wb-divider)] px-2 py-1.5 text-right text-[color:var(--wb-text-faint)] tabular-nums" :class="lineMarkerClass(line)">{{ line.right || line.left }}</span>
            <span class="diff-line-text [overflow-wrap:anywhere] min-w-0 whitespace-pre-wrap break-words px-2 py-1.5" :style="{ color: lineSyntaxVar(line.text) }">{{ line.text }}</span>
          </div>
        </div>
      </section>

      <div class="mt-3 border border-[color:var(--wb-border-2)] rounded-[12px] bg-[var(--wb-bg-diff-section)] px-3 py-2 text-[12px] text-[color:var(--wb-text-muted)]">
        accent: <span class="text-[color:var(--theme-accent)]">{{ accent }}</span> · contrast: <span class="text-[color:var(--wb-text-primary)]">{{ contrast }}</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.diff-drawer {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  transition: border-color 180ms ease;
}

.diff-line-row {
  grid-template-columns: 44px minmax(0, 1fr);
}

.diff-line-gutter {
  flex-shrink: 0;
}

.diff-line-text {
  word-break: break-word;
}

.diff-drawer--open {
  border-color: var(--wb-border-1);
}

.diff-section-body {
  overflow: hidden;
  transform-origin: top;
  transition:
    max-height 240ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 170ms ease,
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.diff-section-body--expanded {
  max-height: 420px;
  opacity: 1;
  transform: translateY(0);
}

.diff-section-body--collapsed {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
  pointer-events: none;
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
      transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
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
