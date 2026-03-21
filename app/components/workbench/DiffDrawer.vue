<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ComposerDropdownMenu from './chat/ComposerDropdownMenu.vue'
import DrawerChangeCard from './chat/DrawerChangeCard.vue'

const props = defineProps<{
  open: boolean
}>()

interface DiffLine {
  kind: 'added' | 'removed' | 'context'
  left: string
  right: string
  text: string
}

interface DiffSection {
  path: string
  delta: string
  showDot?: boolean
  lines: DiffLine[]
}

const diffSections: DiffSection[] = [
  {
    path: 'app/components/workbench/ChatWindow.vue',
    delta: '+18 -6',
    lines: [
      { kind: 'context', left: '28', right: '28', text: 'const laneVars = computed(() => ({' },
      { kind: 'removed', left: '31', right: '', text: '\'--wb-chat-lane-inset-left\': \'13%\',' },
      { kind: 'removed', left: '32', right: '', text: '\'--wb-chat-lane-inset-right\': \'13%\',' },
      { kind: 'added', left: '', right: '31', text: '\'--wb-chat-lane-inset-left\': props.isDiffOpen ? \'11.5%\' : \'13%\',' },
      { kind: 'added', left: '', right: '32', text: '\'--wb-chat-lane-inset-right\': props.isDiffOpen ? \'11.5%\' : \'13%\',' },
      { kind: 'context', left: '47', right: '47', text: '})' },
      { kind: 'added', left: '', right: '52', text: '// keep lane visually stable while drawer animates in' },
    ],
  },
  {
    path: 'app/components/workbench/chat/DrawerChangeCard.vue',
    delta: '+27 -9',
    showDot: true,
    lines: [
      { kind: 'context', left: '18', right: '18', text: '<section class="... bg-[var(--wb-bubble-bg)]">' },
      { kind: 'removed', left: '36', right: '', text: '<span class="text-[12px]">{{ section.delta }}</span>' },
      { kind: 'added', left: '', right: '36', text: '<span class="text-[length:var(--wb-ui-text-2xs)] text-[var(--theme-added)]">{{ + }}</span>' },
      { kind: 'added', left: '', right: '37', text: '<span class="text-[length:var(--wb-ui-text-2xs)] text-[var(--theme-removed)]">{{ - }}</span>' },
      { kind: 'context', left: '51', right: '51', text: '<Icon name="ph:arrow-u-up-left" ... />' },
      { kind: 'added', left: '', right: '66', text: 'line.kind === \'removed\' ? borderLeftStyle: \'dashed\' : \'solid\'' },
      { kind: 'context', left: '78', right: '78', text: 'class="diff-line-row grid gap-0 ..."' },
    ],
  },
  {
    path: 'app/components/workbench/DiffDrawer.vue',
    delta: '+41 -18',
    lines: [
      { kind: 'context', left: '102', right: '102', text: '<ComposerDropdownMenu :open="openMenuKey === \'status\'" ...>' },
      { kind: 'added', left: '', right: '111', text: '<span class="...">Unstaged</span>' },
      { kind: 'added', left: '', right: '112', text: '<span class="... rounded-full ...">1</span>' },
      { kind: 'context', left: '129', right: '129', text: '<button @click="selectStatus(\'unstaged\')">' },
      { kind: 'added', left: '', right: '148', text: '<span class="text-[12px] text-[color:var(--wb-text-muted)]">main -> origin/main</span>' },
      { kind: 'removed', left: '176', right: '', text: 'border-l-[color:var(--wb-border-2)]' },
      { kind: 'added', left: '', right: '176', text: 'border-l-[color:color-mix(in_srgb,var(--wb-divider)_86%,transparent)]' },
      { kind: 'context', left: '212', right: '212', text: '.diff-drawer--open { opacity: 1; transform: translateX(0); }' },
    ],
  },
]

// Default: sections are open. State persists while drawer stays mounted.
const collapsedSections = ref<Set<string>>(new Set())
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
  return collapsedSections.value.has(path)
}

function toggleSection(path: string) {
  const next = new Set(collapsedSections.value)
  if (next.has(path))
    next.delete(path)
  else
    next.add(path)
  collapsedSections.value = next
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
  <aside class="diff-drawer max-w-full overflow-x-hidden overflow-y-visible border-l border-l-[color:color-mix(in_srgb,var(--wb-divider)_86%,transparent)] rounded-none bg-[var(--wb-bg-panel)]" :class="open ? 'diff-drawer--open' : ''">
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
    <div class="diff-scroll relative z-10 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-2 pt-8 text-[13px] font-[var(--font-code)]">
      <DrawerChangeCard
        v-for="section in diffSections"
        :key="section.path"
        :section="section"
        :show-status-dot="section.showDot"
        :collapsed="isSectionCollapsed(section.path)"
        :suspend-accordion-motion="suspendAccordionMotion"
        @toggle="toggleSection(section.path)"
      />
    </div>
  </aside>
</template>

<style scoped>
.diff-drawer {
  width: var(--wb-diff-size, min(41vw, 520px));
  flex: 0 0 auto;
  min-width: 0;
  max-width: min(520px, 100%);
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
