<script setup lang="ts">
import type { DrawerSectionView } from '~/stores/diff'
import type { FileDiffCodeLine, FileDiffLine, FileDiffUnchangedChunkLine } from '~/types/workbench-chat'
import { computed, ref } from 'vue'
import { useDiffStore } from '~/stores/diff'
import DrawerChangeTab from './DrawerChangeTab.vue'

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
const titleHovered = ref(false)

const unmodifiedChunk = computed(() =>
  props.section.lines.find(line => line.kind === 'unchanged_chunk') as FileDiffUnchangedChunkLine | undefined,
)

const hasUnmodifiedChunk = computed(() => Boolean(unmodifiedChunk.value))
const sectionLineDigits = computed(() => maxSectionLineDigits(props.section.lines))
const sectionLineColumns = computed(() => maxSectionLineColumns(props.section.lines))

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
    return 'text-[color:var(--syntax-keyword)]'
  if (t.startsWith('- ') || t.startsWith('`'))
    return 'text-[color:var(--syntax-string)]'
  if (RE_STAGING.test(t))
    return 'text-[color:var(--syntax-comment)]'
  return 'text-[color:var(--syntax-default)]'
}

function lineMarkerClass(line: FileDiffCodeLine) {
  if (line.kind === 'added' || line.kind === 'add')
    return 'border-l-[2px] border-l-solid border-l-[color:var(--theme-added)]'
  if (line.kind === 'removed' || line.kind === 'remove')
    return 'border-l-[2px] border-l-dashed border-l-[color:var(--theme-removed)]'
  return 'border-l-[2px] border-l-solid border-l-transparent'
}

function lineBackgroundClass(line: FileDiffCodeLine) {
  if (line.kind === 'added' || line.kind === 'add')
    return 'bg-[color:color-mix(in_srgb,var(--theme-added)_17%,transparent)]'
  if (line.kind === 'removed' || line.kind === 'remove')
    return 'bg-[color:color-mix(in_srgb,var(--theme-removed)_16%,transparent)]'
  return 'bg-transparent'
}

function isCodeLine(line: FileDiffLine): line is FileDiffCodeLine {
  return line.kind !== 'unchanged_chunk'
}

function isChangedLine(line: FileDiffLine) {
  if (!isCodeLine(line))
    return false
  return line.kind === 'added' || line.kind === 'add' || line.kind === 'removed' || line.kind === 'remove'
}

function hasChangedBefore(index: number) {
  for (let i = index - 1; i >= 0; i--) {
    if (isChangedLine(props.section.lines[i]!))
      return true
  }
  return false
}

function hasChangedAfter(index: number) {
  for (let i = index + 1; i < props.section.lines.length; i++) {
    if (isChangedLine(props.section.lines[i]!))
      return true
  }
  return false
}

function chunkCaretIcon(index: number) {
  const before = hasChangedBefore(index)
  const after = hasChangedAfter(index)
  if (before && after)
    return 'ph:caret-up-down'
  if (!before && after)
    return 'ph:caret-up'
  if (before && !after)
    return 'ph:caret-down'
  return 'ph:caret-up-down'
}

function lineNumberDigits(value: number | string) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed))
    return 1
  return String(Math.max(0, Math.trunc(Math.abs(parsed)))).length
}

function maxSectionLineDigits(lines: FileDiffLine[]) {
  let maxDigits = 2
  for (const line of lines) {
    if (line.kind === 'unchanged_chunk') {
      for (const nestedLine of line.lines) {
        if (nestedLine.left)
          maxDigits = Math.max(maxDigits, lineNumberDigits(nestedLine.left))
        if (nestedLine.right)
          maxDigits = Math.max(maxDigits, lineNumberDigits(nestedLine.right))
      }
      continue
    }
    if (line.left)
      maxDigits = Math.max(maxDigits, lineNumberDigits(line.left))
    if (line.right)
      maxDigits = Math.max(maxDigits, lineNumberDigits(line.right))
  }
  return maxDigits
}

function maxSectionLineColumns(lines: FileDiffLine[]) {
  let maxColumns = 24
  for (const line of lines) {
    if (line.kind === 'unchanged_chunk') {
      for (const nestedLine of line.lines)
        maxColumns = Math.max(maxColumns, nestedLine.text.length)
      continue
    }
    maxColumns = Math.max(maxColumns, line.text.length)
  }
  return maxColumns
}
</script>

