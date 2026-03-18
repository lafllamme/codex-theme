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
      class="border-white/[0.08] bg-black/[0.42] text-white/[0.75] hover:bg-white/[0.07] hover:text-white h-8 w-8 inline-flex items-center justify-center border rounded-[7px] transition-colors"
      :class="runEnabled ? 'text-white bg-white/[0.09]' : ''"
      @click="emit('toggleRun')"
    >
      <Icon name="ph:play-bold" class="h-[14px] w-[14px]" />
    </button>

    <button class="border-white/[0.1] bg-white/[0.03] text-white/[0.9] h-8 inline-flex items-center gap-1 border rounded-[8px] px-2 text-[12px]">
      <Icon name="ph:caret-down-bold" class="h-3 w-3" />
      <Icon name="ph:waves-bold" class="h-3 w-3" />
    </button>

    <button class="border-white/[0.12] bg-white/[0.92] text-black/[0.9] h-8 inline-flex items-center gap-1.5 border rounded-[8px] px-2.5 text-[12px] font-[var(--font-ui)] max-[1180px]:hidden">
      <Icon name="ph:arrows-left-right-bold" class="h-[13px] w-[13px]" />
      In Worktree verschieben
    </button>

    <button class="border-white/[0.12] bg-white/[0.92] text-black/[0.9] h-8 inline-flex items-center gap-1.5 border rounded-[8px] px-2.5 text-[12px] font-[var(--font-ui)] max-[1180px]:hidden">
      Commit
      <Icon name="ph:caret-down-bold" class="h-3 w-3" />
    </button>
  </div>
</template>
