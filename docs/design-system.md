# Codex Theme Design System

## Core Identity
- Typography: `Geist` (UI and body), `Geist Mono` (hero, code-like labels, numeric values)
- Color direction: primär schwarz/dunkel (`#050607` / near-black surfaces)
- Accent color: `mint` (Radix `mint*` tokens) for highlights, focus, CTA emphasis
- Surface style: glass + blur overlays (`bg-black/..`, `backdrop-blur-*`, thin translucent borders)

## Visual Rules
- Dark-first UI. Light mode is secondary.
- Keep base surfaces neutral; use mint sparingly.
- High contrast for headings and actionable controls.
- Rounded geometry, soft border glow, subtle depth.

## Dither Background Defaults
- `enableMouseInteraction: true`
- `disableAnimation: false`
- `waveSpeed: 0.1`
- `waveFrequency: 2.5`
- `waveAmplitude: 0.2`
- `colorNum: 4`
- `pixelSize: 3`
- `mouseRadius: 0.5`
- `waveColor: [0.1, 0.7, 0.5]`

## Notes
- Dither is global page background in `default` layout.
- Start page includes a fixed control center for live tweaking.
