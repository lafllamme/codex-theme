#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const target = args[0] ?? 'site'

function run(label, cmd, cmdArgs) {
  console.log(`\n[generate] ${label}`)
  const result = spawnSync(cmd, cmdArgs, {
    stdio: 'inherit',
    shell: false,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (target === 'themes') {
  run('Write curated Codex presets', 'node', ['scripts/write-codex-theme-presets.mjs'])
  run('Convert iTerm2 presets (includes cleanup)', 'node', ['scripts/convert-iterm2-themes.mjs'])
  run('Re-score and normalize all preset codeThemeIds', 'node', ['scripts/migrate-code-theme-ids.mjs'])
  run('Run theme resolver smoke test', 'node', ['scripts/test-code-theme-resolver.mjs'])

  console.log('\n[generate] Theme pipeline completed successfully.')
  process.exit(0)
}

if (target === 'site') {
  run('Nuxt static generate', 'pnpm', ['exec', 'nuxt', 'generate', ...args.slice(1)])
  process.exit(0)
}

console.error(`Unknown generate target: ${target}`)
console.error('Usage: pnpm generate [site|themes]')
process.exit(1)
