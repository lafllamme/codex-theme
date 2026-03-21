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
  showDot?: boolean
  lines: DiffLine[]
}

defineProps<{
  section: DiffSection
  showStatusDot?: boolean
  collapsed: boolean
  suspendAccordionMotion?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const RE_MD_HEADING = /^#+\s/
const RE_STAGING = /zurücksetzen|stagen/i
const RE_DELTA_PARTS = /[+-]\d+/g
const titleHovered = ref(false)

function deltaParts(delta: string) {
  const matches = delta.match(RE_DELTA_PARTS) ?? []
  return {
    added: matches.find(part => part.startsWith('+')) ?? '',
    removed: matches.find(part => part.startsWith('-')) ?? '',
  }
}

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
  <section
    class="mb-3 max-w-full min-w-0 overflow-visible border border-[color:var(--wb-border-2)] rounded-[10px] bg-[var(--wb-bubble-bg)] last:mb-0 [--wb-accordion-header-bg:color-mix(in_srgb,var(--wb-bubble-bg)_98%,var(--wb-text-primary)_2%)]"
  >
    <div class="group relative z-0 hover:z-40">
      <span
        class="pointer-events-none absolute bottom-full z-[220] mb-1 max-w-[calc(100%-12px)] inline-flex translate-y-1 items-center truncate whitespace-nowrap border border-[color:var(--wb-border-3)] rounded-[8px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_88%,var(--wb-text-primary)_12%)] px-3 py-1 text-[length:var(--wb-code-text-sm)] text-[color:var(--wb-text-primary)] font-[var(--font-code)] opacity-0 transition-[opacity,transform] duration-160 -left-2"
        :class="titleHovered ? 'translate-y-0 opacity-100' : ''"
      >
        {{ section.path }}
      </span>

      <button
        class="group w-full flex items-center justify-between border-none bg-[var(--wb-accordion-header-bg)] px-3 py-2 text-left outline-none transition-colors"
        :class="collapsed
          ? 'rounded-[8px]'
          : 'rounded-t-[8px]'"
        @click="emit('toggle')"
      >
        <div class="min-w-0 inline-flex items-center gap-2">
          <span
            class="truncate text-[length:var(--wb-ui-text-xs)] text-[color:var(--wb-text-primary)]"
            @mouseenter.stop="titleHovered = true"
            @mouseleave.stop="titleHovered = false"
          >
            {{ section.path }}
          </span>
          <span
            v-if="deltaParts(section.delta).added"
            class="text-[length:var(--wb-ui-text-2xs)] text-[var(--theme-added)] font-[var(--font-code)]"
          >
            {{ deltaParts(section.delta).added }}
          </span>
          <span
            v-if="deltaParts(section.delta).removed"
            class="text-[length:var(--wb-ui-text-2xs)] text-[var(--theme-removed)] font-[var(--font-code)]"
          >
            {{ deltaParts(section.delta).removed }}
          </span>
          <span
            v-if="showStatusDot ?? section.showDot"
            class="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--theme-accent)]"
          />
        </div>
        <div class="ml-3 inline-flex items-center gap-2 text-[color:var(--wb-text-secondary)]">
          <span class="h-4 w-4 inline-flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <Icon name="ph:arrow-u-up-left" class="h-[11px] w-[11px]" />
          </span>
          <span class="h-4 w-4 inline-flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <Icon name="ph:plus-bold" class="h-[11px] w-[11px]" />
          </span>
          <span class="h-4 w-4 inline-flex items-center justify-center">
            <Icon
              :name="collapsed ? 'ph:caret-right-bold' : 'ph:caret-down-bold'"
              class="h-[11px] w-[11px] shrink-0 text-[color:var(--wb-text-muted)] transition-transform duration-150"
            />
          </span>
        </div>
      </button>
      <div
        v-if="!collapsed"
        class="h-px bg-[color:var(--wb-divider)]"
      />
    </div>

    <div
      class="diff-section-body min-w-0 divide-y divide-[color:var(--wb-divider)]"
      :class="[
        collapsed ? 'diff-section-body--collapsed' : 'diff-section-body--expanded rounded-b-[8px]',
        suspendAccordionMotion ? 'diff-section-body--no-motion' : '',
      ]"
    >
      <div
        v-for="line in section.lines"
        :key="`${section.path}-${line.left}-${line.right}-${line.text}`"
        class="diff-line-row grid gap-0 px-0 text-[length:var(--wb-code-text-sm)] leading-[1.6]"
        :class="line.kind === 'added'
          ? 'bg-[color:color-mix(in_srgb,var(--theme-added)_17%,transparent)]'
          : line.kind === 'removed'
            ? 'bg-[color:color-mix(in_srgb,var(--theme-removed)_16%,transparent)]'
            : 'bg-transparent'"
      >
        <span
          class="diff-line-gutter border-r border-[color:var(--wb-divider)] px-2 py-1.5 text-right text-[color:var(--wb-text-faint)] tabular-nums"
          :class="lineMarkerClass(line)"
          :style="lineMarkerStyle(line)"
        >{{ line.right || line.left }}</span>
        <span class="diff-line-text [overflow-wrap:anywhere] min-w-0 whitespace-pre-wrap break-words px-2 py-1.5" :style="{ color: lineSyntaxVar(line.text) }">{{ line.text }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

.diff-section-body--no-motion {
  transition: none;
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
</style>
