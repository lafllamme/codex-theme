import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss'
import { fontUtilitiesPreflightCss } from './app/assets/unocss/font-utilities'
import { colorTokensPreflightCss } from './app/assets/unocss/palette'
import { extendTheme, presets, rules, shortcuts, theme } from './app/assets/unocss'

export default defineConfig({
  shortcuts,
  rules,
  theme,
  extendTheme,
  presets,
  preflights: [
    { getCSS: colorTokensPreflightCss },
    { getCSS: fontUtilitiesPreflightCss },
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
