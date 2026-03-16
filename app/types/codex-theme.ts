export type ThemeVariant = 'dark' | 'light'

export interface ThemeFonts {
  code: string | null
  ui: string | null
}

export interface ThemeSemanticColors {
  diffAdded: string
  diffRemoved: string
  skill: string
}

export interface ThemeSettings {
  accent: string
  contrast: number
  fonts: ThemeFonts
  ink: string
  opaqueWindows: boolean
  semanticColors: ThemeSemanticColors
  surface: string
}

export interface CodexThemePayload {
  codeThemeId: string
  theme: ThemeSettings
  variant: ThemeVariant
}

export type ThemeFieldPath =
  | 'codeThemeId'
  | 'variant'
  | 'theme.accent'
  | 'theme.surface'
  | 'theme.ink'
  | 'theme.contrast'
  | 'theme.opaqueWindows'
  | 'theme.semanticColors.diffAdded'
  | 'theme.semanticColors.diffRemoved'
  | 'theme.semanticColors.skill'
  | 'theme.fonts.ui'
  | 'theme.fonts.code'
