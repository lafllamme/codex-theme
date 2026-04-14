<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDiffStore } from '~/stores/diff'
import DsBulkActions from '../DsBulkActions.vue'
import ComposerDropdownMenu from './chat/ComposerDropdownMenu.vue'
import DrawerChangeCard from './chat/DrawerChangeCard.vue'

const props = defineProps<{
  codeThemeId: string
  open: boolean
}>()

const diffStore = useDiffStore()
const diffSections = computed(() => diffStore.resolvedDrawerSections)

const suspendAccordionMotion = ref(false)
const openMenuKey = ref<null | 'status'>(null)
const selectedStatusKey = ref<'unstaged' | 'staged' | 'all' | 'last-round'>('unstaged')
/** Summary vs diff preview; Review matches Codex default. */
const activeTab = ref<'summary' | 'review'>('review')
const statusCounts = {
  unstaged: 2,
  staged: 0,
  untracked: 0,
} as const

const summaryGitStatusLine = computed(() =>
  `${statusCounts.staged} staged, ${statusCounts.unstaged} unstaged, ${statusCounts.untracked} untracked`,
)

const selectedStatusLabel = computed(() => {
  if (selectedStatusKey.value === 'staged')
    return 'Staged'
  if (selectedStatusKey.value === 'all')
    return 'All branch changes'
  if (selectedStatusKey.value === 'last-round')
    return 'Last round changes'
  return 'Unstaged'
})

const selectedStatusCount = computed(() => {
  if (selectedStatusKey.value === 'staged')
    return statusCounts.staged
  if (selectedStatusKey.value === 'unstaged')
    return statusCounts.unstaged
  return 0
})

const showBulkActions = computed(() => {
  if (diffSections.value.length <= 1)
    return false
  return diffSections.value.some(section => !diffStore.isSectionCollapsed(section.id))
})

function toggleMenu(key: 'status') {
  openMenuKey.value = openMenuKey.value === key ? null : key
}

function closeMenus() {
  openMenuKey.value = null
}

function selectStatus(key: 'unstaged' | 'staged' | 'all' | 'last-round') {
  selectedStatusKey.value = key
  closeMenus()
}

function isSectionCollapsed(path: string) {
  return diffStore.isSectionCollapsed(path)
}

function toggleSection(path: string) {
  diffStore.toggleSection(path)
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen)
      return
    // Prevent replayed accordion transitions when drawer itself animates in.
    suspendAccordionMotion.value = true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        suspendAccordionMotion.value = false
      })
    })
  },
)
</script>

