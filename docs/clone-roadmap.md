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

- Controls slice is active and now split into focused sub-components:
  - `workbench/controls/TopbarConversationMeta`
  - `workbench/controls/TopbarWorktreeControls`
  - `workbench/controls/TopbarUtilityToggles`
  - `workbench/controls/CommitChip`
- Screenshot source mapping for this slice:
  - Local/current references: `screenshots/current/01-controls-current.png`, `screenshots/current/02-controls-current-alt.png`
  - Real Codex targets: `screenshots/target/03-full-ui-target.png` ... `screenshots/target/08-toolbar-diff-target.png`

## Next slice: Sidebar (acceptance criteria)

- Sidebar header hierarchy matches Codex: title weight, muted project text, subtle overflow action.
- Thread rows align with Codex spacing: row height, left icon lane, active row emphasis.
- Collapse interaction mirrors Codex behavior: icon alignment, text fade timing, hover response.
- Mobile sidebar keeps parity: off-canvas width, scrim opacity, close affordance.
