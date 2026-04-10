<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import ComposerDropdownMenu from './chat/ComposerDropdownMenu.vue'

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

const allReposCollapsed = computed(() =>
  groupedThreads.value.length > 0
  && groupedThreads.value.every(group => collapsedRepos.value.has(group.repo)),
)

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

function toggleAllRepos() {
  if (allReposCollapsed.value) {
    collapsedRepos.value = new Set()
    return
  }
  collapsedRepos.value = new Set(groupedThreads.value.map(group => group.repo))
}

type OrganizeMode = 'project' | 'chronological'
type SortMode = 'created' | 'updated'
type ShowMode = 'all' | 'relevant'
interface ThreadsFilterOption<T extends string> {
  value: T
  label: string
  icon: string
}

const isThreadsFilterMenuOpen = ref(false)
const organizeMode = ref<OrganizeMode>('project')
const sortMode = ref<SortMode>('updated')
const showMode = ref<ShowMode>('all')

const organizeOptions: ThreadsFilterOption<OrganizeMode>[] = [
  { value: 'project', label: 'By project', icon: 'ph:folder-open' },
  { value: 'chronological', label: 'Chronological list', icon: 'ph:clock' },
]

const sortOptions: ThreadsFilterOption<SortMode>[] = [
  { value: 'created', label: 'Created', icon: 'ph:plus-circle' },
  { value: 'updated', label: 'Updated', icon: 'ph:pencil-simple-line' },
]

const showOptions: ThreadsFilterOption<ShowMode>[] = [
  { value: 'all', label: 'All Threads', icon: 'ph:chats-circle' },
  { value: 'relevant', label: 'Relevant', icon: 'ph:star' },
]

const organizeLabel = computed(() =>
  organizeOptions.find(option => option.value === organizeMode.value)?.label ?? 'By project',
)
const sortLabel = computed(() =>
  sortOptions.find(option => option.value === sortMode.value)?.label ?? 'Updated',
)
const showLabel = computed(() =>
  showOptions.find(option => option.value === showMode.value)?.label ?? 'All Threads',
)
const threadsFilterSummary = computed(() =>
  `${organizeLabel.value} • ${sortLabel.value} • ${showLabel.value}`,
)

function toggleThreadsFilterMenu() {
  isThreadsFilterMenuOpen.value = !isThreadsFilterMenuOpen.value
}

function closeThreadsFilterMenu() {
  isThreadsFilterMenuOpen.value = false
}

const ENTER_MS = 280
const LEAVE_MS = 220
const ENTER_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const LEAVE_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'
const CONTENT_FADE_IN_MS = 260
const CONTENT_FADE_OUT_MS = 180

function clearTransitionStyles(node: HTMLElement) {
  node.style.transition = ''
  node.style.overflow = ''
  node.style.willChange = ''
  node.style.transformOrigin = ''
}

function beforeRepoEnter(el: Element) {
  const node = el as HTMLElement
  node.style.height = '0px'
  node.style.opacity = '0'
  node.style.overflow = 'hidden'
  node.style.willChange = 'height, opacity'
  node.style.transformOrigin = 'top'
}

function repoEnter(el: Element, done: () => void) {
  const node = el as HTMLElement
  const targetHeight = `${node.scrollHeight}px`
  let finished = false
  let stopTimeout = () => {}
  const finish = () => {
    if (finished)
      return
    finished = true
    stopTimeout()
    done()
  }
  const timeout = useTimeoutFn(() => {
    finish()
  }, ENTER_MS + 60, { immediate: false })
  stopTimeout = timeout.stop
  void node.offsetHeight
  node.style.transition = [
    `height ${ENTER_MS}ms ${ENTER_EASING}`,
    `opacity ${CONTENT_FADE_IN_MS}ms ${ENTER_EASING}`,
  ].join(', ')

  requestAnimationFrame(() => {
    node.style.height = targetHeight
    node.style.opacity = '1'
  })
  timeout.start()

  const onEnd = (event: TransitionEvent) => {
    if (event.target !== node || event.propertyName !== 'height')
      return
    finish()
  }
  node.addEventListener('transitionend', onEnd, { once: true })
}

function afterRepoEnter(el: Element) {
  const node = el as HTMLElement
  node.style.height = 'auto'
  node.style.opacity = ''
  node.style.transform = ''
  clearTransitionStyles(node)
}

function beforeRepoLeave(el: Element) {
  const node = el as HTMLElement
  node.style.height = `${node.scrollHeight}px`
  node.style.opacity = '1'
  node.style.overflow = 'hidden'
  node.style.willChange = 'height, opacity'
  node.style.transformOrigin = 'top'
}

