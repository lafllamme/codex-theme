<script setup lang="ts">
const props = defineProps<{
  codeThemeId: string
  variant: 'dark' | 'light'
  inspectorOpen: boolean
  sidebarCollapsed: boolean
}>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleInspector: []
  commit: []
}>()
</script>

<template>
  <div class="topbar-shell">
    <div class="min-w-0 flex items-center gap-2">
      <button class="top-icon lg:hidden" @click="emit('toggleSidebar')">
        <Icon name="ph:sidebar-bold" class="h-4 w-4" />
      </button>

      <div class="border-white/10 bg-white/[0.03] truncate border rounded-xl px-3 py-2">
        <p class="font-geist-600 text-white/92 truncate text-[14px]">
          Theme Workbench
        </p>
        <p class="font-geist-mono-400 text-white/48 text-[11px]">
          codex-theme-v1 · {{ props.codeThemeId }} / {{ props.variant }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="border-white/10 bg-white/[0.03] hidden items-center gap-1.5 border rounded-xl p-1 sm:flex">
        <span class="state-dot bg-[var(--un-preset-radix-green9)]" />
        <span class="state-dot bg-[var(--un-preset-radix-yellow9)]" />
        <span class="state-dot bg-[var(--un-preset-radix-red9)]" />
      </div>

      <button class="top-icon" :class="props.sidebarCollapsed ? '' : 'top-icon--active'" title="Toggle sidebar" @click="emit('toggleSidebar')">
        <Icon name="ph:panel-left-bold" class="h-4 w-4" />
      </button>
      <button class="top-icon" :class="props.inspectorOpen ? 'top-icon--active' : ''" title="Toggle inspector" @click="emit('toggleInspector')">
        <Icon name="ph:sliders-horizontal-bold" class="h-4 w-4" />
      </button>

      <button class="action-chip" @click="emit('commit')">
        <Icon name="ph:git-commit-bold" class="h-4 w-4" />
        Commit
      </button>
    </div>
  </div>
</template>

<style scoped>
.topbar-shell {
  border: 1px solid var(--panel-border, rgba(255, 255, 255, 0.14));
  border-radius: 16px;
  background: var(--panel-bg, rgba(6, 7, 8, 0.92));
  backdrop-filter: blur(var(--panel-blur, 24px));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 16px 26px rgba(0, 0, 0, 0.24);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px;
}

.top-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.04);
  transition: all 160ms ease;
}

.top-icon:hover {
  border-color: rgba(255, 255, 255, 0.24);
  color: rgba(255, 255, 255, 0.92);
}

.top-icon--active {
  border-color: rgba(130, 247, 231, 0.46);
  color: rgba(130, 247, 231, 0.96);
  background: rgba(130, 247, 231, 0.15);
}

.action-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-family: var(--font-ui);
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.05);
  transition: all 160ms ease;
}

.action-chip:hover {
  border-color: rgba(130, 247, 231, 0.48);
  color: rgba(130, 247, 231, 0.98);
}

.state-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}
</style>
