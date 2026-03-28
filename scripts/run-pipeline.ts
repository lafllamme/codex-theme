#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

type Target = 'site' | 'themes' | 'convert' | 'rescore' | 'test'

const args = process.argv.slice(2)
const target = (args[0] ?? 'site') as Target

function run(label: string, cmd: string, cmdArgs: string[]): void {
  console.log(`\n[pipeline] ${label}`)
  const result = spawnSync(cmd, cmdArgs, {
    stdio: 'inherit',
    shell: false,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (target === 'convert') {
  run('Convert iTerm2 presets', 'pnpm', ['exec', 'tsx', 'scripts/convert-iterm-themes.ts'])
  process.exit(0)
}

if (target === 'rescore') {
  run('Re-score and normalize preset codeThemeIds', 'pnpm', ['exec', 'tsx', 'scripts/normalize-code-theme-ids.ts'])
  process.exit(0)
}

if (target === 'test') {
  run('Run theme resolver smoke test', 'pnpm', ['exec', 'tsx', 'scripts/verify-resolver.ts'])
  process.exit(0)
}

if (target === 'themes') {
  run('Write curated Codex presets', 'node', ['scripts/write-codex-theme-presets.mjs'])
  run('Convert iTerm2 presets (includes cleanup)', 'pnpm', ['exec', 'tsx', 'scripts/convert-iterm-themes.ts'])
  run('Re-score and normalize all preset codeThemeIds', 'pnpm', ['exec', 'tsx', 'scripts/normalize-code-theme-ids.ts'])
  run('Run theme resolver smoke test', 'pnpm', ['exec', 'tsx', 'scripts/verify-resolver.ts'])
  console.log('\n[pipeline] Theme pipeline completed successfully.')
  process.exit(0)
}

if (target === 'site') {
  run('Nuxt static generate', 'pnpm', ['exec', 'nuxt', 'generate', ...args.slice(1)])
  process.exit(0)
}

console.error(`Unknown target: ${target}`)
console.error('Usage: pnpm generate [site|themes|convert|rescore|test]')
process.exit(1)
