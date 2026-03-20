<script setup lang="ts">
import type { FileChangeCardBlock, FileChangeItem, FileDiffLine } from '~/types/workbench-chat'

const props = defineProps<{
  block: FileChangeCardBlock
}>()

const openFileId = ref(props.block.files[0]?.id ?? '')
const hoveredFileId = ref('')

const activeFile = computed(() => {
  return props.block.files.find(file => file.id === openFileId.value)
})

function selectFile(file: FileChangeItem) {
  openFileId.value = openFileId.value === file.id ? '' : file.id
}

function lineTextColor(line: FileDiffLine) {
  if (line.kind === 'add')
    return 'var(--wb-diff-delta-added)'
  if (line.kind === 'remove')
    return 'var(--wb-diff-delta-removed)'
  return 'var(--syntax-default)'
}

function lineBackground(line: FileDiffLine) {
  if (line.kind === 'add')
    return 'color-mix(in srgb, var(--wb-diff-delta-added) 13%, transparent)'
  if (line.kind === 'remove')
    return 'color-mix(in srgb, var(--wb-diff-delta-removed) 13%, transparent)'
  return 'transparent'
}

function lineMarkerClass(line: FileDiffLine) {
  if (line.kind === 'add')
    return 'border-l-2 border-l-[color:var(--wb-diff-delta-added)]'
  if (line.kind === 'remove')
    return 'border-l-2 border-l-[color:var(--wb-diff-delta-removed)]'
  return 'border-l-2 border-l-transparent'
}

function lineMarkerStyle(line: FileDiffLine) {
  if (line.kind === 'add')
    return { borderLeftStyle: 'solid' }
  if (line.kind === 'remove')
    return { borderLeftStyle: 'dashed' }
  return { borderLeftStyle: 'solid' }
}
</script>

<template>
  <section class="overflow-visible border border-[color:var(--wb-border-2)] rounded-[var(--wb-chat-bubble-radius)] bg-[var(--wb-bubble-bg)]">
    <div class="flex items-center justify-between border-b border-[color:var(--wb-divider)] px-3 py-2">
      <div class="flex items-center gap-2 text-[length:var(--wb-ui-text-xs)] font-medium">
        <span class="text-[color:var(--wb-text-primary)]">{{ block.summaryLabel }}</span>
        <span class="text-[color:var(--wb-diff-delta-added)]">+{{ block.added }}</span>
        <span class="text-[color:var(--wb-diff-delta-removed)]">-{{ block.removed }}</span>
      </div>
      <button class="inline-flex items-center gap-1 rounded-[7px] border-none bg-transparent px-1.5 py-1 text-[length:var(--wb-ui-text-2xs)] text-[color:var(--wb-text-secondary)] transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]">
        <Icon name="ph:arrow-counter-clockwise-bold" class="h-[11px] w-[11px]" />
        {{ block.revertLabel }}
      </button>
    </div>

    <div class="overflow-visible">
      <div
        v-for="file in block.files"
        :key="file.id"
        class="group relative z-0 border-b border-[color:var(--wb-divider)] last:border-b-0 hover:z-30"
      >
        <span
          class="pointer-events-none absolute -left-2 bottom-full z-50 mb-1 inline-flex max-w-[calc(100%-12px)] translate-y-1 items-center truncate whitespace-nowrap border border-[color:var(--wb-border-3)] rounded-[8px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_88%,var(--wb-text-primary)_12%)] px-3 py-1 text-[length:var(--wb-code-text-sm)] text-[color:var(--wb-text-primary)] font-[var(--font-code)] opacity-0 transition-[opacity,transform] duration-160"
          :class="hoveredFileId === file.id ? 'translate-y-0 opacity-100' : ''"
        >
          {{ file.path }}
        </span>
        <button
          class="group w-full flex items-center justify-between border-none bg-transparent px-3 py-2 text-left transition-colors hover:bg-[var(--wb-hover-bg)]"
          :class="block.files[block.files.length - 1]?.id === file.id && file.id !== openFileId ? 'rounded-b-[calc(var(--wb-chat-bubble-radius)-2px)]' : ''"
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
          </div>
          <div class="ml-3 flex items-center gap-2">
            <Icon
              name="ph:caret-down-bold"
              class="h-[11px] w-[11px] text-[color:var(--wb-text-muted)] opacity-0 transition-[opacity,transform] duration-150 group-hover:opacity-100"
              :class="file.id === openFileId ? 'rotate-180 opacity-100' : ''"
            />
          </div>
        </button>

        <div
          v-if="file.id === openFileId && activeFile"
          class="max-h-[190px] overflow-auto border-t border-[color:var(--wb-divider)] bg-[color-mix(in_srgb,var(--wb-input-bg)_72%,transparent)] text-[length:var(--wb-code-text-sm)] font-[var(--font-code)]"
        >
          <div
            v-for="line in activeFile.lines"
            :key="`${file.id}-${line.left}-${line.right}-${line.text}`"
            class="grid grid-cols-[44px_minmax(0,1fr)] border-b border-[color:color-mix(in_srgb,var(--wb-divider)_72%,transparent)] last:border-b-0"
            :class="lineMarkerClass(line)"
            :style="{ background: lineBackground(line), ...lineMarkerStyle(line) }"
          >
            <span class="border-r border-[color:var(--wb-divider)] px-2 py-1 text-right text-[length:calc(var(--wb-code-text)-2px)] text-[color:var(--wb-text-faint)] tabular-nums">{{ line.right || line.left }}</span>
            <span class="[overflow-wrap:anywhere] px-2 py-1 leading-[1.5]" :style="{ color: lineTextColor(line) }">{{ line.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
