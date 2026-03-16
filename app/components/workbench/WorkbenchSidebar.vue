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
  <aside class="sidebar flex w-full flex-col overflow-hidden rounded-[var(--wb-r-lg)] bg-[rgba(8,10,14,0.42)] p-[7px] text-pureWhite/86 backdrop-blur-[14px]" :class="[mobileOpen ? 'sidebar--mobile-open' : '', collapsed ? 'sidebar--collapsed-shell' : '']">
    <div class="mb-[2px] flex items-center justify-between px-[2px]">
      <div class="inline-flex items-center gap-[7px]">
        <span class="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span class="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span class="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <button class="inline-flex h-6 w-6 items-center justify-center appearance-none border-none bg-transparent p-0 text-pureWhite/40 shadow-none outline-none transition-colors hover:text-pureWhite/62" @click="emit('toggleCollapsed')">
        <Icon name="ph:sidebar-simple-light" class="h-[13px] w-[13px]" />
      </button>
    </div>

    <div class="sidebar-content" :class="collapsed ? 'sidebar-content--collapsed' : 'sidebar-content--expanded'">
      <button class="nav-row min-h-[36px] flex items-center gap-2 rounded-[9px] border border-transparent bg-transparent px-[10px] text-left text-[13.5px] font-medium text-pureWhite/83 transition-colors hover:border-pureWhite/12 hover:bg-pureWhite/7" @click="emit('newThread')">
        <Icon name="ph:note-pencil" class="h-[15px] w-[15px]" />
        <span class="sidebar-label truncate">New Thread</span>
      </button>

      <button class="nav-row min-h-[36px] flex items-center gap-2 rounded-[9px] border border-transparent bg-transparent px-[10px] text-left text-[13.5px] font-medium text-pureWhite/83 transition-colors hover:border-pureWhite/12 hover:bg-pureWhite/7">
        <Icon name="ph:clock" class="h-[15px] w-[15px]" />
        <span class="sidebar-label truncate">Automations</span>
      </button>

      <button class="nav-row min-h-[36px] flex items-center gap-2 rounded-[9px] border border-transparent bg-transparent px-[10px] text-left text-[13.5px] font-medium text-pureWhite/83 transition-colors hover:border-pureWhite/12 hover:bg-pureWhite/7">
        <Icon name="ph:circles-four-bold" class="h-[14px] w-[14px]" />
        <span class="sidebar-label truncate">Skills</span>
      </button>

      <div class="mt-1.5 flex items-center justify-between px-[2px] text-[10px] text-pureWhite/38 uppercase tracking-[0.13em]">
        <span class="sidebar-label">Threads</span>
        <div class="inline-flex items-center gap-2.5">
          <button class="inline-flex items-center justify-center border-none bg-transparent p-0 text-pureWhite/58 transition-colors hover:text-pureWhite/78">
            <Icon name="ph:folder-plus" class="h-[16px] w-[16px]" />
          </button>
          <button class="inline-flex items-center justify-center border-none bg-transparent p-0 text-pureWhite/58 transition-colors hover:text-pureWhite/78">
            <Icon name="ph:funnel-simple" class="h-[16px] w-[16px]" />
          </button>
        </div>
      </div>

      <div v-for="group in groupedThreads" :key="group.repo" class="mt-0.5 flex flex-col gap-[3px]">
        <button class="group inline-flex w-full items-center justify-start gap-2 appearance-none border-none bg-transparent px-[10px] py-0 text-left text-[12.5px] font-semibold text-pureWhite/74 shadow-none outline-none" @click="toggleRepo(group.repo)">
          <span class="relative inline-flex h-[15px] w-[15px] items-center justify-center">
            <Icon
              name="ph:folder-open"
              class="h-[15px] w-[15px] opacity-100 transition-opacity duration-150 group-hover:opacity-0"
            />
            <Icon
              :name="isRepoCollapsed(group.repo) ? 'ph:caret-right-fill' : 'ph:caret-down-fill'"
              class="absolute h-[13px] w-[13px] text-pureWhite/66 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            />
          </span>
          <span>{{ group.repo }}</span>
        </button>

        <div class="repo-items" :class="isRepoCollapsed(group.repo) ? 'repo-items--collapsed' : 'repo-items--expanded'">
          <button
            v-for="thread in group.items"
            :key="thread.id"
            class="thread-row min-h-[34px] flex items-center justify-between gap-[9px] rounded-[9px] border border-transparent bg-transparent pr-[10px] pl-[30px] text-left text-[12.5px] text-pureWhite/84 transition-colors hover:border-pureWhite/12 hover:bg-pureWhite/9"
            :class="thread.id === activeThreadId ? 'thread-row--active' : ''"
            @click="emit('selectThread', thread.id)"
          >
            <span class="thread-row__title sidebar-label truncate">{{ thread.title }}</span>
            <span v-if="typeof thread.added === 'number' || typeof thread.removed === 'number'" class="sidebar-label inline-flex items-center gap-1 font-[var(--font-code)] text-[11px]">
              <span v-if="typeof thread.added === 'number'" class="text-[#32d089]">+{{ thread.added }}</span>
              <span v-if="typeof thread.removed === 'number'" class="text-[#f04f5f]">-{{ thread.removed }}</span>
            </span>
            <span class="thread-row__time sidebar-label">{{ thread.time }}</span>
            <span class="thread-dot" />
          </button>
        </div>
      </div>

      <button class="settings-row mt-[2px] min-h-[36px] flex items-center gap-2 rounded-[9px] border border-transparent bg-transparent px-[10px] text-left text-[13px] font-medium text-pureWhite/84 transition-colors hover:border-pureWhite/12 hover:bg-pureWhite/7">
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
  gap: 7px;
  width: 100%;
  transform-origin: left center;
  overflow: hidden;
  transition:
    width 260ms ease,
    opacity 220ms ease,
    transform 260ms ease;
}

.sidebar-content--expanded {
  width: 100%;
  opacity: 1;
  transform: translateX(0);
}

.sidebar-content--collapsed {
  width: 0;
  opacity: 0;
  transform: translateX(-12px);
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
  max-width: 62%;
  overflow: hidden;
  text-overflow: ellipsis;
  transform: translateX(1px);
}

.thread-row__time {
  color: rgba(255, 255, 255, 0.48);
  font-size: 11px;
}

.thread-dot {
  display: none;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
}

.thread-row--active {
  background: rgba(255, 255, 255, 0.11);
  border-color: rgba(255, 255, 255, 0.14);
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