<template>
  <aside class="diff-drawer relative max-w-full overflow-x-hidden overflow-y-visible rounded-none bg-[var(--wb-bg-panel)]" :class="open ? 'diff-drawer--open' : ''">
    <div
      class="diff-drawer-tablist relative z-[55] flex shrink-0 items-end justify-start gap-0.5 border-0 border-b border-[color:var(--wb-chrome-hairline)] border-solid px-3"
      role="tablist"
      aria-label="Diff drawer views"
    >
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'summary'"
        class="diff-drawer-tab min-h-[30px] inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium font-[var(--font-ui)] transition-colors"
        :class="activeTab === 'summary'
          ? 'diff-drawer-tab--active text-[color:var(--wb-text-primary)]'
          : 'text-[color:var(--wb-text-muted)] hover:text-[color:var(--wb-text-secondary)]'"
        @click="activeTab = 'summary'"
      >
        <Icon name="hugeicons:list-start" class="size-[14px] shrink-0 scale-y-[-1] opacity-[0.92]" aria-hidden="true" />
        <span class="whitespace-nowrap">Summary</span>
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'review'"
        class="diff-drawer-tab min-h-[30px] inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium font-[var(--font-ui)] transition-colors"
        :class="activeTab === 'review'
          ? 'diff-drawer-tab--active text-[color:var(--wb-text-primary)]'
          : 'text-[color:var(--wb-text-muted)] hover:text-[color:var(--wb-text-secondary)]'"
        @click="activeTab = 'review'"
      >
        <Icon name="hugeicons:plus-minus-square-01" class="size-[14px] shrink-0 opacity-[0.92]" aria-hidden="true" />
        <span class="whitespace-nowrap">Review</span>
      </button>
    </div>

    <header
      v-show="activeTab === 'review'"
      class="relative z-50 h-[34px] flex shrink-0 items-center justify-between border-0 border-b border-[color:var(--wb-chrome-hairline)] border-solid px-3 text-[12px] text-[color:color-mix(in_srgb,var(--wb-text-primary)_88%,transparent)]"
    >
      <ComposerDropdownMenu
        :open="openMenuKey === 'status'"
        direction="down"
        menu-class="w-[176px]"
        align="left"
        @toggle="toggleMenu('status')"
        @close="closeMenus"
      >
        <template #trigger="{ toggle }">
          <div class="max-w-full min-w-0 inline-flex items-center gap-0.5">
            <button
              type="button"
              class="diff-drawer-corner-btn h-7 w-7 inline-flex shrink-0 appearance-none items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-muted)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-secondary)]"
              aria-label="Change scope"
              @click.stop="toggle"
            >
              <Icon name="ph:caret-up-down" class="size-[14px] shrink-0 rotate-45" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="diff-drawer-status-trigger h-7 max-w-[min(100%,12rem)] min-w-0 inline-flex appearance-none items-center gap-2 rounded-full border-none bg-transparent pl-1 pr-2 text-[13px] text-[color:var(--wb-text-primary)] font-medium outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
              @click.stop="toggle"
            >
              <span class="min-w-0 truncate">{{ selectedStatusLabel }}</span>
              <span
                v-if="selectedStatusCount > 0"
                class="h-5 min-w-5 inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--wb-bubble-bg)] px-1.5 text-[11px] text-[color:var(--wb-text-primary)] font-medium font-[var(--font-ui)] tabular-nums"
              >
                {{ selectedStatusCount }}
              </span>
              <Icon name="ph:caret-up-down" class="size-[12px] shrink-0 text-[color:var(--wb-text-secondary)]" aria-hidden="true" />
            </button>
          </div>
        </template>

        <div class="grid gap-0.5 text-[13px]">
          <button
            class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            :class="selectedStatusKey === 'unstaged' ? 'text-[color:var(--wb-text-primary)]' : 'text-[color:var(--wb-text-secondary)]'"
            @click="selectStatus('unstaged')"
          >
            <span class="inline-flex items-center gap-2">
              <span>Unstaged</span>
              <span
                v-if="statusCounts.unstaged > 0"
                class="h-5 min-w-5 inline-flex items-center justify-center rounded-full bg-[var(--wb-bubble-bg)] px-1.5 text-[11px] text-[color:var(--wb-text-primary)] font-medium font-[var(--font-ui)] tabular-nums"
              >
                {{ statusCounts.unstaged }}
              </span>
            </span>
            <Icon v-if="selectedStatusKey === 'unstaged'" name="ph:check-bold" class="h-[12px] w-[12px] text-[color:var(--wb-text-primary)]" />
          </button>

          <button
            class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            :class="selectedStatusKey === 'staged' ? 'text-[color:var(--wb-text-primary)]' : 'text-[color:var(--wb-text-secondary)]'"
            @click="selectStatus('staged')"
          >
            <span class="inline-flex items-center gap-2">
              <span>Staged</span>
              <span
                v-if="statusCounts.staged > 0"
                class="h-5 min-w-5 inline-flex items-center justify-center rounded-full bg-[var(--wb-bubble-bg)] px-1.5 text-[11px] text-[color:var(--wb-text-primary)] font-medium font-[var(--font-ui)] tabular-nums"
              >
                {{ statusCounts.staged }}
              </span>
            </span>
            <Icon v-if="selectedStatusKey === 'staged'" name="ph:check-bold" class="h-[12px] w-[12px] text-[color:var(--wb-text-primary)]" />
          </button>

          <button
            class="min-h-[54px] w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 py-2 text-left outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            :class="selectedStatusKey === 'all' ? 'text-[color:var(--wb-text-primary)]' : 'text-[color:var(--wb-text-secondary)]'"
            @click="selectStatus('all')"
          >
            <span class="grid">
              <span class="leading-[1.2]">All branch changes</span>
              <span class="mt-0.5 inline-flex items-center gap-1 text-[12px] text-[color:var(--wb-text-muted)] leading-[1.2]">
                <span>main</span>
                <Icon name="ph:arrow-right" class="h-[10px] w-[10px]" />
                <span>origin/main</span>
              </span>
            </span>
            <Icon v-if="selectedStatusKey === 'all'" name="ph:check-bold" class="h-[12px] w-[12px] text-[color:var(--wb-text-primary)]" />
          </button>

          <button
            class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            :class="selectedStatusKey === 'last-round' ? 'text-[color:var(--wb-text-primary)]' : 'text-[color:var(--wb-text-secondary)]'"
            @click="selectStatus('last-round')"
          >
            <span>Last round changes</span>
            <Icon v-if="selectedStatusKey === 'last-round'" name="ph:check-bold" class="h-[12px] w-[12px] text-[color:var(--wb-text-primary)]" />
          </button>
        </div>
      </ComposerDropdownMenu>

      <div class="inline-flex items-center gap-1 text-[color:color-mix(in_srgb,var(--wb-text-primary)_74%,transparent)]">
        <button class="h-6 w-6 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent p-0 text-[color:inherit] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]">
          <Icon name="ph:dots-three" class="size-[16px]" />
        </button>
        <button class="h-6 w-6 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent p-0 text-[color:inherit] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]">
          <Icon name="ph:square-split-horizontal" class="size-[16px]" />
        </button>
        <button class="h-6 w-6 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent p-0 text-[color:inherit] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]">
          <Icon name="ph:folders" class="size-[16px]" />
        </button>
      </div>
    </header>

    <div
      v-show="activeTab === 'summary'"
      class="diff-scroll summary-scroll relative z-10 min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto px-3 pb-4 pt-5 text-[13px] font-[var(--font-ui)]"
    >
      <section class="mb-5">
        <h3 class="mb-2.5 text-[11px] text-[color:var(--wb-text-muted)] font-semibold tracking-[0.04em] uppercase">
          Git
        </h3>
        <ul class="m-0 list-none p-0 space-y-2.5">
          <li class="flex items-start gap-2.5 text-[color:var(--wb-text-primary)] leading-[1.45]">
            <Icon name="ph:pencil-simple" class="mt-[2px] size-[14px] shrink-0 text-[color:var(--wb-text-secondary)]" aria-hidden="true" />
            <span>{{ summaryGitStatusLine }}</span>
          </li>
          <li class="flex items-start gap-2.5 text-[color:var(--wb-text-primary)] leading-[1.45]">
            <Icon name="ph:github-logo" class="mt-[2px] size-[14px] shrink-0 text-[color:var(--wb-text-secondary)]" aria-hidden="true" />
            <span>GitHub CLI unavailable</span>
          </li>
        </ul>
      </section>
      <section>
        <h3 class="mb-2.5 text-[11px] text-[color:var(--wb-text-muted)] font-semibold tracking-[0.04em] uppercase">
          Sources
        </h3>
        <ul class="m-0 list-none p-0 space-y-2.5">
          <li class="flex items-start gap-2.5 text-[color:var(--wb-text-primary)] leading-[1.45]">
            <Icon name="ph:globe" class="mt-[2px] size-[14px] shrink-0 text-[color:var(--wb-text-secondary)]" aria-hidden="true" />
            <span>Web search</span>
          </li>
        </ul>
      </section>
    </div>

    <div
      v-show="activeTab === 'review'"
      class="diff-scroll relative z-10 min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto px-3 pt-8 text-[13px] font-[var(--font-code)]"
      :class="showBulkActions ? 'pb-[72px]' : 'pb-2'"
    >
      <DrawerChangeCard
        v-for="section in diffSections"
        :key="section.id"
        :section="section"
        :code-theme-id="codeThemeId"
        :show-status-dot="section.showDot"
        :collapsed="isSectionCollapsed(section.id)"
        :suspend-accordion-motion="suspendAccordionMotion"
        @toggle="toggleSection(section.id)"
      />
    </div>
    <div
      v-if="showBulkActions && activeTab === 'review'"
      class="pointer-events-none absolute bottom-[18px] left-1/2 z-[260] -translate-x-1/2"
    >
      <div class="pointer-events-auto">
        <DsBulkActions />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.diff-drawer {
  width: 100%;
  flex: 0 0 auto;
  min-width: 0;
  max-width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateX(12px);
  pointer-events: none;
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: var(--wb-chrome-hairline);
  transition:
    opacity 220ms ease,
    transform 260ms var(--wb-sidebar-ease, cubic-bezier(0.22, 1, 0.36, 1)),
    border-color 180ms ease;
  will-change: opacity, transform;
}

