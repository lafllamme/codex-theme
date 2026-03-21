import type { FileChangeItem } from '~/types/workbench-chat'
import { createSharedDiffFiles, createSharedDrawerSections } from '~/data/workbench-diff-shared'

export interface DrawerSectionView {
  id: string
  fileId: string
  path: string
  delta: string
  showDot?: boolean
  lines: FileChangeItem['lines']
}

export const useDiffStore = defineStore('diff', () => {
  const drawerSections = ref(createSharedDrawerSections())
  const filesById = ref<Record<string, FileChangeItem>>({})
  const collapsedSectionIds = ref<string[]>([])
  const openFileByCardId = ref<Record<string, string>>({})
  const expandedChunkIdsByFile = ref<Record<string, string[]>>({})

  function upsertFiles(files: FileChangeItem[]) {
    for (const file of files)
      filesById.value[file.id] = file
  }

  function initialize() {
    if (Object.keys(filesById.value).length > 0)
      return
    upsertFiles(createSharedDiffFiles())
  }

  initialize()

  function ensureCardState(cardId: string, fileIds: string[]) {
    if (!fileIds.length)
      return
    if (!openFileByCardId.value[cardId])
      openFileByCardId.value[cardId] = fileIds[0]!
  }

  function toggleCardFile(cardId: string, fileId: string) {
    const current = openFileByCardId.value[cardId]
    openFileByCardId.value[cardId] = current === fileId ? '' : fileId
  }

  function activeFileId(cardId: string) {
    return openFileByCardId.value[cardId] ?? ''
  }

  function activeFile(cardId: string) {
    const fileId = activeFileId(cardId)
    return fileId ? filesById.value[fileId] : undefined
  }

  function isSectionCollapsed(sectionId: string) {
    return collapsedSectionIds.value.includes(sectionId)
  }

  function toggleSection(sectionId: string) {
    if (isSectionCollapsed(sectionId)) {
      collapsedSectionIds.value = collapsedSectionIds.value.filter(id => id !== sectionId)
      return
    }
    collapsedSectionIds.value = [...collapsedSectionIds.value, sectionId]
  }

  function isUnmodifiedChunkExpanded(fileId: string, chunkId: string) {
    return expandedChunkIdsByFile.value[fileId]?.includes(chunkId) ?? false
  }

  function toggleUnmodifiedChunk(fileId: string, chunkId: string) {
    const current = expandedChunkIdsByFile.value[fileId] ?? []
    if (current.includes(chunkId)) {
      expandedChunkIdsByFile.value[fileId] = current.filter(id => id !== chunkId)
      return
    }
    expandedChunkIdsByFile.value[fileId] = [...current, chunkId]
  }

  const resolvedDrawerSections = computed<DrawerSectionView[]>(() => {
    return drawerSections.value
      .map((section) => {
        const file = filesById.value[section.fileId]
        if (!file)
          return null
        return {
          ...section,
          lines: file.lines,
        }
      })
      .filter(Boolean) as DrawerSectionView[]
  })

  const drawerAddedTotal = computed(() =>
    resolvedDrawerSections.value.reduce((sum, section) => sum + (filesById.value[section.fileId]?.added ?? 0), 0),
  )

  const drawerRemovedTotal = computed(() =>
    resolvedDrawerSections.value.reduce((sum, section) => sum + (filesById.value[section.fileId]?.removed ?? 0), 0),
  )

  return {
    filesById,
    resolvedDrawerSections,
    drawerAddedTotal,
    drawerRemovedTotal,
    upsertFiles,
    ensureCardState,
    toggleCardFile,
    activeFileId,
    activeFile,
    isSectionCollapsed,
    toggleSection,
    isUnmodifiedChunkExpanded,
    toggleUnmodifiedChunk,
  }
})
