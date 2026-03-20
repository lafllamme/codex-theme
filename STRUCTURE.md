# Codex Theme Structure

Dieses Dokument fasst die aktuelle Theme-Struktur, die Herkunft der Presets und die neue `codeThemeId`-Strategie zusammen.

## 1) Offiziell unterstützte Codex Code-Themes

Die folgenden 24 `codeThemeId`-Werte gelten als offiziell unterstützt:

- `absolutely`
- `ayu`
- `catppuccin`
- `codex`
- `dracula`
- `everforest`
- `github`
- `gruvbox`
- `linear`
- `lobster`
- `material`
- `matrix`
- `monokai`
- `night-owl`
- `nord`
- `notion`
- `one`
- `oscurange`
- `rose-pine`
- `sentry`
- `solarized`
- `temple`
- `tokyo-night`
- `vscode-plus`

Quelle im Code:
- `app/utils/code-theme-registry.ts`
- `scripts/code-theme-resolver.mjs`

## 2) Welche Theme-Items wir im Projekt haben

Es gibt zwei Ebenen:

1. **Offizielle/kuratierte Presets**
- bewusst gepflegte Presets mit klaren Namen (z. B. `catppuccin`, `dracula`, `tokyo-night`).

2. **Konvertierte Presets (iTerm2-Quelle)**
- viele zusätzliche Presets aus `app/assets/themes-raw/*.itermcolors`, exportiert nach `app/assets/theme-presets/*.json`.
- diese Presets sind UI-seitig gültige Codex-Theme-Payloads, aber ihr `codeThemeId` wird jetzt systematisch normalisiert.

## 3) Wie die Themes generiert werden

### A) Kuratierte offizielle Presets
- Generator: `scripts/write-codex-theme-presets.mjs`
- schreibt kuratierte Presets nach:
  - `app/assets/theme-presets/`
  - `docs/themes/presets/`

### B) iTerm2-Konvertierung
- Konverter: `scripts/convert-iterm2-themes.mjs`
- Mapping aus iTerm-Feldern:
  - Background -> `theme.surface`
  - Foreground -> `theme.ink`
  - ANSI Blue -> `theme.accent`
  - ANSI Green -> `theme.semanticColors.diffAdded`
  - ANSI Red -> `theme.semanticColors.diffRemoved`
  - ANSI Magenta -> `theme.semanticColors.skill`
- `variant` wird über Hintergrund-Luminanz abgeleitet.
- `codeThemeId` wird nicht mehr stumpf gesetzt, sondern über Resolver bestimmt.

## 4) Neues Pattern: palette-basiertes `codeThemeId`-Scoring

Die Auswahl von `codeThemeId` erfolgt jetzt über die **Farben des Payloads**:

1. alle 24 offiziellen Code-Themes werden als Kandidaten bewertet
2. pro Kandidat werden Syntax-Tokens gegen `theme.surface` auf Kontrast geprüft
3. Score berücksichtigt zusätzlich semantische Passung zu `accent`, `diffAdded`, `diffRemoved`, `skill`
4. Theme mit dem höchsten Score wird für Preview und Export gewählt

Wichtig:
- Die Entscheidung ist bewusst **nicht** mehr primär Namens-/Alias-basiert.
- Dadurch wird ein codeTheme gewählt, das zur realen Lesbarkeit und Farbwirkung passt.

Kurzregel (vereinfacht):
- Für jedes der 24 offiziellen Themes gibt es ein festes Syntax-Token-Set.
- Für jedes Set berechnen wir einen Score:
  - `+` Kontrast der Tokens gegen `surface` (mit Mindestwerten je Token)
  - `+` leichte Belohnung für sinnvolle Helligkeit (dunkler Hintergrund -> eher hellere Tokens)
  - `+` semantische Passung (`function`~`skill`, `string`~`diffAdded`, `comment`~`diffRemoved`)
  - `-` Strafe, wenn `keyword` zu nah an `accent` liegt (vermeidet „alles gleich blau“)
- Das Theme mit dem höchsten Score wird als `codeThemeId` genommen.

## 5) Syntax-Highlighting-Pattern (Farbverteilung)

Früher kamen Preview-Syntaxfarben global aus `accent/diffAdded/diffRemoved/skill`.

Jetzt:
- pro offiziellem `codeThemeId` existiert ein eigenes Token-Set:
  - `default`, `keyword`, `string`, `comment`, `function`, `type`, `number`, `meta`
- Resolver: `app/utils/code-theme-syntax.ts`
- die Workbench-CSS-Variablen `--syntax-*` kommen direkt aus diesem Resolver.

Kontrast-Schutz:
- Ein Contrast-Guard prüft Token gegen `surface`.
- Falls Lesbarkeit zu schwach ist, werden Token in Richtung besser lesbarer Farben gemischt.
- Ziel: **best-effort + kontrastreich**, nicht pixel-exakte 1:1-Replik jeder Original-Engine.

## 6) Was konkret umgesetzt wurde (damit die Idee nicht verloren geht)

- Zentrale Registry für offizielle Code-Themes eingeführt.
- Einheitliche palette-basierte Resolver-Funktionen für App und Scripts eingeführt.
- Export/Import/Apply-Pfade auf automatisch empfohlenes `codeThemeId` verdrahtet.
- Preview-Syntax von generischem Fallback auf Theme-spezifische Token umgestellt.
- Migrationsskript für bestehende Presets ergänzt:
  - `scripts/migrate-code-theme-ids.mjs`
- `codeThemeId` in vorhandenen Presets entsprechend normalisiert (ohne restliche Payload-Struktur zu ändern).

## 7) Relevante Dateien (Schnellnavigation)

- Resolver (App): `app/utils/code-theme-registry.ts`
- Syntax-Tokens: `app/utils/code-theme-syntax.ts`
- CSS-Var Mapping: `app/utils/codex-workbench-theme.ts`
- Preset-Loading: `app/data/theme-preset-catalog.ts`
- Import/Export-Flow: `app/pages/themes.vue`
- Resolver (Scripts): `scripts/code-theme-resolver.mjs`
- Converter: `scripts/convert-iterm2-themes.mjs`
- Migration: `scripts/migrate-code-theme-ids.mjs`

## 8) Team-Kommando (ein Befehl)

Für den kompletten Theme-Refresh:

```bash
pnpm generate:themes
```

Orchestrator:
- `scripts/generate.mjs`

Ausgeführt werden automatisch:
1. `scripts/write-codex-theme-presets.mjs`
2. `scripts/convert-iterm2-themes.mjs`
3. `scripts/migrate-code-theme-ids.mjs`
4. `scripts/test-code-theme-resolver.mjs`
