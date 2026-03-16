# Visual Regression Workflow

Use this process after each clone or UnoCSS migration slice.

## Required states to capture

Desktop:

1. Base chat
2. Sidebar collapsed
3. Terminal open
4. Diff open
5. Combined state (collapsed + one panel open)

Mobile:

1. Sidebar drawer open
2. Diff overlay open
3. Terminal sheet open

## Capture rules

- Use same viewport sizes across iterations.
- Keep same seed data/thread selection.
- Keep same theme preset for baseline comparisons.
- Compare structure first (spacing/radius/layout), then color/typography.

## Acceptance

- No major geometry shifts from reference screenshot set.
- No clipped controls or overlap regressions.
- States remain interactive and stable.

## Technical checks

- `ReadLints` on edited files.
- `pnpm -s run build` must pass before closing a migration step.
