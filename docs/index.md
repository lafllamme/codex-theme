# Codex Theme Docs

## Color System Quick Intro

This project uses two color systems in UnoCSS:

1. Default Uno/Wind color tokens (dash style)
- Example: `bg-crimson-8`, `shadow-yellow-6`

2. Radix color tokens via `unocss-preset-radix` (Radix style)
- Example: `bg-crimson8`, `text-crimson11`, `bg-crimson8A`, `ring-mint6A`

Important:
- Radix utilities here are `crimson8` and `crimson8A` (not `crimson-8a`).
- Radix alpha scales use `A` suffix.

## CSS Variable Notation

You can always use direct variable notation with arbitrary values:

- Solid radix color: `bg-[var(--un-preset-radix-tomato10)]`
- Alpha radix color: `bg-[var(--un-preset-radix-tomato10A)]`
- Text color: `text-[var(--un-preset-radix-crimson11)]`
- Border color: `border-[var(--un-preset-radix-mint6A)]`
- Shadow color: `shadow-[var(--un-preset-radix-yellow6)]`

This is the safest option when exact control is needed.

## Theme Mode Setup

Current preset setup in this repo:
- Dark palette is default on `:root`
- Light palette can be enabled with `.light`

So colors work immediately without adding a `.dark` class.

## Guidance For AI

When editing UI in this repo:
- Prefer Radix tokens for design-system consistency.
- Use Radix utility form (`bg-mint9`, `bg-mint9A`) or variable form (`var(--un-preset-radix-...)`).
- If a color class does not resolve, switch to explicit variable notation.

## Working Style (How We Build)

- Keep components simple and static first, then refine.
- Prefer Uno utility classes in template markup.
- Use Radix utilities first for speed (`bg-mint9`, `text-slate11`, `border-mint6A`).
- If utility naming is unclear, use explicit variables:
  - `bg-[var(--un-preset-radix-mint9)]`
  - `text-[var(--un-preset-radix-slate12)]`
  - `border-[var(--un-preset-radix-mint6A)]`
- For buttons, keep native browser style disabled with `appearance-none`.
- For dark-first behavior, keep Radix dark palette on `:root`.

## Quick Writing Patterns

Use these patterns when needed:

- Card shell:
  - `class="rounded-2xl border border-[var(--un-preset-radix-mint6A)] bg-[var(--un-preset-radix-slate2)] p-4"`
- Accent button:
  - `class="appearance-none rounded-xl border border-[var(--un-preset-radix-mint10)] bg-[var(--un-preset-radix-mint9)] px-4 py-2 text-[#041312]"`
- Soft badge:
  - `class="inline-flex rounded-full border border-[var(--un-preset-radix-mint6A)] bg-[var(--un-preset-radix-mint4A)] px-3 py-1 text-[var(--un-preset-radix-mint11)]"`

## Fallback Rules

- If `bg-crimson-8` style tokens do not render as expected, prefer Radix form (`bg-crimson8` / `bg-crimson8A`) or direct variable form.
- If colors still look wrong, verify mode selector (`:root` for dark default, `.light` for light).
