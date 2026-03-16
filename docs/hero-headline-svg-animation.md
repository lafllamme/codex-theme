# Hero headline SVG stroke-draw animation (Gotham-style)

There is a **Gotham-style headline animation** (Palantir-style stroke-draw) that can be turned back on when you want to use it.

**Current state:** The hero uses plain text again (“CODEX” / “THEME STUDIO” in an `<h1>`). The animation is switched off; the assets and component remain in the project.

## What it does

- The hero headline (“CODEX” / “THEME STUDIO”) is rendered as **SVG paths** and animated with a **stroke-draw** effect: the outline of the letters is “drawn” on load.
- Implemented in **`app/components/HeroHeadlineDraw.vue`** (supports path mode and a clip-path fallback).

## Where the assets live

- **Path data (size 100):** `app/data/heroHeadlinePaths.ts`  
  - `CODEX_PATH` / `CODEX_VIEWBOX`  
  - `THEME_STUDIO_PATH` / `THEME_STUDIO_VIEWBOX`

## How to turn it on again

In **`app/components/DsHero.vue`**, in the typo variant, replace the plain `<h1>` with:

```vue
<HeroHeadlineDraw
  :line1="heroHeadlineTop"
  :line2="heroHeadlineBottom"
  :path-line1="CODEX_PATH"
  :path-line2="THEME_STUDIO_PATH"
  :view-box1="CODEX_VIEWBOX"
  :view-box2="THEME_STUDIO_VIEWBOX"
  :duration="1600"
/>
```

Add at the top of the script:

```ts
import { CODEX_PATH, CODEX_VIEWBOX, THEME_STUDIO_PATH, THEME_STUDIO_VIEWBOX } from '~/data/heroHeadlinePaths'
```

## Reference

- Inspiration: [Palantir Gotham](https://www.palantir.com/platforms/gotham/) hero text animation.
- Technique: SVG path `stroke-dasharray` = path length, animate `stroke-dashoffset` from length to 0.
