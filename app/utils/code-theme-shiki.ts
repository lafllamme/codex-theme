import type { BundledTheme, ThemeRegistration } from 'shiki'
import type { OfficialCodeThemeId } from '~/utils/code-theme-registry'
import { DEFAULT_CODE_THEME_ID, isOfficialCodeThemeId } from '~/utils/code-theme-registry'
import { baseSyntaxTokensForTheme } from '~/utils/code-theme-syntax'

export interface ShikiThemeBinding {
  codeThemeId: OfficialCodeThemeId
  theme: ThemeRegistration | BundledTheme
  themeName: string
  mode: 'bundled' | 'custom'
  match: 'alias' | 'exact'
}

function createCustomTheme(themeId: OfficialCodeThemeId): ThemeRegistration {
  const tokens = baseSyntaxTokensForTheme(themeId)
  return {
    name: `codex-custom-${themeId}`,
    type: 'dark',
    colors: {
      'editor.background': '#0b0b0f',
      'editor.foreground': tokens.default,
    },
    settings: [
      { settings: { foreground: tokens.default } },
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: tokens.comment } },
      { scope: ['string', 'string.template', 'punctuation.definition.string'], settings: { foreground: tokens.string } },
      { scope: ['constant.numeric', 'constant.language.boolean', 'constant.language.null'], settings: { foreground: tokens.number } },
      { scope: ['keyword', 'storage', 'storage.type', 'keyword.operator.new'], settings: { foreground: tokens.keyword } },
      { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: tokens.function } },
      { scope: ['entity.name.type', 'support.type', 'support.class'], settings: { foreground: tokens.type } },
      { scope: ['entity.name.tag', 'punctuation.definition.tag', 'meta.tag'], settings: { foreground: tokens.keyword } },
      { scope: ['entity.other.attribute-name'], settings: { foreground: tokens.meta } },
      { scope: ['meta.brace', 'punctuation', 'punctuation.separator'], settings: { foreground: tokens.meta } },
    ],
  }
}

const BUNDLED_THEME_MAP: Record<OfficialCodeThemeId, BundledTheme> = {
  'absolutely': 'andromeeda',
  'ayu': 'ayu-dark',
  'catppuccin': 'catppuccin-mocha',
  'codex': 'dark-plus',
  'dracula': 'dracula',
  'everforest': 'everforest-dark',
  'github': 'github-dark-default',
  'gruvbox': 'gruvbox-dark-medium',
  'linear': 'one-dark-pro',
  'lobster': 'material-theme',
  'material': 'material-theme-ocean',
  'matrix': 'vesper',
  'monokai': 'monokai',
  'night-owl': 'night-owl',
  'nord': 'nord',
  'notion': 'github-dark',
  'one': 'one-dark-pro',
  'oscurange': 'material-theme-darker',
  'rose-pine': 'rose-pine',
  'sentry': 'aurora-x',
  'solarized': 'solarized-dark',
  'temple': 'kanagawa-dragon',
  'tokyo-night': 'tokyo-night',
  'vscode-plus': 'dark-plus',
}

