<script setup lang="ts">
import type { FileChangeCardBlock, FileChangeItem, FileDiffLine } from '~/types/workbench-chat'

const props = defineProps<{
  block: FileChangeCardBlock
}>()

const openFileId = ref(props.block.files[0]?.id ?? '')

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
</script>

<template>
  <section class="overflow-hidden border border-[color:var(--wb-border-2)] rounded-[var(--wb-chat-bubble-radius)] bg-[var(--wb-bubble-bg)]">
    <div class="flex items-center justify-between border-b border-[color:var(--wb-divider)] px-3 py-2">
      <div class="flex items-center gap-2 text-[12px] font-medium">
        <span class="text-[color:var(--wb-text-primary)]">{{ block.summaryLabel }}</span>
        <span class="text-[color:var(--wb-diff-delta-added)]">+{{ block.added }}</span>
        <span class="text-[color:var(--wb-diff-delta-removed)]">-{{ block.removed }}</span>
      </div>
      <button class="inline-flex items-center gap-1 rounded-[7px] border-none bg-transparent px-1.5 py-1 text-[11px] text-[color:var(--wb-text-secondary)] transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]">
        <Icon name="ph:arrow-counter-clockwise-bold" class="h-[11px] w-[11px]" />
        {{ block.revertLabel }}
      </button>
    </div>

    <div class="max-h-[320px] overflow-y-auto">
      <div
        v-for="file in block.files"
        :key="file.id"
        class="border-b border-[color:var(--wb-divider)] last:border-b-0"
      >
        <button
          class="group w-full flex items-center justify-between border-none bg-transparent px-3 py-2 text-left transition-colors hover:bg-[var(--wb-hover-bg)]"
          @click="selectFile(file)"
        >
          <div class="min-w-0 flex items-center gap-2">
            <span class="truncate text-[12px] text-[color:var(--wb-text-secondary)]">{{ file.path }}</span>
            <span class="text-[12px] text-[color:var(--wb-text-primary)] font-semibold">{{ file.fileName }}</span>
          </div>
          <div class="ml-3 flex items-center gap-2">
            <span class="text-[11px] text-[color:var(--wb-diff-delta-added)]">+{{ file.added }}</span>
            <span class="text-[11px] text-[color:var(--wb-diff-delta-removed)]">-{{ file.removed }}</span>
            <Icon
              name="ph:caret-down-bold"
              class="h-[11px] w-[11px] text-[color:var(--wb-text-muted)] opacity-0 transition-[opacity,transform] duration-150 group-hover:opacity-100"
              :class="file.id === openFileId ? 'rotate-180 opacity-100' : ''"
            />
          </div>
        </button>

        <div
          v-if="file.id === openFileId && activeFile"
          class="max-h-[190px] overflow-auto border-t border-[color:var(--wb-divider)] bg-[color-mix(in_srgb,var(--wb-input-bg)_72%,transparent)] text-[12px] font-[var(--font-code)]"
        >
          <div
            v-for="line in activeFile.lines"
            :key="`${file.id}-${line.left}-${line.right}-${line.text}`"
            class="grid grid-cols-[36px_36px_minmax(0,1fr)] border-b border-[color:color-mix(in_srgb,var(--wb-divider)_72%,transparent)] last:border-b-0"
            :style="{ background: lineBackground(line) }"
          >
            <span class="border-r border-[color:var(--wb-divider)] px-1.5 py-1 text-right text-[10px] text-[color:var(--wb-text-faint)] tabular-nums">{{ line.left }}</span>
            <span class="border-r border-[color:var(--wb-divider)] px-1.5 py-1 text-right text-[10px] text-[color:var(--wb-text-faint)] tabular-nums">{{ line.right }}</span>
            <span class="[overflow-wrap:anywhere] px-2 py-1 leading-[1.5]" :style="{ color: lineTextColor(line) }">{{ line.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
