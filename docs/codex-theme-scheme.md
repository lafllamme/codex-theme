# Codex Theme Scheme (codex-theme-v1)

This document describes the theme options used by Codex. The format is a single string:

```
codex-theme-v1:<JSON>
```

The JSON payload must match the structure below. Types are defined in `app/types/codex-theme.ts`.

---

## Top-level payload

| Field         | Type              | Description |
|---------------|-------------------|-------------|
| `codeThemeId` | `string`           | Identifier for the syntax-highlighting / editor theme (e.g. `"oscurange"`, `"night-owl"`). |
| `variant`     | `'dark' \| 'light'` | Overall theme mode. |
| `theme`       | `ThemeSettings`    | All visual theme settings (see below). |

---

## Theme settings (`theme`)

| Field            | Type                    | Description |
|------------------|-------------------------|-------------|
| `accent`         | `string` (hex)          | Primary accent color (buttons, focus, highlights). Example: `"#FFB670"`. |
| `surface`        | `string` (hex)          | Base background color (panels, cards). Example: `"#040404"`. |
| `ink`            | `string` (hex)          | Primary text color. Example: `"#FEFFFF"`. |
| `contrast`       | `number` (0–100)        | Contrast tuning; affects how surfaces and borders are derived. |
| `opaqueWindows`  | `boolean`               | If `true`, window/panel backgrounds are opaque; if `false`, they can be translucent (glass effect). |
| `fonts`          | `ThemeFonts`            | Optional font overrides (see below). |
| `semanticColors` | `ThemeSemanticColors`   | Colors for diff and skill UI (see below). |

---

## Fonts (`theme.fonts`)

| Field  | Type           | Description |
|--------|----------------|-------------|
| `ui`   | `string \| null` | UI font family (e.g. `"Geist, sans-serif"`). `null` = use default. |
| `code` | `string \| null` | Monospace font for code/editor. `null` = use default. |

---

## Semantic colors (`theme.semanticColors`)

| Field        | Type     | Description |
|--------------|----------|-------------|
| `diffAdded`  | `string` (hex) | Color for added lines in diffs. |
| `diffRemoved` | `string` (hex) | Color for removed lines in diffs. |
| `skill`      | `string` (hex) | Color for skill/agent-related UI (e.g. avatar, labels). |

---

## Example (Adventure Black)

```json
{
  "codeThemeId": "oscurange",
  "variant": "dark",
  "theme": {
    "accent": "#FFB670",
    "contrast": 60,
    "fonts": { "code": null, "ui": null },
    "ink": "#FEFFFF",
    "opaqueWindows": false,
    "semanticColors": {
      "diffAdded": "#99B52C",
      "diffRemoved": "#D84A33",
      "skill": "#417AB3"
    },
    "surface": "#040404"
  }
}
```

Single-line export format:

```
codex-theme-v1:{"codeThemeId":"oscurange","theme":{"accent":"#FFB670","contrast":60,"fonts":{"code":null,"ui":null},"ink":"#FEFFFF","opaqueWindows":false,"semanticColors":{"diffAdded":"#99B52C","diffRemoved":"#D84A33","skill":"#417AB3"},"surface":"#040404"},"variant":"dark"}
```

### Example: Rose Pine (copy from Codex app)

Real export from Codex app Settings → Appearance → copy theme:

```
codex-theme-v1:{"codeThemeId":"rose-pine","theme":{"accent":"#ea9a97","contrast":60,"fonts":{"code":null,"ui":null},"ink":"#e0def4","opaqueWindows":false,"semanticColors":{"diffAdded":"#9ccfd8","diffRemoved":"#908caa","skill":"#c4a7e7"},"surface":"#232136"},"variant":"dark"}
```

This confirms the schema: same fields and structure; no extra keys in the app export.

---

## Where it’s used in this app

- **Theme page** (`/themes`): Color pickers and controls map to these fields; import/export uses `codex-theme-v1`.
- **Types**: `app/types/codex-theme.ts` — `CodexThemePayload`, `ThemeSettings`, `ThemeSemanticColors`, `ThemeFonts`, `ThemeFieldPath`.
- **Presets**: `app/pages/themes.vue` — `presetMap` (e.g. oscurange, adventure-black, night-owl).
- **Sample themes**: `docs/themes/codex-theme-v1-adventure-black.txt`, `docs/themes/codex-adventure-black.json`.

---

## Research: official Codex docs vs this schema (Mar 2025)

Research was done to confirm that this schema matches what Codex officially supports and that no fields are missing.

### What is officially documented

- **Codex App Settings** ([developers.openai.com/codex/app/settings](https://developers.openai.com/codex/app/settings)) state:
  - *"In Settings, you can change the Codex app appearance by choosing a **base theme**, adjusting **accent, background, and foreground** colors, and changing the **UI and code fonts**. You can also **share your custom theme** with friends."*

- **Mapping to this schema:**
  - **Base theme** → `codeThemeId` (syntax/editor theme identifier).
  - **Accent** → `theme.accent`.
  - **Background** → `theme.surface`.
  - **Foreground** → `theme.ink`.
  - **UI font** → `theme.fonts.ui`.
  - **Code font** → `theme.fonts.code`.
  - **Share theme** → implies an export format; this project uses `codex-theme-v1:<JSON>`.

- **config.toml (Codex CLI/TUI)** does **not** define app appearance. The [Config Reference](https://developers.openai.com/codex/config-reference) and [Sample Config](https://developers.openai.com/codex/config-sample) only mention:
  - `[tui] theme` — syntax-highlighting theme name (kebab-case), e.g. `"catppuccin-mocha"`.
  - No keys for accent, surface, ink, semantic colors, or opaque windows. App appearance is controlled in the app Settings UI, not in `config.toml`.

### What was not found in public docs

- The exact string **`codex-theme-v1`** or the full JSON shape is **not** documented on the Codex docs site.
- The **openai/codex** GitHub repo search for `codex-theme-v1` returns **no code matches** — the share/export format appears to be app-only and not documented in the public repo.
- **Extra fields in this schema** that are not mentioned in the short settings blurb: `contrast`, `opaqueWindows`, `semanticColors` (diffAdded, diffRemoved, skill), `variant`. These are consistent with a full theme payload (diff colors, light/dark, window opacity) and with the sample theme files in this repo.

### Validation with real app export

A theme was **copied from the Codex app** (Settings → Appearance → copy theme). The pasted string (Rose Pine) is:

`codex-theme-v1:{"codeThemeId":"rose-pine","theme":{"accent":"#ea9a97","contrast":60,"fonts":{"code":null,"ui":null},"ink":"#e0def4","opaqueWindows":false,"semanticColors":{"diffAdded":"#9ccfd8","diffRemoved":"#908caa","skill":"#c4a7e7"},"surface":"#232136"},"variant":"dark"}`

- **All fields** in the app export are present in this schema; **no fields are missing**.
- **No extra keys** appear in the app export; the schema matches the app’s format.

### Conclusion

- The **concepts** in this schema match what Codex officially describes (base theme, accent, background, foreground, UI/code fonts, share theme).
- The **exact structure** has been validated against a real copy-from-app export: same top-level and `theme.*` fields, including `contrast`, `opaqueWindows`, `semanticColors`, and `variant`.
- If the app adds new keys in future versions, add them to `app/types/codex-theme.ts` and to this doc.
