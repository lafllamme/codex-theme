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
  <div class="wb-sidebar-root relative h-full min-h-0 min-w-0 w-full flex flex-1 flex-col">
    <div class="sidebar-backdrop" :class="mobileOpen ? 'sidebar-backdrop--open' : ''" @click="emit('closeMobile')" />
    <aside class="sidebar [backdrop-filter:var(--wb-sidebar-backdrop-filter)] min-h-0 min-w-0 w-full flex flex-1 flex-col overflow-hidden rounded-[var(--wb-r-lg)] border border-[color:var(--wb-border-1)] bg-[var(--wb-bg-sidebar)] px-[var(--wb-sidebar-pad-x)] py-[7px] text-[color:var(--wb-text-primary)]" :class="[mobileOpen ? 'sidebar--mobile-open' : '', collapsed ? 'sidebar--collapsed-shell' : '']">
      <div class="sidebar-content" :class="collapsed ? 'sidebar-content--collapsed' : 'sidebar-content--expanded'">
        <div class="nav-stack">
          <button class="sidebar-nav-lane-item nav-row grid grid-cols-[15px_minmax(0,1fr)] items-center gap-[11px] border border-transparent rounded-[9px] bg-transparent px-[10px] text-left text-[color:var(--wb-text-primary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]" @click="emit('newThread')">
            <Icon name="heroicons-outline:pencil-alt" class="nav-row__icon h-[15px] w-[15px]" />
            <span class="sidebar-label truncate">New Thread</span>
          </button>

          <button class="sidebar-nav-lane-item nav-row grid grid-cols-[15px_minmax(0,1fr)] items-center gap-[11px] border border-transparent rounded-[9px] bg-transparent px-[10px] text-left text-[color:var(--wb-text-primary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]">
            <Icon name="ph:clock" class="nav-row__icon h-[15px] w-[15px]" />
            <span class="sidebar-label truncate">Automations</span>
          </button>

          <button class="sidebar-nav-lane-item nav-row grid grid-cols-[15px_minmax(0,1fr)] items-center gap-[11px] border border-transparent rounded-[9px] bg-transparent px-[10px] text-left text-[color:var(--wb-text-primary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]">
            <Icon name="ph:storefront" class="nav-row__icon h-[15px] w-[15px]" />
            <span class="sidebar-label truncate">Skills</span>
          </button>
        </div>

        <div class="min-h-0 flex flex-1 flex-col">
          <div class="sidebar-section-header sidebar-header-lane-item mt-[2px] flex items-center justify-between pl-[10px] pr-[10px] text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-text-faint)] tracking-[0.13em] uppercase">
            <span class="sidebar-label capitalize tracking-normal">Threads</span>
            <div class="inline-flex items-center gap-2">
              <button class="h-[18px] w-[18px] inline-flex items-center justify-center border-none bg-transparent p-0 text-[color:var(--wb-text-secondary)] transition-colors hover:text-[color:var(--wb-text-primary)]">
                <Icon name="ph:folder-plus" class="h-[15px] w-[15px]" />
              </button>
              <button class="h-[18px] w-[18px] inline-flex items-center justify-center border-none bg-transparent p-0 text-[color:var(--wb-text-secondary)] transition-colors hover:text-[color:var(--wb-text-primary)]">
                <Icon name="ph:funnel-simple" class="h-[15px] w-[15px]" />
              </button>
            </div>
          </div>

          <div class="mt-[1px] flex-1 overflow-y-auto pr-[2px]">
            <div v-for="group in groupedThreads" :key="group.repo" class="mt-[1px] flex flex-col gap-[2px]">
              <button class="sidebar-lane-item repo-row group inline-flex appearance-none items-center justify-between gap-2 border-none bg-transparent px-[10px] py-0 text-left text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-secondary)] shadow-none outline-none" @click="toggleRepo(group.repo)">
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
                  <Icon name="heroicons-outline:pencil-alt" class="h-[16px] w-[16px]" />
                </span>
              </button>

              <div class="repo-items" :class="isRepoCollapsed(group.repo) ? 'repo-items--collapsed' : 'repo-items--expanded'">
                <button
                  v-for="thread in group.items"
                  :key="thread.id"
                  class="sidebar-lane-item thread-row group relative grid grid-cols-[minmax(0,1fr)_auto_max-content] items-center gap-[4px] border border-transparent rounded-[12px] bg-transparent pl-[34px] pr-[14px] text-left text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg-strong)]"
                  :class="thread.id === activeThreadId ? 'thread-row--active' : ''"
                  @click="emit('selectThread', thread.id)"
                >
                  <Icon name="ph:push-pin" class="pointer-events-none absolute left-[12px] h-[11px] w-[11px] text-[color:var(--wb-text-muted)] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                  <span class="thread-row__title sidebar-label truncate">{{ thread.title }}</span>
                  <span class="thread-row__delta sidebar-label inline-flex items-center justify-end gap-[1px] text-[length:var(--wb-ui-text-sm)] font-[var(--font-ui)] tabular-nums">
                    <template v-if="typeof thread.added === 'number' || typeof thread.removed === 'number'">
                      <span v-if="typeof thread.added === 'number'" class="text-[color:var(--wb-diff-delta-added)]">+{{ thread.added }}</span>
                      <span v-if="typeof thread.removed === 'number'" class="text-[color:var(--wb-diff-delta-removed)]">-{{ thread.removed }}</span>
                    </template>
                  </span>
                  <span class="sidebar-label relative inline-flex min-w-[72px] translate-x-[6px] items-center justify-end whitespace-nowrap text-right">
                    <span class="text-[color:var(--wb-text-muted)] text-[length:var(--wb-sidebar-meta-size)] leading-[1.25] transition-opacity duration-150 group-hover:opacity-0">{{ thread.time }}</span>
                    <Icon name="ph:archive" class="pointer-events-none absolute right-0 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[color:var(--wb-text-secondary)] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                  </span>
                  <span class="thread-dot" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <button class="sidebar-lane-item settings-row mt-auto grid grid-cols-[15px_minmax(0,1fr)] items-center gap-[11px] border border-transparent rounded-[9px] bg-transparent px-[10px] text-left text-[color:var(--wb-text-primary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]">
          <Icon name="ph:gear-six" class="h-[15px] w-[15px]" />
          <span class="sidebar-label">Settings</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.wb-sidebar-root {
  align-self: stretch;
}

