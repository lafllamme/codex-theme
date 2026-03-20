#!/usr/bin/env node
/**
 * Converts iTerm2 color schemes (.itermcolors) to Codex theme format (.json)
 * 
 * Usage:
 *   node scripts/convert-iterm2-themes.mjs
 * 
 * This script reads all .itermcolors files from app/assets/themes-raw/
 * and outputs Codex-compatible JSON files to app/assets/theme-presets/
 * 
 * To add new themes:
 *   1. Download .itermcolors files from https://github.com/mbadolato/iTerm2-Color-Schemes
 *   2. Drop them into app/assets/themes-raw/
 *   3. Run this script
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { assignFontsForTheme } from './font-assignment.mjs'
import { recommendCodeThemeIdFromPayload } from './code-theme-resolver.mjs'

const ITERM_SCHEMES_DIR = 'app/assets/themes-raw'
const OUTPUT_DIR = 'app/assets/theme-presets'
const CURATED_PRESET_IDS = new Set([
  'absolutely',
  'ayu',
  'catppuccin',
  'codex',
  'dracula',
  'everforest',
  'github',
  'gruvbox',
  'linear',
  'lobster',
  'material',
  'matrix',
  'monokai',
  'night-owl',
  'nord',
  'notion',
  'one',
  'oscurange',
  'rose-pine',
  'sentry',
  'solarized',
  'temple',
  'tokyo-night',
  'vscode-plus',
])

/**
 * Keep curated presets and remove previously generated iTerm outputs.
 */
function cleanupGeneratedPresets() {
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json'))
  let removed = 0

  for (const file of files) {
    const id = file.replace(/\.json$/, '')
    if (!CURATED_PRESET_IDS.has(id)) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file))
      removed++
    }
  }

  console.log(`Cleaned ${removed} generated presets (kept curated: ${CURATED_PRESET_IDS.size})`)
}

cleanupGeneratedPresets()

// Get list of existing curated presets to avoid conflicts
const existingPresets = new Set(
  fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
)

console.log(`Found ${existingPresets.size} existing curated presets`)

/**
 * Convert RGB float components (0-1) to hex string
 */
function rgbToHex(color) {
  if (!color) return '#000000'
  const r = Math.round((color['Red Component'] ?? 0) * 255)
  const g = Math.round((color['Green Component'] ?? 0) * 255)
  const b = Math.round((color['Blue Component'] ?? 0) * 255)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Calculate relative luminance of a hex color
 * Returns value between 0 (dark) and 1 (light)
 */
function getLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  
  const srgb = [r, g, b].map(c => 
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  )
  
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

/**
 * Convert filename to kebab-case ID
 */
function toKebabCase(name) {
  return name
    .replace(/\.itermcolors$/, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

/**
 * Convert filename to Title Case label
 */
function toTitleCase(name) {
  return name
    .replace(/\.itermcolors$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Parse iTerm2 plist and convert to Codex theme format
 */
function convertItermToCodex(itermPath) {
  // Use macOS plutil to convert plist to JSON
  const jsonText = execFileSync('plutil', ['-convert', 'json', '-o', '-', itermPath], {
    encoding: 'utf8'
  })
  const data = JSON.parse(jsonText)
  
  // Extract colors
  const surface = rgbToHex(data['Background Color'])
  const ink = rgbToHex(data['Foreground Color'])
  const accent = rgbToHex(data['Ansi 4 Color']) // Blue
  const diffAdded = rgbToHex(data['Ansi 2 Color']) // Green
  const diffRemoved = rgbToHex(data['Ansi 1 Color']) // Red
  const skill = rgbToHex(data['Ansi 5 Color']) // Magenta
  
  // Determine variant based on background luminance (for UI filtering)
  const bgLuminance = getLuminance(surface)
  const variant = bgLuminance < 0.5 ? 'dark' : 'light'
  
  const filename = path.basename(itermPath)
  const id = toKebabCase(filename)
  const fonts = assignFontsForTheme(id, variant)
  
  const themePayload = {
    codeThemeId: 'monokai',
    variant,
    theme: {
      accent,
      contrast: 60,
      fonts,
      ink,
      opaqueWindows: true,
      semanticColors: {
        diffAdded,
        diffRemoved,
        skill,
      },
      surface,
    },
  }
  // Choose official code theme by token readability/contrast against this palette.
  themePayload.codeThemeId = recommendCodeThemeIdFromPayload(themePayload)
  
  return {
    id,
    payload: themePayload,
  }
}

// Main execution
const itermFiles = fs.readdirSync(ITERM_SCHEMES_DIR)
  .filter(f => f.endsWith('.itermcolors'))

console.log(`Found ${itermFiles.length} iTerm2 color schemes to convert`)

let converted = 0
let updated = 0
let errors = 0

for (const file of itermFiles) {
  try {
    const itermPath = path.join(ITERM_SCHEMES_DIR, file)
    const { id, payload } = convertItermToCodex(itermPath)
    
    // Handle naming conflicts with existing curated presets
    let outputId = id
    if (existingPresets.has(id)) {
      outputId = `${id}-iterm`
      console.log(`  Conflict: ${id} -> ${outputId}`)
    }
    
    const outputPath = path.join(OUTPUT_DIR, `${outputId}.json`)
    const isUpdate = existingPresets.has(outputId)
    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + '\n')
    
    if (isUpdate) {
      updated++
    } else {
      converted++
    }
    
    if ((converted + updated) % 50 === 0) {
      console.log(`  Processed ${converted + updated}/${itermFiles.length}...`)
    }
  } catch (err) {
    console.error(`  Error converting ${file}: ${err.message}`)
    errors++
  }
}

// Count actual files at the end
const finalCount = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json')).length

console.log(`\nDone!`)
console.log(`  New themes: ${converted}`)
console.log(`  Updated: ${updated}`)
console.log(`  Errors: ${errors}`)
console.log(`  Total presets: ${finalCount}`)