function repoLeave(el: Element, done: () => void) {
  const node = el as HTMLElement
  let finished = false
  let stopTimeout = () => {}
  const finish = () => {
    if (finished)
      return
    finished = true
    stopTimeout()
    done()
  }
  const timeout = useTimeoutFn(() => {
    finish()
  }, LEAVE_MS + 60, { immediate: false })
  stopTimeout = timeout.stop
  void node.offsetHeight
  node.style.transition = [
    `height ${LEAVE_MS}ms ${LEAVE_EASING}`,
    `opacity ${CONTENT_FADE_OUT_MS}ms ${LEAVE_EASING}`,
  ].join(', ')

  requestAnimationFrame(() => {
    node.style.height = '0px'
    node.style.opacity = '0'
  })
  timeout.start()

  const onEnd = (event: TransitionEvent) => {
    if (event.target !== node || event.propertyName !== 'height')
      return
    finish()
  }
  node.addEventListener('transitionend', onEnd, { once: true })
}

function afterRepoLeave(el: Element) {
  const node = el as HTMLElement
  node.style.height = ''
  clearTransitionStyles(node)
}
</script>

<template>
  <div class="relative h-full min-h-0 min-w-0 w-full flex flex-1 flex-col self-stretch">
    <div
      class="pointer-events-none fixed inset-0 z-[39] hidden bg-[rgba(0,0,0,0.38)] opacity-0 transition-opacity duration-180 max-[1180px]:block"
      :class="mobileOpen ? 'max-[1180px]:opacity-100 max-[1180px]:pointer-events-auto' : ''"
      @click="emit('closeMobile')"
    />

    <aside
      class="[backdrop-filter:var(--wb-sidebar-backdrop-filter)] min-h-0 min-w-0 w-full flex flex-1 flex-col gap-[7px] border border-[color:var(--wb-border-1)] rounded-[var(--wb-r-lg)] bg-[var(--wb-bg-sidebar)] px-[10px] py-[7px] text-[color:var(--wb-text-primary)] transition-[border-color,background-color,backdrop-filter,transform] duration-180 max-[1180px]:fixed max-[1180px]:left-[8px] max-[1180px]:top-[72px] max-md:left-[8px] max-md:top-[60px] max-[1180px]:z-[40] max-[1180px]:max-h-[calc(100vh-84px)] max-[1180px]:w-[min(92vw,360px)] max-md:max-h-[calc(100vh-72px)] max-md:max-w-[420px] max-md:w-[calc(100vw-16px)] max-[1180px]:overflow-y-auto [&_button]:font-[var(--font-ui)] max-[1180px]:-translate-x-[112%]"
      :class="[
        mobileOpen ? 'max-[1180px]:translate-x-0' : '',
        collapsed
          ? 'border-transparent bg-transparent [backdrop-filter:none] px-[5px] max-[1180px]:border-[rgba(255,255,255,0.09)] max-[1180px]:bg-[rgba(10,12,16,0.48)] max-[1180px]:[backdrop-filter:blur(14px)] max-[1180px]:px-[7px]'
          : '',
        isThreadsFilterMenuOpen ? 'overflow-visible' : 'overflow-hidden',
      ]"
    >
      <div
        class="min-h-0 w-full flex flex-1 flex-col origin-left gap-[10px] pt-[38px] transition-[width,opacity,transform] duration-260"
        :class="collapsed
          ? 'w-0 opacity-0 -translate-x-[12px] overflow-hidden pointer-events-none'
          : isThreadsFilterMenuOpen
            ? 'w-full opacity-100 translate-x-0 overflow-visible'
            : 'w-full opacity-100 translate-x-0 overflow-hidden'"
      >
        <div class="grid gap-[6px]">
          <button class="grid wb-sidebar-nav-row grid-cols-[16px_minmax(0,1fr)] min-h-[36px] w-full items-center gap-[11px] border border-transparent rounded-[12px] bg-transparent px-[10px] text-left transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]" @click="emit('newThread')">
            <Icon name="heroicons-outline:pencil-alt" class="size-4.5 wb-sidebar-icon" />
            <span class="truncate whitespace-nowrap">New Thread</span>
          </button>

          <button class="grid wb-sidebar-nav-row grid-cols-[16px_minmax(0,1fr)] min-h-[36px] w-full items-center gap-[11px] border border-transparent rounded-[12px] bg-transparent px-[10px] text-left transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]">
            <Icon name="ph:circles-four" class="size-4.5 wb-sidebar-icon" />
            <span class="truncate whitespace-nowrap">Capabilities &amp; Apps</span>
          </button>

          <button class="grid wb-sidebar-nav-row grid-cols-[16px_minmax(0,1fr)] min-h-[36px] w-full items-center gap-[11px] border border-transparent rounded-[12px] bg-transparent px-[10px] text-left transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]">
            <Icon name="ph:clock" class="size-4.5 wb-sidebar-icon" />
            <span class="truncate whitespace-nowrap">Automations</span>
          </button>
        </div>

        <div class="min-h-0 flex flex-1 flex-col">
          <div class="mb-[8px] mt-[6px] w-full flex items-center justify-between pl-[10px] pr-[10px] text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-text-faint)] tracking-[0.13em] uppercase">
            <span class="whitespace-nowrap tracking-normal capitalize">Threads</span>
            <div class="inline-flex items-center gap-3 tracking-normal normal-case">
              <button class="h-[22px] w-[22px] wb-sidebar-icon-btn inline-flex items-center justify-center border border-transparent rounded-[8px] bg-transparent p-0 text-[color:var(--wb-text-secondary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]" @click="toggleAllRepos">
                <Icon :name="allReposCollapsed ? 'ph:caret-up-down' : 'ph:arrows-in-simple-bold'" :class="allReposCollapsed ? 'size-[15px] rotate-45' : 'size-[15px]'" />
              </button>

              <ComposerDropdownMenu
                :open="isThreadsFilterMenuOpen"
                menu-class="w-[214px]"
                panel-padding-class="p-1.5"
                panel-class="normal-case tracking-normal rounded-[17px] border-[color:color-mix(in_srgb,var(--wb-border-2)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_96%,transparent)] text-[color:var(--wb-text-primary)] shadow-[0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur-[10px]"
                align="right"
                direction="down"
                @toggle="toggleThreadsFilterMenu"
                @close="closeThreadsFilterMenu"
              >
                <template #trigger="{ toggle }">
                  <button
                    class="h-[22px] w-[22px] wb-sidebar-icon-btn inline-flex items-center justify-center border border-transparent rounded-[8px] bg-transparent p-0 text-[color:var(--wb-text-secondary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
                    :class="isThreadsFilterMenuOpen ? 'border-[color:var(--wb-hover-border)] bg-[var(--wb-hover-bg)] text-[color:var(--wb-text-primary)]' : ''"
                    :title="threadsFilterSummary"
                    :aria-label="`Filter threads (${threadsFilterSummary})`"
                    @click.stop="toggle"
                  >
                    <Icon name="ph:funnel-simple" class="size-[15px]" />
                  </button>
                </template>

                <div class="grid gap-0 tracking-normal normal-case">
                  <p class="m-0 px-1.5 py-1 text-[12px] text-[color:var(--wb-text-muted)] font-semibold leading-none">
                    Organize
                  </p>

                  <button
                    v-for="option in organizeOptions"
                    :key="option.value"
                    class="h-[36px] w-full inline-flex items-center justify-between rounded-[9px] border-none bg-transparent px-1.5 text-left text-[14px] text-[color:var(--wb-text-primary)] leading-none outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                    @click="organizeMode = option.value; closeThreadsFilterMenu()"
                  >
                    <span class="inline-flex items-center gap-1.5">
                      <Icon :name="option.icon" class="h-[14px] w-[14px]" />
                      {{ option.label }}
                    </span>
                    <Icon v-if="organizeMode === option.value" name="ph:check-bold" class="h-[13px] w-[13px]" />
                  </button>

                  <div class="mx-1.5 my-[4px] h-px bg-[color:var(--wb-divider)]" />

                  <p class="m-0 px-1.5 py-1 text-[12px] text-[color:var(--wb-text-muted)] font-semibold leading-none">
                    Sort by
                  </p>

                  <button
                    v-for="option in sortOptions"
                    :key="option.value"
                    class="h-[36px] w-full inline-flex items-center justify-between rounded-[9px] border-none bg-transparent px-1.5 text-left text-[14px] text-[color:var(--wb-text-primary)] leading-none outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                    @click="sortMode = option.value; closeThreadsFilterMenu()"
                  >
                    <span class="inline-flex items-center gap-1.5">
                      <Icon :name="option.icon" class="h-[14px] w-[14px]" />
                      {{ option.label }}
                    </span>
                    <Icon v-if="sortMode === option.value" name="ph:check-bold" class="h-[13px] w-[13px]" />
                  </button>

                  <div class="mx-1.5 my-[4px] h-px bg-[color:var(--wb-divider)]" />

                  <p class="m-0 px-1.5 py-1 text-[12px] text-[color:var(--wb-text-muted)] font-semibold leading-none">
                    Show
                  </p>

                  <button
                    v-for="option in showOptions"
                    :key="option.value"
                    class="h-[36px] w-full inline-flex items-center justify-between rounded-[9px] border-none bg-transparent px-1.5 text-left text-[14px] text-[color:var(--wb-text-primary)] leading-none outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                    @click="showMode = option.value; closeThreadsFilterMenu()"
                  >
                    <span class="inline-flex items-center gap-1.5">
                      <Icon :name="option.icon" class="h-[14px] w-[14px]" />
                      {{ option.label }}
                    </span>
                    <Icon v-if="showMode === option.value" name="ph:check-bold" class="h-[13px] w-[13px]" />
                  </button>
                </div>
              </ComposerDropdownMenu>

              <button class="h-[22px] w-[22px] wb-sidebar-icon-btn inline-flex items-center justify-center border border-transparent rounded-[8px] bg-transparent p-0 text-[color:var(--wb-text-secondary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]">
                <Icon name="hugeicons:folder-add" class="size-[15px]" />
              </button>
            </div>
          </div>

          <div class="mt-px flex-1 overflow-y-auto">
            <div :class="allReposCollapsed ? 'flex flex-col gap-[16px]' : 'flex flex-col gap-px'">
              <div v-for="group in groupedThreads" :key="group.repo" class="flex flex-col gap-[2px]">
                <button class="group w-full inline-flex appearance-none items-center justify-between gap-2 border-none bg-transparent px-[10px] py-0 text-left text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-secondary)] font-normal leading-[1.2] shadow-none outline-none" @click="toggleRepo(group.repo)">
                  <span class="min-w-0 inline-flex items-center gap-2">
                    <span class="relative size-[15px] inline-flex items-center justify-center">
                      <Icon
                        :name="isRepoCollapsed(group.repo) ? 'ph:folder-bold' : 'ph:folder-open-bold'"
                        class="size-[15px] opacity-100 transition-opacity duration-150 group-hover:opacity-0"
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

                <Transition
                  @before-enter="beforeRepoEnter"
                  @enter="repoEnter"
                  @after-enter="afterRepoEnter"
                  @before-leave="beforeRepoLeave"
                  @leave="repoLeave"
                  @after-leave="afterRepoLeave"
                >
                  <div v-if="!isRepoCollapsed(group.repo)" class="flex flex-col gap-[2px] overflow-hidden">
                    <button
                      v-for="thread in group.items"
                      :key="thread.id"
                      class="group relative grid grid-cols-[minmax(0,1fr)_auto_max-content] min-h-[36px] w-full items-center justify-between gap-[4px] border border-transparent rounded-[12px] bg-transparent pl-[34px] pr-[14px] text-left text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg-strong)]"
                      :class="thread.id === activeThreadId ? 'bg-[var(--wb-row-active-bg)] border-[color:color-mix(in_srgb,var(--wb-row-active-border)_76%,transparent)]' : ''"
                      @click="emit('selectThread', thread.id)"
                    >
                      <Icon name="ph:push-pin" class="pointer-events-none absolute left-[12px] h-[11px] w-[11px] text-[color:var(--wb-text-muted)] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                      <span class="min-w-0 translate-x-[1px] overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--wb-ui-text)] font-normal leading-[1.25]" :class="thread.id === activeThreadId ? 'font-medium' : ''">{{ thread.title }}</span>
                      <span class="min-h-[1em] inline-flex items-center justify-end gap-[1px] whitespace-nowrap text-right text-[length:var(--wb-ui-text-sm)] font-[var(--font-ui)] tabular-nums">
                        <template v-if="typeof thread.added === 'number' || typeof thread.removed === 'number'">
                          <span v-if="typeof thread.added === 'number'" class="text-[color:var(--wb-diff-delta-added)]">+{{ thread.added }}</span>
                          <span v-if="typeof thread.removed === 'number'" class="text-[color:var(--wb-diff-delta-removed)]">-{{ thread.removed }}</span>
                        </template>
                      </span>
                      <span class="relative min-w-[72px] inline-flex translate-x-[6px] items-center justify-end whitespace-nowrap text-right">
                        <span class="text-[color:var(--wb-text-muted)] text-[length:calc(var(--wb-ui-text)-2px)] leading-[1.25] transition-opacity duration-150 group-hover:opacity-0">{{ thread.time }}</span>
                        <Icon name="ph:archive" class="pointer-events-none absolute right-0 top-1/2 h-[14px] w-[14px] text-[color:var(--wb-text-secondary)] opacity-0 transition-opacity duration-150 -translate-y-1/2 group-hover:opacity-100" />
                      </span>
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>

        <button class="grid wb-sidebar-settings-row grid-cols-[16px_minmax(0,1fr)] min-h-[34px] w-full items-center gap-[11px] border border-transparent rounded-[12px] bg-transparent px-[10px] text-left transition-colors hover:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]">
          <Icon name="ph:gear-six" class="size-4.5 wb-sidebar-icon" />
          <span class="whitespace-nowrap">Settings</span>
        </button>
      </div>
    </aside>
  </div>
</template>
