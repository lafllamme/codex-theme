# codex-theme

A Nuxt 4 workbench for building, previewing, validating, and exporting Codex themes in the `codex-theme-v1` format. It pairs a Codex-lookalike preview surface with a theme controller, so a colour scheme can be edited and judged against realistic UI instead of a swatch grid.

> Work in progress. The clone parity work and the theme schema are still evolving.

## What it does

- Provides a theme workbench at `/themes` with a live Codex-lookalike preview.
- Imports and exports themes in the `codex-theme-v1` format.
- Ships 24 curated official Codex presets plus conversions from the iTerm2 colour-scheme collection.
- Scores and re-scores converted themes through a repeatable generation pipeline.
- Offers scenario-based preview cases for semantic colours and layout states.

## Tech stack

- Nuxt 4 and Vue 3
- TypeScript
- UnoCSS with the Radix colours and animations presets
- Pinia and VueUse
- GSAP, Motion, Lenis, and OGL for motion and visual scenes
- Shiki for syntax highlighting
- tsx for the theme generation scripts

## Getting started

### Requirements

- Node.js with Corepack enabled
- pnpm 10

### Installation

```bash
corepack enable
pnpm install
```

### Configuration

Copy [`.env.example`](.env.example) to `.env`. All values are optional for local development:

| Variable | Purpose |
| --- | --- |
| `NUXT_PUBLIC_SITE_URL` | Canonical site URL for SEO, Open Graph, and the sitemap |
| `NUXT_PUBLIC_GITHUB_REPO_NAME` | Repository used by `/api/github` and the public links |
| `NUXT_GITHUB_TOKEN` | Server-only token to avoid GitHub API rate limiting |

### Development

```bash
pnpm dev
```

The development server runs at `http://localhost:3000`.

## Useful commands

```bash
pnpm build                     # Build for production
pnpm preview                   # Preview the production build
pnpm lint                      # Run ESLint
pnpm lint:fix                  # Run ESLint and apply fixes
```

The theme pipeline runs through `scripts/run-pipeline.ts`:

```bash
pnpm generate                  # Run the site pipeline stage
pnpm generate:themes           # Regenerate the theme set
pnpm generate:themes:convert   # Convert external colour schemes
pnpm generate:themes:rescore   # Re-score converted themes
pnpm generate:themes:test      # Validate the generated themes
```

## Project structure

```text
app/
├── components/   # Workbench, preview, and Codex-lookalike components
├── composables/  # Theme, preview, and interaction logic
├── stores/       # Pinia state for the theme controller
├── pages/        # Home, themes, docs, imprint, and privacy routes
├── data/         # Theme presets and preview scenarios
└── assets/       # Styles and visual assets

scripts/          # Theme generation, conversion, and scoring pipeline
server/api/       # GitHub metadata endpoint
docs/             # Schema, roadmap, architecture, and design notes
screenshots/      # Source, target, and current parity screenshots
```

## Documentation

Start at the [docs hub](docs/README.md). The most used entries:

- [Theme schema](docs/theme-schema.md)
- [Clone roadmap](docs/clone-roadmap.md)
- [Clone parity checklist](docs/clone-parity-checklist.md)
- [Workbench architecture](docs/workbench-architecture.md)
- [Design system](docs/design-system.md)
- [Visual regression workflow](docs/visual-regression.md)
- [UnoCSS migration playbook](docs/unocss-migration-playbook.md)

The theme sources, preset origins, and known import limitations are documented in [`THEMES.md`](THEMES.md).

## Status

The workbench is usable, but clone parity against the Codex interface is not complete and the theme schema may still change. Treat exported themes as a moving format until the schema is marked stable.

## License

No open-source license has been declared yet. Until a license is added, reuse and redistribution are not granted by default.

Made with love by [Laflamme](https://github.com/lafllamme).
