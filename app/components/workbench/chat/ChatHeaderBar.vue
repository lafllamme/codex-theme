<script setup lang="ts">
defineProps<{
  title: string
  repo: string
  runEnabled: boolean
  isTerminalOpen: boolean
  isDiffOpen: boolean
  isPipEnabled: boolean
}>()

const emit = defineEmits<{
  toggleRun: []
  toggleTerminal: []
  toggleDiff: []
  togglePip: []
}>()
</script>

<template>
  <header class="flex min-h-[42px] items-center justify-between gap-3 rounded-[10px] border border-[var(--wb-border-2)] bg-[rgba(11,13,17,0.56)] px-2.5 py-1.5">
    <div class="inline-flex min-w-0 items-center gap-2.5">
      <strong class="truncate text-[14px] leading-none font-semibold text-pureWhite/95">{{ title }}</strong>
      <span class="truncate font-[var(--font-code)] text-[12px] text-pureWhite/52">{{ repo }}</span>
      <button class="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-transparent text-pureWhite/52 transition-colors hover:bg-pureWhite/7 hover:text-pureWhite/86">
        <Icon name="ph:dots-three" class="h-[13px] w-[13px]" />
      </button>
    </div>

    <div class="inline-flex items-center gap-1.5">
      <button
        class="inline-flex h-7 w-7 items-center justify-center rounded-[7px] border border-pureWhite/10 bg-black/42 text-pureWhite/74 transition-colors hover:bg-pureWhite/8 hover:text-pureWhite/96"
        :class="runEnabled ? 'bg-pureWhite/11 text-pureWhite/96' : ''"
        @click="emit('toggleRun')"
      >
        <Icon name="ph:play-bold" class="h-[13px] w-[13px]" />
      </button>

      <button class="inline-flex h-7 items-center gap-1 rounded-[7px] border border-pureWhite/10 bg-pureWhite/4 px-2 text-[11px] text-pureWhite/86">
        <Icon name="ph:caret-down-bold" class="h-[10px] w-[10px]" />
        <Icon name="ph:waves-bold" class="h-[11px] w-[11px]" />
      </button>

      <button class="inline-flex h-7 items-center gap-1 rounded-[7px] border border-pureWhite/10 bg-pureWhite/4 px-2 text-[11px] text-pureWhite/86 max-[1300px]:hidden">
        <Icon name="ph:arrows-left-right-bold" class="h-[11px] w-[11px]" />
        Move to Worktree
      </button>

      <button class="inline-flex h-7 items-center gap-1 rounded-[7px] border border-pureWhite/10 bg-pureWhite/4 px-2 text-[11px] text-pureWhite/92">
        <Icon name="ph:wave-sine-bold" class="h-[11px] w-[11px]" />
        Commit
        <Icon name="ph:caret-down-bold" class="h-[10px] w-[10px]" />
      </button>

      <span class="mx-[1px] h-[16px] w-px bg-pureWhite/14" />

      <button
        class="inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-transparent text-pureWhite/60 transition-colors hover:bg-pureWhite/8 hover:text-pureWhite/92"
        :class="isTerminalOpen ? 'bg-pureWhite/10 text-pureWhite/94' : ''"
        @click="emit('toggleTerminal')"
      >
        <Icon name="ph:terminal-window-bold" class="h-[13px] w-[13px]" />
      </button>

      <button
        class="inline-flex h-7 items-center gap-[3px] rounded-[7px] bg-transparent px-1.5 text-pureWhite/60 transition-colors hover:bg-pureWhite/8 hover:text-pureWhite/92"
        :class="isDiffOpen ? 'bg-pureWhite/10 text-pureWhite/94' : ''"
        @click="emit('toggleDiff')"
      >
        <Icon name="ph:square-split-vertical-bold" class="h-[13px] w-[13px]" />
        <span class="font-[var(--font-code)] text-[10.5px] leading-none tracking-tight">
          <span class="text-[#30d07d]">+12</span>
          <span class="mx-[1px] text-pureWhite/38">-</span>
          <span class="text-[#ef4f5f]">6</span>
        </span>
      </button>

      <button
        class="inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-transparent text-pureWhite/60 transition-colors hover:bg-pureWhite/8 hover:text-pureWhite/92"
        @click="emit('togglePip')"
      >
        <Icon :name="isPipEnabled ? 'ph:arrow-square-out-bold' : 'ph:square-bold'" class="h-[13px] w-[13px]" />
      </button>
    </div>
  </header>
</template>
