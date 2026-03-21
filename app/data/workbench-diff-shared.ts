import type { FileChangeItem } from '~/types/workbench-chat'

export interface DrawerSectionSeed {
  id: string
  fileId: string
  path: string
  delta: string
  showDot?: boolean
}

const SHARED_DRAWER_SECTIONS: DrawerSectionSeed[] = [
  {
    id: 'section-chat-window',
    fileId: 'f-chat-window',
    path: 'app/components/workbench/ChatWindow.vue',
    delta: '+18 -6',
  },
  {
    id: 'section-drawer-change-card',
    fileId: 'f-drawer-change-card',
    path: 'app/components/workbench/chat/DrawerChangeCard.vue',
    delta: '+27 -9',
    showDot: true,
  },
  {
    id: 'section-diff-drawer',
    fileId: 'f-diff-drawer',
    path: 'app/components/workbench/DiffDrawer.vue',
    delta: '+41 -18',
  },
]

const SHARED_DIFF_FILES: FileChangeItem[] = [
  {
    id: 'f-chat-window',
    path: 'app/components/workbench/ChatWindow.vue',
    fileName: 'ChatWindow.vue',
    added: 18,
    removed: 6,
    lines: [
      { kind: 'context', left: 28, right: 28, text: 'const laneVars = computed(() => ({' },
      { kind: 'context', left: 29, right: 29, text: '  const closeInset = \'13%\'' },
      { kind: 'context', left: 30, right: 30, text: '  const openInset = \'11.5%\'' },
      { kind: 'removed', left: 31, right: '', text: '\'--wb-chat-lane-inset-left\': \'13%\',' },
      { kind: 'removed', left: 32, right: '', text: '\'--wb-chat-lane-inset-right\': \'13%\',' },
      { kind: 'added', left: '', right: 31, text: '\'--wb-chat-lane-inset-left\': props.isDiffOpen ? \'11.5%\' : \'13%\',' },
      { kind: 'added', left: '', right: 32, text: '\'--wb-chat-lane-inset-right\': props.isDiffOpen ? \'11.5%\' : \'13%\',' },
      { kind: 'context', left: 33, right: 33, text: '' },
      { kind: 'context', left: 34, right: 34, text: 'if (!props.isDiffOpen)' },
      { kind: 'context', left: 35, right: 35, text: '  return {' },
      { kind: 'context', left: 36, right: 36, text: '    \'--wb-chat-lane-inset-left\': closeInset,' },
      { kind: 'context', left: 37, right: 37, text: '    \'--wb-chat-lane-inset-right\': closeInset,' },
      { kind: 'context', left: 38, right: 38, text: '  }' },
      { kind: 'context', left: 39, right: 39, text: '' },
      { kind: 'context', left: 40, right: 40, text: 'return {' },
      { kind: 'context', left: 41, right: 41, text: '  \'--wb-chat-lane-inset-left\': openInset,' },
      { kind: 'context', left: 42, right: 42, text: '  \'--wb-chat-lane-inset-right\': openInset,' },
      { kind: 'context', left: 43, right: 43, text: '}' },
      { kind: 'context', left: 44, right: 44, text: '})' },
      { kind: 'context', left: 45, right: 45, text: '' },
      { kind: 'context', left: 46, right: 46, text: 'watch(() => props.isDiffOpen, syncLayoutInset)' },
      { kind: 'context', left: 47, right: 47, text: 'onMounted(syncLayoutInset)' },
      { kind: 'context', left: 48, right: 48, text: '' },
      { kind: 'context', left: 49, right: 49, text: 'function syncLayoutInset() {' },
      { kind: 'context', left: 50, right: 50, text: '  // keep lane visually stable while drawer animates in' },
      { kind: 'context', left: 51, right: 51, text: '}' },
      { kind: 'added', left: '', right: 52, text: '// keep lane visually stable while drawer animates in' },
    ],
  },
  {
    id: 'f-drawer-change-card',
    path: 'app/components/workbench/chat/DrawerChangeCard.vue',
    fileName: 'DrawerChangeCard.vue',
    added: 27,
    removed: 9,
    showDot: true,
    lines: [
      { kind: 'context', left: 18, right: 18, text: 'const diffStore = useDiffStore()' },
      { kind: 'context', left: 19, right: 19, text: 'const titleHovered = ref(false)' },
      { kind: 'context', left: 20, right: 20, text: '' },
      { kind: 'context', left: 21, right: 21, text: 'const unmodifiedChunk = computed(() =>' },
      { kind: 'context', left: 22, right: 22, text: '  props.section.lines.find(line => line.kind === \'unchanged_chunk\'),' },
      { kind: 'context', left: 23, right: 23, text: ')' },
      { kind: 'removed', left: 36, right: '', text: 'const hasUnmodifiedChunk = computed(() => Boolean(unmodifiedChunk.value))' },
      { kind: 'added', left: '', right: 36, text: 'const sectionLineDigits = computed(() => maxSectionLineDigits(props.section.lines))' },
      { kind: 'added', left: '', right: 37, text: 'const hasUnmodifiedChunk = computed(() => Boolean(unmodifiedChunk.value))' },
      { kind: 'context', left: 44, right: 44, text: 'function lineMarkerClass(line: FileDiffCodeLine) {' },
      { kind: 'context', left: 45, right: 45, text: '  if (line.kind === \'added\' || line.kind === \'add\')' },
      { kind: 'context', left: 46, right: 46, text: '    return \'border-l-[2px] border-l-solid border-l-[color:var(--theme-added)]\'' },
      { kind: 'context', left: 47, right: 47, text: '  if (line.kind === \'removed\' || line.kind === \'remove\')' },
      { kind: 'context', left: 48, right: 48, text: '    return \'border-l-[2px] border-l-dashed border-l-[color:var(--theme-removed)]\'' },
      { kind: 'context', left: 49, right: 49, text: '  return \'border-l-[2px] border-l-solid border-l-transparent\'' },
      { kind: 'context', left: 50, right: 50, text: '}' },
      { kind: 'context', left: 51, right: 51, text: '' },
      { kind: 'context', left: 52, right: 52, text: 'function maxSectionLineDigits(lines: FileDiffLine[]) {' },
      { kind: 'context', left: 53, right: 53, text: '  let maxDigits = 2' },
      { kind: 'context', left: 54, right: 54, text: '  for (const line of lines) {' },
      { kind: 'context', left: 55, right: 55, text: '    if (line.left) maxDigits = Math.max(maxDigits, lineNumberDigits(line.left))' },
      { kind: 'context', left: 56, right: 56, text: '    if (line.right) maxDigits = Math.max(maxDigits, lineNumberDigits(line.right))' },
      { kind: 'context', left: 57, right: 57, text: '  }' },
      { kind: 'context', left: 58, right: 58, text: '  return maxDigits' },
      { kind: 'context', left: 59, right: 59, text: '}' },
      { kind: 'added', left: '', right: 71, text: 'class="[--wb-gutter-width:max(66px,calc(var(--wb-line-digits)*1ch+52px))] ..."' },
      { kind: 'context', left: 72, right: 72, text: '<template v-for="(line, lineIndex) in section.lines">' },
      { kind: 'context', left: 73, right: 73, text: '  <!-- render line rows and unmodified tabs -->' },
      { kind: 'context', left: 74, right: 74, text: '</template>' },
    ],
  },
  {
    id: 'f-diff-drawer',
    path: 'app/components/workbench/DiffDrawer.vue',
    fileName: 'DiffDrawer.vue',
    added: 41,
    removed: 18,
    lines: [
      { kind: 'context', left: 102, right: 102, text: '<ComposerDropdownMenu :open="openMenuKey === \'status\'" ...>' },
      { kind: 'added', left: '', right: 111, text: '<span class="...">Unstaged</span>' },
      { kind: 'added', left: '', right: 112, text: '<span class="... rounded-full ...">1</span>' },
      { kind: 'context', left: 129, right: 129, text: '<button @click="selectStatus(\'unstaged\')">' },
      {
        kind: 'unchanged_chunk',
        id: 'chunk-diff-drawer-1',
        count: 7,
        lines: [
          { kind: 'context', left: 139, right: 139, text: '<button class="h-6 w-6 inline-flex ..." />' },
          { kind: 'context', left: 140, right: 140, text: '<button class="h-6 w-6 inline-flex ..." />' },
          { kind: 'context', left: 141, right: 141, text: '<button class="h-6 w-6 inline-flex ..." />' },
          { kind: 'context', left: 142, right: 142, text: '</div>' },
          { kind: 'context', left: 143, right: 143, text: '</header>' },
          { kind: 'context', left: 144, right: 144, text: '<div class="diff-scroll ...">' },
          { kind: 'context', left: 145, right: 145, text: '<DrawerChangeCard ... />' },
        ],
      },
      { kind: 'added', left: '', right: 148, text: '<span class="text-[12px] text-[color:var(--wb-text-muted)]">main → origin/main</span>' },
      { kind: 'removed', left: 176, right: '', text: 'border-l-[color:var(--wb-border-2)]' },
      { kind: 'added', left: '', right: 176, text: 'border-l-[color:color-mix(in_srgb,var(--wb-divider)_86%,transparent)]' },
      { kind: 'context', left: 212, right: 212, text: '.diff-drawer--open { opacity: 1; transform: translateX(0); }' },
    ],
  },
]

export function createSharedDrawerSections() {
  return SHARED_DRAWER_SECTIONS.map(section => ({ ...section }))
}

export function createSharedDiffFiles() {
  return SHARED_DIFF_FILES.map(file => ({
    ...file,
    lines: file.lines.map((line) => {
      if (line.kind !== 'unchanged_chunk')
        return { ...line }
      return {
        ...line,
        lines: line.lines.map(inner => ({ ...inner })),
      }
    }),
  }))
}
