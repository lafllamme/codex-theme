<script setup lang="ts">
import type { DrawerSectionView } from '~/stores/diff'
import type { FileDiffCodeLine, FileDiffLine, FileDiffUnchangedChunkLine } from '~/types/workbench-chat'
import { computed, ref } from 'vue'
import { useDiffStore } from '~/stores/diff'

const props = defineProps<{
  section: DrawerSectionView
  showStatusDot?: boolean
  collapsed: boolean
  suspendAccordionMotion?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const section = computed(() => props.section)
const showStatusDot = computed(() => props.showStatusDot)
const collapsed = computed(() => props.collapsed)
const suspendAccordionMotion = computed(() => props.suspendAccordionMotion)
const diffStore = useDiffStore()

const RE_MD_HEADING = /^#+\s/
const RE_STAGING = /zurücksetzen|stagen/i
const RE_DELTA_PARTS = /[+-]\d+/g
const UNMODIFIED_PREVIEW_CONTEXT = 2
const titleHovered = ref(false)

const unmodifiedChunk = computed(() =>
  props.section.lines.find(line => line.kind === 'unchanged_chunk') as FileDiffUnchangedChunkLine | undefined,
)

const unmodifiedCount = computed(() => {
  const line = unmodifiedChunk.value
  if (!line)
    return 0
  return Math.max(1, line.count)
})

const hasUnmodifiedChunk = computed(() => Boolean(unmodifiedChunk.value))

const unmodifiedLabel = computed(() => {
  const count = unmodifiedCount.value
  return `${count} unmodified ${count === 1 ? 'line' : 'lines'}`
})

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

function lineMarkerClass(line: FileDiffCodeLine) {
  if (line.kind === 'added' || line.kind === 'add')
    return 'border-l-2 border-l-[color:var(--theme-added)]'
  if (line.kind === 'removed' || line.kind === 'remove')
    return 'border-l-2 border-l-[color:var(--theme-removed)]'
  return 'border-l-2 border-l-transparent'
}

function lineMarkerStyle(line: FileDiffCodeLine) {
  if (line.kind === 'added' || line.kind === 'add')
    return { borderLeftStyle: 'solid' as const }
  if (line.kind === 'removed' || line.kind === 'remove')
    return { borderLeftStyle: 'dashed' as const }
  return { borderLeftStyle: 'solid' as const }
}

function isCodeLine(line: FileDiffLine): line is FileDiffCodeLine {
  return line.kind !== 'unchanged_chunk'
}

function previewLeadingLines(chunk: FileDiffUnchangedChunkLine) {
  if (chunk.lines.length <= UNMODIFIED_PREVIEW_CONTEXT * 2)
    return chunk.lines
  return chunk.lines.slice(0, UNMODIFIED_PREVIEW_CONTEXT)
}

function previewTrailingLines(chunk: FileDiffUnchangedChunkLine) {
  if (chunk.lines.length <= UNMODIFIED_PREVIEW_CONTEXT * 2)
    return []
  return chunk.lines.slice(-UNMODIFIED_PREVIEW_CONTEXT)
}
</script>

<template>
  <section
    class="[--wb-accordion-header-bg:color-mix(in_srgb,var(--wb-card-surface)_94%,var(--wb-text-primary)_6%)] [--wb-card-surface:color-mix(in_srgb,var(--wb-bubble-bg)_90%,var(--wb-bg-panel)_10%)] [--wb-unmodified-strip-bg:color-mix(in_srgb,var(--wb-card-surface)_88%,var(--wb-text-primary)_12%)] mb-3 max-w-full min-w-0 overflow-visible border border-[color:var(--wb-border-2)] rounded-[10px] bg-[var(--wb-card-surface)] last:mb-0"
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
      <template
        v-for="(line, lineIndex) in section.lines"
        :key="`${section.path}-${line.kind}-${lineIndex}`"
      >
        <div
          v-if="line.kind === 'unchanged_chunk'"
          class="py-1.5"
        >
          <template v-if="!diffStore.isUnmodifiedChunkExpanded(section.fileId, line.id)">
            <div
              v-for="chunkLine in previewLeadingLines(line)"
              :key="`${section.fileId}-${line.id}-lead-${chunkLine.left}-${chunkLine.right}-${chunkLine.text}`"
              class="diff-line-row grid gap-0 bg-transparent px-0 text-[length:var(--wb-code-text-sm)] leading-[1.6]"
            >
              <span
                class="diff-line-gutter border-r border-[color:var(--wb-divider)] px-2 py-1.5 text-right text-[color:var(--wb-text-faint)] tabular-nums"
                :class="lineMarkerClass(chunkLine)"
                :style="lineMarkerStyle(chunkLine)"
              >{{ chunkLine.right || chunkLine.left }}</span>
              <span class="diff-line-text [overflow-wrap:anywhere] min-w-0 whitespace-pre-wrap break-words px-2 py-1.5 text-[length:var(--wb-code-text-sm)] leading-[1.6]" :style="{ color: lineSyntaxVar(chunkLine.text) }">{{ chunkLine.text }}</span>
            </div>
          </template>

          <template v-if="diffStore.isUnmodifiedChunkExpanded(section.fileId, line.id)">
            <div
              v-for="chunkLine in line.lines"
              :key="`${section.fileId}-${line.id}-${chunkLine.left}-${chunkLine.right}-${chunkLine.text}`"
              class="diff-line-row grid gap-0 bg-transparent px-0 text-[length:var(--wb-code-text-sm)] leading-[1.6]"
            >
              <span
                class="diff-line-gutter border-r border-[color:var(--wb-divider)] px-2 py-1.5 text-right text-[color:var(--wb-text-faint)] tabular-nums"
                :class="lineMarkerClass(chunkLine)"
                :style="lineMarkerStyle(chunkLine)"
              >{{ chunkLine.right || chunkLine.left }}</span>
              <span class="diff-line-text [overflow-wrap:anywhere] min-w-0 whitespace-pre-wrap break-words px-2 py-1.5 text-[length:var(--wb-code-text-sm)] leading-[1.6]" :style="{ color: lineSyntaxVar(chunkLine.text) }">{{ chunkLine.text }}</span>
            </div>
          </template>
          <button
            v-else
            class="diff-line-row grid w-full overflow-hidden border border-[color:var(--wb-border-2)] rounded-[10px] bg-[var(--wb-unmodified-strip-bg)] p-0 text-left text-[color:var(--wb-text-secondary)] transition-colors hover:text-[color:var(--wb-text-primary)]"
            type="button"
            @click="diffStore.toggleUnmodifiedChunk(section.fileId, line.id)"
          >
            <span class="h-10 w-10 inline-flex shrink-0 items-center justify-center border-r border-r-[color:var(--wb-divider)]">
              <Icon
                name="ph:caret-up-down"
                class="h-[12px] w-[12px]"
              />
            </span>
            <span class="h-10 inline-flex items-center truncate px-3 text-[length:var(--wb-ui-text)] font-medium leading-none font-[var(--font-ui)]">
              {{ `${Math.max(1, line.count)} unmodified ${Math.max(1, line.count) === 1 ? 'line' : 'lines'}` }}
            </span>
          </button>

          <template v-if="!diffStore.isUnmodifiedChunkExpanded(section.fileId, line.id)">
            <div
              v-for="chunkLine in previewTrailingLines(line)"
              :key="`${section.fileId}-${line.id}-trail-${chunkLine.left}-${chunkLine.right}-${chunkLine.text}`"
              class="diff-line-row grid gap-0 bg-transparent px-0 text-[length:var(--wb-code-text-sm)] leading-[1.6]"
            >
              <span
                class="diff-line-gutter border-r border-[color:var(--wb-divider)] px-2 py-1.5 text-right text-[color:var(--wb-text-faint)] tabular-nums"
                :class="lineMarkerClass(chunkLine)"
                :style="lineMarkerStyle(chunkLine)"
              >{{ chunkLine.right || chunkLine.left }}</span>
              <span class="diff-line-text [overflow-wrap:anywhere] min-w-0 whitespace-pre-wrap break-words px-2 py-1.5 text-[length:var(--wb-code-text-sm)] leading-[1.6]" :style="{ color: lineSyntaxVar(chunkLine.text) }">{{ chunkLine.text }}</span>
            </div>
          </template>
        </div>
        <div
          v-else
          class="diff-line-row grid gap-0 px-0 text-[length:var(--wb-code-text-sm)] leading-[1.6]"
          :class="isCodeLine(line) && (line.kind === 'added' || line.kind === 'add')
            ? 'bg-[color:color-mix(in_srgb,var(--theme-added)_17%,transparent)]'
            : isCodeLine(line) && (line.kind === 'removed' || line.kind === 'remove')
              ? 'bg-[color:color-mix(in_srgb,var(--theme-removed)_16%,transparent)]'
              : 'bg-transparent'"
        >
          <span
            class="diff-line-gutter border-r border-[color:var(--wb-divider)] px-2 py-1.5 text-right text-[color:var(--wb-text-faint)] tabular-nums"
            :class="isCodeLine(line) ? lineMarkerClass(line) : ''"
            :style="isCodeLine(line) ? lineMarkerStyle(line) : undefined"
          >{{ line.right || line.left }}</span>
          <span class="diff-line-text [overflow-wrap:anywhere] min-w-0 whitespace-pre-wrap break-words px-2 py-1.5" :style="{ color: lineSyntaxVar(line.text) }">{{ line.text }}</span>
        </div>
      </template>

      <div
        v-if="!hasUnmodifiedChunk && !collapsed"
        class="px-2 py-1.5"
      >
        <button
          class="w-full flex items-center overflow-hidden border border-[color:var(--wb-border-2)] rounded-[10px] bg-[var(--wb-unmodified-strip-bg)] p-0 text-left text-[color:var(--wb-text-secondary)] transition-colors hover:text-[color:var(--wb-text-primary)]"
          type="button"
        >
          <span class="h-10 w-10 inline-flex shrink-0 items-center justify-center border-r border-r-[color:var(--wb-divider)]">
            <Icon
              name="ph:caret-up-down-bold"
              class="h-[12px] w-[12px]"
            />
          </span>
          <span class="truncate px-3 text-[length:var(--wb-ui-text)] font-medium font-[var(--font-ui)]">
            {{ unmodifiedLabel }}
          </span>
        </button>
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
  overflow-y: auto;
  overflow-x: hidden;
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
