# Codex Theme Mini App

## Ziel
Kleine Nuxt-4 Web-App bauen, um Codex-Themes schneller zu bauen und live zu previewen (statt nur im Codex-Settings-UI).

## Geplanter Scope (MVP)
- Import/Export im Format `codex-theme-v1:{...}`
- Live-Preview für typische Flächen: Sidebar, Editor, Diff, Controls
- Theme-Controls für: `accent`, `surface`, `ink`, `contrast`, `semanticColors`, `variant`
- Preset-Slots für vorhandene Farbschemata (inkl. Adventure)

## Projektort
Neues Projekt in:
`/Users/flame/Developer/Projects/codex-team`

## Stack
- Nuxt 4
- `@nuxt/icon`
- UnoCSS
- Radix Colors via `unocss-preset-radix`
- gleiche UnoCSS-Presets wie im bestehenden Projekt

## UnoCSS Presets (wie in personal-page)
- `presetUno()`
- `presetMini()`
- `presetWind()`
- `presetAttributify()`
- `presetIcons()`
- `presetTypography()`
- `animatedUno()`
- `presetWebFonts()`
- `presetRadix({ darkSelector: ':root', lightSelector: '.light', palette: [...] })`
- `presetAnimations()`

Referenz:
- `/Users/flame/Developer/Projects/personal-page/frontend/app/assets/unocss/presets.ts`
- `/Users/flame/Developer/Projects/personal-page/frontend/uno.config.ts`

## Mindest-Konfiguration
- `nuxt.config.ts`: mindestens `@nuxt/icon` + `@unocss/nuxt`
- `uno.config.ts`: `shortcuts`, `rules`, `theme`, `extendTheme`, `presets`
- Preflights übernehmen:
  - `colorTokensPreflightCss`
  - `fontUtilitiesPreflightCss`

Referenz:
- `/Users/flame/Developer/Projects/personal-page/frontend/app/assets/unocss/palette.ts`
- `/Users/flame/Developer/Projects/personal-page/frontend/app/assets/unocss/font-utilities.ts`

## Bestehende UI/Farb-Referenz
- `/Users/flame/Developer/Projects/personal-page/frontend/app/components/ui/DesignSystem/DsColorScheme.vue`

## Nächste Schritte (im nächsten Chat)
1. Nuxt-4 Barebone im neuen Ordner scaffolden.
2. UnoCSS + Presets + Radix-Palette identisch konfigurieren.
3. Theme-Editor-Page bauen (`/`) mit Live-Preview.
4. `codex-theme-v1` Import/Export implementieren.
5. Adventure-Black Preset als Startwert hinterlegen.

## Doku
- `/Users/flame/Developer/Projects/codex-theme/docs/index.md` (UnoCSS/Radix Color-Schreibweisen)
- `/Users/flame/Developer/Projects/codex-theme/docs/codex-theme-scheme.md` (Codex-Theme-Schema codex-theme-v1, alle Optionen)