.diff-drawer--open {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
  border-left-color: color-mix(in srgb, var(--wb-chrome-hairline) 94%, var(--wb-text-primary) 6%);
}

/* Desktop: reveal is driven by parent column width only (match sidebar); no inner slide/fade. */
@media (min-width: 1181px) {
  .diff-drawer {
    opacity: 1;
    transform: none;
    transition: border-color 340ms var(--wb-sidebar-ease, cubic-bezier(0.2, 0.8, 0.2, 1));
    will-change: auto;
  }

  .diff-drawer--open {
    pointer-events: auto;
  }
}

.diff-drawer-tab {
  position: relative;
  z-index: 0;
  margin-bottom: -1px;
  border: none;
  background: transparent;
}

.diff-drawer-tab:hover {
  background: color-mix(in srgb, var(--wb-hover-bg) 45%, transparent);
}

.diff-drawer-tab--active::after,
.diff-drawer-tab[aria-selected='true']::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--wb-text-primary);
  pointer-events: none;
}

@media (max-width: 1180px) {
  .diff-drawer {
    position: fixed;
    top: 0;
    right: 8px;
    bottom: 8px;
    left: 8px;
    z-index: 42;
    width: auto;
    max-width: none;
    height: auto;
    opacity: 0;
    transform: translateX(105%);
    pointer-events: none;
    transition:
      opacity 220ms ease,
      transform 260ms var(--wb-sidebar-ease, cubic-bezier(0.22, 1, 0.36, 1)),
      border-color 180ms ease;
  }

  .diff-drawer--open {
    opacity: 1;
    width: auto;
    transform: translateX(0);
    pointer-events: auto;
  }
}
</style>
