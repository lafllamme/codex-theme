<script setup lang="ts">
defineProps<{
  isTerminalOpen: boolean
  isDiffOpen: boolean
  isPipEnabled: boolean
}>()

const emit = defineEmits<{
  toggleTerminal: []
  toggleDiff: []
  togglePip: []
}>()
</script>

<template>
  <div class="inline-flex items-center gap-1.5">
    <button
      class="inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-transparent text-white/[0.62] transition-colors hover:bg-white/[0.08] hover:text-white"
      :class="isTerminalOpen ? 'bg-white/[0.1] text-white' : ''"
      @click="emit('toggleTerminal')"
    >
      <Icon name="ph:terminal-window-bold" class="h-[15px] w-[15px]" />
    </button>

    <button
      class="inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-transparent text-white/[0.62] transition-colors hover:bg-white/[0.08] hover:text-white"
      @click="emit('togglePip')"
    >
      <Icon :name="isPipEnabled ? 'ph:arrow-square-out-bold' : 'ph:square-bold'" class="h-[15px] w-[15px]" />
    </button>

    <button
      class="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-transparent px-2 text-white/[0.62] transition-colors hover:bg-white/[0.08] hover:text-white"
      :class="isDiffOpen ? 'bg-white/[0.1] text-white' : ''"
      @click="emit('toggleDiff')"
    >
      <Icon name="ph:square-split-vertical-bold" class="h-[15px] w-[15px]" />
      <span class="font-[var(--font-code)] text-[11px] tracking-tight">
        <span class="text-[color:var(--theme-diff-added,#9ccfd8)]">+55</span>
        <span class="mx-[2px] text-white/[0.45]">/</span>
        <span class="text-[color:var(--theme-diff-removed,#908caa)]">-1047</span>
      </span>
    </button>
  </div>
</template>
