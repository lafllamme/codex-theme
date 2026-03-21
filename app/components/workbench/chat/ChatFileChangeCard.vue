<script setup lang="ts">
import type {
  FileChangeCardBlock,
  FileChangeItem,
  FileDiffCodeLine,
  FileDiffLine,
} from '~/types/workbench-chat'
import { useDiffStore } from '~/stores/diff'

const props = defineProps<{
  block: FileChangeCardBlock
}>()

const hoveredFileId = ref('')
const diffStore = useDiffStore()

diffStore.upsertFiles(props.block.files)
diffStore.ensureCardState(props.block.id, props.block.files.map(file => file.id))

const activeFile = computed(() => diffStore.activeFile(props.block.id))

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

function lineTextColor(line: FileDiffCodeLine) {
  if (line.kind === 'add' || line.kind === 'added')
    return 'var(--wb-diff-delta-added)'
  if (line.kind === 'remove' || line.kind === 'removed')
    return 'var(--wb-diff-delta-removed)'
  return 'var(--syntax-default)'
}

function lineBackground(line: FileDiffCodeLine) {
  if (line.kind === 'add' || line.kind === 'added')
    return 'color-mix(in srgb, var(--wb-diff-delta-added) 13%, transparent)'
  if (line.kind === 'remove' || line.kind === 'removed')
    return 'color-mix(in srgb, var(--wb-diff-delta-removed) 13%, transparent)'
  return 'transparent'
}

function lineMarkerClass(line: FileDiffCodeLine) {
  if (line.kind === 'add' || line.kind === 'added')
    return 'border-l-2 border-l-[color:var(--wb-diff-delta-added)]'
  if (line.kind === 'remove' || line.kind === 'removed')
    return 'border-l-2 border-l-[color:var(--wb-diff-delta-removed)]'
  return 'border-l-2 border-l-transparent'
}

function lineMarkerStyle(line: FileDiffCodeLine) {
  if (line.kind === 'add' || line.kind === 'added')
    return { borderLeftStyle: 'solid' as const }
  if (line.kind === 'remove' || line.kind === 'removed')
    return { borderLeftStyle: 'dashed' as const }
  return { borderLeftStyle: 'solid' as const }
}
</script>

<template>
  <section
    class="[--wb-card-content-bg:var(--wb-bubble-bg)] [--wb-card-summary-bg:color-mix(in_srgb,var(--wb-bubble-bg)_96%,var(--wb-text-primary)_4%)] [--wb-card-tab-bg:color-mix(in_srgb,var(--wb-bubble-bg)_98%,var(--wb-text-primary)_2%)] overflow-visible border border-[color:var(--wb-border-2)] rounded-[10px] bg-[var(--wb-card-content-bg)]"
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
        class="group relative z-0 border-b border-[color:var(--wb-divider)] hover:z-40 last:border-b-0"
      >
        <span
          class="pointer-events-none absolute bottom-full z-50 mb-1 max-w-[calc(100%-12px)] inline-flex translate-y-1 items-center truncate whitespace-nowrap border border-[color:var(--wb-border-3)] rounded-[8px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_88%,var(--wb-text-primary)_12%)] px-3 py-1 text-[length:var(--wb-code-text-sm)] text-[color:var(--wb-text-primary)] font-[var(--font-code)] opacity-0 transition-[opacity,transform] duration-160 -left-2"
          :class="hoveredFileId === file.id ? 'translate-y-0 opacity-100' : ''"
        >
          {{ file.path }}
        </span>
        <button
          class="group w-full flex items-center justify-between border-none bg-[var(--wb-card-tab-bg)] px-3 py-2 text-left transition-colors"
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
          <div class="ml-3 flex items-center gap-2">
            <Icon
              name="ph:caret-down-bold"
              class="h-[11px] w-[11px] text-[color:var(--wb-text-muted)] opacity-0 transition-[opacity,transform] duration-150 group-hover:opacity-100"
              :class="file.id === diffStore.activeFileId(block.id) ? 'rotate-180 opacity-100' : ''"
            />
          </div>
        </button>

        <div
          v-if="file.id === diffStore.activeFileId(block.id) && activeFile"
          class="max-h-[190px] overflow-auto border-t border-[color:var(--wb-divider)] bg-[var(--wb-card-content-bg)] text-[length:var(--wb-code-text-sm)] font-[var(--font-code)]"
          :class="index === block.files.length - 1 ? 'rounded-b-[8px] overflow-hidden' : ''"
        >
          <div
            v-for="line in visibleDiffLines(activeFile)"
            :key="`${file.id}-${line.left}-${line.right}-${line.text}`"
            class="grid grid-cols-[44px_minmax(0,1fr)] border-b border-[color:color-mix(in_srgb,var(--wb-divider)_72%,transparent)] last:border-b-0"
            :style="{ background: lineBackground(line) }"
          >
            <span
              class="border-r border-[color:var(--wb-divider)] px-2 py-1 text-right text-[color:var(--wb-text-faint)] text-[length:calc(var(--wb-code-text)-2px)] tabular-nums"
              :class="lineMarkerClass(line)"
              :style="lineMarkerStyle(line)"
            >
              {{ line.right || line.left }}
            </span>
            <span class="[overflow-wrap:anywhere] px-2 py-1 leading-[1.5]" :style="{ color: lineTextColor(line) }">{{ line.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
