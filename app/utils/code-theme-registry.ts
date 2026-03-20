export const OFFICIAL_CODE_THEME_IDS = [
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

export type OfficialCodeThemeId = (typeof OFFICIAL_CODE_THEME_IDS)[number]

export const DEFAULT_CODE_THEME_ID: OfficialCodeThemeId = 'monokai'

const OFFICIAL_CODE_THEME_SET = new Set<string>(OFFICIAL_CODE_THEME_IDS)

export function isOfficialCodeThemeId(value: string | null | undefined): value is OfficialCodeThemeId {
  if (!value)
    return false
  return OFFICIAL_CODE_THEME_SET.has(value)
}
