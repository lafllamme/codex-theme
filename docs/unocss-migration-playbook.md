# UnoCSS Migration Playbook

This is the team SOP for moving clone components from scoped CSS to UnoCSS utility-first styling.

## Policy

- Prefer Uno utility classes directly in templates.
- Prefer Radix/Uno tokens for color and border semantics.
- Keep scoped CSS only for special cases:
  - complex choreography/transitions,
  - hard pseudo-selector dependencies,
  - browser-specific quirks,
  - tiny bridge rules not practical in utilities.
- Do not add new large scoped style blocks for standard layout/spacing/typography.

## Migration order

1. `WorkbenchMainStage.vue`
2. `ComposerBar.vue`
3. `WorkbenchTopbar.vue`
4. `WorkbenchSidebar.vue`
5. `TerminalDrawer.vue`
6. `DiffDrawer.vue`
7. `DsCodexWorkbench.vue` wrappers

## Per-component process

1. Convert static layout, spacing, typography, border, background to Uno classes.
2. Keep legacy scoped CSS temporarily for choreography only.
3. Compare against screenshot states.
4. Remove dead CSS immediately after parity check.
5. Run lint and build.

## Definition of done

- Visual parity preserved for target states.
- No duplicated style ownership (utility + stale CSS for same property).
- Scoped CSS reduced to special-case rules only.
- Lint/build pass.

## Required validation states

- Base chat view
- Sidebar collapsed
- Terminal open
- Diff open
- Combined state (collapsed + panel open)
- Mobile overlays

## Practical Uno patterns

- Use arbitrary values when needed:
  - `border-[1px] border-[var(--wb-border-2)]`
  - `bg-[var(--wb-panel-bg-1)]`
  - `text-[rgba(255,255,255,0.9)]`
- Prefer responsive utilities over custom media blocks for non-animated rules.
- Keep transition classes concise; move advanced sequence logic to scoped CSS only when necessary.
