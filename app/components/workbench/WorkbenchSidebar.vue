<script setup lang="ts">
interface ThreadItem {
  id: string
  title: string
  repo: string
  time: string
}

defineProps<{
  threads: ThreadItem[]
  activeThreadId: string
  collapsed: boolean
  mobileOpen: boolean
}>()

const emit = defineEmits<{
  selectThread: [id: string]
  newThread: []
  closeMobile: []
  toggleCollapsed: []
}>()
</script>

<template>
  <div class="sidebar-backdrop" :class="mobileOpen ? 'sidebar-backdrop--open' : ''" @click="emit('closeMobile')" />
  <aside class="sidebar" :class="[collapsed ? 'sidebar--collapsed' : '', mobileOpen ? 'sidebar--mobile-open' : '']">
    <button class="nav-row" @click="emit('newThread')">
      <Icon name="ph:pencil-simple-line-bold" class="icon-16" />
      <span class="sidebar-label">New Thread</span>
    </button>

    <button class="nav-row">
      <Icon name="ph:clock-counter-clockwise-bold" class="icon-16" />
      <span class="sidebar-label">Automations</span>
    </button>

    <button class="nav-row">
      <Icon name="ph:circles-four-bold" class="icon-16" />
      <span class="sidebar-label">Skills</span>
    </button>

    <div class="thread-head">
      <span class="sidebar-label">Threads</span>
      <div class="thread-head__icons">
        <button class="tiny-icon">
          <Icon name="ph:folder-plus-bold" class="icon-12" />
        </button>
        <button class="tiny-icon">
          <Icon name="ph:funnel-simple-bold" class="icon-12" />
        </button>
        <button class="tiny-icon" @click="emit('toggleCollapsed')">
          <Icon :name="collapsed ? 'ph:caret-right-bold' : 'ph:caret-left-bold'" class="icon-12" />
        </button>
      </div>
    </div>

    <button
      v-for="thread in threads"
      :key="thread.id"
      class="thread-row"
      :class="thread.id === activeThreadId ? 'thread-row--active' : ''"
      @click="emit('selectThread', thread.id)"
    >
      <span class="thread-row__title sidebar-label">{{ thread.title }}</span>
      <span class="thread-row__time sidebar-label">{{ thread.time }}</span>
      <span class="thread-dot" />
    </button>

    <button class="settings-row">
      <Icon name="ph:gear-six-bold" class="icon-16" />
      <span class="sidebar-label">Settings</span>
    </button>
  </aside>
</template>

<style scoped>
.sidebar-backdrop {
  display: none;
}

.sidebar {
  border-radius: var(--wb-r-lg);
  background: var(--sidebar-bg);
  border: 1px solid var(--wb-border-1);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
  overflow: hidden;
  transition:
    width 220ms ease,
    padding 180ms ease,
    transform 220ms ease;
}

.sidebar--collapsed {
  width: 88px;
  padding-inline: 7px;
}

.nav-row,
.thread-row,
.settings-row {
  min-height: 40px;
  border-radius: 10px;
  border: 1px solid var(--wb-border-2);
  background: rgba(255, 255, 255, 0.02);
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
}

.sidebar-label {
  white-space: nowrap;
  transition: opacity 160ms ease, transform 160ms ease;
}

.sidebar--collapsed .sidebar-label {
  opacity: 0;
  transform: translateX(-9px);
  width: 0;
  overflow: hidden;
}

.thread-head {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.58);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.thread-head__icons {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tiny-icon {
  width: 22px;
  height: 22px;
  border: 1px solid var(--wb-border-2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.thread-row { justify-content: space-between; }

.thread-row__title {
  max-width: 74%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thread-row__time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.thread-dot {
  display: none;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
}

.sidebar--collapsed .thread-dot { display: inline-block; }

.thread-row--active {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.2);
}

.icon-16 { width: 16px; height: 16px; }
.icon-12 { width: 12px; height: 12px; }

@media (max-width: 1180px) {
  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.38);
    opacity: 0;
    pointer-events: none;
    transition: opacity 180ms ease;
    z-index: 39;
  }

  .sidebar-backdrop--open {
    opacity: 1;
    pointer-events: auto;
  }

  .sidebar,
  .sidebar--collapsed {
    position: fixed;
    top: 104px;
    left: 8px;
    width: min(82vw, 320px);
    max-height: calc(100vh - 116px);
    transform: translateX(-112%);
    z-index: 40;
    overflow-y: auto;
  }

  .sidebar--mobile-open {
    transform: translateX(0);
  }

  .sidebar--collapsed .sidebar-label {
    opacity: 1;
    transform: none;
    width: auto;
  }

  .sidebar--collapsed .thread-dot {
    display: none;
  }
}
</style>
