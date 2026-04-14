import type { CodexThemePayload } from '~/types/codex-theme'
import { resolveSyntaxTokenSet } from '~/utils/code-theme-syntax'

const HEX_RGB_RE = /^[\da-f]{6}$/i

/**
 * Maps codex-theme-v1 payload + page flags to CSS custom properties for the workbench replica.
 * App behavior prioritizes a stable four-surface ladder:
 * - sidebar, container, bubble, input
 */
export function codexWorkbenchCssVars(
  payload: CodexThemePayload,
  translucentSidebar: boolean,
): Record<string, string> {
  const { surface, ink, accent, contrast, opaqueWindows, semanticColors } = payload.theme
  const syntax = resolveSyntaxTokenSet(payload)
  const variant = payload.variant
  const t = Math.min(100, Math.max(0, contrast)) / 100

  const parseHexToRgb = (value: string): [number, number, number] | null => {
    const hex = value.trim().replace('#', '')
    if (!HEX_RGB_RE.test(hex))
      return null
    const int = Number.parseInt(hex, 16)
    return [(int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF]
  }

  const mixRgb = (
    a: [number, number, number],
    b: [number, number, number],
    amount: number,
  ): [number, number, number] => {
    const p = Math.max(0, Math.min(1, amount))
    return [
      Math.round(a[0] * (1 - p) + b[0] * p),
      Math.round(a[1] * (1 - p) + b[1] * p),
      Math.round(a[2] * (1 - p) + b[2] * p),
    ]
  }

  const rgbToHex = ([r, g, b]: [number, number, number]) => {
    const toHex = (v: number) => v.toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const toGray = (rgb: [number, number, number]): [number, number, number] => {
    const l = Math.round((rgb[0] * 0.299) + (rgb[1] * 0.587) + (rgb[2] * 0.114))
    return [l, l, l]
  }

  const surfaceRgb = parseHexToRgb(surface)
  const inkRgb = parseHexToRgb(ink)
  const isLightSurface = surfaceRgb
    ? ((surfaceRgb[0] * 0.299 + surfaceRgb[1] * 0.587 + surfaceRgb[2] * 0.114) / 255) >= 0.74
    : variant === 'light'

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value))

  const useGlass = translucentSidebar && !opaqueWindows

  // Fallback if colors are not parseable.
  const fallbackSidebar = variant === 'light'
    ? `color-mix(in srgb, ${surface} 83%, ${ink} 17%)`
    : `color-mix(in srgb, ${surface} 84%, black 16%)`

  let sidebarSolid = fallbackSidebar
  let chatInput = variant === 'dark'
    ? `color-mix(in srgb, ${surface} 96%, ${ink} 4%)`
    : `color-mix(in srgb, ${surface} 95.5%, ${ink} 4.5%)`
  let chatBubble = variant === 'dark'
    ? `color-mix(in srgb, ${surface} 95%, ${ink} 5%)`
    : `color-mix(in srgb, ${surface} 95%, ${ink} 5%)`

  if (surfaceRgb && inkRgb) {
    if (isLightSurface) {
      // App-calibrated light profile.
      const sidebarMix = opaqueWindows
        ? clamp(0.168 + (t * 0.003), 0.168, 0.171)
        : clamp(0.30 + (t * 0.02), 0.30, 0.34)
      const inputMix = opaqueWindows
        ? clamp(0.046 + (t * 0.002), 0.046, 0.048)
        : clamp(0.17 + (t * 0.02), 0.17, 0.21)
      const bubbleMix = opaqueWindows
        ? clamp(0.048 + (t * 0.002), 0.048, 0.05)
        : clamp(0.045 + (t * 0.01), 0.045, 0.06)

      const sidebarBaseRgb = mixRgb(surfaceRgb, inkRgb, sidebarMix)
      const inputBaseRgb = mixRgb(surfaceRgb, inkRgb, inputMix)
      const bubbleBaseRgb = mixRgb(surfaceRgb, inkRgb, bubbleMix)

      const sidebarRgb = opaqueWindows
        ? mixRgb(sidebarBaseRgb, toGray(sidebarBaseRgb), 0.04)
        : sidebarBaseRgb
      const inputRgb = opaqueWindows
        ? mixRgb(inputBaseRgb, toGray(inputBaseRgb), 0.17)
        : inputBaseRgb
      const bubbleRgb = opaqueWindows
        ? mixRgb(bubbleBaseRgb, toGray(bubbleBaseRgb), 0.05)
        : bubbleBaseRgb

      sidebarSolid = rgbToHex(sidebarRgb)
      chatInput = rgbToHex(inputRgb)
      chatBubble = rgbToHex(bubbleRgb)
    }
    else {
      const darkSidebarRgb = mixRgb(surfaceRgb, [0, 0, 0], 0.16)
      const darkInputRgb = mixRgb(surfaceRgb, inkRgb, clamp(0.038 + (t * 0.008), 0.038, 0.048))
      const darkBubbleRgb = mixRgb(surfaceRgb, inkRgb, clamp(0.048 + (t * 0.01), 0.048, 0.06))

      sidebarSolid = rgbToHex(darkSidebarRgb)
      chatInput = rgbToHex(darkInputRgb)
      chatBubble = rgbToHex(darkBubbleRgb)
    }
  }

  const sidebarBg = useGlass
    ? `color-mix(in srgb, ${sidebarSolid} 48%, transparent)`
    : sidebarSolid

  const chatCanvas = surface
  const chatElevated = chatCanvas

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

    '--wb-bg-panel': chatCanvas,
    '--wb-bg-panel-elevated': chatElevated,
    '--wb-bg-composer': chatElevated,
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
    /** Softer than `--wb-divider`: header hairlines, diff chrome (Codex-like). */
    '--wb-chrome-hairline': `color-mix(in srgb, ${ink} 7%, transparent)`,
    '--wb-hover-bg': `color-mix(in srgb, ${ink} 8%, transparent)`,
    '--wb-hover-bg-strong': `color-mix(in srgb, ${ink} 11%, transparent)`,
    '--wb-hover-border': `color-mix(in srgb, ${ink} 14%, transparent)`,
    '--wb-chip-ghost-bg': `color-mix(in srgb, ${ink} 6%, transparent)`,
    '--wb-chip-ghost-bg-hover': `color-mix(in srgb, ${ink} 12%, transparent)`,
    '--wb-chip-ghost-bg-active': `color-mix(in srgb, ${ink} 16%, transparent)`,
    '--wb-chip-ghost-border': `color-mix(in srgb, ${ink} 18%, transparent)`,
    '--wb-chip-bg': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 58%, black 42%)`
      : `color-mix(in srgb, ${surface} 85%, black 15%)`,
    '--wb-input-bg': chatInput,
    '--wb-bubble-bg': chatBubble,
    '--wb-select-bg': `color-mix(in srgb, ${surface} 65%, black 35%)`,

    '--wb-diff-delta-added': diffAdded,
    '--wb-diff-delta-removed': diffRemoved,
    '--wb-access-warn': variant === 'dark'
      ? `color-mix(in srgb, #f59f44 ${Math.round(82 - t * 12)}%, ${ink} ${Math.round(18 + t * 12)}%)`
      : `color-mix(in srgb, #f59f44 ${Math.round(74 - t * 10)}%, ${ink} ${Math.round(26 + t * 10)}%)`,
    '--wb-row-active-bg': `color-mix(in srgb, ${ink} 10%, transparent)`,
    '--wb-row-active-border': `color-mix(in srgb, ${ink} 16%, transparent)`,
    '--wb-terminal-prompt': `color-mix(in srgb, ${ink} 52%, transparent)`,
    '--wb-popover-bg': variant === 'dark'
      ? `color-mix(in srgb, ${surface} 76%, black 24%)`
      : `color-mix(in srgb, ${surface} 90%, black 10%)`,
    '--wb-popover-muted': `color-mix(in srgb, ${ink} 44%, transparent)`,

    '--syntax-default': syntax.default,
    '--syntax-keyword': syntax.keyword,
    '--syntax-string': syntax.string,
    '--syntax-comment': syntax.comment,
    '--syntax-function': syntax.function,
    '--syntax-type': syntax.type,
    '--syntax-number': syntax.number,
    '--syntax-meta': syntax.meta,
  }
}
