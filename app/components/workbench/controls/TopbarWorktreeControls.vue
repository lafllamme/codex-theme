<script setup lang="ts">
defineProps<{
  runEnabled: boolean
}>()

const emit = defineEmits<{
  toggleRun: []
}>()
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <button
      class="inline-flex h-8 w-8 items-center justify-center rounded-[7px] border border-white/[0.08] bg-black/[0.42] text-white/[0.75] transition-colors hover:bg-white/[0.07] hover:text-white"
      :class="runEnabled ? 'text-white bg-white/[0.09]' : ''"
      @click="emit('toggleRun')"
    >
      <Icon name="ph:play-bold" class="h-[14px] w-[14px]" />
    </button>

    <button class="inline-flex h-8 items-center gap-1 rounded-[8px] border border-white/[0.1] bg-white/[0.03] px-2 text-[12px] text-white/[0.9]">
      <Icon name="ph:caret-down-bold" class="h-3 w-3" />
      <Icon name="ph:waves-bold" class="h-3 w-3" />
    </button>

    <button class="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-white/[0.12] bg-white/[0.92] px-2.5 text-[12px] text-black/[0.9] max-[1180px]:hidden">
      <Icon name="ph:arrows-left-right-bold" class="h-[13px] w-[13px]" />
      In Worktree verschieben
    </button>

    <button class="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-white/[0.12] bg-white/[0.92] px-2.5 text-[12px] text-black/[0.9] max-[1180px]:hidden">
      Commit
      <Icon name="ph:caret-down-bold" class="h-3 w-3" />
    </button>
  </div>
</template>