.sidebar-backdrop {
  display: none;
}

/* Buttons do not inherit font-family; force theme UI stack */
.sidebar :where(button) {
  font-family: var(--font-ui, 'Geist', ui-sans-serif, system-ui, sans-serif);
}

.sidebar {
  --wb-sidebar-text-size: var(--wb-ui-text, var(--ui-font-size));
  --wb-sidebar-meta-size: calc(var(--wb-ui-text, var(--ui-font-size)) - 2px);
  --wb-sidebar-pad-x: 14px;
  --wb-sidebar-pad-top: 38px;
  --wb-sidebar-section-gap: 10px;
  --wb-sidebar-nav-row-h: 36px;
  --wb-sidebar-thread-row-h: 36px;
  --wb-sidebar-footer-h: 34px;
  --wb-sidebar-inner-gap-right: 22px;
  --wb-sidebar-nav-gap-right: 30px;
  --wb-sidebar-header-gap-right: 34px;
  gap: 7px;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    backdrop-filter 180ms ease;
}

.sidebar--collapsed-shell {
  border-color: transparent;
  background: transparent;
  backdrop-filter: none;
  padding-inline: 5px;
}

.sidebar-label {
  white-space: nowrap;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding-top: var(--wb-sidebar-pad-top);
  gap: var(--wb-sidebar-section-gap);
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

.nav-stack {
  display: grid;
  gap: 6px;
}

.sidebar-lane-item {
  width: calc(100% - var(--wb-sidebar-inner-gap-right));
}

.sidebar-nav-lane-item {
  width: calc(100% - var(--wb-sidebar-nav-gap-right));
}

.sidebar-header-lane-item {
  width: calc(100% - var(--wb-sidebar-header-gap-right));
}

.repo-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  min-height: var(--wb-sidebar-thread-row-h);
  justify-content: space-between;
  border-radius: 12px;
}

.nav-row {
  min-height: var(--wb-sidebar-nav-row-h);
  font-size: var(--wb-sidebar-text-size);
  font-weight: 400;
  line-height: 1.25;
}

.nav-row__icon {
  color: var(--wb-text-secondary);
  transform: translateY(0.2px);
}

.repo-row {
  font-weight: 400;
  line-height: 1.2;
}

.sidebar-section-header {
  margin-top: 16px;
  margin-bottom: 8px;
}

.thread-row__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  transform: translateX(1px);
  font-size: var(--wb-sidebar-text-size);
  font-weight: 400;
  line-height: 1.25;
}

.thread-row__delta {
  min-height: 1em;
  text-align: right;
}

.settings-row {
  min-height: var(--wb-sidebar-footer-h);
  font-size: var(--wb-sidebar-text-size);
  font-weight: 400;
  line-height: 1.25;
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
  border-color: color-mix(in srgb, var(--wb-row-active-border) 76%, transparent);
}

.thread-row--active .thread-row__title {
  font-weight: 500;
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
