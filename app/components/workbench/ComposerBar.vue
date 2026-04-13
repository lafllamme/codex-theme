<script setup lang="ts">
import type {
  ComposerMenuItem,
  ComposerMenuSection,
  ComposerMenuTrigger,
} from '~/components/workbench/chat/DsComposerMenu.vue'
import CodexSkillIcon from '~/components/icons/CodexSkillIcon.vue'
import DsSwitch from '~/components/ui/DsSwitch.vue'
import ComposerDropdownMenu from '~/components/workbench/chat/ComposerDropdownMenu.vue'
import DsComposerMenu from '~/components/workbench/chat/DsComposerMenu.vue'

interface MenuOption {
  key: string
  label: string
  icon?: string
  disabled?: boolean
}

interface TriggerToken {
  trigger: ComposerMenuTrigger
  query: string
  start: number
  end: number
}

const props = withDefaults(
  defineProps<{
    modelOptions: string[]
    thinkingOptions: string[]
    /** Input placeholder; use empty-thread vs follow-up copy from the parent. */
    composerPlaceholder?: string
  }>(),
  {
    composerPlaceholder: 'Ask Codex anything, @ to add files, / for commands, $ for skills',
  },
)

const COMPACT_WHITESPACE_RE = /\s{2,}/g

const selectedModel = defineModel<string>('selectedModel', { required: true })
const selectedThinking = defineModel<string>('selectedThinking', {
  required: true,
})
const composeValue = defineModel<string>('composeValue', { required: true })
const composerInputRef = ref<HTMLInputElement | null>(null)

const selectedComposerMentions = ref<ComposerMenuItem[]>([])
const activeComposerTrigger = ref<ComposerMenuTrigger | null>(null)
const composerMenuQuery = ref('')
const composerMenuOpen = ref(false)
const composerMenuActiveIndex = ref(0)
/** When this matches the current trigger+query, keyboard highlight is preserved (arrow keys). Ref reset only when the user changes the filter. */
const composerMenuFilterSignature = ref('')

const openMenuKey = ref<
    null | 'plus' | 'model' | 'thinking' | 'local' | 'access' | 'branch'
>(null)

const executionOptions: MenuOption[] = [
  { key: 'local', label: 'Local Project', icon: 'ph:laptop' },
  { key: 'cloud', label: 'Cloud', icon: 'material-symbols:cloud-outline' },
]

const accessOptions: MenuOption[] = [
  {
    key: 'standard',
    label: 'Standard permissions',
    icon: 'ph:shield-check',
  },
  { key: 'full', label: 'Full access', icon: 'ph:shield-warning' },
]

const thinkingOptionIcons: Record<string, string> = {
  'Niedrig': 'ph:brain-bold',
  'Mittel': 'ph:brain-bold',
  'Hoch': 'ph:brain-bold',
  'Extra hoch': 'ph:brain-bold',
  'Low': 'ph:brain-bold',
  'Medium': 'ph:brain-bold',
  'High': 'ph:brain-bold',
  'Very high': 'ph:brain-bold',
}

const commandItems = computed<ComposerMenuItem[]>(() => [
  { id: 'cmd-cloud', type: 'command', tone: 'command', label: 'Cloud', description: 'Run in cloud environment', icon: 'material-symbols:cloud-outline' },
  { id: 'cmd-code-review', type: 'command', tone: 'command', label: 'Code review', description: 'Review current changes', icon: 'mdi:bug-outline' },
  { id: 'cmd-fast', type: 'command', tone: 'command', label: 'Fast', description: 'Enable faster inference mode', icon: 'ph:lightning-bold' },
  { id: 'cmd-feedback', type: 'command', tone: 'command', label: 'Feedback', description: 'Share product feedback', icon: 'ph:chat-text' },
  { id: 'cmd-mcp', type: 'command', tone: 'command', label: 'MCP', description: 'Show MCP server status', icon: 'ph:plugs' },
  { id: 'cmd-model', type: 'command', tone: 'command', label: 'Model', description: selectedModel.value, icon: 'ph:cube' },
  { id: 'cmd-new-worktree', type: 'command', tone: 'command', label: 'New worktree', description: 'Create and switch worktree', icon: 'ph:arrow-square-out' },
  { id: 'cmd-personality', type: 'command', tone: 'command', label: 'Personality', description: 'Adjust assistant style', icon: 'ph:user-circle' },
  { id: 'cmd-plan-mode', type: 'command', tone: 'command', label: 'Plan mode', description: 'Turn plan mode on', icon: 'ph:list-checks' },
  { id: 'cmd-reasoning', type: 'command', tone: 'command', label: 'Reasoning', description: selectedThinking.value, icon: 'ph:brackets-curly' },
  { id: 'cmd-status', type: 'command', tone: 'command', label: 'Status', description: 'Show context usage and rate limits', icon: 'mdi:speedometer' },
])

const pluginItems: ComposerMenuItem[] = [
  {
    id: 'plugin-github',
    type: 'plugin',
    tone: 'plugin',
    label: 'GitHub',
    description: 'Triage PRs, issues, CI, and publish flows',
    icon: 'mdi:github',
  },
  {
    id: 'plugin-notion',
    type: 'plugin',
    tone: 'plugin',
    label: 'Notion',
    description: 'Notion workflows for specs, research, and docs',
    icon: 'simple-icons:notion',
  },
]

