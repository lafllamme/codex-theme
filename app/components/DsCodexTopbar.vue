<script setup lang="ts">
const props = defineProps<{
  codeThemeId: string
  variant: 'dark' | 'light'
}>()

const emit = defineEmits<{
  toggleSidebar: []
}>()
</script>

<template>
  <div class="topbar-shell flex items-center justify-between gap-3 border border-white/10 rounded-[16px] bg-black/65 p-2.5 backdrop-blur-xl">
    <div class="flex min-w-0 items-center gap-2">
      <button class="top-icon lg:hidden" @click="emit('toggleSidebar')">
        <Icon name="ph:sidebar-bold" class="h-4 w-4" />
      </button>

      <div class="truncate rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
        <p class="truncate font-geist-600 text-[14px] text-white/92">
          Theme Workbench
        </p>
        <p class="font-geist-mono-400 text-[11px] text-white/48">
          codex-theme-v1 · {{ props.codeThemeId }} / {{ props.variant }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1 sm:flex">
        <span class="state-dot bg-[var(--un-preset-radix-green9)]" />
        <span class="state-dot bg-[var(--un-preset-radix-yellow9)]" />
        <span class="state-dot bg-[var(--un-preset-radix-red9)]" />
      </div>

      <button class="action-chip">
        <Icon name="ph:git-commit-bold" class="h-4 w-4" />
        Commit
      </button>
    </div>
  </div>
</template>

<style scoped>
.topbar-shell {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 16px 26px rgba(0, 0, 0, 0.24);
}

.top-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.04);
}

.action-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-family: var(--font-ui);
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.05);
}

.state-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}
</style>
