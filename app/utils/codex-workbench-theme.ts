import type { CodexThemePayload } from '~/types/codex-theme'

/**
 * Maps codex-theme-v1 payload + page flags to CSS custom properties for the workbench replica.
 * Sidebar is always darker than `surface`; glass vs solid from translucentSidebar + opaqueWindows.
 */
export function codexWorkbenchCssVars(
  payload: CodexThemePayload,
  translucentSidebar: boolean,
): Record<string, string> {
  const { surface, ink, accent, contrast, opaqueWindows, semanticColors } = payload.theme
  const variant = payload.variant
  const t = Math.min(100, Math.max(0, contrast)) / 100

  const sidebarBase
    = variant === 'light'
      ? `color-mix(in srgb, ${surface} 88%, black 12%)`
      : `color-mix(in srgb, ${surface} 74%, black 26%)`

  const useGlass = translucentSidebar && !opaqueWindows
  const sidebarBg = useGlass
    ? `color-mix(in srgb, ${sidebarBase} 48%, transparent)`
    : sidebarBase

  const inkBorder = (base: number) =>
    variant === 'dark'
      ? `color-mix(in srgb, ${ink} ${Math.round(base + t * 18)}%, transparent)`
      : `color-mix(in srgb, ${ink} ${Math.round(Math.min(45, base + 12 + t * 10))}%, transparent)`

  const { diffAdded, diffRemoved, skill } = semanticColors

  return {
    '--theme-surface': surface,
    '--theme-ink': ink,
    '--theme-accent': accent,
    '--theme-added': diffAdded,
    '--theme-removed': diffRemoved,
    '--theme-skill': skill,

    '--wb-bg-panel': surface,
    '--wb-bg-panel-elevated': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 90%, black 10%)`
      : `color-mix(in srgb, ${surface} 94%, black 6%)`,
    '--wb-bg-composer': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 86%, black 14%)`
      : `color-mix(in srgb, ${surface} 92%, black 8%)`,
    '--wb-bg-sidebar': sidebarBg,
    '--wb-sidebar-backdrop-filter': useGlass ? 'blur(14px)' : 'none',
    '--wb-bg-diff-chrome': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 82%, black 18%)`
      : `color-mix(in srgb, ${surface} 90%, black 10%)`,
    '--wb-bg-diff-section': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 88%, black 12%)`
      : `color-mix(in srgb, ${surface} 94%, black 6%)`,
    '--wb-bg-diff-header': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 84%, black 16%)`
      : `color-mix(in srgb, ${surface} 92%, black 8%)`,
    '--wb-bg-terminal': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 92%, black 8%)`
      : `color-mix(in srgb, ${surface} 96%, black 4%)`,

    '--wb-border-1': inkBorder(6),
    '--wb-border-2': inkBorder(10),
    '--wb-border-3': inkBorder(14),

    '--wb-text-primary': ink,
    '--wb-text-secondary': `color-mix(in srgb, ${ink} 62%, transparent)`,
    '--wb-text-muted': `color-mix(in srgb, ${ink} 42%, transparent)`,
    '--wb-text-faint': `color-mix(in srgb, ${ink} 26%, transparent)`,
    '--wb-divider': `color-mix(in srgb, ${ink} 12%, transparent)`,
    '--wb-hover-bg': `color-mix(in srgb, ${ink} 8%, transparent)`,
    '--wb-hover-bg-strong': `color-mix(in srgb, ${ink} 11%, transparent)`,
    '--wb-hover-border': `color-mix(in srgb, ${ink} 14%, transparent)`,
    '--wb-chip-bg': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 58%, black 42%)`
      : `color-mix(in srgb, ${surface} 85%, black 15%)`,
    '--wb-input-bg': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 70%, black 30%)`
      : `color-mix(in srgb, ${surface} 88%, black 12%)`,
    '--wb-select-bg': `color-mix(in srgb, ${surface} 65%, black 35%)`,

    '--wb-diff-delta-added': diffAdded,
    '--wb-diff-delta-removed': diffRemoved,
    '--wb-access-warn': `color-mix(in srgb, ${accent} 55%, #f59f44 45%)`,
    '--wb-row-active-bg': `color-mix(in srgb, ${ink} 10%, transparent)`,
    '--wb-row-active-border': `color-mix(in srgb, ${ink} 16%, transparent)`,
    '--wb-terminal-prompt': `color-mix(in srgb, ${ink} 52%, transparent)`,
    '--wb-popover-bg': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 76%, black 24%)`
      : `color-mix(in srgb, ${surface} 90%, black 10%)`,
    '--wb-popover-muted': `color-mix(in srgb, ${ink} 44%, transparent)`,

    /* Code / diff line syntax — fallback from v1 until per-codeThemeId token JSON exists */
    '--syntax-default': ink,
    '--syntax-keyword': accent,
    '--syntax-string': diffAdded,
    '--syntax-comment': diffRemoved,
    '--syntax-function': skill,
    '--syntax-type': skill,
    '--syntax-number': accent,
    '--syntax-meta': `color-mix(in srgb, ${ink} 48%, transparent)`,
  }
}
