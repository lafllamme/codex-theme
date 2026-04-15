/**
 * Static command palette entries for Cmd+K (labels, shortcuts, icons).
 * Runtime actions are bound in DsCodexWorkbench via `actionKey`.
 */

export type CommandPaletteActionId
  = 'newChat'
    | 'openFolder'
    | 'settings'
    | 'searchChats'
    | 'newQuickChat'
    | 'openMiniWindow'
    | 'prevChat'
    | 'nextChat'
    | 'find'
    | 'back'
    | 'forward'
    | 'toggleSidebar'
    | 'toggleTerminal'
    | 'toggleDiff'
    | 'forceReloadSkills'
    | 'goToSkills'
    | 'mcp'
    | 'personality'
    | 'manageAutomations'
    | 'logOut'
    | 'feedback'

export interface CommandPaletteItemDef {
  id: string
  label: string
  /** Iconify name; omit for iconless rows (e.g. Manage automations in reference). */
  icon?: string
  shortcut?: string
  actionKey: CommandPaletteActionId
}

export interface CommandPaletteSectionDef {
  id: string
  title: string
  items: CommandPaletteItemDef[]
}

export const commandPaletteSectionDefs: CommandPaletteSectionDef[] = [
  {
    id: 'suggested',
    title: 'Suggested',
    items: [
      { id: 'new-chat', label: 'New chat', shortcut: '⌘N', icon: 'heroicons-outline:pencil-alt', actionKey: 'newChat' },
      { id: 'open-folder', label: 'Open folder', shortcut: '⌘O', icon: 'ph:folder-open', actionKey: 'openFolder' },
      { id: 'settings', label: 'Settings', shortcut: '⌘,', icon: 'ph:gear-six', actionKey: 'settings' },
    ],
  },
  {
    id: 'chat',
    title: 'Chat',
    items: [
      { id: 'search-chats', label: 'Search chats', shortcut: '⌘G', icon: 'ph:magnifying-glass', actionKey: 'searchChats' },
      { id: 'new-quick-chat', label: 'New quick chat', shortcut: '⌥⌘N', icon: 'heroicons-outline:pencil-alt', actionKey: 'newQuickChat' },
      { id: 'open-mini-window', label: 'Open in mini window', icon: 'ph:app-window', actionKey: 'openMiniWindow' },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    items: [
      { id: 'prev-chat', label: 'Previous chat', shortcut: '⇧⌘[', icon: 'ph:arrow-up', actionKey: 'prevChat' },
      { id: 'next-chat', label: 'Next chat', shortcut: '⇧⌘]', icon: 'ph:arrow-down', actionKey: 'nextChat' },
      { id: 'find', label: 'Find', shortcut: '⌘F', icon: 'ph:magnifying-glass', actionKey: 'find' },
      { id: 'back', label: 'Back', shortcut: '⌘[', icon: 'ph:arrow-left', actionKey: 'back' },
      { id: 'forward', label: 'Forward', shortcut: '⌘]', icon: 'ph:arrow-right', actionKey: 'forward' },
    ],
  },
  {
    id: 'panels',
    title: 'Panels',
    items: [
      { id: 'toggle-sidebar', label: 'Toggle sidebar', shortcut: '⌘B', icon: 'ph:sidebar-simple', actionKey: 'toggleSidebar' },
      { id: 'toggle-terminal', label: 'Toggle terminal', shortcut: '⌘J', icon: 'mynaui:terminal', actionKey: 'toggleTerminal' },
      { id: 'toggle-diff', label: 'Toggle diff panel', shortcut: '⌥⌘B', icon: 'ph:columns', actionKey: 'toggleDiff' },
    ],
  },
  {
    id: 'skills',
    title: 'Skills',
    items: [
      { id: 'force-reload-skills', label: 'Force reload skills', icon: 'ph:arrow-clockwise', actionKey: 'forceReloadSkills' },
      { id: 'go-to-skills', label: 'Go to skills', icon: 'ph:cube', actionKey: 'goToSkills' },
    ],
  },
  {
    id: 'configure',
    title: 'Configure',
    items: [
      { id: 'mcp', label: 'MCP', icon: 'ph:paperclip', actionKey: 'mcp' },
      { id: 'personality', label: 'Personality', icon: 'ph:user-circle', actionKey: 'personality' },
    ],
  },
  {
    id: 'app',
    title: 'App',
    items: [
      { id: 'manage-automations', label: 'Manage automations', actionKey: 'manageAutomations' },
      { id: 'log-out', label: 'Log out', icon: 'ph:sign-out', actionKey: 'logOut' },
      { id: 'feedback', label: 'Feedback', icon: 'ph:chat-circle-dots', actionKey: 'feedback' },
    ],
  },
]