const skillItems: ComposerMenuItem[] = [
  { id: 'skill-vue', type: 'skill', tone: 'skill', label: 'Vue', description: 'Vue.js - Progressive UI framework', icon: 'mdi:cube-outline', meta: 'Personal' },
  { id: 'skill-vueuse', type: 'skill', tone: 'skill', label: 'Vueuse Functions', description: 'Composable helpers for Vue apps', icon: 'mdi:cube-outline', meta: 'Personal' },
  { id: 'skill-vite', type: 'skill', tone: 'skill', label: 'Vite', description: 'Fast build tool with HMR', icon: 'mdi:cube-outline', meta: 'Personal' },
  { id: 'skill-vitest', type: 'skill', tone: 'skill', label: 'Vitest', description: 'Unit testing framework powered by Vite', icon: 'mdi:cube-outline', meta: 'Personal' },
  { id: 'skill-unocss', type: 'skill', tone: 'skill', label: 'Unocss', description: 'Instant atomic CSS engine', icon: 'mdi:cube-outline', meta: 'Personal' },
]

const fileItems: ComposerMenuItem[] = [
  { id: 'file-dshero', type: 'file', tone: 'file', label: 'DsHero.vue', description: 'app/components', path: 'app/components/DsHero.vue', icon: 'ph:file' },
  { id: 'file-composer', type: 'file', tone: 'file', label: 'ComposerBar.vue', description: 'app/components/workbench', path: 'app/components/workbench/ComposerBar.vue', icon: 'ph:file' },
  { id: 'file-mainstage', type: 'file', tone: 'file', label: 'WorkbenchMainStage.vue', description: 'app/components/workbench', path: 'app/components/workbench/WorkbenchMainStage.vue', icon: 'ph:file' },
  { id: 'file-chatdemo', type: 'file', tone: 'file', label: 'ChatWorkbenchDemoMessage.vue', description: 'app/components/workbench/chat', path: 'app/components/workbench/chat/ChatWorkbenchDemoMessage.vue', icon: 'ph:file' },
  { id: 'file-ayu', type: 'file', tone: 'file', label: 'ayu.json', description: 'app/assets/theme-presets', path: 'app/assets/theme-presets/ayu.json', icon: 'ph:brackets-curly' },
  { id: 'file-box', type: 'file', tone: 'file', label: 'box.json', description: 'app/assets/theme-presets', path: 'app/assets/theme-presets/box.json', icon: 'ph:brackets-curly' },
]

const emptyFileSearchItem: ComposerMenuItem = {
  id: 'file-search-empty',
  type: 'file',
  tone: 'file',
  label: 'Type to search for files',
  icon: 'ph:magnifying-glass',
  disabled: true,
}

const selectedExecution = ref('local')
const selectedAccess = ref('full')
const selectedBranch = ref('main')
const isLocalRateLimitsExpanded = ref(false)
const planningModeEnabled = ref(false)
const selectedSpeed = ref<'standard' | 'fast'>('standard')
const isSpeedMenuOpen = ref(false)
const branchSearch = ref('')
const contextUsagePercent = 87
const contextUsedTokens = 226000
const contextTotalTokens = 258000
const contextProgressStroke = computed(() =>
  `${Math.max(0, Math.min(100, contextUsagePercent))} 100`,
)

const normalizedThinkingOptions = computed(() => {
  const defaults = ['Low', 'Medium', 'High', 'Very high']
  const source = props.thinkingOptions.length ? props.thinkingOptions : defaults
  const merged = [...source]
  for (const option of defaults) {
    if (!merged.includes(option))
      merged.push(option)
  }
  return merged
})

const branchItems = [
  {
    key: 'main',
    label: 'main',
    status: 'Not committed: 2 files',
    added: '+5',
    removed: '-3',
  },
]

const selectedExecutionLabel = computed(
  () => {
    const selected = executionOptions.find(
      option => option.key === selectedExecution.value,
    )
    if (!selected || selected.key === 'local')
      return 'Local'
    return selected.label
  },
)

const selectedAccessLabel = computed(
  () =>
    accessOptions.find(option => option.key === selectedAccess.value)
      ?.label ?? 'Full access',
)

const filteredBranches = computed(() => {
  const query = branchSearch.value.trim().toLowerCase()
  if (!query)
    return branchItems
  return branchItems.filter(item =>
    item.label.toLowerCase().includes(query),
  )
})

const composerTokenMap = computed(
  () =>
    selectedComposerMentions.value.map(item => ({
      id: item.id,
      icon: item.icon,
      label: item.label,
      tone: item.tone ?? item.type,
    })),
)

function includesQuery(item: ComposerMenuItem, query: string) {
  if (!query)
    return true
  const q = query.toLowerCase()
  return (
    item.label.toLowerCase().includes(q)
    || item.description?.toLowerCase().includes(q)
    || item.path?.toLowerCase().includes(q)
  )
}

