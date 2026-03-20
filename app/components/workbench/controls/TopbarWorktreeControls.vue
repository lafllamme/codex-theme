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
      class="h-8 w-8 inline-flex items-center justify-center border border-[color:var(--wb-chip-ghost-border)] rounded-[11px] bg-[var(--wb-chip-ghost-bg)] text-[color:var(--wb-text-secondary)] transition-colors hover:bg-[var(--wb-chip-ghost-bg-hover)] hover:text-[color:var(--wb-text-primary)]"
      :class="runEnabled ? 'text-[color:var(--wb-text-primary)] bg-[var(--wb-chip-ghost-bg-active)]' : ''"
      @click="emit('toggleRun')"
    >
      <Icon name="ph:play-bold" class="h-[14px] w-[14px]" />
    </button>

    <button class="h-8 inline-flex items-center gap-1 border border-[color:var(--wb-chip-ghost-border)] rounded-[11px] bg-[var(--wb-chip-ghost-bg)] px-2 text-[12px] text-[color:var(--wb-text-primary)] transition-colors hover:bg-[var(--wb-chip-ghost-bg-hover)]">
      <Icon name="ph:caret-down-bold" class="h-3 w-3" />
      <Icon name="ph:waves-bold" class="h-3 w-3" />
    </button>

    <button class="h-8 inline-flex items-center gap-1.5 border border-[color:var(--wb-chip-ghost-border)] rounded-[11px] bg-[var(--wb-chip-ghost-bg)] px-2.5 text-[12px] text-[color:var(--wb-text-primary)] font-[var(--font-ui)] transition-colors max-[1180px]:hidden hover:bg-[var(--wb-chip-ghost-bg-hover)]">
      <Icon name="ph:arrows-left-right-bold" class="h-[13px] w-[13px]" />
      In Worktree verschieben
    </button>

    <button class="h-8 inline-flex items-center gap-1.5 border border-[color:var(--wb-chip-ghost-border)] rounded-[11px] bg-[var(--wb-chip-ghost-bg)] px-2.5 text-[12px] text-[color:var(--wb-text-primary)] font-[var(--font-ui)] transition-colors max-[1180px]:hidden hover:bg-[var(--wb-chip-ghost-bg-hover)]">
      Commit
      <Icon name="ph:caret-down-bold" class="h-3 w-3" />
    </button>
  </div>
</template>
