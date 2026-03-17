# Clone Parity Checklist

Checklist for visual/behavior parity against Codex reference screenshots.

## Shell

- [x] Tighten outer frame radius, border alpha, and shadow depth.
- [x] Keep menu + shell hierarchy flatter (less glow).
- [x] Align vertical rhythm (topbar -> stage -> composer).

## Topbar

- [x] Verify 3 focus button behaviors in all states.
- [x] Match chip/button roundness and icon weight.
- [x] Match action spacing (`run`, `worktree`, `push`, utility icons).

## Chat window (in-panel header + content lane)

- [x] Move heading/controls into the chat panel hierarchy.
- [x] Isolate chat header as a dedicated component.
- [x] Keep title/project/actions hierarchy aligned with Codex screenshot structure.
- [x] Apply compact diff count spacing and subtle divider rhythm.

## Sidebar

- [x] Match row heights and section spacing.
- [x] Improve collapsed mode (text fade + icon alignment).
- [x] Keep active thread emphasis subtle but clear.

## Main stage

- [x] Match chat surface contrast and border layering.
- [x] Match bubble geometry and spacing.
- [x] Move commit/header ownership out of transcript renderer.
- [x] Keep transcript lane inset and center rhythm aligned.

## Drawers

- [x] Terminal behaves as bottom drawer with push-up feel.
- [x] Diff behaves as right drawer with slide/shrink behavior.
- [x] Combined states remain stable.

## Composer

- [x] Match prompt field hierarchy with mic/send controls.
- [x] Match model/thinking selector row density and spacing.
- [x] Match status row typography and branch alignment.
- [x] Keep CTA response tied to accent token.

## Mobile

- [x] Sidebar off-canvas + scrim behavior.
- [x] Diff full-screen overlay behavior.
- [x] Terminal bottom-sheet behavior.

## Theme controller cases

- [x] Scenario presets cover visual edge cases.
- [x] Unknown key passthrough is preserved on import/export.

## Final verification

- [ ] Manual side-by-side check vs `screenshots/target/01-full-look-demo.png`.
- [ ] Manual side-by-side check vs `screenshots/target/02-full-look.png`.
