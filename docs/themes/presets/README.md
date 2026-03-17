# Codex theme presets (codex-theme-v1)

Each `{id}.json` is a **`codex-theme-v1`-compatible** object (without the `codex-theme-v1:` prefix): `codeThemeId`, `variant`, `theme` (colors, fonts, `opaqueWindows`, …).

Copies also live under `app/assets/theme-presets/` for the theme page preset strip.

Regenerate both folders after edits:

```bash
node scripts/write-codex-theme-presets.mjs
```

Then update `ORDER` / `LABELS` in `app/data/theme-preset-catalog.ts` if you add or rename presets.
