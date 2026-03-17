<script setup lang="ts">
interface ThreadItem {
  id: string
  title: string
  repo: string
  time: string
  added?: number
  removed?: number
}

const props = defineProps<{
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
const { activeThreadId, collapsed, mobileOpen } = toRefs(props)
const collapsedRepos = ref<Set<string>>(new Set())

const groupedThreads = computed(() => {
  const groups: Array<{ repo: string, items: ThreadItem[] }> = []
  for (const thread of props.threads) {
    const group = groups.find(item => item.repo === thread.repo)
    if (group)
      group.items.push(thread)
    else
      groups.push({ repo: thread.repo, items: [thread] })
  }
  return groups
})

function isRepoCollapsed(repo: string) {
  return collapsedRepos.value.has(repo)
}

function toggleRepo(repo: string) {
  const next = new Set(collapsedRepos.value)
  if (next.has(repo))
    next.delete(repo)
  else
    next.add(repo)
  collapsedRepos.value = next
}
</script>

<template>
  <div class="sidebar-backdrop" :class="mobileOpen ? 'sidebar-backdrop--open' : ''" @click="emit('closeMobile')" />
  <aside class="sidebar [backdrop-filter:var(--wb-sidebar-backdrop-filter)] h-full min-h-0 w-full flex flex-col overflow-hidden rounded-[var(--wb-r-lg)] bg-[var(--wb-bg-sidebar)] p-[7px] text-[color:var(--wb-text-primary)]" :class="[mobileOpen ? 'sidebar--mobile-open' : '', collapsed ? 'sidebar--collapsed-shell' : '']">
    <div class="mb-[2px] flex items-center justify-between px-[2px]">
      <div class="inline-flex items-center gap-[7px]">
        <span class="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span class="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span class="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <button class="h-6 w-6 inline-flex appearance-none items-center justify-center border-none bg-transparent p-0 text-[color:var(--wb-text-faint)] shadow-none outline-none transition-colors hover:text-[color:var(--wb-text-secondary)]" @click="emit('toggleCollapsed')">
        <Icon name="ph:sidebar-simple-light" class="h-[13px] w-[13px]" />
      </button>
    </div>

    <div class="sidebar-content" :class="collapsed ? 'sidebar-content--collapsed' : 'sidebar-content--expanded'">
      <button class="nav-row min-h-[36px] flex items-center gap-2 border border-transparent rounded-[9px] bg-transparent px-[10px] text-left text-[13.5px] text-[color:var(--wb-text-primary)] font-medium transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]" @click="emit('newThread')">
        <Icon name="ph:note-pencil" class="h-[15px] w-[15px]" />
        <span class="sidebar-label truncate">New Thread</span>
      </button>

      <button class="nav-row min-h-[36px] flex items-center gap-2 border border-transparent rounded-[9px] bg-transparent px-[10px] text-left text-[13.5px] text-[color:var(--wb-text-primary)] font-medium transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]">
        <Icon name="ph:clock" class="h-[15px] w-[15px]" />
        <span class="sidebar-label truncate">Automations</span>
      </button>

      <button class="nav-row min-h-[36px] flex items-center gap-2 border border-transparent rounded-[9px] bg-transparent px-[10px] text-left text-[13.5px] text-[color:var(--wb-text-primary)] font-medium transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]">
        <Icon name="ph:circles-four-bold" class="h-[14px] w-[14px]" />
        <span class="sidebar-label truncate">Skills</span>
      </button>

      <div class="min-h-0 flex flex-1 flex-col">
        <div class="mt-1.5 flex items-center justify-between px-[2px] pr-[6px] text-[10px] text-[color:var(--wb-text-muted)] tracking-[0.13em] uppercase">
          <span class="sidebar-label">Threads</span>
          <div class="inline-flex translate-y-[1px] items-center gap-2">
            <button class="h-[18px] w-[18px] inline-flex items-center justify-center border-none bg-transparent p-0 text-[color:var(--wb-text-secondary)] transition-colors hover:text-[color:var(--wb-text-primary)]">
              <Icon name="ph:folder-plus" class="h-[15px] w-[15px]" />
            </button>
            <button class="h-[18px] w-[18px] inline-flex items-center justify-center border-none bg-transparent p-0 text-[color:var(--wb-text-secondary)] transition-colors hover:text-[color:var(--wb-text-primary)]">
              <Icon name="ph:funnel-simple" class="h-[15px] w-[15px]" />
            </button>
          </div>
        </div>

        <div class="mt-0.5 flex-1 overflow-y-auto pr-[2px]">
          <div v-for="group in groupedThreads" :key="group.repo" class="mt-0.5 flex flex-col gap-[3px]">
            <button class="group w-full inline-flex appearance-none items-center justify-between gap-2 border-none bg-transparent px-[10px] py-0 text-left text-[12.5px] text-[color:var(--wb-text-secondary)] font-semibold shadow-none outline-none" @click="toggleRepo(group.repo)">
              <span class="min-w-0 inline-flex items-center gap-2">
                <span class="relative h-[15px] w-[15px] inline-flex items-center justify-center">
                  <Icon
                    name="ph:folder-open"
                    class="h-[15px] w-[15px] opacity-100 transition-opacity duration-150 group-hover:opacity-0"
                  />
                  <Icon
                    :name="isRepoCollapsed(group.repo) ? 'ph:caret-right-fill' : 'ph:caret-down-fill'"
                    class="absolute h-[13px] w-[13px] text-[color:var(--wb-text-secondary)] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  />
                </span>
                <span class="truncate">{{ group.repo }}</span>
              </span>
              <span class="inline-flex items-center gap-2 text-[color:var(--wb-text-secondary)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <Icon name="ph:dots-three" class="h-[16px] w-[16px]" />
                <Icon name="ph:note-pencil" class="h-[16px] w-[16px]" />
              </span>
            </button>

            <div class="repo-items" :class="isRepoCollapsed(group.repo) ? 'repo-items--collapsed' : 'repo-items--expanded'">
              <button
                v-for="thread in group.items"
                :key="thread.id"
                class="thread-row group relative grid grid-cols-[minmax(0,1fr)_52px_66px] min-h-[34px] items-center gap-[4px] border border-transparent rounded-[9px] bg-transparent pl-[30px] pr-[10px] text-left text-[12.5px] text-[color:var(--wb-text-primary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg-strong)]"
                :class="thread.id === activeThreadId ? 'thread-row--active' : ''"
                @click="emit('selectThread', thread.id)"
              >
                <Icon name="ph:push-pin" class="pointer-events-none absolute left-[10px] h-[11px] w-[11px] text-[color:var(--wb-text-muted)] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                <span class="thread-row__title sidebar-label truncate">{{ thread.title }}</span>
                <span class="thread-row__delta sidebar-label inline-flex items-center justify-end gap-[1px] text-[11px] font-[var(--font-code)]">
                  <template v-if="typeof thread.added === 'number' || typeof thread.removed === 'number'">
                    <span v-if="typeof thread.added === 'number'" class="text-[color:var(--wb-diff-delta-added)]">+{{ thread.added }}</span>
                    <span v-if="typeof thread.removed === 'number'" class="text-[color:var(--wb-diff-delta-removed)]">-{{ thread.removed }}</span>
                  </template>
                </span>
                <span class="thread-row__time sidebar-label">{{ thread.time }}</span>
                <span class="thread-dot" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="settings-row mt-[4px] min-h-[36px] flex items-center gap-2 border border-transparent rounded-[9px] bg-transparent px-[10px] text-left text-[13px] text-[color:var(--wb-text-primary)] font-medium transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]">
        <Icon name="ph:gear-six-bold" class="h-[14px] w-[14px]" />
        <span class="sidebar-label">Settings</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-backdrop {
  display: none;
}

.sidebar {
  gap: 7px;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    backdrop-filter 180ms ease;
}

.sidebar--collapsed-shell {
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  border-color: transparent;
  background: transparent;
  backdrop-filter: none;
  padding-inline: 4px;
  z-index: 2;
}

.sidebar-label {
  white-space: nowrap;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 7px;
  width: 100%;
  transform-origin: left center;
  overflow-x: hidden;
  transition:
    width 260ms ease,
    opacity 220ms ease,
    transform 260ms ease;
}

.sidebar-content--expanded {
  width: 100%;
  opacity: 1;
  transform: translateX(0);
  overflow-y: hidden;
}

.sidebar-content--collapsed {
  width: 0;
  opacity: 0;
  transform: translateX(-12px);
  overflow-y: hidden;
  pointer-events: none;
}

.repo-items {
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
  transform-origin: top;
  transition:
    max-height 230ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 160ms ease,
    transform 230ms cubic-bezier(0.22, 1, 0.36, 1);
}

.repo-items--expanded {
  max-height: 420px;
  opacity: 1;
  transform: translateY(0);
}

.repo-items--collapsed {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
  pointer-events: none;
}

.thread-row {
  justify-content: space-between;
}

.thread-row__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  transform: translateX(1px);
}

.thread-row__delta {
  min-height: 1em;
  text-align: right;
}

.thread-row__time {
  color: var(--wb-text-muted);
  font-size: 11px;
  text-align: right;
  white-space: nowrap;
}

.thread-dot {
  display: none;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
}

.thread-row--active {
  background: var(--wb-row-active-bg);
  border-color: var(--wb-row-active-border);
}

@media (max-width: 1180px) {
  .sidebar--collapsed-shell {
    position: fixed;
    width: min(82vw, 320px);
    border-color: rgba(255, 255, 255, 0.09);
    background: rgba(10, 12, 16, 0.48);
    backdrop-filter: blur(14px);
    padding-inline: 7px;
  }

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

  .sidebar {
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

  .sidebar-content--collapsed {
    width: 0;
  }
}
</style>