const composerMenuSections = computed<ComposerMenuSection[]>(() => {
  const trigger = activeComposerTrigger.value
  const query = composerMenuQuery.value.trim()
  if (!trigger)
    return []

  if (trigger === '/') {
    const filteredCommands = commandItems.value.filter(item => includesQuery(item, query))
    const filteredSkills = skillItems.filter(item => includesQuery(item, query))

    return [
      { id: 'commands', title: 'Commands', items: filteredCommands },
      { id: 'skills', title: 'Skills', items: filteredSkills },
    ].filter(section => section.items.length > 0)
  }

  if (trigger === '@') {
    const filteredPlugins = pluginItems.filter(item => includesQuery(item, query))
    const filteredFiles = fileItems.filter(item => includesQuery(item, query))
    const filesSectionItems = filteredFiles.length
      ? filteredFiles
      : [emptyFileSearchItem]

    return [
      { id: 'plugins', title: 'Plugins', items: filteredPlugins },
      { id: 'files', title: 'Files', items: filesSectionItems },
    ].filter(section => section.items.length > 0)
  }

  const filteredSkills = skillItems.filter(item => includesQuery(item, query))
  return [
    { id: 'skills', title: 'Skills', items: filteredSkills },
  ].filter(section => section.items.length > 0)
})

const composerSelectableItems = computed(() =>
  composerMenuSections.value.flatMap(section =>
    section.items.filter(item => !item.disabled),
  ),
)

const composerActiveItemId = computed(
  () => composerSelectableItems.value[composerMenuActiveIndex.value]?.id ?? '',
)

function clampComposerMenuIndex() {
  const lastIndex = Math.max(0, composerSelectableItems.value.length - 1)
  if (composerMenuActiveIndex.value > lastIndex)
    composerMenuActiveIndex.value = lastIndex
}

watch(composerMenuSections, () => {
  clampComposerMenuIndex()
})

function parseTriggerToken(value: string, cursor: number): TriggerToken | null {
  const safeCursor = Math.max(0, Math.min(cursor, value.length))
  const lastSpaceIndex = Math.max(
    value.lastIndexOf(' ', safeCursor - 1),
    value.lastIndexOf('\n', safeCursor - 1),
  )
  const start = lastSpaceIndex + 1
  const segment = value.slice(start, safeCursor)
  if (!segment)
    return null

  const trigger = segment[0]
  if (trigger !== '/' && trigger !== '@' && trigger !== '$')
    return null

  return {
    trigger,
    query: segment.slice(1),
    start,
    end: safeCursor,
  }
}

function refreshComposerMenu() {
  const inputEl = composerInputRef.value
  const cursor = inputEl?.selectionStart ?? composeValue.value.length
  const token = parseTriggerToken(composeValue.value, cursor)

  if (!token) {
    composerMenuOpen.value = false
    activeComposerTrigger.value = null
    composerMenuQuery.value = ''
    composerMenuActiveIndex.value = 0
    composerMenuFilterSignature.value = ''
    return
  }

  const nextSignature = `${token.trigger}\0${token.query}`
  activeComposerTrigger.value = token.trigger
  composerMenuQuery.value = token.query
  composerMenuOpen.value = true

  if (composerMenuFilterSignature.value !== nextSignature) {
    composerMenuFilterSignature.value = nextSignature
    composerMenuActiveIndex.value = 0
  }
  clampComposerMenuIndex()
}

function removeComposerMention(id: string) {
  selectedComposerMentions.value = selectedComposerMentions.value.filter(item => item.id !== id)
}

function closeComposerMenu() {
  composerMenuOpen.value = false
  activeComposerTrigger.value = null
  composerMenuQuery.value = ''
  composerMenuActiveIndex.value = 0
  composerMenuFilterSignature.value = ''
}

function selectComposerMenuItem(item: ComposerMenuItem) {
  if (!selectedComposerMentions.value.some(existing => existing.id === item.id))
    selectedComposerMentions.value.push(item)

  const inputEl = composerInputRef.value
  const cursor = inputEl?.selectionStart ?? composeValue.value.length
  const token = parseTriggerToken(composeValue.value, cursor)
  if (token) {
    const before = composeValue.value.slice(0, token.start)
    const after = composeValue.value.slice(token.end)
    composeValue.value = `${before}${after}`.replace(COMPACT_WHITESPACE_RE, ' ')
    const nextCursor = Math.min(token.start, composeValue.value.length)
    nextTick(() => {
      inputEl?.focus()
      inputEl?.setSelectionRange(nextCursor, nextCursor)
    })
  }

  closeComposerMenu()
}

function handleComposerInputKeydown(event: KeyboardEvent) {
  if (!composerMenuOpen.value || composerSelectableItems.value.length === 0)
    return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    composerMenuActiveIndex.value = (composerMenuActiveIndex.value + 1) % composerSelectableItems.value.length
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    composerMenuActiveIndex.value = composerMenuActiveIndex.value === 0
      ? composerSelectableItems.value.length - 1
      : composerMenuActiveIndex.value - 1
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    const item = composerSelectableItems.value[composerMenuActiveIndex.value]
    if (item)
      selectComposerMenuItem(item)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeComposerMenu()
  }
}

