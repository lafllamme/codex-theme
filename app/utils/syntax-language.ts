import type { BundledLanguage } from 'shiki'

const EXT_TO_LANG: Record<string, BundledLanguage> = {
  bash: 'bash',
  c: 'c',
  cc: 'cpp',
  cpp: 'cpp',
  css: 'css',
  go: 'go',
  h: 'c',
  hpp: 'cpp',
  html: 'html',
  java: 'java',
  js: 'js',
  json: 'json',
  jsx: 'jsx',
  kt: 'kotlin',
  md: 'md',
  mjs: 'mjs',
  php: 'php',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  scss: 'scss',
  sh: 'sh',
  sql: 'sql',
  swift: 'swift',
  toml: 'toml',
  ts: 'ts',
  tsx: 'tsx',
  vue: 'vue',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yml',
  zsh: 'zsh',
}

export function detectSyntaxLanguage(filePath: string | null | undefined): BundledLanguage {
  if (!filePath)
    return 'log'

  const segment = filePath.split('/').pop() ?? filePath
  const ext = segment.includes('.') ? segment.split('.').pop()?.toLowerCase() ?? '' : ''
  return EXT_TO_LANG[ext] ?? 'log'
}

const TS_LIKE_RE = /\b(?:const|let|var|function|return|export|import|async|await|computed|ref|defineProps|defineEmits)\b/
const TAG_LIKE_RE = /^\s*<\/?[a-z][\w-]*/i
const HTML_ATTR_RE = /\b(?:class|id|style|src|href|type|name)=["']/
const CSS_LIKE_RE = /^[-.#\w]+\s*:[^;]+;?$/
const JSON_LIKE_RE = /^\s*[{[]|^\s*["'][^"']+["']\s*:/

export function inferSyntaxLanguageForLine(filePath: string | null | undefined, line: string): BundledLanguage {
  const byPath = detectSyntaxLanguage(filePath)
  const text = line.trim()

  if (!text)
    return byPath

  if (byPath === 'vue') {
    if (TAG_LIKE_RE.test(text) || HTML_ATTR_RE.test(text))
      return 'html'
    if (CSS_LIKE_RE.test(text))
      return 'css'
    if (TS_LIKE_RE.test(text))
      return 'ts'
    return 'html'
  }

  if (byPath === 'json' && JSON_LIKE_RE.test(text))
    return 'json'

  return byPath
}
