# Codex Clone Mismatch Checklist

This checklist tracks remaining visual and behavioral differences between the current theme workbench and the Codex desktop app screenshots.

## Shell

- [ ] Tighten outer frame radius, border alpha, and shadow depth to match desktop density.
- [ ] Keep macOS menu strip and app shell hierarchy visually flatter (less glow).
- [ ] Align window spacing rhythm (top bar to content to composer).

## Topbar

- [ ] Match 3 focus buttons behavior: terminal drawer, diff drawer, sidebar collapse.
- [ ] Reduce chip/button roundness and icon weight for closer native feel.
- [ ] Align top action spacing (`run`, worktree, push, utility icons).

## Sidebar

- [ ] Match section spacing and row heights from screenshots.
- [ ] Improve collapsed mode: text fade/slide + icon-only alignment.
- [ ] Keep active thread emphasis subtle but visible.

## Main Stage

- [ ] Match chat surface contrast and border layering.
- [ ] Match bubble shape, max width, and vertical rhythm.
- [ ] Keep commit/header card geometry closer to screenshots.

## Drawers

- [ ] Terminal as bottom drawer with content push-up animation.
- [ ] Diff as right drawer with slide-in behavior and width transition.
- [ ] Support combined states with stable layout (sidebar + terminal + diff).

## Composer

- [ ] Align input row density, select widths, and icon button geometry.
- [ ] Match status strip typography and spacing.
- [ ] Keep CTA button color response tied to accent token.

## Mobile

- [ ] Sidebar becomes off-canvas drawer with scrim.
- [ ] Diff becomes full-screen overlay sheet.
- [ ] Terminal becomes full-width bottom sheet.

## Theme Controller Cases

- [ ] Add scenario presets to stress semantic colors and layout states.
- [ ] Add import/export passthrough for unknown future Codex keys.
