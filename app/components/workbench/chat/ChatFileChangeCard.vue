<script setup lang="ts">
import type {
  FileChangeCardBlock,
  FileChangeItem,
  FileDiffCodeLine,
  FileDiffLine,
} from '~/types/workbench-chat'
import SyntaxLine from '~/components/workbench/code/SyntaxLine.vue'
import { useDiffStore } from '~/stores/diff'

const props = defineProps<{
  block: FileChangeCardBlock
  codeThemeId: string
}>()

const hoveredFileId = ref('')
const diffStore = useDiffStore()

diffStore.upsertFiles(props.block.files)
diffStore.ensureCardState(props.block.id, props.block.files.map(file => file.id))

const activeFile = computed(() => diffStore.activeFile(props.block.id))
const activeFileLineDigits = computed(() => maxLineDigits(activeFile.value))
const activeFileLineColumns = computed(() => maxLineColumns(activeFile.value))

function selectFile(file: FileChangeItem) {
  diffStore.toggleCardFile(props.block.id, file.id)
}

function isCodeLine(line: FileDiffLine): line is FileDiffCodeLine {
  return line.kind !== 'unchanged_chunk'
}

function visibleDiffLines(file: FileChangeItem | undefined) {
  if (!file)
    return []
  return file.lines.filter(isCodeLine)
}

function lineNumberDigits(value: number | string) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed))
    return 1
  return String(Math.max(0, Math.trunc(Math.abs(parsed)))).length
}

function maxLineDigits(file: FileChangeItem | undefined) {
  const lines = visibleDiffLines(file)
  if (!lines.length)
    return 2

  let maxDigits = 2
  for (const line of lines) {
    if (line.left)
      maxDigits = Math.max(maxDigits, lineNumberDigits(line.left))
    if (line.right)
      maxDigits = Math.max(maxDigits, lineNumberDigits(line.right))
  }
  return maxDigits
}

function maxLineColumns(file: FileChangeItem | undefined) {
  const lines = visibleDiffLines(file)
  if (!lines.length)
    return 24
  let maxColumns = 24
  for (const line of lines)
    maxColumns = Math.max(maxColumns, line.text.length)
  return maxColumns
}

function lineBackground(line: FileDiffCodeLine) {
  if (line.kind === 'add' || line.kind === 'added')
    return 'bg-[color:color-mix(in_srgb,var(--wb-diff-delta-added)_13%,transparent)]'
  if (line.kind === 'remove' || line.kind === 'removed')
    return 'bg-[color:color-mix(in_srgb,var(--wb-diff-delta-removed)_13%,transparent)]'
  return 'bg-transparent'
}

function lineMarkerClass(line: FileDiffCodeLine) {
  if (line.kind === 'add' || line.kind === 'added')
    return 'border-l-[2px] border-l-solid border-l-[color:var(--wb-diff-delta-added)]'
  if (line.kind === 'remove' || line.kind === 'removed')
    return 'border-l-[2px] border-l-dashed border-l-[color:var(--wb-diff-delta-removed)]'
  return 'border-l-[2px] border-l-solid border-l-transparent'
}
</script>

