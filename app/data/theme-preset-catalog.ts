import type { CodexThemePayload } from '~/types/codex-theme'

/** Stable order for the preset strip (matches Codex-style names). */
const ORDER = [
  'absolutely',
  'ayu',
  'catppuccin',
  'codex',
  'dracula',
  'everforest',
  'github',
  'gruvbox',
  'linear',
  'lobster',
  'material',
  'matrix',
  'monokai',
  'night-owl',
  'nord',
  'notion',
  'one',
  'oscurange',
  'rose-pine',
  'sentry',
  'solarized',
  'temple',
  'tokyo-night',
  'vscode-plus',
] as const

const LABELS: Record<string, string> = {
  'night-owl': 'Night Owl',
  'rose-pine': 'Rose Pine',
  'tokyo-night': 'Tokyo Night',
  'vscode-plus': 'VS Code+',
  'catppuccin': 'Catppuccin',
  'gruvbox': 'Gruvbox',
  'oscurange': 'Oscurange',
}

function labelForId(id: string) {
  if (LABELS[id])
    return LABELS[id]
  return id
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const modules = import.meta.glob('../assets/theme-presets/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, CodexThemePayload>

function payloadForId(id: string): CodexThemePayload | null {
  const hit = Object.entries(modules).find(([path]) => path.endsWith(`/${id}.json`))
  return hit ? structuredClone(hit[1]) : null
}

export interface ThemePresetEntry {
  id: string
  label: string
  payload: CodexThemePayload
}

export const themePresetEntries: ThemePresetEntry[] = ORDER
  .map((id) => {
    const payload = payloadForId(id)
    if (!payload)
      return null
    return { id, label: labelForId(id), payload }
  })
  .filter((e): e is ThemePresetEntry => e !== null)
