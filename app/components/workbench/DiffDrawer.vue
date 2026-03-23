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
const statusCounts = {
  unstaged: 1,
  staged: 0,
} as const

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
  <aside class="diff-drawer relative max-w-full overflow-x-hidden overflow-y-visible border-l border-l-[color:color-mix(in_srgb,var(--wb-divider)_86%,transparent)] rounded-none bg-[var(--wb-bg-panel)]" :class="open ? 'diff-drawer--open' : ''">
    <header class="relative z-50 h-[34px] flex shrink-0 items-center justify-between border-b border-[color:var(--wb-border-2)] px-3 text-[12px] text-[color:color-mix(in_srgb,var(--wb-text-primary)_88%,transparent)]">
      <ComposerDropdownMenu
        :open="openMenuKey === 'status'"
        direction="down"
        menu-class="w-[176px]"
        align="left"
        @toggle="toggleMenu('status')"
        @close="closeMenus"
      >
        <template #trigger="{ toggle }">
          <button
            class="h-7 inline-flex appearance-none items-center gap-2 rounded-full border-none bg-transparent px-3 text-[13px] text-[color:var(--wb-text-primary)] font-medium outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            @click.stop="toggle"
          >
            <span class="truncate">{{ selectedStatusLabel }}</span>
            <span
              v-if="selectedStatusCount > 0"
              class="h-5 min-w-5 inline-flex items-center justify-center rounded-full bg-[var(--wb-bubble-bg)] px-1.5 text-[11px] text-[color:var(--wb-text-primary)] font-medium font-[var(--font-ui)] tabular-nums"
            >
              {{ selectedStatusCount }}
            </span>
            <Icon name="ph:caret-down-bold" class="h-[10px] w-[10px] text-[color:var(--wb-text-secondary)]" />
          </button>
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
          <Icon name="ph:dots-three" class="h-[12px] w-[12px]" />
        </button>
        <button class="h-6 w-6 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent p-0 text-[color:inherit] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]">
          <Icon name="ph:folders" class="h-[12px] w-[12px]" />
        </button>
        <button class="h-6 w-6 inline-flex appearance-none items-center justify-center rounded-[8px] border-none bg-transparent p-0 text-[color:inherit] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]">
          <Icon name="ph:arrows-out-simple" class="h-[12px] w-[12px]" />
        </button>
      </div>
    </header>
    <div
      class="diff-scroll relative z-10 min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto px-2 pt-8 text-[13px] font-[var(--font-code)]"
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
      v-if="showBulkActions"
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
  border-color: var(--wb-border-1);
}

@media (max-width: 1180px) {
  .diff-drawer {
    position: fixed;
    inset: 104px 8px 8px;
    z-index: 42;
    width: auto;
    max-width: none;
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
