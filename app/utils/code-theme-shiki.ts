import type { BundledTheme } from 'shiki'
import type { OfficialCodeThemeId } from '~/utils/code-theme-registry'
import { DEFAULT_CODE_THEME_ID, isOfficialCodeThemeId } from '~/utils/code-theme-registry'

export interface ShikiThemeBinding {
  codeThemeId: OfficialCodeThemeId
  shikiTheme: BundledTheme
  match: 'alias' | 'exact'
}

const CODE_THEME_TO_SHIKI: Record<OfficialCodeThemeId, ShikiThemeBinding> = {
  'absolutely': { codeThemeId: 'absolutely', shikiTheme: 'andromeeda', match: 'alias' },
  'ayu': { codeThemeId: 'ayu', shikiTheme: 'ayu-dark', match: 'alias' },
  'catppuccin': { codeThemeId: 'catppuccin', shikiTheme: 'catppuccin-mocha', match: 'alias' },
  'codex': { codeThemeId: 'codex', shikiTheme: 'dark-plus', match: 'alias' },
  'dracula': { codeThemeId: 'dracula', shikiTheme: 'dracula', match: 'exact' },
  'everforest': { codeThemeId: 'everforest', shikiTheme: 'everforest-dark', match: 'alias' },
  'github': { codeThemeId: 'github', shikiTheme: 'github-dark-default', match: 'alias' },
  'gruvbox': { codeThemeId: 'gruvbox', shikiTheme: 'gruvbox-dark-medium', match: 'alias' },
  'linear': { codeThemeId: 'linear', shikiTheme: 'one-dark-pro', match: 'alias' },
  'lobster': { codeThemeId: 'lobster', shikiTheme: 'material-theme', match: 'alias' },
  'material': { codeThemeId: 'material', shikiTheme: 'material-theme-ocean', match: 'alias' },
  'matrix': { codeThemeId: 'matrix', shikiTheme: 'vesper', match: 'alias' },
  'monokai': { codeThemeId: 'monokai', shikiTheme: 'monokai', match: 'exact' },
  'night-owl': { codeThemeId: 'night-owl', shikiTheme: 'night-owl', match: 'exact' },
  'nord': { codeThemeId: 'nord', shikiTheme: 'nord', match: 'exact' },
  'notion': { codeThemeId: 'notion', shikiTheme: 'github-dark', match: 'alias' },
  'one': { codeThemeId: 'one', shikiTheme: 'one-dark-pro', match: 'alias' },
  'oscurange': { codeThemeId: 'oscurange', shikiTheme: 'material-theme-darker', match: 'alias' },
  'rose-pine': { codeThemeId: 'rose-pine', shikiTheme: 'rose-pine', match: 'exact' },
  'sentry': { codeThemeId: 'sentry', shikiTheme: 'aurora-x', match: 'alias' },
  'solarized': { codeThemeId: 'solarized', shikiTheme: 'solarized-dark', match: 'alias' },
  'temple': { codeThemeId: 'temple', shikiTheme: 'kanagawa-dragon', match: 'alias' },
  'tokyo-night': { codeThemeId: 'tokyo-night', shikiTheme: 'tokyo-night', match: 'exact' },
  'vscode-plus': { codeThemeId: 'vscode-plus', shikiTheme: 'dark-plus', match: 'alias' },
}

export function resolveShikiThemeBinding(codeThemeId: string | null | undefined): ShikiThemeBinding {
  const validCodeThemeId = isOfficialCodeThemeId(codeThemeId) ? codeThemeId : DEFAULT_CODE_THEME_ID
  return CODE_THEME_TO_SHIKI[validCodeThemeId]
}
