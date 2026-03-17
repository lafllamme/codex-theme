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
  <header class="flex h-[34px] items-center justify-between gap-2 px-1.5">
    <div class="inline-flex min-w-0 items-center gap-1.5">
      <strong class="truncate text-[13px] leading-none font-semibold text-pureWhite/94">{{ title }}</strong>
      <span class="truncate text-[13px] leading-none text-pureWhite/46">{{ repo }}</span>
      <button class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-transparent text-pureWhite/52 transition-colors hover:bg-pureWhite/7 hover:text-pureWhite/82">
        <Icon name="ph:dots-three" class="h-[12px] w-[12px]" />
      </button>
    </div>

    <div class="inline-flex items-center gap-1.5">
      <button
        class="inline-flex h-6 w-6 items-center justify-center rounded-[7px] border border-pureWhite/11 bg-pureBlack/52 text-pureWhite/72 transition-colors hover:bg-pureWhite/9 hover:text-pureWhite/94"
        :class="runEnabled ? 'bg-pureWhite/11 text-pureWhite/96' : ''"
        @click="emit('toggleRun')"
      >
        <Icon name="ph:play-bold" class="h-[10px] w-[10px]" />
      </button>

      <button class="inline-flex h-6 items-center gap-1 rounded-[7px] border border-pureWhite/11 bg-pureBlack/52 px-1.5 text-[10px] text-pureWhite/78">
        <Icon name="ph:caret-down-bold" class="h-[9px] w-[9px]" />
        <Icon name="ph:waves-bold" class="h-[10px] w-[10px]" />
      </button>

      <button class="inline-flex h-6 items-center gap-1 rounded-[7px] border border-pureWhite/11 bg-pureBlack/52 px-2 text-[10px] text-pureWhite/87 max-[1300px]:hidden">
        <Icon name="ph:arrows-left-right-bold" class="h-[10px] w-[10px]" />
        Move to Worktree
      </button>

      <button class="inline-flex h-6 items-center gap-1 rounded-[7px] border border-pureWhite/11 bg-pureBlack/52 px-2 text-[10px] text-pureWhite/90">
        <Icon name="ph:git-commit" class="h-[10px] w-[10px]" />
        Commit
        <Icon name="ph:caret-down-bold" class="h-[9px] w-[9px]" />
      </button>

      <span class="mx-[2px] h-[14px] w-px bg-pureWhite/12" />

      <button
        class="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-transparent text-pureWhite/56 transition-colors hover:bg-pureWhite/8 hover:text-pureWhite/90"
        :class="isTerminalOpen ? 'bg-pureWhite/10 text-pureWhite/92' : ''"
        @click="emit('toggleTerminal')"
      >
        <Icon name="ph:terminal-window-bold" class="h-[10px] w-[10px]" />
      </button>

      <button
        class="inline-flex h-6 items-center gap-[3px] rounded-[7px] bg-transparent px-1 text-pureWhite/56 transition-colors hover:bg-pureWhite/8 hover:text-pureWhite/92"
        :class="isDiffOpen ? 'bg-pureWhite/10 text-pureWhite/92' : ''"
        @click="emit('toggleDiff')"
      >
        <Icon name="ph:square-split-vertical-bold" class="h-[10px] w-[10px]" />
        <span class="font-[var(--font-code)] text-[10px] leading-none">
          <span class="text-[#30d07d]">+836</span>
          <span class="mx-[1px] text-pureWhite/40">-</span>
          <span class="text-[#ef4f5f]">1.068</span>
        </span>
      </button>

      <button
        class="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-transparent text-pureWhite/56 transition-colors hover:bg-pureWhite/8 hover:text-pureWhite/92"
        @click="emit('togglePip')"
      >
        <Icon :name="isPipEnabled ? 'ph:arrow-square-out-bold' : 'ph:square-bold'" class="h-[10px] w-[10px]" />
      </button>
    </div>
  </header>
</template>
