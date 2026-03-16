<script setup lang="ts">
defineProps<{
  title: string
  repo: string
  runEnabled: boolean
  pipEnabled: boolean
  isTerminalOpen: boolean
  isDiffOpen: boolean
  mobileSidebarOpen: boolean
}>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleSidebarMobile: []
  toggleRun: []
  toggleTerminal: []
  toggleDiff: []
  togglePip: []
}>()
</script>

<template>
  <header class="app-topbar">
    <div class="app-topbar__left">
      <span class="dot dot-red" />
      <span class="dot dot-yellow" />
      <span class="dot dot-green" />

      <button class="sidebar-toggle mobile-only" @click="emit('toggleSidebarMobile')">
        <Icon :name="mobileSidebarOpen ? 'ph:x-bold' : 'ph:list-bold'" class="icon-14" />
      </button>
      <button class="sidebar-toggle desktop-only" @click="emit('toggleSidebar')">
        <Icon name="ph:sidebar-simple-bold" class="icon-14" />
      </button>

      <div class="title-line">
        <strong>{{ title }}</strong>
        <span>{{ repo }}</span>
      </div>
    </div>

    <div class="app-topbar__actions">
      <button class="run-btn" :class="runEnabled ? 'run-btn--active' : ''" @click="emit('toggleRun')">
        <Icon name="ph:play-bold" class="icon-14" />
      </button>

      <button class="light-chip">
        <Icon name="ph:caret-down-bold" class="icon-12" />
        <Icon name="ph:wave-sine-bold" class="icon-12" />
      </button>

      <button class="light-chip desktop-only">
        <Icon name="ph:arrows-left-right-bold" class="icon-14" /> In Worktree verschieben
      </button>

      <button class="light-chip desktop-only">
        <Icon name="ph:cloud-arrow-up-bold" class="icon-14" /> Push
        <Icon name="ph:caret-down-bold" class="icon-12" />
      </button>

      <span class="toolbar-divider" />

      <button class="ghost-icon" :class="isTerminalOpen ? 'ghost-icon--active' : ''" @click="emit('toggleTerminal')">
        <Icon name="ph:terminal-window-bold" class="icon-14" />
      </button>
      <button class="ghost-icon" :class="isDiffOpen ? 'ghost-icon--active' : ''" @click="emit('toggleDiff')">
        <Icon name="ph:file-diff-bold" class="icon-14" />
        <span class="count">9</span>
      </button>
      <button class="ghost-icon" :class="pipEnabled ? 'ghost-icon--active' : ''" @click="emit('togglePip')">
        <Icon name="ph:rectangle-bold" class="icon-14" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-topbar {
  min-height: var(--wb-topbar-height);
  border: 1px solid var(--wb-border-2);
  border-radius: var(--wb-r-md);
  background: var(--wb-panel-bg-2);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.app-topbar__left,
.app-topbar__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #febc2e; }
.dot-green { background: #28c840; }

.sidebar-toggle {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--wb-border-2);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.86);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-only { display: none; }

.title-line {
  margin-left: 4px;
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
}

.title-line strong {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.title-line span {
  font-family: var(--font-code);
  font-size: 14px;
  opacity: 0.62;
}

.run-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.82);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.run-btn--active { color: #fff; }

.light-chip {
  height: 32px;
  padding: 0 10px;
  border-radius: 9px;
  border: 1px solid var(--wb-border-2);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.toolbar-divider {
  width: 1px;
  height: 22px;
  background: var(--wb-border-3);
}

.ghost-icon {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ghost-icon--active {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.count {
  position: absolute;
  top: -4px;
  right: -5px;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  padding: 0 4px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-14 { width: 14px; height: 14px; }
.icon-12 { width: 12px; height: 12px; }

@media (max-width: 1180px) {
  .desktop-only { display: none; }
  .mobile-only { display: inline-flex; }

  .app-topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .app-topbar__actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
