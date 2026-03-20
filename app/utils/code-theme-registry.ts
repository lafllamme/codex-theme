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