function toggleMenu(
  menu: 'plus' | 'model' | 'thinking' | 'local' | 'access' | 'branch',
) {
  closeComposerMenu()
  openMenuKey.value = openMenuKey.value === menu ? null : menu
  if (menu !== 'plus' || openMenuKey.value !== 'plus')
    isSpeedMenuOpen.value = false
}

function closeMenus() {
  openMenuKey.value = null
  isSpeedMenuOpen.value = false
  isLocalRateLimitsExpanded.value = false
  closeComposerMenu()
}

function selectModel(option: string) {
  selectedModel.value = option
  closeMenus()
}

function selectThinking(option: string) {
  selectedThinking.value = option
  closeMenus()
}

function selectExecution(option: string) {
  selectedExecution.value = option
  closeMenus()
}

function toggleLocalRateLimits() {
  isLocalRateLimitsExpanded.value = !isLocalRateLimitsExpanded.value
}

function selectAccess(option: string) {
  selectedAccess.value = option
  closeMenus()
}

function selectBranch(option: string) {
  selectedBranch.value = option
  closeMenus()
}

function toggleSpeedMenu() {
  isSpeedMenuOpen.value = !isSpeedMenuOpen.value
}

function selectSpeed(mode: 'standard' | 'fast') {
  selectedSpeed.value = mode
  isSpeedMenuOpen.value = false
}

function togglePlanningMode() {
  planningModeEnabled.value = !planningModeEnabled.value
}

const contextUsedLabel = computed(() =>
  `${Math.round(contextUsedTokens / 1000)}k / ${Math.round(contextTotalTokens / 1000)}k Tokens`,
)
</script>