<template>
  <section
    class="[--wb-accordion-header-bg:color-mix(in_srgb,var(--wb-card-surface)_94%,var(--wb-text-primary)_6%)] [--wb-card-surface:color-mix(in_srgb,var(--wb-bubble-bg)_90%,var(--wb-bg-panel)_10%)] [--wb-row-divider:var(--wb-card-surface)] [--wb-unmodified-strip-bg:color-mix(in_srgb,var(--wb-card-surface)_88%,var(--wb-text-primary)_12%)] mb-3 max-w-full min-w-0 overflow-visible border border-[color:var(--wb-border-2)] rounded-[10px] bg-[var(--wb-card-surface)] last:mb-0"
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
      class="[--wb-gutter-width:max(66px,calc(var(--wb-line-digits)*1ch+52px))] [--wb-row-divider-offset:0px] [transition-duration:240ms,170ms,240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),ease,cubic-bezier(0.22,1,0.36,1)] relative min-w-0 origin-top transition-[max-height,opacity,transform] divide-y divide-[color:var(--wb-divider)]"
      :style="{ '--wb-line-digits': sectionLineDigits, '--wb-line-columns': sectionLineColumns }"
      :class="[
        collapsed ? 'max-h-0 -translate-y-1 opacity-0 pointer-events-none overflow-hidden' : 'max-h-[420px] translate-y-0 opacity-100 overflow-x-auto overflow-y-auto rounded-b-[8px]',
        suspendAccordionMotion ? '!transition-none' : '',
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
          <template v-if="diffStore.isUnmodifiedChunkExpanded(section.fileId, line.id)">
            <div
              v-for="chunkLine in line.lines"
              :key="`${section.fileId}-${line.id}-${chunkLine.left}-${chunkLine.right}-${chunkLine.text}`"
              class="relative grid grid-cols-[var(--wb-gutter-width)_max-content] w-[max(100%,calc(var(--wb-gutter-width)+var(--wb-line-columns)*1ch+28px))] gap-0 px-0 text-[length:var(--wb-code-text-sm)] leading-[1.6] before:pointer-events-none before:absolute before:inset-y-0 before:left-[calc(var(--wb-gutter-width)+var(--wb-row-divider-offset))] before:z-[5] before:w-px before:bg-[var(--wb-row-divider)] before:content-['']"
              :class="lineBackgroundClass(chunkLine)"
            >
              <span
                class="relative z-[2] py-1.5 pl-8 pr-4 text-right text-[color:var(--wb-text-faint)] tabular-nums"
                :class="lineMarkerClass(chunkLine)"
              >{{ chunkLine.right || chunkLine.left }}</span>
              <span class="relative z-[2] whitespace-pre py-1.5 pl-4 pr-2 text-[length:var(--wb-code-text-sm)] leading-[1.6]" :class="lineSyntaxVar(chunkLine.text)">{{ chunkLine.text }}</span>
            </div>
          </template>
          <DrawerChangeTab
            v-else
            :count="Math.max(1, line.count)"
            :icon="chunkCaretIcon(lineIndex)"
            @toggle="diffStore.toggleUnmodifiedChunk(section.fileId, line.id)"
          />
        </div>
        <div
          v-else
          class="relative grid grid-cols-[var(--wb-gutter-width)_max-content] w-[max(100%,calc(var(--wb-gutter-width)+var(--wb-line-columns)*1ch+28px))] gap-0 px-0 text-[length:var(--wb-code-text-sm)] leading-[1.6] before:pointer-events-none before:absolute before:inset-y-0 before:left-[calc(var(--wb-gutter-width)+var(--wb-row-divider-offset))] before:z-[5] before:w-px before:bg-[var(--wb-row-divider)] before:content-['']"
          :class="isCodeLine(line) ? lineBackgroundClass(line) : 'bg-transparent'"
        >
          <span
            class="relative z-[2] py-1.5 pl-8 pr-4 text-right text-[color:var(--wb-text-faint)] tabular-nums"
            :class="isCodeLine(line) ? lineMarkerClass(line) : ''"
          >{{ line.right || line.left }}</span>
          <span class="relative z-[2] whitespace-pre py-1.5 pl-4 pr-2" :class="lineSyntaxVar(line.text)">{{ line.text }}</span>
        </div>
      </template>

      <div v-if="!hasUnmodifiedChunk && !collapsed" class="px-2 py-1.5" />
    </div>
  </section>
</template>
