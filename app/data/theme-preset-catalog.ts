import type { CodexThemePayload } from '~/types/codex-theme'

/**
 * Special labels for themes that need custom formatting
 */
const LABELS: Record<string, string> = {
  'night-owl': 'Night Owl',
  'rose-pine': 'Rose Pine',
  'tokyo-night': 'Tokyo Night',
  'vscode-plus': 'VS Code+',
  'catppuccin': 'Catppuccin',
  'gruvbox': 'Gruvbox',
  'oscurange': 'Oscurange',
  'c64': 'C64',
  '3024-day': '3024 Day',
  '3024-night': '3024 Night',
  'vs-code': 'VS Code',
}

/**
 * Convert kebab-case ID to Title Case label
 */
function labelForId(id: string): string {
  if (LABELS[id])
    return LABELS[id]
  return id
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/**
 * Load all theme presets from the assets folder
 */
const modules = import.meta.glob('../assets/theme-presets/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, CodexThemePayload>

export interface ThemePresetEntry {
  id: string
  label: string
  payload: CodexThemePayload
}

/**
 * All available theme presets, sorted alphabetically by label
 */
export const themePresetEntries: ThemePresetEntry[] = Object.entries(modules)
  .map(([path, payload]) => {
    const id = path.match(/([^/]+)\.json$/)?.[1] ?? ''
    return {
      id,
      label: labelForId(id),
      payload: structuredClone(payload),
    }
  })
  .sort((a, b) => a.label.localeCompare(b.label))