<template>
  <div class="flex flex-col">
    <footer
      class="relative border border-[color:var(--wb-border-2)] rounded-[28px] bg-[var(--wb-input-bg)] p-[6px]"
    >
      <DsComposerMenu
        :open="composerMenuOpen"
        :trigger="activeComposerTrigger"
        :sections="composerMenuSections"
        :active-item-id="composerActiveItemId"
        @select="selectComposerMenuItem"
        @close="closeComposerMenu"
      />

      <div class="rounded-[10px] bg-transparent px-2.5 py-2.5">
        <div>
          <div class="min-h-[40px] flex flex-wrap items-center gap-1 px-1">
            <span
              v-for="token in composerTokenMap"
              :key="token.id"
              class="h-[25px] inline-flex items-center gap-1 border rounded-[9px] px-1.5 text-[12.5px] font-medium leading-none"
              :class="[
                token.tone === 'plugin' || token.tone === 'skill'
                  ? 'border-[color:color-mix(in_srgb,var(--theme-skill)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--theme-skill)_10%,transparent)] text-[color:color-mix(in_srgb,var(--theme-skill)_78%,var(--wb-text-primary)_22%)]'
                  : token.tone === 'file'
                    ? 'border-[color:color-mix(in_srgb,var(--theme-accent)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--theme-accent)_10%,transparent)] text-[color:color-mix(in_srgb,var(--theme-accent)_78%,var(--wb-text-primary)_22%)]'
                    : 'border-[color:color-mix(in_srgb,var(--wb-text-primary)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--wb-text-primary)_6%,transparent)] text-[color:var(--wb-text-primary)]',
              ]"
            >
              <CodexSkillIcon
                v-if="token.tone === 'skill'"
                class="h-[13px] w-[13px]"
              />
              <Icon
                v-else
                :name="token.icon"
                class="h-[12px] w-[12px]"
              />
              <span>{{ token.label }}</span>
              <button
                class="h-[14px] w-[14px] inline-flex items-center justify-center rounded-full border-none bg-transparent p-0 opacity-55 outline-none transition-opacity hover:opacity-85"
                @click.stop="removeComposerMention(token.id)"
              >
                <Icon name="ph:x-bold" class="h-[9px] w-[9px]" />
              </button>
            </span>

            <input
              ref="composerInputRef"
              v-model="composeValue"
              class="h-[40px] min-w-[240px] flex-1 appearance-none border-none bg-transparent px-0.5 text-[17px] text-[color:var(--wb-text-muted)] font-light font-[var(--font-ui)] outline-none placeholder:text-[color:var(--wb-text-faint)]"
              type="text"
              :placeholder="composerPlaceholder"
              @focus="refreshComposerMenu"
              @input="refreshComposerMenu"
              @click="refreshComposerMenu"
              @keydown="handleComposerInputKeydown"
            >
          </div>
        </div>

        <div
          class="composer-primary-row mt-4 flex items-center justify-between gap-2 text-[12px]"
        >
          <div class="composer-primary-left min-w-0 inline-flex items-center gap-1.5">
            <ComposerDropdownMenu
              :open="openMenuKey === 'plus'"
              menu-class="w-[244px]"
              align="left"
              @toggle="toggleMenu('plus')"
              @close="closeMenus"
            >
              <template #trigger="{ toggle }">
                <button
                  class="h-[24px] w-[24px] inline-flex appearance-none items-center justify-center rounded-full border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
                  @click.stop="toggle"
                >
                  <Icon
                    name="ph:plus-bold"
                    class="h-[14px] w-[14px]"
                  />
                </button>
              </template>

              <div class="grid gap-0.5">
                <button
                  class="h-[34px] w-full flex items-center gap-2 rounded-[9px] border-none bg-transparent px-2 text-left text-[12px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                >
                  <Icon
                    name="ph:paperclip-bold"
                    class="h-[13px] w-[13px]"
                  />
                  Add photos and files
                </button>

                <div
                  class="mx-0.5 my-[2px] h-px bg-[color:var(--wb-divider)]"
                />

                <button
                  class="h-[34px] w-full flex items-center justify-between rounded-[9px] border-none bg-transparent px-2 text-left text-[12px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                  @click="togglePlanningMode"
                >
                  <span class="inline-flex items-center gap-2">
                    <Icon
                      name="ph:list-checks-bold"
                      class="h-[13px] w-[13px]"
                    />
                    Planning mode
                  </span>
                  <DsSwitch
                    :model-value="planningModeEnabled"
                    :track-width="30"
                    :track-height="18"
                    :thumb-size="14"
                    on-class="bg-[color:var(--theme-accent)]"
                    off-class="bg-[color-mix(in_srgb,var(--wb-text-secondary)_24%,transparent)]"
                    thumb-on-class="bg-[var(--wb-bg-panel)]"
                    thumb-off-class="bg-[var(--wb-bg-panel)]"
                    @update:model-value="planningModeEnabled = $event"
                  />
                </button>

                <div class="relative">
                  <button
                    class="h-[34px] w-full flex items-center justify-between rounded-[9px] border-none px-2 text-left text-[12px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                    :class="isSpeedMenuOpen ? 'bg-[var(--wb-hover-bg)]' : 'bg-transparent'"
                    @click="toggleSpeedMenu"
                  >
                    <span class="inline-flex items-center gap-2">
                      <Icon
                        name="ph:lightning-fill"
                        class="h-[13px] w-[13px]"
                      />
                      Speed
                    </span>
                    <Icon
                      name="ph:caret-right-bold"
                      class="h-[10px] w-[10px]"
                    />
                  </button>

                  <div
                    v-if="isSpeedMenuOpen"
                    class="absolute left-full top-0 z-50 ml-2 w-[300px] border border-[color:color-mix(in_srgb,var(--wb-border-2)_56%,transparent)] rounded-[20px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_72%,transparent)] p-2 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-[16px]"
                  >
                    <ul class="grid m-0 list-none gap-1 p-0">
                      <li>
                        <button
                          class="w-full rounded-[10px] border-none bg-transparent px-2 py-1.5 text-left outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                          @click="selectSpeed('standard')"
                        >
                          <div class="flex items-start justify-between gap-2">
                            <div class="min-w-0">
                              <p class="m-0 text-[15px] text-[color:var(--wb-text-primary)] font-medium leading-[1.2]">
                                Standard
                              </p>
                              <p class="m-0 mt-1 text-[13px] text-[color:var(--wb-text-muted)] leading-[1.25]">
                                Default speed with normal credit usage
                              </p>
                            </div>
                            <Icon
                              v-if="selectedSpeed === 'standard'"
                              name="ph:check-bold"
                              class="mt-[2px] h-[14px] w-[14px] shrink-0 text-[color:var(--wb-text-primary)]"
                            />
                          </div>
                        </button>
                      </li>
                      <li>
                        <button
                          class="w-full rounded-[10px] border-none bg-transparent px-2 py-1.5 text-left outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                          @click="selectSpeed('fast')"
                        >
                          <div class="flex items-start justify-between gap-2">
                            <div class="min-w-0">
                              <p class="m-0 text-[15px] text-[color:var(--wb-text-primary)] font-medium leading-[1.2]">
                                Fast
                              </p>
                              <p class="m-0 mt-1 text-[13px] text-[color:var(--wb-text-muted)] leading-[1.25]">
                                About 1.5x faster, with credits used at 2x
                              </p>
                            </div>
                            <Icon
                              v-if="selectedSpeed === 'fast'"
                              name="ph:check-bold"
                              class="mt-[2px] h-[14px] w-[14px] shrink-0 text-[color:var(--wb-text-primary)]"
                            />
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ComposerDropdownMenu>

            <ComposerDropdownMenu
              :open="openMenuKey === 'model'"
              menu-class="w-max min-w-[196px] max-w-[248px]"
              align="left"
              @toggle="toggleMenu('model')"
              @close="closeMenus"
            >
              <template #trigger="{ toggle }">
                <button
                  class="h-[24px] max-w-[220px] inline-flex items-center gap-1 border border-transparent rounded-[999px] border-solid bg-transparent px-2.5 text-[12px] text-[color:var(--wb-text-secondary)] font-[var(--font-ui)] outline-none transition-colors focus-visible:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
                  @click.stop="toggle"
                >
                  <span class="truncate">{{
                    selectedModel
                  }}</span>
                  <Icon
                    name="ph:caret-down-bold"
                    class="h-[10px] w-[10px] shrink-0 text-current"
                  />
                </button>
              </template>

              <p
                class="mb-2 px-2 text-[17px] text-[color:var(--wb-text-muted)] font-normal leading-[1.2]"
              >
                Model
              </p>
              <ul class="grid m-0 list-none gap-1 p-0">
                <li
                  v-for="option in modelOptions"
                  :key="option"
                >
                  <button
                    class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                    @click="selectModel(option)"
                  >
                    <span class="truncate">{{
                      option
                    }}</span>
                    <Icon
                      v-if="option === selectedModel"
                      name="ph:check-bold"
                      class="h-[13px] w-[13px] shrink-0"
                    />
                  </button>
                </li>
              </ul>
            </ComposerDropdownMenu>

            <ComposerDropdownMenu
              :open="openMenuKey === 'thinking'"
              menu-class="w-max min-w-[180px] max-w-[240px]"
              align="left"
              @toggle="toggleMenu('thinking')"
              @close="closeMenus"
            >
              <template #trigger="{ toggle }">
                <button
                  class="h-[24px] max-w-[160px] inline-flex items-center gap-1 border border-transparent rounded-[999px] bg-transparent px-2.5 text-[12px] text-[color:var(--wb-text-secondary)] font-[var(--font-ui)] outline-none transition-colors focus-visible:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
                  @click.stop="toggle"
                >
                  <span class="truncate">{{
                    selectedThinking
                  }}</span>
                  <Icon
                    name="ph:caret-down-bold"
                    class="h-[10px] w-[10px] shrink-0 text-current"
                  />
                </button>
              </template>

              <p
                class="mb-2 px-2 text-[17px] text-[color:var(--wb-text-muted)] font-normal leading-[1.2]"
              >
                Reasoning
              </p>
              <ul class="grid m-0 list-none gap-1 p-0">
                <li
                  v-for="option in normalizedThinkingOptions"
                  :key="option"
                >
                  <button
                    class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                    @click="selectThinking(option)"
                  >
                    <span
                      class="inline-flex items-center gap-2 truncate"
                    >
                      <Icon
                        :name="
                          thinkingOptionIcons[
                            option
                          ] || 'ph:brain-bold'
                        "
                        class="h-[14px] w-[14px] shrink-0"
                      />
                      {{ option }}
                    </span>
                    <Icon
                      v-if="option === selectedThinking"
                      name="ph:check-bold"
                      class="h-[14px] w-[14px] shrink-0"
                    />
                  </button>
                </li>
              </ul>
            </ComposerDropdownMenu>

            <div
              v-if="planningModeEnabled"
              class="ml-1 inline-flex items-center gap-2 pl-2"
            >
              <span
                aria-hidden="true"
                class="h-[22px] w-px bg-[color:var(--wb-divider)]"
              />
              <span
                class="inline-flex items-center gap-1.5 text-[13px] text-[color:var(--theme-accent)] font-normal"
              >
                <Icon
                  name="ph:list-checks-bold"
                  class="h-[14px] w-[14px] shrink-0 text-[color:var(--theme-accent)]"
                />
                Plan
              </span>
            </div>
          </div>

          <div class="inline-flex items-center gap-2">
            <button
              class="h-7 w-7 inline-flex appearance-none items-center justify-center rounded-full border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            >
              <Icon
                name="ph:microphone-bold"
                class="h-[12px] w-[12px]"
              />
            </button>
            <button
              class="h-7 w-7 inline-flex appearance-none items-center justify-center border border-[color:var(--wb-border-2)] rounded-full bg-[color-mix(in_srgb,var(--wb-text-primary)_82%,transparent)] text-[color:var(--wb-bg-panel)] transition-colors hover:bg-[color-mix(in_srgb,var(--wb-text-primary)_88%,transparent)]"
            >
              <Icon
                name="ph:arrow-up"
                class="h-[16px] w-[16px]"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>

    <div
      class="composer-meta-row mt-1 min-h-[34px] flex items-center justify-between px-2.5 text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-secondary)] font-[var(--font-ui)]"
    >
      <div class="inline-flex items-center">
        <ComposerDropdownMenu
          :open="openMenuKey === 'local'"
          menu-class="w-[250px]"
          align="left"
          @toggle="toggleMenu('local')"
          @close="closeMenus"
        >
          <template #trigger="{ toggle }">
            <button
              class="h-9 inline-flex items-center gap-1.5 rounded-[999px] border-none bg-transparent px-3 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
              @click.stop="toggle"
            >
              <Icon
                name="ph:laptop"
                class="h-[16px] w-[16px]"
              />
              <span>{{
                selectedExecutionLabel
              }}</span>
              <Icon
                name="ph:caret-down-bold"
                class="size-3.5"
              />
            </button>
          </template>

          <p
            class="mb-2 px-2 text-[17px] text-[color:var(--wb-text-muted)] font-normal leading-[1.2]"
          >
            Continue in
          </p>
          <ul class="grid m-0 list-none gap-0.5 p-0">
            <li
              v-for="option in executionOptions"
              :key="option.key"
            >
              <button
                class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2 text-left text-[14px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                @click="selectExecution(option.key)"
              >
                <span class="inline-flex items-center gap-2.5 whitespace-nowrap">
                  <Icon
                    :name="option.icon || 'ph:laptop'"
                    class="h-[16px] w-[16px]"
                  />
                  {{ option.label }}
                </span>
                <Icon
                  v-if="option.key === selectedExecution"
                  name="ph:check-bold"
                  class="h-[14px] w-[14px]"
                />
              </button>
            </li>
          </ul>
          <div
            class="mx-0.5 mt-2 border-t border-[color:var(--wb-divider)] pt-2"
          >
            <button
              class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2 text-left text-[14px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
              @click="toggleLocalRateLimits"
            >
              <span class="inline-flex items-center gap-2.5 whitespace-nowrap">
                <Icon
                  name="mdi:speedometer"
                  class="h-[14px] w-[14px]"
                />
                Remaining rate limits
              </span>
              <Icon
                name="ph:caret-down-bold ml-2"
                class="h-[12px] w-[12px] transition-transform duration-150"
                :class="isLocalRateLimitsExpanded ? 'rotate-180' : ''"
              />
            </button>

            <div
              v-if="isLocalRateLimitsExpanded"
              class="grid gap-0.5 px-2 pb-1.5 pt-0.5"
            >
              <div class="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-3">
                <span class="text-[13px] text-[color:var(--wb-text-primary)] font-semibold leading-[1.2]">5h</span>
                <span class="text-[13px] text-[color:var(--wb-text-muted)] leading-none">63%</span>
                <span class="text-[13px] text-[color:var(--wb-text-muted)] leading-none">20:51</span>
              </div>
              <div class="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-3">
                <span class="text-[13px] text-[color:var(--wb-text-primary)] font-semibold leading-[1.2]">Weekly</span>
                <span class="text-[13px] text-[color:var(--wb-text-muted)] leading-none">12%</span>
                <span class="text-[13px] text-[color:var(--wb-text-muted)] leading-none">16. Apr.</span>
              </div>
              <a
                href="https://chatgpt.com/de-DE/pricing/"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-0.5 h-8 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-0 text-left text-[13px] text-[color:var(--wb-text-muted)] no-underline outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
              >
                <span class="whitespace-nowrap">Upgrade to Pro</span>
                <Icon name="ph:arrow-square-out-bold" class="h-[14px] w-[14px] text-[color:var(--wb-text-muted)]" />
              </a>
              <a
                href="https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan#h_8dd84c836b"
                target="_blank"
                rel="noopener noreferrer"
                class="h-8 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-0 text-left text-[13px] text-[color:var(--wb-text-faint)] no-underline outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-muted)]"
              >
                <span class="whitespace-nowrap">Learn more</span>
                <Icon name="ph:arrow-square-out-bold" class="h-[14px] w-[14px] text-[color:var(--wb-text-faint)]" />
              </a>
            </div>
          </div>

          <div
            class="mx-0.5 mt-1 border-t border-[color:var(--wb-divider)] pt-2"
          >
            <button
              class="h-10 w-full flex items-center gap-2.5 rounded-[10px] border-none bg-transparent px-2 text-left text-[14px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            >
              <Icon
                name="ph:arrows-left-right"
                class="h-[16px] w-[16px]"
              />
              <span class="whitespace-nowrap">Handoff to worktree</span>
            </button>
          </div>
        </ComposerDropdownMenu>

        <ComposerDropdownMenu
          :open="openMenuKey === 'branch'"
          menu-class="w-[360px]"
          align="left"
          @toggle="toggleMenu('branch')"
          @close="closeMenus"
        >
          <template #trigger="{ toggle }">
            <button
              class="h-9 inline-flex items-center gap-1.5 rounded-[999px] border-none bg-transparent px-3 text-[color:var(--wb-text-secondary)] font-normal outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
              @click.stop="toggle"
            >
              <Icon
                name="ph:git-branch"
                class="h-[16px] w-[16px]"
              />
              <span class="font-normal">{{
                selectedBranch
              }}</span>
              <Icon
                name="ph:caret-down-bold"
                class="size-3.5"
              />
            </button>
          </template>

          <div class="mb-2 h-10 flex items-center gap-2 px-2">
            <Icon
              name="ph:magnifying-glass-bold"
              class="h-[12px] w-[12px] text-[color:var(--wb-text-muted)]"
            />
            <input
              v-model="branchSearch"
              class="h-full min-w-0 flex-1 border-none bg-transparent p-0 text-[14px] text-[color:var(--wb-text-primary)] outline-none placeholder:text-[color:var(--wb-text-faint)]"
              type="text"
              placeholder="Search branches"
            >
          </div>

          <div class="min-h-[330px] flex flex-col">
            <p
              class="mb-2 px-2 text-[11px] text-[color:var(--wb-text-muted)] font-semibold"
            >
              Branches
            </p>
            <ul class="grid m-0 list-none gap-1 p-0">
              <li
                v-for="branch in filteredBranches"
                :key="branch.key"
              >
                <button
                  class="min-h-[52px] w-full flex items-start justify-between rounded-[10px] border-none bg-transparent px-2.5 py-2 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                  @click="selectBranch(branch.key)"
                >
                  <span class="min-w-0 inline-flex flex-col">
                    <span
                      class="inline-flex items-center gap-2"
                    >
                      <Icon
                        name="ph:git-branch-bold"
                        class="h-[14px] w-[14px] shrink-0 text-[color:var(--wb-text-secondary)]"
                      />
                      <span class="font-medium">{{
                        branch.label
                      }}</span>
                    </span>
                    <span
                      class="mt-1 pl-[22px] text-[12px] text-[color:var(--wb-text-muted)]"
                    >
                      {{ branch.status }}
                      <span
                        class="ml-1 text-[color:var(--wb-diff-delta-added)]"
                      >{{ branch.added }}</span>
                      <span
                        class="ml-0.5 text-[color:var(--wb-diff-delta-removed)]"
                      >{{ branch.removed }}</span>
                    </span>
                  </span>
                  <Icon
                    v-if="branch.key === selectedBranch"
                    name="ph:check-bold"
                    class="mt-1 h-[14px] w-[14px] shrink-0"
                  />
                </button>
              </li>
            </ul>
            <div class="mb-1 mt-auto px-1">
              <div class="mt-auto h-px bg-$wb-divider" />
            </div>

            <button
              class="h-10 w-full flex items-center gap-2 rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            >
              <Icon
                name="ph:plus-bold"
                class="h-[14px] w-[14px]"
              />
              Create and checkout new branch...
            </button>
          </div>
        </ComposerDropdownMenu>
      </div>

      <span class="inline-flex items-center gap-3.5">
        <ComposerDropdownMenu
          :open="openMenuKey === 'access'"
          menu-class="w-[210px]"
          align="left"
          @toggle="toggleMenu('access')"
          @close="closeMenus"
        >
          <template #trigger="{ toggle }">
            <button
              class="h-9 inline-flex items-center gap-1.5 rounded-[999px] border-none bg-transparent px-3 text-[color:var(--wb-access-warn)] font-normal outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
              @click.stop="toggle"
            >
              <Icon
                name="solar:shield-warning-outline"
                class="h-[16px] w-[16px]"
              />
              <span class="font-normal">{{
                selectedAccessLabel
              }}</span>
              <Icon
                name="ph:caret-down-bold"
                class="size-3.5"
              />
            </button>
          </template>

          <ul class="grid m-0 list-none gap-1 p-0">
            <li v-for="option in accessOptions" :key="option.key">
              <button
                class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] font-normal outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                @click="selectAccess(option.key)"
              >
                <span class="inline-flex items-center gap-2.5 whitespace-nowrap">
                  <Icon
                    :name="
                      option.icon
                        || 'ph:shield-warning'
                    "
                    class="h-[16px] w-[16px]"
                  />
                  {{ option.label }}
                </span>
                <Icon
                  v-if="option.key === selectedAccess"
                  name="ph:check-bold"
                  class="h-[14px] w-[14px]"
                />
              </button>
            </li>
          </ul>
        </ComposerDropdownMenu>

        <span class="relative inline-flex items-center">
          <span
            class="group/context relative h-[16px] w-[16px] inline-flex items-center justify-center rounded-full"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              class="h-[16px] w-[16px] -rotate-90"
            >
              <circle
                cx="10"
                cy="10"
                r="7"
                fill="none"
                stroke-width="2.4"
                pathLength="100"
                style="stroke: color-mix(in srgb, var(--wb-text-secondary) 34%, transparent)"
                stroke-dasharray="100 100"
              />
              <circle
                cx="10"
                cy="10"
                r="7"
                fill="none"
                stroke-width="2.4"
                stroke-linecap="round"
                pathLength="100"
                :style="{ stroke: 'color-mix(in srgb, var(--wb-text-primary) 62%, var(--wb-text-secondary) 38%)' }"
                :stroke-dasharray="contextProgressStroke"
              />
            </svg>

            <span
              class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 max-w-[180px] min-w-[140px] flex flex-col gap-0.5 border border-[color:var(--wb-border-2)] rounded-[16px] bg-[var(--wb-bubble-bg)] px-1 py-3 text-center opacity-0 shadow-[0_12px_28px_rgba(0,0,0,0.2)] backdrop-blur-[14px] transition-[opacity,transform] duration-150 -translate-x-1/2 -translate-y-1 group-hover/context:translate-y-0 group-hover/context:opacity-100"
            >
              <p class="m-0 text-[11px] text-[color:var(--wb-text-muted)] leading-[1.25]">
                Context window:
              </p>
              <p class="m-0 mt-1 text-[13px] text-[color:var(--wb-text-muted)] leading-[1.25]">
                {{ contextUsagePercent }}% full
              </p>
              <p class="m-0 mt-2 text-[13px] text-[color:var(--wb-text-primary)] leading-[1.3]">
                {{ contextUsedLabel }}
              </p>
              <p class="m-0 text-[13px] text-[color:var(--wb-text-primary)] leading-[1.3]">
                used
              </p>
              <p class="m-0 mt-2 text-[13px] text-[color:var(--wb-text-primary)] leading-[1.3]">
                Codex compresses
              </p>
              <p class="m-0 text-[13px] text-[color:var(--wb-text-primary)] leading-[1.3]">
                its context
              </p>
              <p class="m-0 text-[13px] text-[color:var(--wb-text-primary)] leading-[1.3]">
                automatically.
              </p>
            </span>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .composer-primary-row {
    gap: 8px;
  }

  .composer-primary-left {
    min-width: 0;
    overflow: hidden;
  }

  .composer-meta-row {
    display: none;
  }
}
</style>