<template>
  <section
    class="[--wb-card-content-bg:var(--wb-bubble-bg)] [--wb-card-summary-bg:color-mix(in_srgb,var(--wb-bubble-bg)_96%,var(--wb-text-primary)_4%)] [--wb-card-tab-bg:color-mix(in_srgb,var(--wb-bubble-bg)_98%,var(--wb-text-primary)_2%)] [--wb-row-divider:var(--wb-card-content-bg)] overflow-visible border border-[color:var(--wb-border-2)] rounded-[10px] bg-[var(--wb-card-content-bg)]"
  >
    <div class="flex items-center justify-between border-b border-[color:var(--wb-divider)] rounded-t-[8px] bg-[var(--wb-card-summary-bg)] px-3 py-2">
      <div class="flex items-center gap-2 text-[length:var(--wb-ui-text-xs)] font-medium">
        <span class="text-[color:var(--wb-text-primary)]">{{ block.summaryLabel }}</span>
        <span class="text-[color:var(--wb-diff-delta-added)]">+{{ block.added }}</span>
        <span class="text-[color:var(--wb-diff-delta-removed)]">-{{ block.removed }}</span>
      </div>
      <button class="inline-flex items-center gap-1 rounded-full border-none bg-transparent px-2 py-1 text-[length:var(--wb-ui-text-2xs)] text-[color:var(--wb-text-secondary)] transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]">
        {{ block.revertLabel }}
        <Icon name="ph:arrow-u-up-left" class="h-[11px] w-[11px]" />
      </button>
    </div>

    <div class="overflow-visible">
      <div
        v-for="(file, index) in block.files"
        :key="file.id"
        class="relative z-0 border-b border-[color:var(--wb-divider)] hover:z-40 last:border-b-0"
      >
        <span
          class="pointer-events-none absolute bottom-full z-50 mb-1 max-w-[calc(100%-12px)] inline-flex translate-y-1 items-center truncate whitespace-nowrap border border-[color:var(--wb-border-3)] rounded-[8px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_88%,var(--wb-text-primary)_12%)] px-3 py-1 text-[length:var(--wb-code-text-sm)] text-[color:var(--wb-text-primary)] font-[var(--font-code)] opacity-0 transition-[opacity,transform] duration-160 -left-2"
          :class="hoveredFileId === file.id ? 'translate-y-0 opacity-100' : ''"
        >
          {{ file.path }}
        </span>
        <button
          type="button"
          class="group/file-row w-full flex items-center justify-between border-none bg-[var(--wb-card-tab-bg)] px-3 py-2 text-left transition-colors"
          :class="index === block.files.length - 1 && file.id !== diffStore.activeFileId(block.id) ? 'rounded-b-[8px]' : ''"
          @click="selectFile(file)"
        >
          <div class="min-w-0 flex items-center gap-2">
            <span
              class="truncate text-[length:var(--wb-ui-text-xs)] text-[color:var(--wb-text-primary)]"
              @mouseenter.stop="hoveredFileId = file.id"
              @mouseleave.stop="hoveredFileId = ''"
            >
              {{ file.path }}
            </span>
            <span class="shrink-0 text-[length:var(--wb-ui-text-2xs)] text-[color:var(--wb-diff-delta-added)]">+{{ file.added }}</span>
            <span class="shrink-0 text-[length:var(--wb-ui-text-2xs)] text-[color:var(--wb-diff-delta-removed)]">-{{ file.removed }}</span>
            <span
              v-if="file.showDot"
              class="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--theme-accent)]"
            />
          </div>
          <div
            class="ml-3 flex shrink-0 items-center gap-2 text-[color:var(--wb-text-secondary)] transition-colors duration-150 group-hover/file-row:text-[color:var(--wb-text-primary)]"
          >
            <span
              class="h-4 w-4 inline-flex items-center justify-center opacity-0 transition-[opacity,color] duration-150 group-hover/file-row:opacity-100"
              @click.stop
            >
              <Icon
                name="ph:arrow-square-out"
                class="h-[11px] w-[11px] text-current"
                aria-hidden="true"
              />
            </span>
            <Icon
              name="ph:caret-down-bold"
              class="h-[11px] w-[11px] shrink-0 text-[color:var(--wb-text-muted)] transition-[transform,color] duration-150 group-hover/file-row:text-[color:var(--wb-text-secondary)]"
              :class="file.id === diffStore.activeFileId(block.id) ? 'rotate-180' : ''"
              aria-hidden="true"
            />
          </div>
        </button>

        <div
          v-if="file.id === diffStore.activeFileId(block.id) && activeFile"
          class="[--wb-gutter-width:max(66px,calc(var(--wb-line-digits)*1ch+52px))] [--wb-row-divider-offset:0px] relative max-h-[190px] overflow-x-auto overflow-y-auto overscroll-contain border-t border-[color:var(--wb-divider)] bg-[var(--wb-card-content-bg)] text-[length:var(--wb-code-text-sm)] font-[var(--font-code)]"
          :style="{ '--wb-line-digits': activeFileLineDigits, '--wb-line-columns': activeFileLineColumns }"
          :class="index === block.files.length - 1 ? 'rounded-b-[8px] overflow-hidden' : ''"
        >
          <div
            v-for="line in visibleDiffLines(activeFile)"
            :key="`${file.id}-${line.left}-${line.right}-${line.text}`"
            class="relative grid grid-cols-[var(--wb-gutter-width)_max-content] w-[max(100%,calc(var(--wb-gutter-width)+var(--wb-line-columns)*1ch+28px))] border-b border-[color:color-mix(in_srgb,var(--wb-divider)_72%,transparent)] before:pointer-events-none before:absolute before:inset-y-0 before:left-[calc(var(--wb-gutter-width)+var(--wb-row-divider-offset))] before:z-[5] before:w-px last:border-b-0 before:bg-[var(--wb-row-divider)] before:content-['']"
            :class="lineBackground(line)"
          >
            <span
              class="relative z-[2] py-1 pl-8 pr-4 text-right text-[color:var(--wb-text-faint)] text-[length:calc(var(--wb-code-text)-2px)] tabular-nums"
              :class="lineMarkerClass(line)"
            >
              {{ line.right || line.left }}
            </span>
            <SyntaxLine
              class="relative z-[2] whitespace-pre py-1 pl-4 pr-2 leading-[1.5]"
              :text="line.text"
              :file-path="file.path"
              :code-theme-id="codeThemeId"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
