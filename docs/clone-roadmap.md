# Codex Clone Roadmap

This roadmap tracks clone delivery from current implementation to near 1:1 visual and behavioral parity.

## Implemented baseline

- Workbench split into focused components:
  - `WorkbenchTopbar`
  - `WorkbenchSidebar`
  - `WorkbenchMainStage`
  - `ComposerBar`
  - `TerminalDrawer`
  - `DiffDrawer`
- Shared panel state composable:
  - `app/composables/useWorkbenchPanels.ts`
- Functional controls:
  - terminal drawer toggle
  - diff drawer toggle
  - sidebar collapse
- Mobile overlays:
  - sidebar off-canvas + scrim
  - diff overlay
  - terminal bottom sheet
- Theme schema and export flow validated (`codex-theme-v1`).

## Remaining mismatch focus

See detailed checklist:

- [`clone-parity-checklist.md`](./clone-parity-checklist.md)

## Delivery phases

### Phase A: Pixel polish

- Match spacing/radius/border/blur/typography to screenshots.
- Improve icon weight and control density.

### Phase B: Choreography polish

- Refine drawer animation timing and content push/shrink behavior.
- Validate combined states.

### Phase C: Content realism

- Diff and terminal mock structures closer to live Codex feel.
- Add stress states.

### Phase D: Mobile refinement

- Final breakpoint tuning and touch targets.
- Preserve hierarchy parity while keeping usability.

### Phase E: Regression pass

- Run screenshot parity checks for all required states.
- Run lint/build checks.

## Team rule

- UnoCSS-first in templates.
- Scoped CSS only for special-case behavior.
- Keep docs and checklist current while implementing.

## Slice status (latest)

- Controls slice is complete and split into focused sub-components:
  - `workbench/controls/TopbarConversationMeta`
  - `workbench/controls/TopbarWorktreeControls`
  - `workbench/controls/TopbarUtilityToggles`
  - `workbench/controls/CommitChip`
- Sidebar slice is complete:
  - anchored window controls inside sidebar glass shell
  - collapsible repo groups with stable icon behavior
  - draggable width + symmetric collapse/expand choreography
  - full-height behavior with internal thread scrolling (no bottom dead area)
- ChatWindow slice is now active and integrated:
  - new `workbench/ChatWindow` wrapper for `header -> transcript -> composer`
  - new `workbench/chat/ChatHeaderBar` for in-panel heading and controls
  - `WorkbenchMainStage` narrowed to transcript rendering lane
  - `ComposerBar` updated to Codex-like input hierarchy
- Screenshot source mapping for active parity pass:
  - `screenshots/target/01-full-look-demo.png`
  - `screenshots/target/02-full-look.png`

## Next slice: Final pixel polish (acceptance criteria)

- Header control spacing and typography are tuned to screenshot-level parity.
- Transcript vertical rhythm and bubble widths match Codex density.
- Composer baseline, icon contrast, and token row alignment match Codex.
- No regressions in collapsed sidebar, diff-open, terminal-open, and combined states.
