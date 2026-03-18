# Theme System Documentation

This document explains how themes are generated, managed, and the current limitations of the Codex theme import system.

## Theme Sources

### 1. Official Codex Themes (Curated)

These are the official themes that ship with Codex and have matching `codeThemeId` values:

- `absolutely`, `ayu`, `catppuccin`, `codex`, `dracula`, `everforest`
- `github`, `gruvbox`, `linear`, `lobster`, `material`, `matrix`
- `monokai`, `night-owl`, `nord`, `notion`, `one`, `oscurange`
- `rose-pine`, `sentry`, `solarized`, `temple`, `tokyo-night`, `vscode-plus`

These themes are defined in `scripts/write-codex-theme-presets.mjs`.

### 2. iTerm2 Color Schemes (Converted)

We convert themes from the popular [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) repository, which contains 480+ terminal color schemes.

**Source repository:** https://github.com/mbadolato/iTerm2-Color-Schemes

## Adding New Themes

### From iTerm2 Color Schemes

1. Download `.itermcolors` files from [iTerm2-Color-Schemes/schemes](https://github.com/mbadolato/iTerm2-Color-Schemes/tree/master/schemes)

2. Drop them into `app/assets/themes-raw/`

3. Run the converter:
   ```bash
   node scripts/convert-iterm2-themes.mjs
   ```

4. New JSON presets appear in `app/assets/theme-presets/`

### Manual Theme Creation

1. Create a JSON file in `app/assets/theme-presets/`
2. Use a **valid** `codeThemeId` from the list below
3. Follow the JSON schema format

## Theme Generation

### Converter Script

**Location:** `scripts/convert-iterm2-themes.mjs`

**What it does:**
1. Reads all `.itermcolors` plist files from `app/assets/themes-raw/`
2. Uses macOS `plutil` to convert plist XML to JSON
3. Maps iTerm2 colors to Codex theme format:
   - `Background Color` → `surface`
   - `Foreground Color` → `ink`
   - `Ansi 4 Color` (Blue) → `accent`
   - `Ansi 2 Color` (Green) → `diffAdded`
   - `Ansi 1 Color` (Red) → `diffRemoved`
   - `Ansi 5 Color` (Magenta) → `skill`
4. Determines `variant` (dark/light) based on background luminance
5. Outputs JSON files to `app/assets/theme-presets/`

### Naming Conflicts

When an iTerm2 theme has the same name as an existing curated preset, the converter appends `-iterm` to avoid overwriting:
- `dracula.json` (curated) stays unchanged
- `dracula-iterm.json` (converted from iTerm2)

## Codex Theme Format

### JSON Schema

```json
{
  "codeThemeId": "monokai",
  "variant": "dark",
  "theme": {
    "accent": "#44b4cc",
    "contrast": 60,
    "fonts": {
      "code": null,
      "ui": null
    },
    "ink": "#ffffff",
    "opaqueWindows": true,
    "semanticColors": {
      "diffAdded": "#ccff04",
      "diffRemoved": "#ff6600",
      "skill": "#9933cc"
    },
    "surface": "#000000"
  }
}
```

### Export String Format

When exporting for Codex import:
```
codex-theme-v1:{"codeThemeId":"monokai","theme":{...},"variant":"dark"}
```

## Critical Limitation: `codeThemeId`

### The Problem

**Codex only accepts specific hardcoded `codeThemeId` values.** This ID refers to the code syntax highlighting theme used in the editor, NOT the UI theme.

If you use an invalid `codeThemeId` (e.g., `"vibrant-ink"`), Codex will **reject the theme import**.

### Valid `codeThemeId` Values (as of 2026-03)

These are the only values Codex currently accepts:

```
absolutely    ayu           catppuccin    codex
dracula       everforest    github        gruvbox
linear        lobster       material      matrix
monokai       night-owl     nord          notion
one           oscurange     rose-pine     sentry
solarized     temple        tokyo-night   vscode-plus
```

### Our Workaround

For all converted themes, we use:
- **`"codeThemeId": "monokai"`** - a universally available Codex code theme

This allows themes to import successfully into Codex.

### Light-Colored Themes

Codex does not support `variant: "light"` - all 24 official Codex themes are dark.

**Our solution:**
- **Stored JSON**: Uses real variant (`light` or `dark`) based on background luminance - this enables the Dark/Light filter in the UI
- **Export string**: Always forces `variant: "dark"` for Codex compatibility

This way the UI filter works correctly, but exported themes will import into Codex without issues.

### Future: Codex Feature Request

This is a Codex limitation that could be addressed in a future update:
- Allow arbitrary `codeThemeId` values, or
- Auto-select the best matching code theme based on the color palette
- Add more built-in code themes

**TODO:** Consider opening a feature request with the Codex team to expand supported `codeThemeId` values.

## File Structure

```
codex-theme/
├── app/assets/
│   ├── themes-raw/               # Drop .itermcolors files here (gitignored)
│   └── theme-presets/            # Generated JSON presets
│       ├── codex.json
│       ├── dracula.json
│       ├── vibrant-ink.json
│       └── ...
├── scripts/
│   ├── convert-iterm2-themes.mjs # iTerm2 → Codex converter
│   └── write-codex-theme-presets.mjs
└── THEMES.md                     # This documentation
```

## Troubleshooting

### "Theme won't import into Codex"

**Cause:** Invalid `codeThemeId`

**Fix:** Ensure `codeThemeId` is one of the valid values listed above. For custom themes, use `"monokai"` (dark) or `"github"` (light).

### "Colors don't match the preview"

**Cause:** The `codeThemeId` determines syntax highlighting independently of UI colors.

**Explanation:** A theme can have a dark purple UI but still use `monokai` for syntax highlighting. This is a Codex architectural decision.
