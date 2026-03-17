<script setup lang="ts">
import { ref } from 'vue'

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

defineProps<{
  open: boolean
  accent: string
  contrast: number
}>()

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
</script>

<template>
  <aside class="diff-drawer overflow-hidden rounded-[var(--wb-r-md)] border border-transparent bg-[rgba(7,8,10,0.96)]" :class="open ? 'diff-drawer--open' : ''">
    <header class="flex h-[34px] items-center justify-between border-b border-[var(--wb-border-2)] px-3 text-[12px] text-pureWhite/84">
      <div class="inline-flex items-center gap-2">
        <span class="font-medium">Nicht gestagt</span>
        <span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-[var(--wb-border-2)] px-1.5 font-[var(--font-code)] text-[11px]">3</span>
        <Icon name="ph:caret-down-bold" class="h-[10px] w-[10px] text-pureWhite/48" />
      </div>
      <div class="inline-flex items-center gap-2 text-pureWhite/62">
        <button class="inline-flex h-5 w-5 items-center justify-center appearance-none border-none bg-transparent p-0 outline-none transition-colors hover:text-pureWhite/86">
          <Icon name="ph:dots-three" class="h-[12px] w-[12px]" />
        </button>
        <button class="inline-flex h-5 w-5 items-center justify-center appearance-none border-none bg-transparent p-0 outline-none transition-colors hover:text-pureWhite/86">
          <Icon name="ph:arrows-out-simple" class="h-[12px] w-[12px]" />
        </button>
      </div>
    </header>
    <div class="diff-scroll min-h-0 overflow-y-auto p-2 font-[var(--font-code)] text-[13px]">
      <section v-for="section in diffSections" :key="section.path" class="mb-3 overflow-hidden rounded-[12px] border border-[var(--wb-border-2)] bg-[rgba(19,20,25,0.92)] last:mb-0">
        <button
          class="flex w-full items-center justify-between border-none border-b border-[var(--wb-border-2)] bg-[rgba(24,26,32,0.92)] px-3 py-2 text-left outline-none"
          @click="toggleSection(section.path)"
        >
          <div class="inline-flex min-w-0 items-center gap-2">
            <Icon
              :name="isSectionCollapsed(section.path) ? 'ph:caret-right-bold' : 'ph:caret-down-bold'"
              class="h-[11px] w-[11px] shrink-0 text-pureWhite/62"
            />
            <span class="truncate text-[12px] text-pureWhite/90">{{ section.path }}</span>
            <span class="font-[var(--font-code)] text-[12px] text-[var(--theme-added)]">{{ section.delta }}</span>
            <span class="h-1.5 w-1.5 rounded-full bg-pureWhite/58" />
          </div>
          <div class="inline-flex items-center gap-2 text-pureWhite/58">
            <span class="inline-flex h-4 w-4 items-center justify-center">
              <Icon name="ph:arrow-counter-clockwise-bold" class="h-[11px] w-[11px]" />
            </span>
            <span class="inline-flex h-4 w-4 items-center justify-center">
              <Icon name="ph:plus-bold" class="h-[11px] w-[11px]" />
            </span>
          </div>
        </button>

        <div class="diff-section-body divide-y divide-pureWhite/4" :class="isSectionCollapsed(section.path) ? 'diff-section-body--collapsed' : 'diff-section-body--expanded'">
          <div
            v-for="line in section.lines"
            :key="`${section.path}-${line.left}-${line.right}-${line.text}`"
            class="grid grid-cols-[42px_42px_1fr] gap-0 px-0 text-[13px] leading-[1.65]"
            :class="line.kind === 'added'
              ? 'bg-[color:color-mix(in_srgb,var(--theme-added)_17%,transparent)]'
              : line.kind === 'removed'
                ? 'bg-[color:color-mix(in_srgb,var(--theme-removed)_16%,transparent)]'
                : 'bg-transparent'"
          >
            <span class="border-r border-pureWhite/6 px-3 py-1.5 text-right text-pureWhite/36">{{ line.left }}</span>
            <span class="border-r border-pureWhite/6 px-3 py-1.5 text-right text-pureWhite/36">{{ line.right }}</span>
            <span class="whitespace-pre-wrap px-3 py-1.5 text-pureWhite/88">{{ line.text }}</span>
          </div>
        </div>
      </section>

      <div class="mt-3 rounded-[12px] border border-[var(--wb-border-2)] bg-[rgba(18,20,25,0.88)] px-3 py-2 text-[12px] text-pureWhite/54">
        accent: <span class="text-[var(--theme-added)]">{{ accent }}</span> · contrast: <span class="text-pureWhite/82">{{ contrast }}</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.diff-drawer {
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translateX(12px);
  pointer-events: none;
  transition:
    opacity 240ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 220ms ease;
}

.diff-drawer--open {
  opacity: 1;
  transform: translateX(0);
  border-color: var(--wb-border-1);
  pointer-events: auto;
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
    transform: translateX(105%);
  }

  .diff-drawer--open {
    width: auto;
    transform: translateX(0);
  }
}
</style>
