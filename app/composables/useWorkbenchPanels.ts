export function useWorkbenchPanels() {
  const isSidebarCollapsed = ref(false)
  const isSidebarOpenMobile = ref(false)
  const isTerminalOpen = ref(false)
  const isDiffOpen = ref(false)
  const isPipEnabled = ref(true)

  function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
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
