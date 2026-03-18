#!/usr/bin/env node
/**
 * Converts iTerm2 color schemes (.itermcolors) to Codex theme format (.json)
 * 
 * Usage:
 *   node scripts/convert-iterm2-themes.mjs
 * 
 * This script reads all .itermcolors files from tmp/iTerm2-Color-Schemes/schemes/
 * and outputs Codex-compatible JSON files to app/assets/theme-presets/
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ITERM_SCHEMES_DIR = 'tmp/iTerm2-Color-Schemes/schemes'
const OUTPUT_DIR = 'app/assets/theme-presets'

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
  
  // Determine variant based on background luminance
  const bgLuminance = getLuminance(surface)
  const variant = bgLuminance < 0.5 ? 'dark' : 'light'
  
  const filename = path.basename(itermPath)
  const id = toKebabCase(filename)
  
  return {
    id,
    payload: {
      codeThemeId: id,
      variant,
      theme: {
        accent,
        contrast: 60,
        fonts: {
          code: null,
          ui: null
        },
        ink,
        opaqueWindows: true,
        semanticColors: {
          diffAdded,
          diffRemoved,
          skill
        },
        surface
      }
    }
  }
}

// Main execution
const itermFiles = fs.readdirSync(ITERM_SCHEMES_DIR)
  .filter(f => f.endsWith('.itermcolors'))

console.log(`Found ${itermFiles.length} iTerm2 color schemes to convert`)

let converted = 0
let skipped = 0
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
    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + '\n')
    converted++
    
    if (converted % 50 === 0) {
      console.log(`  Converted ${converted}/${itermFiles.length}...`)
    }
  } catch (err) {
    console.error(`  Error converting ${file}: ${err.message}`)
    errors++
  }
}

console.log(`\nDone!`)
console.log(`  Converted: ${converted}`)
console.log(`  Skipped: ${skipped}`)
console.log(`  Errors: ${errors}`)
console.log(`  Total presets: ${existingPresets.size + converted}`)
