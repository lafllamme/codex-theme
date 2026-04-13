import { useMediaQuery } from '@vueuse/core'

/** Matches `max-[1180px]` workbench layout: sidebar column is zero-width; drawer uses `isSidebarOpenMobile`. */
const WORKBENCH_MOBILE_SIDEBAR_MQ = '(max-width: 1180px)'

export function useWorkbenchPanels() {
  const isSidebarCollapsed = ref(false)
  const isSidebarOpenMobile = ref(false)
  const isTerminalOpen = ref(false)
  const isDiffOpen = ref(false)
  const isPipEnabled = ref(true)

  const isWorkbenchNarrowLayout = useMediaQuery(WORKBENCH_MOBILE_SIDEBAR_MQ)

  watch(isWorkbenchNarrowLayout, (narrow) => {
    if (!narrow)
      isSidebarOpenMobile.value = false
  })

  function toggleSidebar() {
    if (isWorkbenchNarrowLayout.value) {
      if (isSidebarOpenMobile.value) {
        isSidebarOpenMobile.value = false
      }
      else {
        isSidebarCollapsed.value = false
        isSidebarOpenMobile.value = true
      }
      return
    }

    isSidebarCollapsed.value = !isSidebarCollapsed.value
    isSidebarOpenMobile.value = false
  }

  function openSidebarMobile() {
    isSidebarOpenMobile.value = true
  }

  function closeSidebarMobile() {
    isSidebarOpenMobile.value = false
  }

  function toggleTerminal() {
    isTerminalOpen.value = !isTerminalOpen.value
  }

  function toggleDiff() {
    isDiffOpen.value = !isDiffOpen.value
  }

  function closePanels() {
    isTerminalOpen.value = false
    isDiffOpen.value = false
  }

  function togglePip() {
    isPipEnabled.value = !isPipEnabled.value
  }

  return {
    isSidebarCollapsed,
    isSidebarOpenMobile,
    isTerminalOpen,
    isDiffOpen,
    isPipEnabled,
    toggleSidebar,
    openSidebarMobile,
    closeSidebarMobile,
    toggleTerminal,
    toggleDiff,
    closePanels,
    togglePip,
  }
}