const CODE_THEME_TO_SHIKI: Record<OfficialCodeThemeId, ShikiThemeBinding> = {
  'absolutely': { codeThemeId: 'absolutely', theme: createCustomTheme('absolutely'), themeName: 'codex-custom-absolutely', mode: 'custom', match: 'alias' },
  'ayu': { codeThemeId: 'ayu', theme: createCustomTheme('ayu'), themeName: 'codex-custom-ayu', mode: 'custom', match: 'alias' },
  'catppuccin': { codeThemeId: 'catppuccin', theme: createCustomTheme('catppuccin'), themeName: 'codex-custom-catppuccin', mode: 'custom', match: 'alias' },
  'codex': { codeThemeId: 'codex', theme: createCustomTheme('codex'), themeName: 'codex-custom-codex', mode: 'custom', match: 'alias' },
  'dracula': { codeThemeId: 'dracula', theme: BUNDLED_THEME_MAP.dracula, themeName: BUNDLED_THEME_MAP.dracula, mode: 'bundled', match: 'exact' },
  'everforest': { codeThemeId: 'everforest', theme: createCustomTheme('everforest'), themeName: 'codex-custom-everforest', mode: 'custom', match: 'alias' },
  'github': { codeThemeId: 'github', theme: createCustomTheme('github'), themeName: 'codex-custom-github', mode: 'custom', match: 'alias' },
  'gruvbox': { codeThemeId: 'gruvbox', theme: createCustomTheme('gruvbox'), themeName: 'codex-custom-gruvbox', mode: 'custom', match: 'alias' },
  'linear': { codeThemeId: 'linear', theme: createCustomTheme('linear'), themeName: 'codex-custom-linear', mode: 'custom', match: 'alias' },
  'lobster': { codeThemeId: 'lobster', theme: createCustomTheme('lobster'), themeName: 'codex-custom-lobster', mode: 'custom', match: 'alias' },
  'material': { codeThemeId: 'material', theme: createCustomTheme('material'), themeName: 'codex-custom-material', mode: 'custom', match: 'alias' },
  'matrix': { codeThemeId: 'matrix', theme: createCustomTheme('matrix'), themeName: 'codex-custom-matrix', mode: 'custom', match: 'alias' },
  'monokai': { codeThemeId: 'monokai', theme: BUNDLED_THEME_MAP.monokai, themeName: BUNDLED_THEME_MAP.monokai, mode: 'bundled', match: 'exact' },
  'night-owl': { codeThemeId: 'night-owl', theme: BUNDLED_THEME_MAP['night-owl'], themeName: BUNDLED_THEME_MAP['night-owl'], mode: 'bundled', match: 'exact' },
  'nord': { codeThemeId: 'nord', theme: BUNDLED_THEME_MAP.nord, themeName: BUNDLED_THEME_MAP.nord, mode: 'bundled', match: 'exact' },
  'notion': { codeThemeId: 'notion', theme: createCustomTheme('notion'), themeName: 'codex-custom-notion', mode: 'custom', match: 'alias' },
  'one': { codeThemeId: 'one', theme: createCustomTheme('one'), themeName: 'codex-custom-one', mode: 'custom', match: 'alias' },
  'oscurange': { codeThemeId: 'oscurange', theme: createCustomTheme('oscurange'), themeName: 'codex-custom-oscurange', mode: 'custom', match: 'alias' },
  'rose-pine': { codeThemeId: 'rose-pine', theme: BUNDLED_THEME_MAP['rose-pine'], themeName: BUNDLED_THEME_MAP['rose-pine'], mode: 'bundled', match: 'exact' },
  'sentry': { codeThemeId: 'sentry', theme: createCustomTheme('sentry'), themeName: 'codex-custom-sentry', mode: 'custom', match: 'alias' },
  'solarized': { codeThemeId: 'solarized', theme: createCustomTheme('solarized'), themeName: 'codex-custom-solarized', mode: 'custom', match: 'alias' },
  'temple': { codeThemeId: 'temple', theme: createCustomTheme('temple'), themeName: 'codex-custom-temple', mode: 'custom', match: 'alias' },
  'tokyo-night': { codeThemeId: 'tokyo-night', theme: BUNDLED_THEME_MAP['tokyo-night'], themeName: BUNDLED_THEME_MAP['tokyo-night'], mode: 'bundled', match: 'exact' },
  'vscode-plus': { codeThemeId: 'vscode-plus', theme: createCustomTheme('vscode-plus'), themeName: 'codex-custom-vscode-plus', mode: 'custom', match: 'alias' },
}

export function resolveShikiThemeBinding(codeThemeId: string | null | undefined): ShikiThemeBinding {
  const validCodeThemeId = isOfficialCodeThemeId(codeThemeId) ? codeThemeId : DEFAULT_CODE_THEME_ID
  return CODE_THEME_TO_SHIKI[validCodeThemeId]
}
