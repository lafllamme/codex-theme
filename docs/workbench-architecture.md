# Workbench Architecture

## Component map

- `DsCodexWorkbench.vue` orchestrator shell
  - `WorkbenchTopbar.vue`
  - `WorkbenchSidebar.vue`
  - `WorkbenchMainStage.vue`
  - `DiffDrawer.vue`
  - `TerminalDrawer.vue`
  - `ComposerBar.vue`

## State model

Shared in `useWorkbenchPanels.ts`:

- `isSidebarCollapsed`
- `isSidebarOpenMobile`
- `isTerminalOpen`
- `isDiffOpen`
- `isPipEnabled`

Thread/content state in `DsCodexWorkbench.vue`:

- `activeThreadId`
- `messagesByThread`
- model/thinking selection
- compose input value

## Interaction model

- Topbar buttons toggle independent panel booleans.
- Sidebar collapse is independent of terminal/diff state.
- Mobile sidebar uses off-canvas open/close state + backdrop.
- Diff and terminal can be validated in combined layout states.

## Theme token flow

`themes.vue` owns `CodexThemePayload` and passes data to workbench.

Workbench derives CSS variables:

- `--theme-surface`
- `--theme-ink`
- `--theme-accent`
- `--theme-added`
- `--theme-removed`
- `--theme-skill`
- `--font-ui`
- `--font-code`
- `--ui-font-size`
- `--code-font-size`

These are then consumed by components for visuals.
