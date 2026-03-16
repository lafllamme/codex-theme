# Codex Theme Schema (`codex-theme-v1`)

## Format

Themes are exchanged as:

```txt
codex-theme-v1:<JSON>
```

## Payload shape

Types are defined in `app/types/codex-theme.ts`.

### Top-level

| Field | Type | Description |
| --- | --- | --- |
| `codeThemeId` | `string` | Syntax/editor theme ID (for example `rose-pine`, `oscurange`). |
| `variant` | `'dark' \| 'light'` | Global appearance mode. |
| `theme` | `ThemeSettings` | Main visual settings object. |

### `theme`

| Field | Type | Description |
| --- | --- | --- |
| `accent` | `string` (hex) | Accent color for controls/highlights. |
| `surface` | `string` (hex) | Background/surface base color. |
| `ink` | `string` (hex) | Primary text color. |
| `contrast` | `number` | Contrast tuning value (0-100). |
| `opaqueWindows` | `boolean` | Window opacity behavior. |
| `fonts` | `ThemeFonts` | UI/code font overrides. |
| `semanticColors` | `ThemeSemanticColors` | Semantic diff/skill colors. |

### `theme.fonts`

| Field | Type |
| --- | --- |
| `ui` | `string \| null` |
| `code` | `string \| null` |

### `theme.semanticColors`

| Field | Type |
| --- | --- |
| `diffAdded` | `string` (hex) |
| `diffRemoved` | `string` (hex) |
| `skill` | `string` (hex) |

## Real app-validated example

Copied from Codex app settings:

```txt
codex-theme-v1:{"codeThemeId":"rose-pine","theme":{"accent":"#ea9a97","contrast":60,"fonts":{"code":null,"ui":null},"ink":"#e0def4","opaqueWindows":false,"semanticColors":{"diffAdded":"#9ccfd8","diffRemoved":"#908caa","skill":"#c4a7e7"},"surface":"#232136"},"variant":"dark"}
```

Validation result:

- All schema fields are present.
- No unknown extra fields in this export sample.

## Official docs alignment summary

Codex app settings officially mention base theme + accent/background/foreground + UI/code fonts + share custom theme.

Schema mapping:

- base theme -> `codeThemeId`
- accent -> `theme.accent`
- background -> `theme.surface`
- foreground -> `theme.ink`
- ui/code fonts -> `theme.fonts.ui` / `theme.fonts.code`

## Forward compatibility

This project preserves unknown future keys during import/export to avoid data loss if Codex adds new fields later.
